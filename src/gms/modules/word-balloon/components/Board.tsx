import { Box, BoxProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useRef } from "react";

interface StyledBoxProps extends BoxProps {
  cellWidth?: number;
}

const BoardSquare = styled(Box, {
  shouldForwardProp: (prop) => prop !== "cellWidth",
})<StyledBoxProps>(({ cellWidth }) => ({
  width: `${cellWidth}%`,
  height: "50px",
  textAlign: "center",
  lineHeight: "50px",
  border: "1px solid black",
}));

const Board = (props: BoxProps) => {
  const ref = useRef<HTMLInputElement>(null);
  const renderBoard = () => {
    const board = [];
    for (let row = 0; row < 4; row++) {
      const currentRow = [];
      for (let col = 0; col < 5; col++) {
        currentRow.push(
          <BoardSquare bgcolor="transparent" key={`${row}-${col}`} cellWidth={ref.current?.offsetWidth??500 / 5}>
            {row}-{col}
          </BoardSquare>
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

  return <Box {...props} ref={ref}>{renderBoard()}</Box>;
};

export default Board;
