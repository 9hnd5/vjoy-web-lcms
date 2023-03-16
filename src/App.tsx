import { EscalatorWarning } from "@mui/icons-material";
import { authService } from "modules/auth/authService";
import { LoginPage } from "modules/auth/components/LoginPage";
import { Admin, defaultTheme, memoryStore, Resource } from "react-admin";
import dataService from "services/dataService";

const theme = {
  ...defaultTheme,
  typography: {
    ...defaultTheme.typography,
    fontFamily: "SVN-Gotham",
    fontSize: 16,
  },
};

import kidComponents from "modules/kid/components";
import userComponents from "modules/user/components";

const App = () => {
  return (
    <Admin
      dataProvider={dataService}
      authProvider={authService}
      loginPage={LoginPage}
      theme={theme}
      store={memoryStore()}
    >
      <Resource name="core/users" options={{ label: "Users" }} {...userComponents} />
      <Resource icon={EscalatorWarning} name="core/kids" options={{ label: "Kids" }} {...kidComponents} />
    </Admin>
  );
};

export default App;
