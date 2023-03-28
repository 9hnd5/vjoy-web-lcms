import { Container } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Route, Routes } from "react-router-dom";
import { WordBalloon } from "./modules/word-balloon/WordBalloon";
import { Provider } from "react-redux";
import { store } from "./store";

const theme = createTheme({ typography: { fontFamily: "SVN-Gotham", fontSize: 16 } });

export const Gms = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Container disableGutters maxWidth={false}>
          <Routes>
            <Route path="/word-balloon" element={<WordBalloon />} />
          </Routes>
        </Container>
      </ThemeProvider>
    </Provider>
  );
};
