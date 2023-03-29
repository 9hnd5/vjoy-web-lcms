import { Container } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Provider } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { WordBalloonEditor } from "./modules/word-balloon/WordBalloonEditor";
import { store } from "./store";

const theme = createTheme({ typography: { fontFamily: "SVN-Gotham", fontSize: 16 } });

export const Gms = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Container disableGutters maxWidth={false}>
          <Routes>
            <Route path="/word-balloon" element={<WordBalloonEditor />} />
          </Routes>
        </Container>
      </ThemeProvider>
    </Provider>
  );
};
