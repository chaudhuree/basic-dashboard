import baseApi from "./baseApi";

const eventApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        blog: build.query({
            query: () => ({
                url: `/blogs`,
                method: "GET"
            }),
            providesTags: ["approveEvent"]
        }),
        addblog: build.mutation({
            query: (data) => ({
                url: `/blogs/create-blog`,
                method: "POST",
                body:data
            }),
            invalidatesTags: ["approveEvent"]
        }),

        deleteBlog: build.mutation({
            query: (id) => ({
                url: `/blogs/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["approveEvent"]
        }),

        updateBlog: build.mutation({
            query: ({id, data}) => ({
                url: `/blogs/${id}`,
                method: "PATCH",
                body:data
            }),
            invalidatesTags: ["approveEvent"]
        })
    })
});

export const {useBlogQuery,useAddblogMutation, useDeleteBlogMutation, useUpdateBlogMutation} = eventApi

