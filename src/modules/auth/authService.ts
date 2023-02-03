const fakeUser = {
  id: 1,
  fullName: "Nguyễn Đình Huy",
  token: "fakeToken",
  refreshToken: "fakeRefreshToken",
};
export const authService = {
  login: (params: any) => {
    const { email, password } = params;
    if (email === "admin@gmail.com" && password === "admin") {
      localStorage.setItem("user", JSON.stringify(fakeUser));
      return Promise.resolve();
    }
    return Promise.reject("Invalid Credential");
  },
  logout: () => {
    localStorage.removeItem("user");
    return Promise.resolve();
  },
  checkAuth: () => (localStorage.getItem("user") ? Promise.resolve() : Promise.reject()),
  checkError: (error: any) => {
    const status = error.status;
    if (status === 401 || status === 403) {
      return Promise.reject();
    }
    return Promise.resolve();
  },
  getIdentity: () => {
    const user = localStorage.getItem("user");
    if (!user) return Promise.reject();
    return Promise.resolve(JSON.parse(user));
  },

  getPermissions: () => Promise.resolve(""),
};
