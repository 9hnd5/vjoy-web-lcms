import { createTheme, Container, ThemeProvider } from "@mui/material";
import { Provider } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { WordBalloonEditor } from "./modules/word-balloon/WordBalloonEditor";
import { store } from "./store";
import { Notification } from "./components/Notification";

const theme = createTheme({ typography: { fontFamily: "SVN-Gotham" } });

export const Gms = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Container disableGutters maxWidth={false}>
          <Routes>
            <Route path="/word-balloon" element={<WordBalloonEditor />} />
          </Routes>
          <Notification />
        </Container>
      </ThemeProvider>
    </Provider>
  );
};
