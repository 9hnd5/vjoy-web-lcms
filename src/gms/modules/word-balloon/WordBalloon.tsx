import { Box, Grid } from "@mui/material";
import { blueGrey, lightBlue } from "@mui/material/colors";
import { EditorScene } from "gms/components/EditorScene";
import { ImageSelect } from "./components/ImageSelect";
// import { useAppSelector } from "gms/hooks/useAppSelector";
// import { selectValue } from "./wordBalloonSlice";
import { useGetAssetsQuery } from "gms/services/assetService";
import { ASSET_BUCKET, ASSET_FOLDER } from "gms/ultils/constansts";
import { useEffect, useState } from "react";
import Board from "./components/Board";

export const WordBalloon = () => {
  // const value = useAppSelector(selectValue);
  const { data: assets } = useGetAssetsQuery({ bucket: ASSET_BUCKET, folder: ASSET_FOLDER.WORD_BALLOON });
  const [backgrounds, setBackgrounds] = useState<string[]>([]);
  const [cannons, setCannons] = useState<string[]>([]);
  const [selectedBackground, setSelectedBackground] = useState<string>();
  const [selectedCannon, setSelectedCannon] = useState<string>();

  useEffect(() => {
    if (!assets) return;

    const bgs = assets.data.filter((item) => item.includes("/bg/"));
    const cns = assets.data.filter((item) => item.includes("/cannon/"));

    setBackgrounds(() => bgs);
    setCannons(() => cns);
    setSelectedBackground(bgs[0]);
    setSelectedCannon(cns[0]);
  }, [assets]);

  return (
    <EditorScene>
      <EditorScene.Left xs={2}></EditorScene.Left>
      <EditorScene.Mid xs={8}>
        <Box sx={{ mt: 2, mb: 2 }}>
          <Grid container spacing={1}>
            <Grid item xs={3}></Grid>
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
                    src={selectedBackground}
                    style={{
                      width: "calc(100% - 16px)",
                      height: "70%",
                      objectFit: "cover",
                      position: "absolute",
                      bottom: "10%",
                    }}
                  />

                  <img
                    src={selectedCannon}
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
                  <ImageSelect label="Cannon shape" imgs={cannons} viewRow onChange={setSelectedCannon} />
                  <ImageSelect label="background theme" imgs={backgrounds} onChange={setSelectedBackground} />
                </>
              )}
            </Grid>
          </Grid>
        </Box>
      </EditorScene.Mid>
      <EditorScene.Right xs={2}></EditorScene.Right>
    </EditorScene>
  );
};
