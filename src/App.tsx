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

import userComponents from "modules/user/components";

import fakeDataProvider from 'ra-data-fakerest';
const dataProvider = fakeDataProvider({ users: [{ firstName: "Alpha", lastName: "Test", dateOfBirth: '1990-01-01', email: 'test@mail.com', gender: 'Male', createdAt: "2023.1.21 10:23:55" }] }, true);

const App = () => {
  return (
    <Admin dataProvider={dataService} authProvider={authService} loginPage={LoginPage} theme={theme}>
      <Resource name="users" list={ListGuesser} />
    </Admin>
  );
};

export default App;
