import baseApi from "./baseApi";

const transaction = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getAllTransaction: build.query({
            query: () => ({
                url: "/user/all/transaction",
                method: "GET"
            }),
            providesTags: ["transaction"]
        })
    })
})


export const { useGetAllTransactionQuery } = transaction