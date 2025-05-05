import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// backend's live meeting URL
const LIVE_MEETING_API = "http://localhost:9090/api/v1/meetings";

export const liveMeetingApi = createApi({
  reducerPath: "liveMeetingApi",
  baseQuery: fetchBaseQuery({
    baseUrl: LIVE_MEETING_API,
    credentials: "include", // This will include the cookie for authentication
  }),
  endpoints: (builder) => ({
    // Create or start a meeting (Instructor)
    createMeeting: builder.mutation({
      query: (meetingData) => ({
        url: "/create",
        method: "POST",
        body: meetingData,
      }),
    }),

    // Get meeting by course ID (for students)
    getMeetingByCourse: builder.query({
      query: (courseId) => `/course/${courseId}`,
    }),

    deleteMeeting: builder.mutation({
        query: (meetingId) => ({
          url: `/meetings/${meetingId}`,
          method: 'DELETE',
        }),
      }),

    // Student sends join request
    sendJoinRequest: builder.mutation({
      query: (meetingId) => ({
        url: `/${meetingId}/join-request`,
        method: "POST",
      }),
    }),

    // Instructor approves student
    approveStudent: builder.mutation({
      query: ({ meetingId, studentId }) => ({
        url: `/${meetingId}/approve`,
        method: "POST",
        body: { studentId },
      }),
    }),
  }),
});

export const {
  useCreateMeetingMutation,
  useGetMeetingByCourseQuery,
  useSendJoinRequestMutation,
  useApproveStudentMutation,
  useDeleteMeetingMutation 
} = liveMeetingApi;
