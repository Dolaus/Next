import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import exp from "node:constants";
import {RootState} from "../store";
import axiosInstance from "../../api/axiosInstance";
import {getUserInformation} from "../../api/userActions";

const initialState = {
    isAuthenticated: !!localStorage.getItem('token'),
    token: null,
    username: ''
}

interface UserRegister {
    username: string,
    password: string
}

export const login = createAsyncThunk(
    'user/login',
    async function (payload : UserRegister, {rejectWithValue}) {

        const responseLogin = await axiosInstance.post('http://ec2-13-49-67-34.eu-north-1.compute.amazonaws.com/api/auth/login', {
            'username': payload.username,
            'password': payload.password
        })

        const responseUsername = await getUserInformation(responseLogin.data.access_token);

        return {access_token: responseLogin.data.access_token, username: responseUsername.data.username};
    }
)


export const checkUser = createAsyncThunk(
    'user/checkUser',
    async function (_, {rejectWithValue}) {

        const responseUsername = await getUserInformation(String(initialState.token));

        return responseUsername.data.username;
    }
)

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        register: (state, action) => {
            state.isAuthenticated = true;
        },
        removeToken: (state) => {
            state.token = null;
        },
        removeAuthenticate: (state) => {
            state.isAuthenticated = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.fulfilled, (state, action) => {
                state.isAuthenticated = true;
                console.log(action.payload);
                state.token = action.payload.access_token;
                state.username = action.payload.username;

                localStorage.setItem('token', action.payload.access_token);
            })
            .addCase(login.rejected, (state, action) => {
                state.isAuthenticated = false;
            })
            .addCase(checkUser.fulfilled, (state, action) => {
                state.username = action.payload;
            })
        ;
    },
})

export const { register, removeToken, removeAuthenticate } = userSlice.actions;
export const selectIsAuthenticated = (state: RootState) => state.user.isAuthenticated;
export const selectToken = (state: RootState) => state.user.token;
export default userSlice.reducer