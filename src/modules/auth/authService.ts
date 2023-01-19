export const authService = {
  login: (params: any) => {
    const { username, password } = params;
    if (username !== "test" && password !== "test") {
      return Promise.reject();
    }
    localStorage.setItem("username", username);
    return Promise.resolve();
  },
  logout: () => {
    localStorage.removeItem("username");
    return Promise.resolve();
  },
  checkAuth: () =>
    localStorage.getItem("username") ? Promise.resolve() : Promise.reject(),
  checkError: (error: any) => {
    const status = error.status;
    if (status === 401 || status === 403) {
      return Promise.reject();
    }
    return Promise.resolve();
  },
  getIdentity: () =>
    Promise.resolve({
      id: 1,
      fullName: "Huy Nguyễn",
    }),
  getPermissions: () => Promise.resolve(""),
};
