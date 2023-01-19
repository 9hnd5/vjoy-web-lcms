import axios from "axios";
import qs from "query-string";
import { HttpError } from "react-admin";
const { stringify } = qs;

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
console.log("url", apiUrl);
console.log("env", process.env.NODE_ENV);
console.log("env1", process.env);

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (err) {
    if (err.response) {
      const { response } = err;
      return Promise.reject(
        new HttpError(response.data.message, response.status, response.data)
      );
    } else if (err.request) {
      const { status, response } = err.request;
      return Promise.reject(
        new HttpError("Network Error", status, JSON.stringify(response))
      );
    } else {
      return Promise.reject(new HttpError("Internal Error", 500, err.message));
    }
  }
);

axios.interceptors.request.use(function (config) {
  const userSession = localStorage.getItem("userSession"); // Must do
  config.headers.authorization = "Bearer ";
  return config;
});

const dataService = {
  getList: async (resource: string, params: any) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const query = {
      sort: JSON.stringify([field, order]),
      range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
      filter: JSON.stringify(params.filter),
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;
    const { data } = await axios.get(url);
    return data;
  },

  getOne: async (resource: string, params: any) => {
    const url = `${apiUrl}/${resource}/${params.id}`;
    const { data } = await axios.get(url);
    return data;
  },

  getMany: async (resource: string, params: any) => {
    const query = {
      filter: JSON.stringify({ ids: params.ids }),
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;
    const { data } = await axios.get(url);
    return data;
  },

  getManyReference: async (resource: string, params: any) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const query = {
      sort: JSON.stringify([field, order]),
      range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
      filter: JSON.stringify({
        ...params.filter,
        [params.target]: params.id,
      }),
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;
    const { data } = await axios.get(url);
    return data;
  },

  create: async (resource: string, params: any) => {
    const url = `${apiUrl}/${resource}`;
    const { data } = await axios.post(url, params.data);
    return data;
  },

  update: async (resource: string, params: any) => {
    const url = `${apiUrl}/${resource}/${params.id}`;
    const { data } = await axios.put(url, params.data);
    return data;
  },

  updateMany: async (resource: string, params: any) => {
    const query = {
      ids: JSON.stringify({ id: params.ids }),
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;
    const { data } = await axios.put(url, params.data);
    return data;
  },

  delete: async (resource: string, params: any) => {
    const url = `${apiUrl}/${resource}/${params.id}`;
    const { data } = await axios.delete(url);
    return data;
  },

  deleteMany: async (resource: string, params: any) => {
    const query = {
      ids: JSON.stringify(params.ids),
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;
    const { data } = await axios.delete(url);
    return data;
  },
};

export default dataService;
