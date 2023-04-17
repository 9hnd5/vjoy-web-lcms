import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Box, Typography, styled } from "@mui/material";
import { AssetImage } from "gms/ultils/types";
import { useMemo } from "react";
import { WORD_ON_SPHERE } from "../bustAWordContant";

const StyledBox = styled(Box)(() => ({
  height: "35px",
  textAlign: "center",
  display: "flex",
  flexDirection: "row",
}));

type BoardRowProps = {
  id: string;
  word?: boolean;
  assets: AssetImage[];
};

export const BoardRowDraggable = ({ id, word = false, assets }: BoardRowProps) => {
  const { attributes, active, listeners, setNodeRef, transform } = useDraggable({
    id,
  });
  const [idx] = id.split("-");
  const style = useMemo(
    () =>
      transform
        ? active?.id !== id
          ? {
              transform: CSS.Translate.toString(transform),
            }
          : undefined
        : undefined,
    [transform, active, id]
  );

  const spheres = [];
  for (let i = 0; i < 6; i++) {
    spheres.push(
      <Box key={i} sx={{ position: "relative" }}>
        <img src={assets[parseInt(idx)].imgSrc} style={{ height: "35px", objectFit: "cover", display: "block" }} />
        {word && (
          <Typography
            variant="button"
            sx={{
              position: "absolute",
              top: "45%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: "#fff",
            }}
          >
            {WORD_ON_SPHERE}
          </Typography>
        )}
      </Box>
    );
  }

  return (
    <StyledBox bgcolor="transparent" id={id} ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {spheres}
    </StyledBox>
  );
};
