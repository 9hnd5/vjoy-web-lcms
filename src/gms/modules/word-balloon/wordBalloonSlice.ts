import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "gms/store";

type WordBalloonState = {
  value: any;
};

const initialState: WordBalloonState = {
  value: 0,
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
  },
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;

export const selectValue = (state: RootState) => state.wordBalloon.value;

export default counterSlice.reducer;
