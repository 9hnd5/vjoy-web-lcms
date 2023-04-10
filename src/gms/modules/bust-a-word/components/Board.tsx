import { Box, BoxProps } from "@mui/material";
import { useRef } from "react";
import { BoardSquare } from "./BoardSquare";
import { AssetImage } from "gms/ultils/types";

interface BoardProps extends BoxProps {
  assets: AssetImage[];
  rows: number;
}

export const Board = ({ assets, rows, ...props }: BoardProps) => {
  const ref = useRef<HTMLInputElement>(null);
  const renderBoard = () => {
    const board = [];
    for (let row = 0; row < rows; row++) {
      const currentRow = [];
      for (let col = 0; col < 7; col++) {
        currentRow.push(
          <BoardSquare
            key={`${row},${col}`}
            id={`${row},${col}`}
            width={ref.current?.offsetWidth ?? 500 / 5}
            assets={assets}
          />
        );
      }
      board.push(
        <Box display="flex" key={row}>
          {currentRow}
        </Box>
      );
    }
    return board;
  };

  return (
    <Box {...props} ref={ref}>
      {renderBoard()}
    </Box>
  );
};
