import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "gms/store";
import { AssignmentsMap } from "./bustAWordType";

type BustAWordState = {
  assignmentsMap: AssignmentsMap;
};

const initialState: BustAWordState = {
  assignmentsMap: {},
};

export const counterSlice = createSlice({
  name: "bustAWord",
  initialState,
  reducers: {
    assignSphere: (state, action: PayloadAction<{ sphereId: string; boardId: string }>) => {
      const current = state.assignmentsMap;
      const { sphereId, boardId } = action.payload;
      const keyToRemove = Object.keys(current).find((k) => current[k] === boardId);
      const updatedItems = keyToRemove ? { ...current, [keyToRemove]: undefined } : current;

      state.assignmentsMap = {
        ...updatedItems,
        [sphereId]: boardId,
      };
    },
    removeSphere: (state, action: PayloadAction<string>) => {
      const current = state.assignmentsMap;
      state.assignmentsMap = { ...current, [action.payload]: undefined };
    },
    removeAllSphere: (state) => {
      state.assignmentsMap = {};
    },
  },
});

export const { assignSphere, removeSphere, removeAllSphere } = counterSlice.actions;

export const selectAllAssignedSpheres = (state: RootState) => state.bustAWord.assignmentsMap;
export const selectAssignedSpheres = (state: RootState) => {
  return (id: string) => {
    for (const [sphereId, boardId] of Object.entries(state.bustAWord.assignmentsMap)) {
      if (boardId === id) {
        return sphereId;
      }
    }

    return;
  };
};
export const selectAssignedIdCount = (state: RootState) => {
  return (id: string) => {
    let count = 0;
    for (const [sphereId] of Object.entries(state.bustAWord.assignmentsMap)) {
      if (sphereId.startsWith(id)) {
        count += 1;
      }
    }
    return count;
  };
};

export default counterSlice.reducer;
