# Redux API Integration Guide

This guide explains how to integrate and use APIs in our React application using Redux Toolkit Query (RTK Query).

## Table of Contents
1. [Base API Setup](#base-api-setup)
2. [Creating a New API Endpoint](#creating-a-new-api-endpoint)
3. [Using API Hooks in Components](#using-api-hooks-in-components)
4. [Cache Invalidation and Tags](#cache-invalidation-and-tags)
5. [Error Handling](#error-handling)

## Base API Setup

Our application uses a centralized base API configuration located in `src/Redux/Api/baseApi.ts`. This setup includes:

```typescript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

export const baseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://104.236.194.254:5009/api/v1',
        prepareHeaders: (headers) => {
            const token = Cookies.get("accessToken")
            if (token) {
                headers.set('Authorization', `${token}`);
            }
            return headers;
        },
    }),
    endpoints: () => ({}),
    tagTypes: ["logIn", "transaction", "allUsers", "allProducts", "allOrders"]
});
```

## Creating a New API Endpoint

To create a new API endpoint, follow these steps:

1. Create a new file in `src/Redux/Api/` (e.g., `newFeatureApi.ts`)
2. Import and extend the base API:

```typescript
import baseApi from "./baseApi";

const newFeatureApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        // Query (GET request)
        getAllItems: build.query({
            query: () => ({
                url: '/items',
                method: 'GET'
            }),
            providesTags: ['tagName']
        }),

        // Mutation (POST, PUT, PATCH, DELETE requests)
        addItem: build.mutation({
            query: (data) => ({
                url: '/items',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['tagName']
        })
    })
});

// Export hooks
export const {
    useGetAllItemsQuery,
    useAddItemMutation
} = newFeatureApi;
```

## Using API Hooks in Components

After creating your API endpoints, you can use them in your React components:

```typescript
import { useGetAllItemsQuery, useAddItemMutation } from '@/Redux/Api/newFeatureApi';

function MyComponent() {
    // Query hook (for GET requests)
    const { data, isLoading, error } = useGetAllItemsQuery();

    // Mutation hook (for POST, PUT, PATCH, DELETE)
    const [addItem, { isLoading: isAdding }] = useAddItemMutation();

    const handleAddItem = async (itemData) => {
        try {
            await addItem(itemData).unwrap();
            // Handle success
        } catch (error) {
            // Handle error
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        // Your component JSX
    );
}
```

## Cache Invalidation and Tags

RTK Query uses a tag-based cache invalidation system:

1. Define tags in `baseApi.ts`:
```typescript
tagTypes: ["tagName"]
```

2. Provide tags in queries:
```typescript
getAllItems: build.query({
    query: () => '/items',
    providesTags: ['tagName']
})
```

3. Invalidate tags in mutations:
```typescript
addItem: build.mutation({
    query: (data) => ({
        url: '/items',
        method: 'POST',
        body: data
    }),
    invalidatesTags: ['tagName'] // This will trigger a refetch of queries with this tag
})
```

## Error Handling

Handle API errors using try-catch blocks with mutation hooks:

```typescript
try {
    const response = await addItem(data).unwrap();
    // Handle success
} catch (error: any) {
    if (error.status === 401) {
        // Handle unauthorized
    } else {
        // Handle other errors
    }
}
```

For queries, use the error property:
```typescript
const { data, error, isLoading } = useGetAllItemsQuery();

if (error) {
    if ('status' in error) {
        // Handle specific HTTP error
    } else {
        // Handle other errors
    }
}
```

## Best Practices

1. Always use TypeScript interfaces for your request and response data
2. Use meaningful tag names for cache invalidation
3. Handle loading and error states appropriately
4. Use the `.unwrap()` method with mutations for better error handling
5. Keep API endpoints organized by feature/domain
6. Use meaningful names for your API slices and endpoints

Remember to add your new API slice to the store configuration if needed (though using `injectEndpoints` typically handles this automatically when extending the base API).