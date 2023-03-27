import { Box, Grid } from "@mui/material";
import { blueGrey, lightBlue} from "@mui/material/colors";
import { ImageSelect } from "./components/ImageSelect";

import bg1 from "assets/images/bg1.jpg";
import bg2 from "assets/images/bg2.jpg";
import bg3 from "assets/images/bg3.jpg";
import c1 from "assets/images/c1.jpg";
import c2 from "assets/images/c2.jpg";
import c3 from "assets/images/c3.jpg";
import { EditorScene } from "gms/components/EditorScene";

export const WordBalloon = () => {
  const cannons = [c1, c2, c3];
  const bgs = [bg1, bg2, bg3];
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
              sx={{ height: "80vh", backgroundColor: lightBlue[300], border: `solid 3px ${blueGrey[300]}`, borderRadius: "10px", overflow: "hidden" }}
            ></Grid>
            <Grid item xs={3}>
              <ImageSelect label="Cannon shape" imgs={cannons} viewRow />
              <ImageSelect label="background theme" imgs={bgs} />
            </Grid>
          </Grid>
        </Box>
      </EditorScene.Mid>
      <EditorScene.Right xs={2}></EditorScene.Right>
    </EditorScene>
  );
};
