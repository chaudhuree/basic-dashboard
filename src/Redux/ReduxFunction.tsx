import { createSlice } from '@reduxjs/toolkit'
import Cookies from 'js-cookie'
// Define a type for the slice state
interface CounterState {
    name: string,
    role: string,
}

// Define the initial state using that type
const initialState: CounterState = {
    name: "",
    role: "",
}

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

export const { setUser, logOut } = adminAuth.actions

// Other code such as selectors can use the imported `RootState` type

export default adminAuth.reducer