import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";
import { getUserInformation } from "@/api/userActions";
import { RootState } from "@/store/store";

const initialState = {
    isAuthenticated: false,
    token: null,
    username: ''
};

interface UserRegister {
    username: string;
    password: string;
}

export const login = createAsyncThunk(
    'user/login',
    async function (payload: UserRegister, { rejectWithValue }) {
        try {
            const responseLogin = await axiosInstance.post('http://ec2-13-49-67-34.eu-north-1.compute.amazonaws.com/api/auth/login', {
                username: payload.username,
                password: payload.password
            });

            const responseUsername = await getUserInformation(responseLogin.data.access_token);

            return { access_token: responseLogin.data.access_token, username: responseUsername.data.username };
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const checkUser = createAsyncThunk(
    'user/checkUser',
    async function (_, { getState, rejectWithValue }) {
        const state = getState() as RootState;
        const token = state.user.token || (typeof window !== 'undefined' && localStorage.getItem('token'));

        if (!token) {
            return rejectWithValue('No token found');
        }

        try {
            const responseUsername = await getUserInformation(String(token));
            return responseUsername.data.username;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        register: (state) => {
            state.isAuthenticated = true;
        },
        removeToken: (state) => {
            state.token = null;
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
            }
        },
        removeAuthenticate: (state) => {
            state.isAuthenticated = false;
        },
        loadTokenFromLocalStorage: (state) => {
            if (typeof window !== 'undefined') {
                const token = localStorage.getItem('token');
                if (token) {
                    state.isAuthenticated = true;
                    state.token = token;
                }
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.fulfilled, (state, action) => {
                state.isAuthenticated = true;
                state.token = action.payload.access_token;
                state.username = action.payload.username;

                if (typeof window !== 'undefined') {
                    localStorage.setItem('token', action.payload.access_token);
                }
            })
            .addCase(login.rejected, (state) => {
                state.isAuthenticated = false;
            })
            .addCase(checkUser.fulfilled, (state, action) => {
                state.username = action.payload;
            });
    },
});

export const { register, removeToken, removeAuthenticate, loadTokenFromLocalStorage } = userSlice.actions;
export default userSlice.reducer;
