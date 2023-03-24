import React from "react";
import { useAuthProvider } from "react-admin";

export const useAuthenticated = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const authProvider = useAuthProvider();

  React.useEffect(() => {
    function checkAuth() {
      authProvider.checkAuth({}).then(() => {
        setIsAuthenticated(true);
      });
    }
    checkAuth();
  });

  return isAuthenticated;
};
