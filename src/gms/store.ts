import { configureStore } from "@reduxjs/toolkit";
import wordBalloonReducer from "./modules/word-balloon/wordBalloonSlice";
import bustAWordReducer from "./modules/bust-a-word/bustAWordSlice";
import appReducer from "./slice";
import { baseService } from "./services/baseService";

export const store = configureStore({
  reducer: {
    app: appReducer,
    wordBalloon: wordBalloonReducer,
    bustAWord: bustAWordReducer,
    [baseService.reducerPath]: baseService.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseService.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
