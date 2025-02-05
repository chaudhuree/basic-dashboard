import baseApi from "./baseApi";

const productApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        addProduct: build.mutation({
            query: (data) => ({
                url: "/products",
                method: "POST",
                body: data
            }),
            invalidatesTags: ["allProducts"]
        }),
        allProducts: build.query({
            query: () => ({
                url: `/products`,
                method: "GET"
            }),
            providesTags: ["allProducts"]
        }),
        deleteProduct: build.mutation({
            query: (id) => ({
                url: `/products/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["allProducts"]
        }),
        singleProduct: build.query({
            query: (id) => ({
                url: `/products/${id}`,
                method: "GET"
            }),
            providesTags: ["allProducts"]
        }),
        updateProduct: build.mutation({
            query: ({ id, data }) => ({
                url: `/products/${id}`,
                method: "PATCH",
                body: data
            }),
            invalidatesTags: ["allProducts"]
        }),
        orderHistory: build.query({
            query: (status) => ({
                url: `/orders/all?status=${status}`,
                method: "GET"
            }),
            providesTags: ["allOrders"]
        }),
        orderStatus: build.mutation({
            query: ({ id, status }) => ({
                url: `/orders/${id}`,
                method: "PATCH",
                body: status 
            }),
            invalidatesTags: ["allOrders"]
        })
    })
})

export const { useAddProductMutation, useAllProductsQuery, useDeleteProductMutation, useSingleProductQuery, useUpdateProductMutation, useOrderHistoryQuery, useOrderStatusMutation } = productApi