import { Pagination, baseService } from "./baseService";

const url = "content/levels";

const levelService = baseService.injectEndpoints({
  endpoints: (builder) => ({
    getLevels: builder.query<Pagination<Level>, any>({
      query: (params) => ({
        url,
        method: "GET",
        params,
      }),
      providesTags: ["LEVELS"],
    }),
  }),
});

export type Level = {
  id: string;
  name: string;
  subject: string;
  status: number;
  rules?: any;
  asset?: any;
  createdAt: Date;
  updatedAt: Date;
};

export const { useGetLevelsQuery } = levelService;
