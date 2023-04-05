import { Pagination, baseService, providesList } from "./baseService";

const url = "content/units";

const unitService = baseService.injectEndpoints({
  endpoints: (builder) => ({
    getUnits: builder.query<Pagination<Unit>, void>({
      query: () => ({
        url,
        method: "GET",
      }),
      providesTags: (result) => providesList(result?.data.rows, "Unit"),
    }),
  }),
});

export const { useGetUnitsQuery } = unitService;

export type Unit = {
  id: number;
  name: string;
  status: number;
  levelId: string;
  rules?: any;
  asset?: any;
  createdAt: Date;
  updatedAt: Date;
};

export const UNIT_STATUS = {
  NEW: 0,
  APPROVED: 1,
  PUBLISHED: 2,
  HIDE: 3,
};
