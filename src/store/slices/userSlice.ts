import { getUserInformation } from "@/api/userActions";
import { RootState } from "@/store/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "@/api/axiosInstance";

interface UserState {
    isAuthenticated: boolean;
    token: string | null;
    username: string | null;
}

const initialState: UserState = {
    isAuthenticated: false,
    token: null,
    username: null,
};

export const login = createAsyncThunk(
    'user/login',
    async function (credentials: { username: string; password: string }, { rejectWithValue }) {
        try {
            const response = await axiosInstance.post('/auth/login', {
                username: credentials.username,
                password: credentials.password,
            });

            const { access_token, username } = response.data;
            return { access_token, username };
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Login failed');
        }
    }
);

export const checkUser = createAsyncThunk(
    'user/checkUser',
    async function (_, { getState, rejectWithValue, dispatch }) {
        const state = getState() as RootState;
        const token = state.user.token || (typeof window !== 'undefined' && localStorage.getItem('token'));

        if (!token) {
            return rejectWithValue('No token found');
        }

        try {
            const responseUsername = await getUserInformation(String(token));
            return responseUsername.data.username;
        } catch (error) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
            }
            dispatch(removeAuthenticate());
            return rejectWithValue(error.response?.data || 'Failed to authenticate user');
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
            state.username = '';
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
            }
        },
        removeAuthenticate: (state) => {
            state.isAuthenticated = false;
            state.token = null;
            state.username = '';
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
            .addCase(login.rejected, (state, action) => {
                state.isAuthenticated = false;
                state.token = null;
                state.username = '';
                console.error('Login failed:', action.payload);
            })
            .addCase(checkUser.fulfilled, (state, action) => {
                state.username = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(checkUser.rejected, (state, action) => {
                state.isAuthenticated = false;
                state.token = null;
                state.username = '';
            });
    },
});

export const { register, removeToken, removeAuthenticate, loadTokenFromLocalStorage } = userSlice.actions;
export default userSlice.reducer;
