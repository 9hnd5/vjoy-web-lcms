import { useDroppable } from "@dnd-kit/core";
import { Grid, InputLabel, styled } from "@mui/material";
import { blueGrey, orange } from "@mui/material/colors";
import { useAppSelector } from "gms/hooks/useAppSelector";
import { upperCase } from "lodash";
import { selectAssignedIdCount } from "../bustAWordSlice";
import { SphereDraggable } from "./SphereDraggable";
import { AssetImage } from "gms/ultils/types";

const ImageContainer = styled("div")(() => ({
  border: `solid 3px ${blueGrey[300]}`,
  borderRadius: "4px",
  marginBottom: "10px",
  overflowX: "scroll",
  padding: "5px 0",
}));

type SphereColorProps = {
  imgs: AssetImage[];
};

export const SphereColor = ({ imgs }: SphereColorProps) => {
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
        {upperCase("Sphere color")}
      </InputLabel>
      <ImageContainer ref={setNodeRef}>
        <Grid container direction="row" wrap="nowrap">
          {imgs.map((image, index) => (
            <SphereDraggable key={index} id={`${index}-${countIds(`${index}-`)}`} assets={imgs} />
          ))}
        </Grid>
      </ImageContainer>
    </>
  );
};
