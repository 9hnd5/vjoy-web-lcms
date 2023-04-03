import { baseService, Pagination, Result } from "./baseService";

const url = "content/lessons";

const lessonService = baseService.injectEndpoints({
  endpoints: (builder) => ({
    getLessons: builder.query<Pagination<Lesson>, any>({
      query: (params) => ({
        url,
        method: "GET",
        params,
      }),
      providesTags: ["LESSONS"],
    }),
    getLesson: builder.query<Result<Lesson>, number>({
      query: (id) => ({
        url: `${url}/${id}`,
        method: "GET",
      }),
      providesTags: ["LESSONS"],
    }),
    updateLesson: builder.mutation<void, Partial<Lesson>>({
      query: (body) => ({
        url: `${url}/${body.id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["LESSONS"],
    }),
    createLesson: builder.mutation<void, Partial<Lesson>>({
      query: (body) => ({
        url,
        method: "POST",
        body,
      }),
      invalidatesTags: ["LESSONS"],
    }),
  }),
});

export const LESSON_STATUS = {
  SAVED: 0,
  APPROVED: 1,
  PUBLISHED: 2,
  HIDDEN: 3,
};

export const LESSON_DIFFICULTY = {
  EASY: 0,
  NORMAL: 1,
  HARD: 2,
  VERY_HARD: 3,
};

export const GAME_TYPE = {
  WORD_BALLOON: "WORD_BALLOON",
  TRIVIA: "TRIVIA",
  DIY: "DIY",
  BUST_A_WORD: "BUST_A_WORD",
  DROPPY_BIRD: "DROPPY_BIRD",
  WORD_SHARK: "WORD_SHARK",
};

export type Lesson = {
  id: number;
  name: string;
  status: number;
  unitId: number;
  difficulty: number;
  rules?: any;
  asset: Asset;
  curriculum: Curriculum[];
  gameType: string;
  createdAt: Date;
  updatedAt: Date;
};
export type Curriculum = {
  difficulty: number;
  word: string;
  missingLetterCount: number;
};
export type Balloon = {
  type: string;
  position: string;
  name: string;
};
export type Asset = {
  bundleUrl: string;
  balloons: Balloon[];
  bg: string;
  cannon: string;
  behavior: number;
};

export const {
  useGetLessonsQuery,
  useGetLessonQuery,
  useLazyGetLessonQuery,
  useCreateLessonMutation,
  useUpdateLessonMutation,
} = lessonService;
