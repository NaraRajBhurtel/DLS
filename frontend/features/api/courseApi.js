import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COURSE_API = "http://localhost:9090/api/v1/course";


export const courseApi = createApi({
    reducerPath: "courseApi",
    tagTypes: ["Refetch_Creator_Course", "Refetch_Lecture"],
    baseQuery: fetchBaseQuery({
      baseUrl: COURSE_API,
      credentials: "include",
    }),
    endpoints: (builder) => ({
        createCourse: builder.mutation({
          query: ({ courseTitle, category }) => ({
            url: "",
            method: "POST",
            body: { courseTitle, category },
          }),
          invalidatesTags: ["Refetch_Creator_Course"],
        }),
        getSearchCourse:builder.query({
            query: ({searchQuery, categories, sortByPrice}) => {
                //Query String
                let queryString = `/search?query=${encodeURIComponent(searchQuery)}`
                //append category
                if(categories && categories.length > 0){
                   const  categoriesString = categories.map(encodeURIComponent).join(",");
                     queryString += `&categories=${categoriesString}`;
                }

                if(sortByPrice){
                    queryString += `&sortByPrice=${encodeURIComponent(sortByPrice)}`;
                }
                return {
                    url: queryString,
                    method: "GET",
                }
            } 
        }),

        getPublishedCourse: builder.query({
            query: () => ({
              url: "/published-courses",
              method: "GET",
            }),
          }),
          
        getCreatorCourse: builder.query({
            query: () => ({
              url: "",
              method: "GET",
            }),
            providesTags: ["Refetch_Creator_Course"],  
        }),

        editCourse: builder.mutation({
            query: ({ formData, courseId }) => ({
              url: `/${courseId}`,
              method: "PUT",
              body: formData,
            }),
            invalidatesTags: ["Refetch_Creator_Course"],
          }),
        getCourseById: builder.query({
            query: (courseId) => ({
              url: `/${courseId}`,
              method: "GET",
            }),
        }),

        createLecture: builder.mutation({
            query: ({ lectureTitle, courseId }) => ({
              url: `/${courseId}/lecture`,
              method: "POST",
              body: { lectureTitle },
            }),

        }),

        getCourseLecture: builder.query({
            query: (courseId) => ({
              url: `/${courseId}/lecture`,
              method: "GET",
            }),
            providesTags: ["Refetch_Lecture"],
          }),

          editLecture: builder.mutation({
            query: ({
              lectureTitle,
              videoInfo,
              materialInfo,
              isPreviewFree,
              courseId,
              lectureId,
            }) => ({
              url: `/${courseId}/lecture/${lectureId}`,
              method: "POST",
              body: { lectureTitle, videoInfo, materialInfo, isPreviewFree },
            }),
          }),
          removeLecture: builder.mutation({
            query: (lectureId) => ({
              url: `/lecture/${lectureId}`,
              method: "DELETE",
            }),
            invalidatesTags: ["Refetch_Lecture"],
          }),
          getLectureById: builder.query({
            query: (lectureId) => ({
              url: `/lecture/${lectureId}`,
              method: "GET",
            }),
          }),
          publishCourse: builder.mutation({
            query: ({ courseId, query }) => ({
              url: `/${courseId}?publish=${query}`,
              method: "PATCH",
            }),
          }),
          removeCourse: builder.mutation({
            query: (courseId) => ({
              url: `/${courseId}`,
              method: "DELETE",
            }),
            invalidatesTags: ["Refetch_Creator_Course"], // Invalidate cache to refresh course list
          }),

                    // Get all quizzes for a course
          getCourseQuizzes: builder.query({
            query: (courseId) => `/${courseId}/quizzes`,
            providesTags: ['Quiz'],
          }),

          createQuiz: builder.mutation({
            query: ({ quizTitle, courseId }) => ({
              url: `/${courseId}/quizzes`,   
              method: 'POST',
              body: { quizTitle, courseId }, // Include courseId if your controller requires it
            }),
            invalidatesTags: ['Quiz'],
          }),
          
          getQuizById: builder.query({
            query: ({ courseId, quizId }) => `/${courseId}/quizzes/${quizId}`,
            providesTags: ['Quiz'],
          }),
          
          editQuiz: builder.mutation({
            query: ({ courseId, quizId, quizData }) => ({
              url: `/${courseId}/quizzes/${quizId}`, 
              method: "PUT",
              body: quizData,
            }),
            invalidatesTags: ["Quiz"],
          }),
          
          deleteQuiz: builder.mutation({
            query: ({ quizId, courseId }) => ({
              url: `/${courseId}/quizzes/${quizId}`,   // Correct URL format
              method: 'DELETE',
            }),
            invalidatesTags: ['Quiz'],
          }),
          updateQuiz: builder.mutation({
            query: ({ quizId, updatedQuizData }) => ({
              url: `/quizzes/${quizId}`, // Adjust this if your endpoint differs
              method: 'PUT',
              body: updatedQuizData,
            }),
          }),
          

   }),
   


    //
});


export const {
    useCreateCourseMutation,
    useGetSearchCourseQuery,
    useGetPublishedCourseQuery,
    useGetCreatorCourseQuery,
    useEditCourseMutation,
    useGetCourseByIdQuery,
    useCreateLectureMutation,
    useGetCourseLectureQuery,
    useEditLectureMutation,
    useRemoveLectureMutation,
    useGetLectureByIdQuery,
    usePublishCourseMutation,
    useRemoveCourseMutation,   
    useGetCourseQuizzesQuery,
    useCreateQuizMutation,
    useGetQuizByIdQuery,
    useEditQuizMutation,
    useDeleteQuizMutation,
    useUpdateQuizMutation,

  } = courseApi;