import { authService } from "modules/auth/authService";
import { LoginPage } from "modules/auth/components/LoginPage";
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
  return (
    <Admin dataProvider={dataService} authProvider={authService} loginPage={LoginPage} theme={theme}>
      <Resource name="users" list={ListGuesser} />
    </Admin>
  );
};

export default App;
