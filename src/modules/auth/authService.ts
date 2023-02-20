import axios from "axios";
import { LOCAL_STORAGE_KEY } from "ultils/constants";
const authServiceAxios = axios.create();
const baseUrl = ENV.BASE_URL;

authServiceAxios.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (err) {
    if (!err.response) return Promise.reject(err);
    const {
      response: {
        data: { error },
      },
    } = err;
    return Promise.reject(error);
  }
);
authServiceAxios.interceptors.request.use(function (config) {
  config.baseURL = baseUrl;
  return config;
});

export const authService = {
  login: async (params: any) => {
    const { email, password } = params;
    const { data } = await authServiceAxios.post(`core/auth/login`, { email, password, type: "email" });
    localStorage.setItem(LOCAL_STORAGE_KEY.USER, JSON.stringify(data));
    return Promise.resolve();
  },
  logout: () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY.USER);
    return Promise.resolve();
  },
  checkAuth: () => {
    return localStorage.getItem(LOCAL_STORAGE_KEY.USER) ? Promise.resolve() : Promise.reject();
  },
  checkError: (error: any) => {
    if (!error) return Promise.resolve();
    const status = error.status;
    if (status === 401 || status === 403) return Promise.reject();
    return Promise.resolve();
  },
  getIdentity: () => {
    const user = localStorage.getItem(LOCAL_STORAGE_KEY.USER);
    if (!user) return Promise.reject();

    const parseUser = JSON.parse(user);
    return Promise.resolve({ id: parseUser.id, fullName: `${parseUser.firstname} ${parseUser.lastname}` });
  },

  getPermissions: () => {
    const user = localStorage.getItem(LOCAL_STORAGE_KEY.USER);
    if (!user) return Promise.resolve(null);

    const parseUser = JSON.parse(user);
    return Promise.resolve(parseUser.permissions);
  },
};
