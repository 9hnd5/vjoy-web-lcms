import { Box, Grid, TextField, Button, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import { blueGrey, lightBlue } from "@mui/material/colors";
import { EditorScene } from "gms/components/EditorScene";
import LoadingComponent from "gms/components/LoadingComponent";
import { useGetAssetsQuery } from "gms/services/assetService";
import { ASSET_BUCKET, ASSET_FOLDER } from "gms/ultils/constansts";
import { useState } from "react";
import Board from "./components/Board";
import { ImageSelect } from "./components/ImageSelect";
import { BalloonColor } from "./components/BalloonColor";
import { AssetImage, Curriculum, FormType } from "./wordBalloonType";
import { csvToJson } from "gms/ultils/file";
import { useForm, SubmitHandler } from "react-hook-form";

export const WordBalloonEditor = () => {
  const { register, handleSubmit } = useForm<FormType>();
  const { data: assetsResponse = { data: [] }, isFetching } = useGetAssetsQuery({
    bucket: ASSET_BUCKET,
    folder: ASSET_FOLDER.WORD_BALLOON,
  });
  const [selectedBackground, setSelectedBackground] = useState<AssetImage>();
  const [selectedCannon, setSelectedCannon] = useState<AssetImage>();

  if (isFetching) return <LoadingComponent />;

  const assets = assetsResponse.data.map((img) => {
    const isZip = img.endsWith(".zip");
    const imgSrc = isZip ? img.replace(/\.zip$/, ".png") : img;
    return { url: img, imgSrc };
  });

  const backgrounds = assets.filter((item) => item.url.includes("/bg/"));
  const balloons = assets.filter((item) => item.url.includes("/balloon/"));
  const cannons = assets.filter((item) => item.url.includes("/cannon/"));

  if (backgrounds.length && !selectedBackground) setSelectedBackground(backgrounds[0]);
  if (cannons.length && !selectedCannon) setSelectedCannon(cannons[0]);

  const handleSubmitForm: SubmitHandler<FormType> = async (formData) => {
    const data = { ...formData, curriculumns: await csvToJson<Curriculum>(formData.curriculumns[0]) };
  };

  return (
    <EditorScene>
      <EditorScene.Left xs={2}></EditorScene.Left>
      <EditorScene.Mid xs={8}>
        <Box sx={{ mt: 2, mb: 2 }}>
          <Grid container spacing={1}>
            <Grid item xs={3}>
              <FormControl fullWidth>
                <InputLabel size="small">Behavior</InputLabel>
                <Select label="Behavior" size="small" {...register("difficulty")}>
                  <MenuItem value={1}>Standing Still</MenuItem>
                  <MenuItem value={2}>Horizontal</MenuItem>
                  <MenuItem value={3}>Vertical</MenuItem>
                  <MenuItem value={4}>Random</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid
              item
              xs={6}
              sx={{
                height: "80vh",
                backgroundColor: lightBlue[300],
                border: `solid 3px ${blueGrey[300]}`,
                borderRadius: "10px",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <Board position="absolute" width="90%" top="25%" left="5%" zIndex="999" />
              {assets && (
                <>
                  <img
                    src={selectedBackground?.imgSrc}
                    style={{
                      width: "calc(100% - 16px)",
                      height: "70%",
                      objectFit: "cover",
                      position: "absolute",
                      bottom: "10%",
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
            </Grid>
            <Grid item xs={3}>
              {assets && (
                <>
                  <BalloonColor imgs={balloons} />
                  <ImageSelect
                    label="Cannon shape"
                    imgs={cannons}
                    selectedImg={selectedCannon}
                    viewRow
                    onChange={setSelectedCannon}
                  />
                  <ImageSelect
                    label="background theme"
                    imgs={backgrounds}
                    selectedImg={selectedBackground}
                    onChange={setSelectedBackground}
                  />
                </>
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth type="file" size="small" {...register("curriculumns")} />
            </Grid>
          </Grid>
        </Box>
      </EditorScene.Mid>
      <EditorScene.Right xs={2}>
        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
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
};
