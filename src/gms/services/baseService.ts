import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { TAG_TYPES } from "gms/ultils/constansts";
import qs from "query-string";

const baseUrl = ENV.BASE_URL;

const apiToken = ENV.API_TOKEN;

export function providesList<R extends { id: string | number }[], T extends string>(
  resultsWithIds: R | undefined,
  tagType: T
) {
  return resultsWithIds
    ? [{ type: tagType, id: "LIST" }, ...resultsWithIds.map(({ id }) => ({ type: tagType, id }))]
    : [{ type: tagType, id: "LIST" }];
}

export const baseService = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      headers.set("api-token", apiToken);
      //Hard admin accessToken;
      const accessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGVDb2RlIjoiYWRtaW4iLCJpYXQiOjE2NzkyOTU4OTMsImV4cCI6MTY3OTI5NjE5M30.Fu0qrjih1tPFIxpuCPkmT-bdpPVwBtnjRbl2AIsh_QI";
      headers.set("authorization", `Bearer ${accessToken}`);
      return headers;
    },
    paramsSerializer: (params) => {
      return qs.stringify(params);
    },
  }),
  tagTypes: TAG_TYPES,
  endpoints: () => ({}),
});

export type Pagination<T extends Record<string, any>> = {
  data: {
    rows: T[];
    count: number;
  };
};

export type Result<T extends Record<string, any> = any> = {
  data: T;
};
