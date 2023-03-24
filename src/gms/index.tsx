import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Route } from "react-router-dom";

const theme = createTheme({ typography: { fontFamily: "SVN-Gotham", fontSize: 16 } });

export const Gms = () => {
  return (
    <ThemeProvider theme={theme}>
      <Route path="word-balloon" />
    </ThemeProvider>
  );
};
