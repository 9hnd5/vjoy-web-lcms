import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  MouseSensor,
  rectIntersection,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  TextField,
} from "@mui/material";
import { blueGrey, lightBlue } from "@mui/material/colors";
import { EditorScene } from "gms/components/EditorScene";
import LoadingComponent from "gms/components/LoadingComponent";
import { useAppDispatch } from "gms/hooks/useAppDispatch";
import { useAppSelector } from "gms/hooks/useAppSelector";
import { useNotification } from "gms/hooks/useNotification";
import { useGetAssetsQuery } from "gms/services/assetService";
import {
  Balloon,
  Curriculum,
  GAME_TYPE,
  LESSON_DIFFICULTY,
  LESSON_STATUS,
  useCreateLessonMutation,
  useLazyGetLessonQuery,
  useUpdateLessonMutation,
} from "gms/services/lessonService";
import { useGetLevelsQuery } from "gms/services/levelService";
import { ASSET_BUCKET, ASSET_FOLDER } from "gms/ultils/constansts";
import { csvToJson } from "gms/ultils/file";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { BalloonColor } from "./components/BalloonColor";
import { BalloonDraggable } from "./components/BalloonDraggable";
import { Board } from "./components/Board";
import { ImageSelect } from "./components/ImageSelect";
import { LessonModal } from "./components/LessonModal";
import { assignBalloon, removeAllBalloon, removeBalloon, selectAllAssignedBalloons } from "./wordBalloonSlice";
import { AssetImage, AssignmentsMap, FormType } from "./wordBalloonType";

export const WordBalloonEditor = () => {
  const dispatch = useAppDispatch();

  const notify = useNotification();

  const { data: assetsResponse = { data: [] }, isFetching } = useGetAssetsQuery({
    bucket: ASSET_BUCKET,
    folder: ASSET_FOLDER.WORD_BALLOON,
  });
  const [selectedBackground, setSelectedBackground] = useState<AssetImage>();
  const [selectedCannon, setSelectedCannon] = useState<AssetImage>();

  const [activeId, setActiveId] = useState<string | null>(null);
  const assignmentsMap = useAppSelector(selectAllAssignedBalloons);

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor), useSensor(KeyboardSensor));

  const [open, setOpen] = useState(false);

  const [openConfirm, setOpenConfirm] = useState(false);

  const [getLesson] = useLazyGetLessonQuery();

  const { data: { data: levels } = { data: { rows: [], count: 0 } } } = useGetLevelsQuery({});
  const {
    handleSubmit,
    register,
    reset,
    trigger,
    getValues,
    setValue,
    setError,
    formState: { errors },
  } = useForm<FormType>({
    defaultValues: {
      unitId: 1,
      levelId: "eng-preA1",
      gameType: GAME_TYPE.WORD_BALLOON,
    },
  });

  const [createLesson, { isLoading: isCreating }] = useCreateLessonMutation();

  const [updateLesson, { isLoading: isUpdating }] = useUpdateLessonMutation();

  if (isFetching) return <LoadingComponent />;

  const assets = assetsResponse.data.map((img) => {
    const isZip = img.endsWith(".zip");
    const imgSrc = isZip ? img.replace(/\.zip$/, ".png") : img;
    const filename = imgSrc.substring(imgSrc.lastIndexOf("/") + 1);
    const name = filename.substring(0, filename.lastIndexOf("."));
    return { url: img, imgSrc, name };
  });

  const backgroundAssets = assets.filter((item) => item.url.includes("/bg/"));
  const balloonAssets = assets.filter((item) => item.url.includes("/balloon/"));
  const cannonAssets = assets.filter((item) => item.url.includes("/cannon/"));

  if (backgroundAssets.length && !selectedBackground) setSelectedBackground(backgroundAssets[0]);
  if (cannonAssets.length && !selectedCannon) setSelectedCannon(cannonAssets[0]);

  const handleSubmitForm: SubmitHandler<FormType> = async (formData) => {
    const balloons = transferMapToBalloonAssets(assignmentsMap, balloonAssets);
    const asset = {
      balloons,
      bg: selectedBackground!.name,
      cannon: selectedCannon!.name,
      behavior: formData.behavior,
      bundleUrl: "https://storage.googleapis.com/vjoy-game-asset-dev/WORD_BALLOON.bundle",
    };

    const fileExtension = formData.curriculum[0].name.split(".").at(-1);
    if (fileExtension !== "csv") return setError("curriculum", { message: "Only Support CSV file extendsion" });
    const curriculum = await csvToJson<Curriculum>(formData.curriculum[0]);
    const data = {
      ...formData,
      asset,
      curriculum,
    };

    try {
      //Publish case
      if (formData.id && formData.status) {
        await updateLesson(data);
        return notify.success({ content: "Publish Succeed" });
      }

      //Update case
      if (formData.id) {
        await updateLesson(data);
        notify.success({ content: "Update Succeed" });
      } else {
        //Create case
        await createLesson(data);
        notify.success({ content: "Create Succeed" });
      }

      handleToggleConfirm();
    } catch (err) {
      notify.error({ content: "There was an error" });
    }
  };

  const handleToggleLesson = () => setOpen(!open);

  const handleToggleConfirm = () => setOpenConfirm(!openConfirm);

  const handleLessonSelect = async (id: number) => {
    const { data: { data: lesson } = {} } = await getLesson(id);
    if (!lesson) return;

    reset({
      id: lesson.id,
      behavior: lesson.asset.behavior,
      curriculum: {} as any,
      difficulty: lesson.difficulty,
      gameType: lesson.gameType,
      name: lesson.name,
      unitId: lesson.unitId,
    });

    dispatch(removeAllBalloon());

    lesson.asset.balloons
      .filter((x) => x.type === "E")
      .forEach((balloon, indexCount) => {
        const indexName = balloonAssets.findIndex((x) => x.name === balloon.name);
        dispatch(assignBalloon({ balloonId: `E-${indexName}-${indexCount}-}`, boardId: balloon.position }));
      });

    lesson.asset.balloons
      .filter((x) => x.type === "W")
      .forEach((balloon, indexCount) => {
        const indexName = balloonAssets.findIndex((x) => x.name === balloon.name);
        dispatch(assignBalloon({ balloonId: `W-${indexName}-${indexCount}-}`, boardId: balloon.position }));
      });

    const backgroud = backgroundAssets.find((x) => x.name === lesson.asset.bg);
    setSelectedBackground(backgroud);
    const cannon = cannonAssets.find((x) => x.name === lesson.asset.cannon);
    setSelectedCannon(cannon);
  };

  const handlePubic = async () => {
    const formValue = getValues();
    if (formValue.id) {
      setValue("status", LESSON_STATUS.PUBLISHED);
      if (await trigger()) handleSubmit(handleSubmitForm)();
    }
  };

  return (
    <React.Fragment>
      <EditorScene spacing={1} sx={{ height: "95vh" }}>
        <EditorScene.Left xs={2}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 1, width: "100%" }}>
            <FormControl fullWidth>
              <InputLabel size="small">Level</InputLabel>
              <Select label="Level" size="small" {...register("levelId")} native disabled>
                {levels.count &&
                  levels.rows.map((level) => (
                    <option key={level.id} value={level.id}>
                      {level.name}
                    </option>
                  ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel size="small">Level</InputLabel>
              <Select label="Unit" size="small" {...register("unitId")} native disabled>
                <option key={1} value={1}>
                  School thing
                </option>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel size="small">Level</InputLabel>
              <Select label="Lesson list" size="small" {...register("gameType")} native disabled>
                {Object.entries(GAME_TYPE).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Box>
        </EditorScene.Left>
        <EditorScene.Mid xs={8}>
          <DndContext
            sensors={sensors}
            modifiers={[restrictToWindowEdges]}
            collisionDetection={rectIntersection}
            autoScroll={false}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <Box
              sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", p: 1 }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1, height: "90%" }}>
                <Box sx={{ display: "flex", flexDirection: "column", width: "20%" }}>
                  <FormControl fullWidth>
                    <InputLabel size="small">Behavior</InputLabel>
                    <Select
                      label="Behavior"
                      size="small"
                      {...register("behavior", { required: "This field is required", valueAsNumber: true })}
                      native
                    >
                      <option value={1}>STANDING STILL</option>
                      <option value={2}>HORIZONTAL</option>
                      <option value={3}>VERTICAL</option>
                      <option value={4}>RANDOM</option>
                    </Select>
                  </FormControl>
                </Box>
                <Box
                  sx={{
                    position: "relative",
                    width: "50%",
                    backgroundColor: lightBlue[300],
                    border: `solid 3px ${blueGrey[300]}`,
                    borderRadius: "10px",
                  }}
                >
                  <Board position="absolute" width="90%" top="25%" left="5%" zIndex="999" assets={balloonAssets} />
                  {assets && (
                    <>
                      <img
                        src={selectedBackground?.imgSrc}
                        style={{
                          width: "calc(100% - 16px)",
                          height: "75%",
                          objectFit: "cover",
                          position: "absolute",
                          bottom: "10%",
                          left: "8px",
                        }}
                      />

                      <img
                        src={selectedCannon?.imgSrc}
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                          position: "absolute",
                          bottom: "10%",
                          left: "calc(50% - 50px)",
                        }}
                      />
                    </>
                  )}
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", width: "20%" }}>
                  {assets && (
                    <>
                      <BalloonColor imgs={balloonAssets} />
                      <ImageSelect
                        label="Cannon shape"
                        imgs={cannonAssets}
                        selectedImg={selectedCannon}
                        viewRow
                        onChange={setSelectedCannon}
                      />
                      <ImageSelect
                        label="background theme"
                        imgs={backgroundAssets}
                        selectedImg={selectedBackground}
                        onChange={setSelectedBackground}
                      />
                    </>
                  )}
                </Box>

                <DragOverlay>{activeId ? <BalloonDraggable id={activeId} assets={balloonAssets} /> : null}</DragOverlay>
              </Box>

              <TextField
                fullWidth
                label="Curriculum"
                type="file"
                size="small"
                InputLabelProps={{
                  shrink: true,
                }}
                error={!!errors.curriculum}
                helperText={errors.curriculum ? errors.curriculum.message : " "}
                {...register("curriculum", { required: "This field is required" })}
              />
            </Box>
          </DndContext>
        </EditorScene.Mid>
        <EditorScene.Right xs={2}>
          <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", p: 1 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <FormControl>
                <InputLabel size="small">Difficulty</InputLabel>
                <Select
                  label="Difficulty"
                  size="small"
                  {...register("difficulty", { required: "This field is required", valueAsNumber: true })}
                  native
                >
                  {Object.entries(LESSON_DIFFICULTY).map(([key, value]) => (
                    <option key={key} value={value}>
                      {key.toUpperCase()}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Button color="primary" variant="contained" onClick={handleToggleLesson}>
                Load
              </Button>
              <Button color="primary" variant="contained" onClick={handleToggleConfirm}>
                Save
              </Button>
              <Button color="primary" variant="contained" disabled={isUpdating} onClick={handlePubic}>
                Publish
              </Button>
            </Box>
          </Box>
        </EditorScene.Right>
      </EditorScene>
      <LessonModal open={open} onClose={handleToggleLesson} onSelect={handleLessonSelect} />
      <Dialog open={openConfirm} onClose={handleToggleConfirm}>
        <DialogTitle>Confirm Save</DialogTitle>
        <DialogContent>
          <TextField
            size="small"
            label="Name"
            fullWidth
            margin="dense"
            error={!!errors.name}
            helperText={errors.name ? errors.name.message : " "}
            {...register("name", { required: "This field is required" })}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" disabled={isCreating || isUpdating} onClick={handleSubmit(handleSubmitForm)}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id.toString());
  }

  function removeAssignment(id: string) {
    dispatch(removeBalloon(id));
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);

    const { active, over, collisions } = event;

    const containsCollisionWithRemoveDroppable = collisions?.some((collision) => collision.id === "remove-assignment");
    if (over) {
      if (containsCollisionWithRemoveDroppable) {
        removeAssignment(active.id.toString());
      } else if (over.id && active.id) {
        dispatch(assignBalloon({ balloonId: active.id.toString(), boardId: over.id.toString() }));
      }
    } else {
      if (assignmentsMap[active.id]) {
        removeAssignment(active.id.toString());
      }
    }
  }

  function transferMapToBalloonAssets(a: AssignmentsMap, b: AssetImage[]): Balloon[] {
    const output: Balloon[] = [];

    for (const [key, value] of Object.entries(a)) {
      if (value === undefined) {
        continue;
      }

      const [type, index] = key.split("-");
      const position = value;
      const { name } = b[parseInt(index)];

      output.push({ type, position, name });
    }

    return output;
  }
};
