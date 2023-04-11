import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Grid, styled, Typography } from "@mui/material";
import { blueGrey } from "@mui/material/colors";
import { AssetImage } from "gms/ultils/types";
import { useMemo } from "react";
import { WORD_ON_SPHERE } from "../bustAWordContant";

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

type SphereProps = {
  id: string;
  word?: boolean;
  assets: AssetImage[];
};

export const SphereDraggable = ({ id, word = false, assets }: SphereProps) => {
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
  return (
    <ImageItem item id={id} ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <img src={assets[parseInt(idx)].imgSrc} style={{ height: "35px", objectFit: "cover", display: "block" }} />
      {word && (
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
          {WORD_ON_SPHERE}
        </Typography>
      )}
    </ImageItem>
  );
};
