import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const ADMIN_API_BASE_URL = "http://localhost:9090/api/v1/admin/";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({
    baseUrl: ADMIN_API_BASE_URL,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    // Users
    getUsers: builder.query({
      query: () => "users",
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `users/${userId}`,
        method: "DELETE",
      }),
    }),
    promoteToInstructor: builder.mutation({
      query: (userId) => ({
        url: `users/${userId}/promote`,
        method: "PUT",
      }),
    }),

    // Courses
    getCourses: builder.query({
      query: () => "courses",
    }),
    deleteCourse: builder.mutation({
      query: (courseId) => ({
        url: `courses/${courseId}`,
        method: "DELETE",
      }),
    }),
    togglePublish: builder.mutation({
      query: ({ courseId, publish }) => ({
        url: `courses/${courseId}/publish`,
        method: "PUT",
        body: { publish },
      }),
    }),
    getCourseEnrolledStudents: builder.query({
      query: (courseId) => `courses/${courseId}/enrolled`,
    }),

    // Live Meetings
    getAllMeetings: builder.query({
      query: () => '/meetings',
    }),
    deleteMeeting: builder.mutation({
      query: (meetingId) => ({
        url: `meetings/${meetingId}`,
        method: "DELETE",
      }),
    }),
    getDashboardStats: builder.query({
  query: () => "/stats",
}),



  
  }),
});

export const {
  // User hooks
  useGetUsersQuery,
  useDeleteUserMutation,
  usePromoteToInstructorMutation,

  // Course hooks
  useGetCoursesQuery,
  useDeleteCourseMutation,
  useTogglePublishMutation,
  useGetCourseEnrolledStudentsQuery,

  // Meeting hooks
  useGetAllMeetingsQuery,
  useDeleteMeetingMutation,
 
  // Dashboard hooks
  useGetDashboardStatsQuery,
} = adminApi;
