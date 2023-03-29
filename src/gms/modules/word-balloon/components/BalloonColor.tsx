import { Grid, InputLabel, Typography } from "@mui/material";
import { blueGrey, orange } from "@mui/material/colors";
import { styled } from "@mui/material/styles";

import { upperCase } from "lodash";
import { AssetImage } from "../wordBalloonType";

const ImageContainer = styled("div")(() => ({
  border: `solid 3px ${blueGrey[300]}`,
  borderRadius: "10px",
  marginBottom: "10px",
  overflow: "hidden",
}));

const ImageItem = styled(Grid)(() => ({
  margin: "5px",
  position: "relative",
  display: "inline-block",
  "&:hover": {
    cursor: "pointer",
    opacity: 0.8,
    boxShadow: `0px 5px 15px ${blueGrey.A400}`,
  },
}));

type BalloonColorProps = {
  imgs: AssetImage[];
};

export const BalloonColor = ({ imgs }: BalloonColorProps) => {
  return (
    <>
      <InputLabel
        sx={{
          color: orange[500],
          fontSize: 13,
          fontWeight: "bold",
          padding: "10px",
        }}
      >
        {upperCase("balloon color")}
      </InputLabel>
      <ImageContainer>
        <Grid container sx={{ overflowX: "auto" }}>
          <Grid item container direction="row" wrap="nowrap">
            {imgs.map((image, index) => (
              <ImageItem item key={index}>
                <img src={image.imgSrc} style={{ height: "40px", objectFit: "cover" }} />
              </ImageItem>
            ))}
          </Grid>
          <Grid item container direction="row" wrap="nowrap">
            {imgs.map((image, index) => (
              <ImageItem item key={index}>
                <img src={image.imgSrc} style={{ height: "40px", objectFit: "cover", display: "block" }} />
                <Typography
                  variant="button"
                  sx={{
                    position: "absolute",
                    top: "35%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    color: "#fff",
                  }}
                >
                  A
                </Typography>
              </ImageItem>
            ))}
          </Grid>
        </Grid>
      </ImageContainer>
    </>
  );
};
