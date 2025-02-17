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
// tagTypes er moddhe j j tagType gulo add kora hobe, provideTags and invalidatesTags er moddhe sudhu oigulo e use kora jabe
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

## ReduxFunction is a slice. it contains some variables which we need to have access to the entire app.
like,
```
const initialState: CounterState = {
    name: "",
    role: "",
}
```

- as we have stored it in a slice and also use persist it so we can using useDispatch hook, save the variable value from anywhere in the app
- and also we can access the data in the entire app by using useSelector hook.

```
export const adminAuth = createSlice({
    name: 'Auth',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.name = action.payload.name
            state.role = action.payload.role
        },
        logOut: (state) => {
            state.name = ""
            state.role = ""
            Cookies.remove("accessToken")

        }
    },
})
```

```
import { useDispatch, useSelector } from "react-redux";
import { RootState } from '@/Redux/store';
import {logout,setUser} from '@/Redux/ReduxFunction' // we have to import the dispatch function from related file or slice 
const dispatch = useDispatch()

dispatch(setUser({
    name: "sohan",
    role: "admin"
}))

dispathch(logout())


// state.Auth -> here Auth this name is added in the slice ReduxFunction . that's why we have to use this name to specifically get that slice

const { name,role } = useSelector((state: RootState) => state.Auth) // -> here name and role is the intialState added in the ReduxFunction slice.so using specified slice we can have the variable stored in the intialState.

// now we can use name,role anywhere
```


## Another Example:

- suppose we have anoterh silce for add to cart.

- AddToCartFunction.jsx

```
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Define the type for a cart item
interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

// Define the type for the slice state
interface CartState {
    items: CartItem[];
    total: number;
}

// Define the initial state
const initialState: CartState = {
    items: [],
    total: 0,
}

export const cartSlice = createSlice({
    name: 'Cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<CartItem>) => {
            const existingItem = state.items.find(item => item.id === action.payload.id)
            if (existingItem) {
                existingItem.quantity += action.payload.quantity;
            } else {
                state.items.push(action.payload);
            }
            state.total += action.payload.price * action.payload.quantity;
        },
        removeFromCart: (state, action: PayloadAction<string>) => {
            const itemIndex = state.items.findIndex(item => item.id === action.payload);
            if (itemIndex !== -1) {
                state.total -= state.items[itemIndex].price * state.items[itemIndex].quantity;
                state.items.splice(itemIndex, 1);
            }
        },
        clearCart: (state) => {
            state.items = [];
            state.total = 0;
        }
    },
})

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

```

## Updated Store

```
import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import adminAuth from './ReduxFunction'
import cartSlice from './AddToCartFunction' // Import cart reducer
import baseApi from './Api/baseApi'

const persistConfig = {
    key: 'root',
    storage,
}

const persistedAuthReducer = persistReducer(persistConfig, adminAuth)
const persistedCartReducer = persistReducer(persistConfig, cartSlice)

export const store = configureStore({
    reducer: {
        Auth: persistedAuthReducer,
        Cart: persistedCartReducer, // Add the cart reducer
        [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
                ignoredPaths: ['Auth.somePathWithNonSerializableValues', 'Cart.items'],
            },
        }).concat(baseApi.middleware),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

```

## use case

```
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart, removeFromCart, clearCart } from '@redux/AddToCart.tsx'
import { RootState } from '../store'

const ProductList = () => {
    const dispatch = useDispatch()
    const cart = useSelector((state: RootState) => state.Cart)

    const handleAddToCart = () => {
        dispatch(addToCart({
            id: '1',
            name: 'Nike Sneakers',
            price: 120,
            quantity: 1,
            image: 'https://example.com/nike.jpg'
        }))
    }

    const handleRemoveFromCart = (id: string) => {
        dispatch(removeFromCart(id))
    }

    const handleClearCart = () => {
        dispatch(clearCart())
    }

    return (
        <div>
            <h1>Product List</h1>
            <button onClick={handleAddToCart}>Add Nike Sneakers</button>

            <h2>Shopping Cart</h2>
            <ul>
                {cart.items.map((item) => (
                    <li key={item.id}>
                        <img src={item.image} alt={item.name} width={50} />
                        <p>{item.name} - ${item.price} x {item.quantity}</p>
                        <button onClick={() => handleRemoveFromCart(item.id)}>Remove</button>
                    </li>
                ))}
            </ul>

            <h3>Total: ${cart.total}</h3>
            <button onClick={handleClearCart}>Clear Cart</button>
        </div>
    )
}

export default ProductList

```

---

## Login korar shomoy kora hoy ki j token pawa hoy oita cookies a set kora hoy and pore base api a oi token ta header e pathano hoy. and logout korar shomoy token ta cookies theke remove kore dewa hoy so r seita header dea jay na. aivabe tokenize kora hoy.

## query like GET er shomoy providesTags use kora hoy r mutation like GET bade ja ache tader jonne invalidatesTag use kora hoy.


## Best Practices

1. Always use TypeScript interfaces for your request and response data
2. Use meaningful tag names for cache invalidation
3. Handle loading and error states appropriately
4. Use the `.unwrap()` method with mutations for better error handling
5. Keep API endpoints organized by feature/domain
6. Use meaningful names for your API slices and endpoints

Remember to add your new API slice to the store configuration if needed (though using `injectEndpoints` typically handles this automatically when extending the base API).