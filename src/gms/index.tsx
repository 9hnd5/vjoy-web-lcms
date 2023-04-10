import { createTheme, Container, ThemeProvider } from "@mui/material";
import { Provider } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { store } from "./store";
import { Notification } from "./components/Notification";
import { BustAWordEditor } from "./modules/bust-a-word/BustAWordEditor";
import { WordBalloonEditor } from "./modules/word-balloon/WordBalloonEditor";

const theme = createTheme({ typography: { fontFamily: "SVN-Gotham" } });

export const Gms = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Container disableGutters maxWidth={false}>
          <Routes>
            <Route path="/word-balloon" element={<WordBalloonEditor />} />
            <Route path="/bust-a-word" element={<BustAWordEditor />} />
          </Routes>
          <Notification />
        </Container>
      </ThemeProvider>
    </Provider>
  );
};
