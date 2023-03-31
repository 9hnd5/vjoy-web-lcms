import { useDroppable } from "@dnd-kit/core";
import { Box, BoxProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useAppSelector } from "gms/hooks/useAppSelector";
import { selectAssignedBalloons } from "../wordBalloonSlice";
import { AssetImage } from "../wordBalloonType";
import { BalloonDraggable } from "./BalloonDraggable";

interface StyledBoxProps extends BoxProps {
  cellWidth?: number;
}

const StyledBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "cellWidth",
})<StyledBoxProps>(({ cellWidth }) => ({
  width: `${cellWidth}%`,
  height: "50px",
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
  const balloons = useAppSelector(s => selectAssignedBalloons(s)(id));

  return (
    <StyledBox bgcolor="transparent" cellWidth={width} ref={setNodeRef}>
      {balloons.map((balloonId) => (
        <BalloonDraggable key={balloonId} id={balloonId} assets={assets} />
      ))}
    </StyledBox>
  );
};
