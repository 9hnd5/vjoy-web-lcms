import { useDroppable } from "@dnd-kit/core";
import { Grid, InputLabel } from "@mui/material";
import { blueGrey, orange } from "@mui/material/colors";
import { styled } from "@mui/material/styles";
import { useAppSelector } from "gms/hooks/useAppSelector";

import { upperCase } from "lodash";
import { selectAssignedIdCount } from "../wordBalloonSlice";
import { AssetImage } from "../wordBalloonType";
import { BalloonDraggable } from "./BalloonDraggable";

const ImageContainer = styled("div")(() => ({
  border: `solid 3px ${blueGrey[300]}`,
  borderRadius: "10px",
  marginBottom: "10px",
  overflow: "hidden",
}));

type BalloonColorProps = {
  imgs: AssetImage[];
};

export const BalloonColor = ({ imgs }: BalloonColorProps) => {
  const { setNodeRef } = useDroppable({
    id: "remove-assignment",
  });
  const countIds = useAppSelector(selectAssignedIdCount);
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
      <ImageContainer ref={setNodeRef}>
        <Grid container sx={{ overflowX: "auto" }}>
          <Grid item container direction="row" wrap="nowrap">
            {imgs.map((image, index) => (
              <BalloonDraggable key={`E-${index}`} id={`E-${index}-${(`E-${index}-`)}`} assets={imgs} />
            ))}
          </Grid>
          <Grid item container direction="row" wrap="nowrap">
            {imgs.map((image, index) => (
              <BalloonDraggable key={`W-${index}`} id={`W-${index}-${countIds(`W-${index}-`)}`} assets={imgs} />
            ))}
          </Grid>
        </Grid>
      </ImageContainer>
    </>
  );
};
