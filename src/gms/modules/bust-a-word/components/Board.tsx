import { Box, BoxProps } from "@mui/material";
import { AssetImage } from "gms/ultils/types";
import { useRef } from "react";
import { BoardRow } from "./BoardRow";

interface BoardProps extends BoxProps {
  assets: AssetImage[];
  words: { value: boolean }[];
  rows: number;
}

export const Board = ({ assets, words, rows, ...props }: BoardProps) => {
  const ref = useRef<HTMLInputElement>(null);
  const renderBoard = () => {
    const board = [];
    for (let row = 0; row < rows; row++) {
      board.push(<BoardRow key={row} id={row} assets={assets} words={words} />);
    }
    return board;
  };

  return (
    <Box {...props} ref={ref}>
      {renderBoard()}
    </Box>
  );
};
