import { Grid, ImageList, ImageListItem, ImageListItemProps, InputLabel } from "@mui/material";
import { blueGrey, orange } from "@mui/material/colors";
import { styled } from "@mui/material/styles";

import { upperCase } from "lodash";
import { useState } from "react";

interface StyledImageItemProps extends ImageListItemProps {
  selected?: boolean;
}

const ImageItem = styled(ImageListItem, {
  shouldForwardProp: (prop) => prop !== "selected",
})<StyledImageItemProps>(({ selected }) => ({
  margin: "10px",
  "&:hover": {
    cursor: "pointer",
    opacity: 0.8,
    boxShadow: `0px 5px 15px ${blueGrey.A400}`,
  },
  ...(selected && {
    opacity: 0.8,
    border: `solid 5px ${orange[300]}`,
  }),
}));

export const ImageSelect = ({ label, imgs, viewRow }: any) => {
  const [selected, setSelected] = useState(
    imgs.map(() => {
      return false;
    })
  );
  return (
    <>
      <InputLabel
        sx={{
          color: orange[500],
          fontWeight: "bold",
          padding: "10px",
        }}
      >
        {upperCase(label)}
      </InputLabel>
      <Grid
        sx={{
          border: `solid 3px ${blueGrey[300]}`,
          borderRadius: "10px",
          marginBottom: "10px",
          overflow: "hidden",
        }}
      >
        <ImageList
          sx={{
            margin: "0",
            ...(viewRow && {
              gridAutoFlow: "column",
            }),
            gridTemplateColumns: "repeat(auto-fill,minmax(100px,1fr)) !important",
            gridAutoColumns: "minmax(100px, 1fr)",
          }}
        >
          {imgs &&
            imgs.map((elem: string, idx: number) => {
              return (
                <ImageItem
                  key={idx}
                  selected={selected[idx]}
                  onClick={() => {
                    setSelected((state: any) => {
                      return state.map((e: boolean, i: number) => {
                        return i == idx ? !e : false;
                      });
                    });
                  }}
                >
                  <img src={`${elem}`} style={{ maxHeight: "100px", objectFit: "cover" }} />
                </ImageItem>
              );
            })}
        </ImageList>
      </Grid>
    </>
  );
};
