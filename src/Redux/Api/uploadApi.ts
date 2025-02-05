import baseApi from "./baseApi";

const eventApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        upload: build.mutation({
            query: (data) => ({
                url: `products/upload-file`,
                method: "POST",
                body:data
            }),
            invalidatesTags: ["approveEvent"]
        }),
        
    })
});

export const {useUploadMutation} = eventApi

