import { Box, BoxProps } from "@mui/material";
import { useRef } from "react";
import { AssetImage } from "../wordBalloonType";
import BoardSquare from "./BoardSquare";

interface BoardProps extends BoxProps {
  assets: AssetImage[];
}

const Board = ({ assets, ...props }: BoardProps) => {
  const ref = useRef<HTMLInputElement>(null);
  const renderBoard = () => {
    const board = [];
    for (let row = 0; row < 4; row++) {
      const currentRow = [];
      for (let col = 0; col < 5; col++) {
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

export default Board;
