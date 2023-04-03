import { baseService } from "./baseService";

const url = "file-uploader/files";

const assetService = baseService.injectEndpoints({
  endpoints: (builder) => ({
    getAssets: builder.query<{ data: string[] }, { bucket: string; folder: string }>({
      query: (params) => ({ url, method: "GET", params: { ...params, type: ".png" } }),
      providesTags: ["ASSETS"],
    }),
  }),
});

export const { useGetAssetsQuery } = assetService;
