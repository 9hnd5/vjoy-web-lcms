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
import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { blueGrey, lightBlue } from "@mui/material/colors";
import { EditorScene } from "gms/components/EditorScene";
import LoadingComponent from "gms/components/LoadingComponent";
import { useGetAssetsQuery } from "gms/services/assetService";
import { ASSET_BUCKET, ASSET_FOLDER } from "gms/ultils/constansts";
import { csvToJson } from "gms/ultils/file";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { AssignmentsContext } from "./components/AssignmentsContext";
import { BalloonColor } from "./components/BalloonColor";
import { BalloonDraggable } from "./components/BalloonDraggable";
import Board from "./components/Board";
import { ImageSelect } from "./components/ImageSelect";
import { Asset, AssetImage, Balloon, Curriculum, FormType } from "./wordBalloonType";

type AssignmentsMap = { [key: string]: string | undefined };

export const WordBalloonEditor = () => {
  const { register, handleSubmit } = useForm<FormType>();
  const { data: assetsResponse = { data: [] }, isFetching } = useGetAssetsQuery({
    bucket: ASSET_BUCKET,
    folder: ASSET_FOLDER.WORD_BALLOON,
  });
  const [selectedBackground, setSelectedBackground] = useState<AssetImage>();
  const [selectedCannon, setSelectedCannon] = useState<AssetImage>();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [assignmentsMap, setAssignmentsMap] = useState<AssignmentsMap>({});

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor), useSensor(KeyboardSensor));

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

    const data = { ...formData, curriculum: await csvToJson<Curriculum>(formData.curriculum[0]), balloons };
  };

  return (
    <EditorScene sx={{ height: "95vh" }}>
      <EditorScene.Left xs={2}></EditorScene.Left>
      <EditorScene.Mid xs={8}>
        <AssignmentsContext.Provider value={assignmentsMap}>
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
                    <Select label="Behavior" size="small" {...register("difficulty")}>
                      <MenuItem value={1}>Standing Still</MenuItem>
                      <MenuItem value={2}>Horizontal</MenuItem>
                      <MenuItem value={3}>Vertical</MenuItem>
                      <MenuItem value={4}>Random</MenuItem>
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

              <TextField fullWidth type="file" size="small" {...register("curriculum")} />
            </Box>
          </DndContext>
        </AssignmentsContext.Provider>
      </EditorScene.Mid>
      <EditorScene.Right xs={2}>
        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", p: 1 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <FormControl>
              <InputLabel size="small">Difficulty</InputLabel>
              <Select label="Difficulty" size="small" {...register("difficulty")}>
                <MenuItem value={1}>Easy</MenuItem>
                <MenuItem value={2}>Normal</MenuItem>
                <MenuItem value={3}>Hard</MenuItem>
                <MenuItem value={4}>Very Hard</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Button color="primary" variant="contained">
              Load
            </Button>
            <Button color="primary" variant="contained" onClick={handleSubmit(handleSubmitForm)}>
              Save
            </Button>
            <Button color="primary" variant="contained">
              Public
            </Button>
          </Box>
        </Box>
      </EditorScene.Right>
    </EditorScene>
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id.toString());
  }

  function removeAssignment(id: string) {
    setAssignmentsMap((current) => ({ ...current, [id]: undefined } as AssignmentsMap));
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);

    const { active, over, collisions } = event;

    const containsCollisionWithRemoveDroppable = collisions?.some((collision) => collision.id === "remove-assignment");

    if (over) {
      if (containsCollisionWithRemoveDroppable) {
        removeAssignment(active.id.toString());
      } else if (over.id && active.id) {
        setAssignmentsMap((current) => {
          const keyToRemove = Object.keys(current).find((k) => current[k] === over.id);
          const updatedItems = keyToRemove ? { ...current, [keyToRemove]: undefined } : current;
          return {
            ...updatedItems,
            [active.id]: over.id,
          } as AssignmentsMap;
        });
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
