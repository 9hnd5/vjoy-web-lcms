import { useDroppable } from "@dnd-kit/core";
import { Box, styled } from "@mui/material";
import { blueGrey } from "@mui/material/colors";
import { useAppSelector } from "gms/hooks/useAppSelector";
import { AssetImage } from "gms/ultils/types";
import { selectAssignedSpheres } from "../bustAWordSlice";
import { BoardRowDraggable } from "./BoardRowDraggable";

const StyledBox = styled(Box)(() => ({
  width: "100%",
  height: "35px",
  border: `1px dashed ${blueGrey[500]}`,
  display: "flex",
  justifyContent: "space-around",
}));

type BoardRowProps = {
  id: number;
  assets: AssetImage[];
  words: boolean[];
};

export const BoardRow = ({ id, words, assets }: BoardRowProps) => {
  const { setNodeRef } = useDroppable({
    id: id,
  });
  const sphereId = useAppSelector((s) => selectAssignedSpheres(s)(id.toString()));

  let sx: { [key: string]: string } = {};
  if (id > 0) sx = { borderTop: "none" };
  if (id % 2 != 0) sx = { ...sx, paddingLeft: "35px", width: "calc(100% - 35px)" };

  return (
    <StyledBox bgcolor="transparent" ref={setNodeRef} sx={sx}>
      {sphereId && <BoardRowDraggable id={`${sphereId}`} assets={assets} word={words[id]} />}
    </StyledBox>
  );
};
