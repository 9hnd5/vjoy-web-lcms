import { Container } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Route, Routes } from "react-router-dom";

const theme = createTheme({ typography: { fontFamily: "SVN-Gotham", fontSize: 16 } });

export const Gms = () => {
  return (
    <ThemeProvider theme={theme}>
      <Container disableGutters maxWidth={false}>
        <Routes>
          <Route path="/word-balloon" />
        </Routes>
      </Container>
    </ThemeProvider>
  );
};
