import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "gms/store";
import { AssignmentsMap } from "./wordBalloonType";

type WordBalloonState = {
  value: any;
  assignmentsMap: AssignmentsMap;
};

const initialState: WordBalloonState = {
  value: 0,
  assignmentsMap: {},
};

export const counterSlice = createSlice({
  name: "wordBalloon",
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
    assignBalloon: (state, action: PayloadAction<{ balloonId: string; boardId: string }>) => {
      const current = state.assignmentsMap;
      const { balloonId, boardId } = action.payload;
      const keyToRemove = Object.keys(current).find((k) => current[k] === boardId);
      const updatedItems = keyToRemove ? { ...current, [keyToRemove]: undefined } : current;

      state.assignmentsMap = {
        ...updatedItems,
        [balloonId]: boardId,
      };
    },
    removeBalloon: (state, action: PayloadAction<string>) => {
      const current = state.assignmentsMap;
      state.assignmentsMap = { ...current, [action.payload]: undefined };
    },
    removeAllBalloon: (state) => {
      state.assignmentsMap = {};
    },
  },
});

export const { increment, decrement, incrementByAmount, assignBalloon, removeBalloon, removeAllBalloon } =
  counterSlice.actions;

export const selectValue = (state: RootState) => state.wordBalloon.value;
export const selectAllAssignedBalloons = (state: RootState) => state.wordBalloon.assignmentsMap;
export const selectAssignedBalloons = (state: RootState) => {
  return (id: string) => {
    const balloonIds = [];

    for (const [balloonId, boardId] of Object.entries(state.wordBalloon.assignmentsMap)) {
      if (boardId === id) {
        balloonIds.push(balloonId);
      }
    }

    return balloonIds;
  };
};
export const selectAssignedIdCount = (state: RootState) => {
  return (id: string) => {
    let count = 0;
    for (const [balloonId] of Object.entries(state.wordBalloon.assignmentsMap)) {
      if (balloonId.startsWith(id)) {
        count += 1;
      }
    }
    return count;
  };
};

export default counterSlice.reducer;
