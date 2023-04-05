import { Pagination, baseService, providesList } from "./baseService";

const url = "content/levels";

const levelService = baseService.injectEndpoints({
  endpoints: (builder) => ({
    getLevels: builder.query<Pagination<Level>, void>({
      query: () => ({
        url,
        method: "GET",
      }),
      providesTags: (result) => providesList(result?.data.rows, "Level"),
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
