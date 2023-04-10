import { baseService, Pagination, providesList, Result } from "./baseService";

const url = "content/lessons";

const lessonService = baseService.injectEndpoints({
  endpoints: (builder) => ({
    getLessons: builder.query<Pagination<Lesson>, any>({
      query: (params) => ({
        url,
        method: "GET",
        params: { filter: JSON.stringify(params) },
      }),
      providesTags: (result) => providesList(result?.data.rows, "Lesson"),
    }),

    getLesson: builder.query<Result<Lesson>, number>({
      query: (id) => ({
        url: `${url}/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Lesson", id }],
    }),

    updateLesson: builder.mutation<void, Partial<Lesson>>({
      query: (body) => ({
        url: `${url}/${body.id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => (error ? [] : [{ type: "Lesson", id }]),
    }),

    createLesson: builder.mutation<void, Partial<Lesson>>({
      query: (body) => ({
        url,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error) => (error ? [] : [{ type: "Lesson", id: "LIST" }]),
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
  BUST_A_WORD: "BUST_A_WORD",
  DIY: "DIY",
  DROPPY_BIRD: "DROPPY_BIRD",
  TRIVIA: "TRIVIA",
  WORD_BALLOON: "WORD_BALLOON",
  WORD_SHARK: "WORD_SHARK",
};

export type Lesson = {
  id: number;
  name: string;
  status: number;
  unitId: number;
  difficulty: number;
  rules?: any;
  asset: BustAWordAsset | WordBalloonAsset;
  curriculum: {
    name: string;
    data: Curriculum[];
  };
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
export type WordBalloonAsset = {
  bundleUrl: string;
  balloons: Balloon[];
  bg: string;
  cannon: string;
  behavior: number;
};
export type Sphere = {
  type: string;
  name: string;
};
export type BustAWordAsset = {
  bundleUrl: string;
  bg: string;
  cannon: string;
  spheres: Sphere[];
};

export const {
  useGetLessonsQuery,
  useLazyGetLessonsQuery,
  useGetLessonQuery,
  useLazyGetLessonQuery,
  useCreateLessonMutation,
  useUpdateLessonMutation,
} = lessonService;
