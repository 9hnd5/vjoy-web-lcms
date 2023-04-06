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
  Grid,
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
  useLazyGetLessonsQuery,
  useUpdateLessonMutation,
} from "gms/services/lessonService";
import { useGetLevelsQuery } from "gms/services/levelService";
import { ASSET_BUCKET, ASSET_FOLDER } from "gms/ultils/constansts";
import { csvToJson } from "gms/ultils/file";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { SubmitHandler, useForm } from "react-hook-form";
import { BalloonColor } from "./components/BalloonColor";
import { BalloonDraggable } from "./components/BalloonDraggable";
import { Board } from "./components/Board";
import { ImageSelect } from "./components/ImageSelect";
import { LessonModal } from "./components/LessonModal";
import { assignBalloon, removeAllBalloon, removeBalloon, selectAllAssignedBalloons } from "./wordBalloonSlice";
import { AssetImage, AssignmentsMap, FormType } from "./wordBalloonType";
import { useGetUnitsQuery } from "gms/services/unitService";

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

  const [getLessons, { isLoading: isLessonsLoading }] = useLazyGetLessonsQuery();

  const { data: { data: level } = { data: { rows: [], count: 0 } } } = useGetLevelsQuery();

  const { data: { data: unit } = { data: { rows: [], count: 0 } } } = useGetUnitsQuery();

  const {
    handleSubmit,
    register,
    reset,
    trigger,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormType>({
    defaultValues: {
      unitId: 1,
      levelId: "eng-preA1",
      gameType: GAME_TYPE.WORD_BALLOON,
    },
  });
  const registerLevelId = register("levelId");
  const registerUnitId = register("unitId");
  const registerGameType = register("gameType");

  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    onDrop: async (acceptFiles) => {
      const data = await csvToJson<Curriculum>(acceptFiles[0]);
      const name = acceptFiles[0].name;
      setValue("curriculum", { name, data }, { shouldValidate: true });
    },
    accept: {
      "text/csv": [".csv"],
    },
  });

  const curriculum = watch("curriculum");

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
      bundleUrl: "https://storage.googleapis.com/vjoy-game-asset-dev/.unity_bundle",
    };

    const data = {
      ...formData,
      asset,
    };

    try {
      // Publish case
      if (formData.id && formData.status) {
        await updateLesson(data).unwrap();
        return notify.success({ content: "Publish Succeed" });
      }

      //Update case
      if (formData.id) {
        await updateLesson(data).unwrap();
        notify.success({ content: "Update Succeed" });
      } else {
        //Create case
        await createLesson(data).unwrap();
        notify.success({ content: "Create Succeed" });
      }

      handleToggleConfirm();
    } catch (err) {
      notify.error({ content: "There was an error" });
    }
  };

  const handleToggleLesson = () => setOpen(!open);

  const handleToggleConfirm = async () => {
    if (!getValues("id") && !openConfirm) {
      const levelId = getValues("levelId");
      const [difficulty] = Object.entries(LESSON_DIFFICULTY).find(([key, value]) =>
        value === getValues("difficulty") ? true : false
      )!;
      const { data: { data } = { data: { rows: [], count: 0 } } } = await getLessons({
        gameType: "WORD_BALLOON",
      });
      setValue("name", `${levelId}_aquarium_wordballon_${difficulty}_${data.count + 1}`.toLowerCase());
    }
    setOpenConfirm(!openConfirm);
  };

  const handleLessonSelect = async (id: number) => {
    const { data: { data: lesson } = {} } = await getLesson(id);
    if (!lesson) return;
    reset({
      id: lesson.id,
      behavior: lesson.asset.behavior,
      curriculum: lesson.curriculum,
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
      <EditorScene>
        <EditorScene.Left xs={2}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
            <FormControl fullWidth>
              <InputLabel size="small">Level</InputLabel>
              <Select
                label="Level"
                size="small"
                {...{ registerLevelId, inputRef: registerLevelId.ref }}
                native
                disabled
              >
                {level.rows.map((level) => (
                  <option key={level.id} value={level.id}>
                    {level.name}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel size="small">Unit</InputLabel>
              <Select label="Unit" size="small" {...{ registerUnitId, inputRef: registerUnitId.ref }} native disabled>
                {unit.rows.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel size="small">Lesson List</InputLabel>
              <Select
                label="Lesson list"
                size="small"
                {...{ registerGameType, inputRef: registerGameType.ref }}
                native
                disabled
              >
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
            <Grid container spacing={2} sx={{ height: "100%" }} direction="column" wrap="nowrap">
              <Grid container spacing={2} item xs={11}>
                <Grid item xs={3}>
                  <FormControl fullWidth>
                    <InputLabel size="small">Behavior</InputLabel>
                    <Select
                      label="Behavior"
                      size="small"
                      {...register("behavior", { required: "This field is required", valueAsNumber: true })}
                      native
                    >
                      <option value={0}>STANDING STILL</option>
                      <option value={1}>HORIZONTAL</option>
                      <option value={2}>VERTICAL</option>
                      <option value={3}>RANDOM</option>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%%",
                      height: "100%",
                      backgroundColor: lightBlue[300],
                      border: `solid 3px ${blueGrey[300]}`,
                      borderRadius: "4px",
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
                </Grid>
                <Grid item xs={3}>
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
                </Grid>
              </Grid>
              <Grid container item xs={1}>
                <Grid item xs={12}>
                  <Box
                    {...getRootProps()}
                    style={{
                      border: "#999 2px dashed",
                      boxSizing: "border-box",
                      backgroundColor: "#EEE",
                      padding: "0px 8px",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <input {...getInputProps()} />
                    <p>Drag and drop or click to select curriculum file</p>
                  </Box>
                  <input type="hidden" {...register("curriculum", { required: "This field is required" })} />
                  <Box sx={{ color: "#d32f2f" }}>{errors?.curriculum?.message}</Box>
                  <Box>{acceptedFiles.length || curriculum ? curriculum.name : ""}</Box>
                </Grid>
              </Grid>
              <DragOverlay>{activeId ? <BalloonDraggable id={activeId} assets={balloonAssets} /> : null}</DragOverlay>
            </Grid>
          </DndContext>
        </EditorScene.Mid>
        <EditorScene.Right xs={2}>
          <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
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
              <Button color="primary" variant="contained" onClick={handleToggleConfirm} disabled={isLessonsLoading}>
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
