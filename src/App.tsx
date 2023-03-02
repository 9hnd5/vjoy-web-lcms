import { EscalatorWarning } from "@mui/icons-material";
import { authService } from "modules/auth/authService";
import { LoginPage } from "modules/auth/components/LoginPage";
import kidService from "modules/kid/kidService";
import { Admin, combineDataProviders, defaultTheme, memoryStore, Resource } from "react-admin";
import { Route } from "react-router-dom";
import dataService from "services/dataService";

const theme = {
  ...defaultTheme,
  typography: {
    ...defaultTheme.typography,
    fontFamily: "SVN-Gotham",
    fontSize: 16,
  },
};

import { KidCreate } from "modules/kid/components/KidCreate";
import { KidEdit } from "modules/kid/components/KidEdit";
import { KidList } from "modules/kid/components/KidList";
import userComponents from "modules/user/components";

const dataProvider = combineDataProviders((resource) => {
  switch (resource) {
    case "core/kids":
      return kidService;
    default:
      return dataService;
  }
});
const App = () => {
  return (
    <Admin
      dataProvider={dataProvider}
      authProvider={authService}
      loginPage={LoginPage}
      theme={theme}
      store={memoryStore()}
    >
      <Resource name="core/users" options={{ label: "Users" }} {...userComponents}>
        <Route path=":userId/kids/:kidId" element={<KidEdit />} />
      </Resource>
      <Resource
        icon={EscalatorWarning}
        name="core/kids"
        options={{ label: "Kids" }}
        list={<KidList />}
        create={<KidCreate />}
      />
    </Admin>
  );
};

export default App;
