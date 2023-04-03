import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

export type Severity = "error" | "success";

type AppState = {
  notification: {
    open: boolean;
    title?: string;
    content?: string;
    severity: Severity;
  };
};

const initialState = {
  notification: {},
} as AppState;
const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    openNotification: (state, action: PayloadAction<{ title?: string; content?: string; severity: Severity }>) => {
      state.notification.content = action.payload.content;
      state.notification.severity = action.payload.severity;
      
      if (state.notification.title) state.notification.title = action.payload.title;

      if (state.notification.severity === "success" && !state.notification.title) {
        state.notification.title = "Successfully";
      }

      if (state.notification.severity === "error" && !state.notification.title) {
        state.notification.title = "Failure";
      }

      state.notification.open = true;
    },
    closeNotification: (state) => {
      state.notification = {} as any;
    },
  },
});

export const { openNotification, closeNotification } = appSlice.actions;
export const selectOpenNotification = (state: RootState) => state.app.notification.open;
export const selectNotification = (state: RootState) => state.app.notification;
export default appSlice.reducer;
