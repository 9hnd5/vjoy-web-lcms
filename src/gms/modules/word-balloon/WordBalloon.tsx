import { Box, Grid } from "@mui/material";
import { blueGrey, lightBlue } from "@mui/material/colors";
import { EditorScene } from "gms/components/EditorScene";
// import { useAppSelector } from "gms/hooks/useAppSelector";
// import { selectValue } from "./wordBalloonSlice";
import LoadingComponent from "gms/components/LoadingComponent";
import { useGetAssetsQuery } from "gms/services/assetService";
import { ASSET_BUCKET, ASSET_FOLDER } from "gms/ultils/constansts";
import { useState } from "react";
import Board from "./components/Board";
import { ImageSelect } from "./components/ImageSelect";
import { BalloonColor } from "./components/BalloonColor";
import { AssetImage } from "./wordBalloonType";

export const WordBalloon = () => {
  // const value = useAppSelector(selectValue);
  const { data = { data: [] }, isFetching } = useGetAssetsQuery({
    bucket: ASSET_BUCKET,
    folder: ASSET_FOLDER.WORD_BALLOON,
  });
  const [selectedBackground, setSelectedBackground] = useState<AssetImage>();
  const [selectedCannon, setSelectedCannon] = useState<AssetImage>();

  if (isFetching) return <LoadingComponent />;

  const assets = data.data.map((img) => {
    const isZip = img.endsWith(".zip"); // check if it's a zip file

    // replace zip extension with png
    const imgSrc = isZip ? img.replace(/\.zip$/, ".png") : img;

    return { url: img, imgSrc };
  });

  const backgrounds = assets.filter((item) => item.url.includes("/bg/"));
  const balloons = assets.filter((item) => item.url.includes("/balloon/"));
  const cannons = assets.filter((item) => item.url.includes("/cannon/"));

  if (backgrounds.length && !selectedBackground) setSelectedBackground(backgrounds[0]);
  if (cannons.length && !selectedCannon) setSelectedCannon(cannons[0]);

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
          </Grid>
        </Box>
      </EditorScene.Mid>
      <EditorScene.Right xs={2}></EditorScene.Right>
    </EditorScene>
  );
};
