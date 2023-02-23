import { authService } from "modules/auth/authService";
import { LoginPage } from "modules/auth/components/LoginPage";
import { Admin, combineDataProviders, CustomRoutes, defaultTheme, Resource } from "react-admin";
import { Route } from "react-router-dom";
import dataService from "services/dataService";
import kidService from "modules/kid/kidService";

const theme = {
  ...defaultTheme,
  typography: {
    ...defaultTheme.typography,
    fontFamily: "SVN-Gotham",
    fontSize: 16,
  },
};

import userComponents from "modules/user/components";
import kidComponents from "modules/kid/components";
import { KidList } from "modules/kid/components/KidList";
import { KidEdit } from "modules/kid/components/KidEdit";

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
    <Admin dataProvider={dataProvider} authProvider={authService} loginPage={LoginPage} theme={theme}>
      <Resource name="core/users" options={{ label: "Users" }} {...userComponents.user} />
      <Resource name="core/kids" options={{ label: "Kids" }} list={<KidList />} >
        <Route path=":id/users" element={<KidEdit />} />
      </Resource>
    </Admin>
  );
};

export default App;
