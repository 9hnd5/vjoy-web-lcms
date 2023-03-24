import { EscalatorWarning } from "@mui/icons-material";
import { authService } from "admin/modules/auth/authService";
import { LoginPage } from "admin/modules/auth/components/LoginPage";
import kidComponents from "admin/modules/kid/components";
import userComponents from "admin/modules/user/components";
import dataService from "admin/services/dataService";
import { Admin as RAAdmin, defaultTheme, memoryStore, Resource } from "react-admin";
const theme = {
  ...defaultTheme,
  typography: {
    ...defaultTheme.typography,
    fontFamily: "SVN-Gotham",
    fontSize: 16,
  },
};
export const Admin = () => {
  return (
    <RAAdmin
      basename="/admin"
      dataProvider={dataService}
      authProvider={authService}
      loginPage={LoginPage}
      theme={theme}
      store={memoryStore()}
    >
      <Resource name="core/users" options={{ label: "Users" }} {...userComponents} />
      <Resource icon={EscalatorWarning} name="core/kids" options={{ label: "Kids" }} {...kidComponents} />
    </RAAdmin>
  );
};
