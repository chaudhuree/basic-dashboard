// src/features/api/baseApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';
export const baseApi = createApi({
    reducerPath: 'baseApi', // The key for this API in the Redux store
    baseQuery: fetchBaseQuery({
        // baseUrl: 'http://10.0.20.36:5001/api/v1', // Replace with your API's base URL
        baseUrl: 'http://104.236.194.254:5009/api/v1', // Replace with your API's base URL
        prepareHeaders: (headers) => {
            const token = Cookies.get("accessToken") // Assuming token is stored in the auth slice
            if (token) {
                headers.set('Authorization', `${token}`);
            }
            return headers;
        },
    }),
    endpoints: () => ({}),
    tagTypes: [ "logIn", "transaction", "allUsers", "allProducts", "allOrders"]
});

// Export hooks for usage in functional components
export default baseApi;
