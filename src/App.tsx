import { authService } from "modules/auth/authService";
import { LoginPage } from "modules/auth/components/LoginPage";
import { Admin, defaultTheme, Resource } from "react-admin";
import dataService from "services/dataService";
const theme = {
  ...defaultTheme,
  typography: {
    ...defaultTheme.typography,
    fontFamily: "SVN-Gotham",
    fontSize: 16,
  },
};

import userComponents from "modules/user/components";

const App = () => {
  return (
    <Admin dataProvider={dataService} authProvider={authService} loginPage={LoginPage} theme={theme}>
      <Resource name="core/users" options={{ label: "Users" }} {...userComponents.user} />
    </Admin>
  );
};

export default App;
