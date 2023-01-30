import { Admin, defaultTheme, ListGuesser, Resource } from "react-admin";
import dataService from "services/dataService";
const theme = {
  ...defaultTheme,
  typography: {
    ...defaultTheme.typography,
    fontFamily: "SVN-Gotham",
    fontSize: 16,
  },
};
const App = () => {
  return <Admin dataProvider={dataService} theme={theme}></Admin>;
};

export default App;
