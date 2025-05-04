import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COURSE_PROGRESS_API = "http://localhost:9090/api/v1/progress";

export const courseProgressApi = createApi({
  reducerPath: "courseProgressApi",
  baseQuery: fetchBaseQuery({
    baseUrl: COURSE_PROGRESS_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getCourseProgress: builder.query({
      query: (courseId) => ({
        url: `/${courseId}`,
        method: "GET",
      }),
    }),
    updateLectureProgress: builder.mutation({
      query: ({ courseId, lectureId }) => ({
        url: `/${courseId}/lecture/${lectureId}/view`,
        method:"POST"
      }),
    }),

    completeCourse: builder.mutation({
        query:(courseId) => ({
            url:`/${courseId}/complete`,
            method:"POST"
        })
    }),
    inCompleteCourse: builder.mutation({
        query:(courseId) => ({
            url:`/${courseId}/incomplete`,
            method:"POST"
        })
    }),

    // Add this endpoint to fetch quizzes by course ID
    getQuizzesByCourseId: builder.query({
      query: (courseId) => `/${courseId}/quizzes`,
    }),

      // New endpoint for submitting quiz attempt
      submitQuizAttempt: builder.mutation({
        query: ({ courseId, quizId, studentAnswers }) => ({
          url: `/${courseId}/quiz/${quizId}/submit`,
          method: "POST",
          body: { studentAnswers },
        }),
      }),
  
      // New endpoint for reviewing quiz attempt
      reviewQuizAttempt: builder.query({
        query: ({ courseId, quizId }) => ({
          url: `/${courseId}/quiz/${quizId}/review`,
          method: "GET",
        }),
      }),
    
  }),
});
export const {
useGetCourseProgressQuery,
useUpdateLectureProgressMutation,
useCompleteCourseMutation,
useInCompleteCourseMutation,
useSubmitQuizAttemptMutation,
useReviewQuizAttemptQuery,
useGetQuizzesByCourseIdQuery
} = courseProgressApi;