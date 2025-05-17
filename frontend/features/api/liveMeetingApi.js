// liveMeetingApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const LIVE_MEETING_API = "http://localhost:9090/api/v1/meetings";

export const liveMeetingApi = createApi({
  reducerPath: "liveMeetingApi",
  baseQuery: fetchBaseQuery({
    baseUrl: LIVE_MEETING_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    createMeeting: builder.mutation({
      query: (meetingData) => ({
        url: "/create",
        method: "POST",
        body: meetingData,
      }),
    }),
    getMeetingByCourse: builder.query({
      query: (courseId) => `/course/${courseId}`,
    }),
    deleteMeeting: builder.mutation({
      query: (meetingId) => ({
        url: `/meetings/${meetingId}`,
        method: "DELETE",
      }),
    }),
    updateMeetingStatus: builder.mutation({
      query: (meetingId) => ({
        url: `/meetings/${meetingId}/start`,
        method: "PUT",
      }),
    }),
    getMeetingForStudent: builder.query({
      query: (courseId) => `/course/${courseId}/meeting`,  // Route to get live meeting for student
    }),
  }),
});

export const {
  useCreateMeetingMutation,
  useGetMeetingByCourseQuery,
  useDeleteMeetingMutation,
  useUpdateMeetingStatusMutation,
  useGetMeetingForStudentQuery
} = liveMeetingApi;

