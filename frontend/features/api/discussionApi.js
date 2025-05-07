// filepath: d:\DLS\frontend\features\api\discussionApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const discussionApi = createApi({
    reducerPath: "discussionApi",
    baseQuery: fetchBaseQuery({
      baseUrl: "http://localhost:9090/api/v1/discussions",
      credentials: "include",
    }),
    endpoints: (builder) => ({
      createDiscussion: builder.mutation({
        query: (data) => ({
          url: "/",
          method: "POST",
          body: data,
        }),
      }),
  
      getAllDiscussions: builder.query({ // Ensure this is defined
        query: () => "/all", // Matches the backend route
      }),
  
      getDiscussionById: builder.query({
        query: (id) => `/${id}`,
      }),
  
      addComment: builder.mutation({
        query: ({ id, comment }) => ({
          url: `/${id}/comments`,
          method: "POST",
          body: { comment },
        }),
      }),
    }),
  });
  
  export const {
    useCreateDiscussionMutation,
    useGetAllDiscussionsQuery, // Ensure this is exported
    useGetDiscussionByIdQuery,
    useAddCommentMutation,
  } = discussionApi;