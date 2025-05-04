import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// backend's chat URL
const CHAT_API = "http://localhost:9090/api/v1/chat";

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: fetchBaseQuery({
    baseUrl: CHAT_API,
    credentials: "include", // This will include the cookie for authentication
  }),
  endpoints: (builder) => ({
    // Fetch chat messages for a specific course
    // getChatMessages: builder.query({
    //     query: ({ courseId, studentId }) => ({
    //       url: `/course/${courseId}/messages`,
    //       method: "GET",
    //     //   params: { studentId }, // 👈 send studentId as query param
    //     }),
    //   }),
    getChatMessages: builder.query({
        query: ({ courseId, studentId }) => ({
          url: `/course/${courseId}/student/${studentId}/messages`,
          method: "GET",
        }),
      }),

    // Send a message to the instructor
    sendMessage: builder.mutation({
      query: ({ courseId, content, from }) => ({
        url: `/course/${courseId}/send-message`,
        method: "POST",
        body: { content, from },
      }),
    }),

    // Get course details
    getCourse: builder.query({
      query: (courseId) => `/courses/${courseId}`,
    }),

    getInstructorMessages: builder.query({
        query: () => ({
          url: `/instructor/messages`,
          method: "GET",
        }),
    
    }),
    // Instructor sends a message to a specific student
    sendInstructorMessage: builder.mutation({
        query: ({ studentId, courseId, content }) => ({
          url: '/send-message', // Updated route
          method: 'POST',
          body: { studentId, courseId, content }, // Send courseId and studentId in the body
        }),
      }),
})
});

export const {
  useGetChatMessagesQuery,
  useSendMessageMutation,
  useGetCourseQuery,
    useGetInstructorMessagesQuery,
    useSendInstructorMessageMutation,

} = chatApi;
