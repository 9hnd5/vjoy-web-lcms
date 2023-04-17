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
  FormGroup,
  Grid,
  TextField,
} from "@mui/material";
import { blueGrey, lightBlue } from "@mui/material/colors";
import { BlurLoading } from "gms/components/BlurLoading";
import { EditorScene1 } from "gms/components/EditorScene1";
import { ImageSelect } from "gms/components/ImageSelect";
import LoadingComponent from "gms/components/LoadingComponent";
import { useAppDispatch } from "gms/hooks/useAppDispatch";
import { useAppSelector } from "gms/hooks/useAppSelector";
import { useNotification } from "gms/hooks/useNotification";
import { useGetAssetsQuery } from "gms/services/assetService";
import {
  BustAWordAsset,
  Curriculum,
  GAME_TYPE,
  LESSON_DIFFICULTY,
  LESSON_STATUS,
  Sphere,
  useCreateLessonMutation,
  useLazyGetLessonQuery,
  useLazyGetLessonsQuery,
  useUpdateLessonMutation,
} from "gms/services/lessonService";
import { ASSET_BUCKET, ASSET_FOLDER } from "gms/ultils/constants";
import { csvToJson } from "gms/ultils/file";
import { AssetImage } from "gms/ultils/types";
import { isNil } from "lodash";
import { ChangeEvent, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Controller, FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { assignSphere, removeAllSphere, removeSphere, selectAllAssignedSpheres } from "./bustAWordSlice";
import { AssignmentsMap, FormType } from "./bustAWordType";
import { Board } from "./components/Board";
import { BoardRowDraggable } from "./components/BoardRowDraggable";
import { LessonModal } from "./components/LessonModal";
import { SphereColor } from "./components/SphereColor";
import { WordSwitch } from "./components/WordSwitch";

export const BustAWordEditor = () => {
  const dispatch = useAppDispatch();

  const notify = useNotification();

  const { data: assetsResponse = { data: [] }, isFetching } = useGetAssetsQuery({
    bucket: ASSET_BUCKET,
    folder: ASSET_FOLDER.BUST_A_WORD,
  });
  const [selectedBackground, setSelectedBackground] = useState<AssetImage>();
  const [selectedCannon, setSelectedCannon] = useState<AssetImage>();
  const [wordsArray, setWordsArray] = useState<boolean[]>([]);

  const [activeId, setActiveId] = useState<string | null>(null);
  const assignmentsMap = useAppSelector(selectAllAssignedSpheres);

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor), useSensor(KeyboardSensor));

  const [open, setOpen] = useState(false);

  const [openConfirm, setOpenConfirm] = useState(false);

  const [getLesson, { isFetching: isLessonLoading = true }] = useLazyGetLessonQuery();

  const [getLessons, { isFetching: isLessonsLoading }] = useLazyGetLessonsQuery();

  const methods = useForm<FormType>({
    defaultValues: {
      unitId: 1,
      levelId: "eng-preA1",
      difficulty: LESSON_DIFFICULTY.EASY,
      gameType: GAME_TYPE.BUST_A_WORD,
      curriculum: null as any,
      totalLines: 0,
    },
  });
  const {
    handleSubmit,
    register,
    reset,
    trigger,
    getValues,
    setValue,
    watch,
    control,
    formState: { errors },
  } = methods;

  const { getRootProps, getInputProps } = useDropzone({
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
  const totalLines = watch("totalLines");
  useMemo(() => {
    const lines = totalLines ?? 0;
    let words = wordsArray;
    if (lines > wordsArray.length) {
      const numToAdd = lines - wordsArray.length;
      const newElements = Array.from({ length: numToAdd }, () => false);
      words = [...wordsArray, ...newElements];
    } else if (lines < wordsArray.length) {
      words = wordsArray.slice(0, lines);
    }
    setWordsArray(words);
  }, [totalLines, wordsArray]);

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
  const cannonAssets = assets.filter((item) => item.url.includes("/cannon/"));
  const sphereAssets = assets.filter((item) => item.url.includes("/sphere/"));

  if (backgroundAssets.length && !selectedBackground) setSelectedBackground(backgroundAssets[0]);
  if (cannonAssets.length && !selectedCannon) setSelectedCannon(cannonAssets[0]);

  const handleSubmitForm: SubmitHandler<FormType> = async (formData) => {
    const spheres = transferMapToAssets(assignmentsMap, sphereAssets);
    const asset = {
      spheres,
      bg: selectedBackground!.name,
      cannon: selectedCannon!.name,
      bundleUrl: "https://storage.googleapis.com/vjoy-game-asset-dev/.unity_bundle",
    };

    delete formData.totalLines;
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
        gameType: GAME_TYPE.BUST_A_WORD,
      });
      setValue("name", `${levelId}_aquarium_bustaword_${difficulty}_${data.count + 1}`.toLowerCase());
    }
    setOpenConfirm(!openConfirm);
  };

  const handleLessonSelect = async (id: number) => {
    const { data: { data: lesson } = {} } = await getLesson(id);
    if (!lesson) return;
    const { asset } = lesson as { asset: BustAWordAsset };
    reset(
      {
        id: lesson.id,
        curriculum: lesson.curriculum,
        difficulty: lesson.difficulty,
        gameType: lesson.gameType,
        name: lesson.name,
        unitId: lesson.unitId,
        totalLines: asset.spheres.length,
      },
      { keepDefaultValues: true }
    );

    dispatch(removeAllSphere());

    const wordArr: boolean[] = [];
    asset.spheres.forEach((bubble, indexCount) => {
      const indexName = sphereAssets.findIndex((x) => x.name === bubble.name);
      dispatch(assignSphere({ sphereId: `${indexName}-${indexCount}-}`, boardId: indexCount.toString() }));
      wordArr.push(bubble.type === "W");
    });
    setWordsArray(wordArr);

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

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear all input fields?")) {
      reset();
      dispatch(removeAllSphere());
      setSelectedBackground(backgroundAssets[0]);
      setSelectedCannon(cannonAssets[0]);
      setWordsArray([]);
    }
  };

  const handleTotalLinesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, Math.min(6, parseInt(e.target.value)));
    setValue("totalLines", value, { shouldValidate: true });
  };

  return (
    <BlurLoading isLoading={isLessonLoading}>
      <FormProvider {...methods}>
        <EditorScene1
          isSaving={isLessonsLoading}
          isPublising={isUpdating}
          onNew={handleClear}
          onSave={handleToggleConfirm}
          onLoad={handleToggleLesson}
          onPublish={handlePubic}
        >
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
                  <TextField
                    size="small"
                    label="Total Lines"
                    fullWidth
                    type="number"
                    inputProps={{ min: 0, max: 6, step: 1 }}
                    {...register("totalLines", { valueAsNumber: true, min: 0, max: 6 })}
                    onChange={handleTotalLinesChange}
                  />
                  <FormGroup>
                    {wordsArray.map((w, i) => (
                      <WordSwitch
                        key={i}
                        checked={w}
                        index={i}
                        onChange={(index, value) =>
                          setWordsArray((prev) => [...prev.slice(0, index), value, ...prev.slice(index + 1)])
                        }
                      />
                    ))}
                  </FormGroup>
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
                    <Board
                      position="absolute"
                      width="90%"
                      top="18%"
                      left="5%"
                      zIndex="999"
                      assets={sphereAssets}
                      rows={totalLines ?? 0}
                      words={wordsArray}
                    />
                    {assets && (
                      <>
                        <img
                          src={selectedBackground?.imgSrc}
                          style={{
                            width: "calc(100% - 16px)",
                            height: "75%",
                            objectFit: "fill",
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
                            objectFit: "fill",
                            position: "absolute",
                            bottom: "12%",
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
                      <SphereColor imgs={sphereAssets} />
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
                  <Box>{curriculum?.name}</Box>
                </Grid>
              </Grid>
              <DragOverlay>{activeId ? <BoardRowDraggable id={activeId} assets={sphereAssets} /> : null}</DragOverlay>
            </Grid>
          </DndContext>
        </EditorScene1>
      </FormProvider>

      <LessonModal open={open} onClose={handleToggleLesson} onSelect={handleLessonSelect} />

      <Dialog open={openConfirm} onClose={handleToggleConfirm}>
        <DialogTitle>Confirm Save</DialogTitle>
        <DialogContent>
          <Controller
            control={control}
            name="name"
            rules={{ required: "This field is required" }}
            render={({ field }) => (
              <TextField
                size="small"
                label="Name"
                fullWidth
                margin="dense"
                error={!!errors.name}
                helperText={errors.name ? errors.name.message : " "}
                InputLabelProps={{ shrink: true }}
                {...field}
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" disabled={isCreating || isUpdating} onClick={handleSubmit(handleSubmitForm)}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </BlurLoading>
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id.toString());
  }

  function removeAssignment(id: string) {
    dispatch(removeSphere(id));
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);

    const { active, over, collisions } = event;

    const containsCollisionWithRemoveDroppable = collisions?.some((collision) => collision.id === "remove-assignment");
    if (over) {
      if (containsCollisionWithRemoveDroppable) {
        removeAssignment(active.id.toString());
      } else if (!isNil(over.id) && !isNil(active.id)) {
        dispatch(assignSphere({ sphereId: active.id.toString(), boardId: over.id.toString() }));
      }
    } else {
      if (assignmentsMap[active.id]) {
        removeAssignment(active.id.toString());
      }
    }
  }

  function transferMapToAssets(a: AssignmentsMap, b: AssetImage[]): Sphere[] {
    const output: Sphere[] = [];
    let count = 1;

    for (const [key, value] of Object.entries(a)) {
      if (count > totalLines!) break;
      if (value === undefined) {
        continue;
      }

      const [index] = key.split("-");
      const { name } = b[parseInt(index)];

      output.push({ type: wordsArray[count - 1] ? "W" : "E", name });
      count++;
    }

    return output;
  }
};
