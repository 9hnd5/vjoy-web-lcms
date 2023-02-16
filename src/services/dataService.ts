import axios from "axios";
import qs from "query-string";
import { HttpError } from "react-admin";
import { LOCAL_STORAGE_KEY } from "ultils/constants";
const { stringify } = qs;
const dataServiceAxios = axios.create();
const apiUrl = ENV.CORE_API_URL;

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
  return config;
});

const dataService = {
  getList: async (resource: string, params: any) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const query = {
      filter: JSON.stringify(params.filter),
      page: page,
      pageSize: perPage,
      sort: JSON.stringify([[field, order]]),
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;
    const { data } = await dataServiceAxios.get(url);
    return { data: data.rows, total: data.count };
  },

  getOne: async (resource: string, params: any) => {
    const url = `${apiUrl}/${resource}/${params.id}`;
    const data = await dataServiceAxios.get(url);
    return data;
  },

  getMany: async (resource: string, params: any) => {
    const query = {
      filter: JSON.stringify({ ids: params.ids }),
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;
    const data = await dataServiceAxios.get(url);
    return data;
  },

  getManyReference: async (resource: string, params: any) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const query = {
      filter: JSON.stringify({
        ...params.filter,
        [params.target]: params.id,
      }),
      page: page,
      pageSize: perPage,
      sort: JSON.stringify([[field, order]]),
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;
    const { data } = await dataServiceAxios.get(url);
    return data;
  },

  create: async (resource: string, params: any) => {
    const url = `${apiUrl}/${resource}`;
    const data = await dataServiceAxios.post(url, params.data);
    return data;
  },

  update: async (resource: string, params: any) => {
    const url = `${apiUrl}/${resource}/${params.id}`;
    const data = await dataServiceAxios.patch(url, params.data);
    return data;
  },

  updateMany: async (resource: string, params: any) => {
    const query = {
      ids: JSON.stringify({ id: params.ids }),
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;
    const data = await dataServiceAxios.patch(url, params.data);
    return data;
  },

  delete: async (resource: string, params: any) => {
    const url = `${apiUrl}/${resource}/${params.id}`;
    const data = await dataServiceAxios.delete(url);
    return data;
  },

  deleteMany: async (resource: string, params: any) => {
    const query = {
      ids: JSON.stringify(params.ids),
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;
    const data = await dataServiceAxios.delete(url);
    return data;
  },
};

export default dataService;
