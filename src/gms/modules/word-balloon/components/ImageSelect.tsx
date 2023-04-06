import { Grid, ImageList, ImageListItem, ImageListItemProps, InputLabel, styled } from "@mui/material";
import { blueGrey, orange } from "@mui/material/colors";
import { upperCase } from "lodash";
import { AssetImage } from "../wordBalloonType";

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

type ImageSelectProps = {
  label: string;
  selectedImg?: AssetImage;
  imgs: AssetImage[];
  viewRow?: boolean;
  onChange: (value: AssetImage) => void;
};

export const ImageSelect = ({ label, selectedImg, imgs, viewRow, onChange }: ImageSelectProps) => {
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
        {upperCase(label)}
      </InputLabel>
      <Grid
        sx={{
          border: `solid 3px ${blueGrey[300]}`,
          borderRadius: "4px",
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
            gridTemplateColumns: "repeat(auto-fill,minmax(70px,1fr)) !important",
            gridAutoColumns: "minmax(70px, 1fr)",
          }}
        >
          {imgs &&
            imgs.map((elem: AssetImage, idx: number) => {
              return (
                <ImageItem key={idx} selected={selectedImg?.url === elem.url} onClick={() => onChange(elem)}>
                  <img src={elem.imgSrc} style={{ maxHeight: "100px", objectFit: "cover" }} />
                </ImageItem>
              );
            })}
        </ImageList>
      </Grid>
    </>
  );
};
