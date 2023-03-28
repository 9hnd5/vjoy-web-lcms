import { baseService } from "./baseService";

const url = "file-uploader/files";

const assetService = baseService.injectEndpoints({
  endpoints: (builder) => ({
    getAssets: builder.query<string[], { bucket: string; folder: string }>({
      query: (params) => ({ url, method: "GET", params }),
      providesTags: ["ASSETS"],
    }),
  }),
});

export const { useGetAssetsQuery } = assetService;
