import { omit } from "lodash";
import dataService, { dataServiceAxios } from "services/dataService";
import { EXCLUDED_FIELDS } from "ultils/constants";

const kidService = {
  ...dataService,

  getOne: async (resource: string, params: any) => {
    const url = `/core/users/${params.meta.userId}/kids/${params.id}`;
    const data = await dataServiceAxios.get(url);
    return data;
  },

  create: async (resource: string, params: any) => {
    const url = `/core/users/${params.data.parentId}/kids`;
    const data = await dataServiceAxios.post(url, params.data);
    return data;
  },

  update: async (resource: string, params: any) => {
    const url = `/core/users/${params.meta.userId}/kids/${params.id}`;
    const data = await dataServiceAxios.patch(url, omit(params.data, EXCLUDED_FIELDS));
    return data;
  },

  delete: async (resource: string, params: any) => {
    const url = `/core/users/${params.meta.userId}/kids/${params.id}`;
    const data = await dataServiceAxios.delete(url);
    return data;
  },
};

export default kidService;
