import axios from "axios";
import { HttpError } from "react-admin";
import dataService from "services/dataService";
import { LOCAL_STORAGE_KEY } from "ultils/constants";
const dataServiceAxios = axios.create();
const baseUrl = ENV.BASE_URL;

dataServiceAxios.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (err) {
    if (!err.response) return Promise.reject(err);
    const {
      response: {
        data: { error },
        status,
      },
    } = err;
    if (typeof error === "string") return Promise.reject(new HttpError(error, status));
    if (Array.isArray(error)) return Promise.reject(new HttpError("Error", status, error));
    return Promise.reject(new HttpError(error.message, status));
  }
);

dataServiceAxios.interceptors.request.use(function (config) {
  const user = localStorage.getItem(LOCAL_STORAGE_KEY.USER);
  if (!user) return config;

  const parseUser = JSON.parse(user);
  config.headers.authorization = `Bearer ${parseUser.accessToken}`;
  config.baseURL = `${baseUrl}/core/users/`;
  return config;
});

const kidService = {
  ...dataService,

  getOne: async (resource: string, params: any) => {
    const url = `/kids/${params.id}`;
    const data = await dataServiceAxios.get(url);
    return data;
  },
}

export default kidService;