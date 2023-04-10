import { useDroppable } from "@dnd-kit/core";
import { Box, BoxProps, styled } from "@mui/material";
import { useAppSelector } from "gms/hooks/useAppSelector";
import { selectAssignedSpheres } from "../bustAWordSlice";
import { SphereDraggable } from "./SphereDraggable";
import { AssetImage } from "gms/ultils/types";

interface StyledBoxProps extends BoxProps {
  cellWidth?: number;
}

const StyledBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "cellWidth",
})<StyledBoxProps>(({ cellWidth }) => ({
  width: `${cellWidth}%`,
  height: "30px",
  textAlign: "center",
  lineHeight: "50px",
  border: "1px solid black",
}));

type BoardSquareProps = {
  id: string;
  width: number;
  assets: AssetImage[];
};

export const BoardSquare = ({ id, width, assets }: BoardSquareProps) => {
  const { setNodeRef } = useDroppable({
    id: id,
  });
  const spheres = useAppSelector((s) => selectAssignedSpheres(s)(id));

  return (
    <StyledBox bgcolor="transparent" cellWidth={width} ref={setNodeRef}>
      {spheres.map((sphereId) => (
        <SphereDraggable key={sphereId} id={sphereId} assets={assets} />
      ))}
    </StyledBox>
  );
};
