import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
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
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGVJZCI6ImFkbWluIiwiaWF0IjoxNjgxNjk4NzY2LCJleHAiOjM4MjkxODI0MTN9.U15mdIIoYc3caISWYLGXCTjg1-ZLTOhvxOEGaRJO32w";
      headers.set("authorization", `Bearer ${accessToken}`);
      return headers;
    },
    paramsSerializer: (params) => {
      return qs.stringify(params);
    },
  }),
  tagTypes: ["Asset", "Lesson", "Level", "Unit"],
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
