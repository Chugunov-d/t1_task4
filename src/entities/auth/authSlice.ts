import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../shared/api/axiosInstance';
import type {LoginData, AuthState} from './types';

// Загружаем токен из localStorage при инициализации
const initialState: AuthState = {
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
    status: 'idle',
    error: null,
};

// Async Thunk для логина пользователя
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (loginData: LoginData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/auth/login', loginData);
            const { token } = response.data;
            localStorage.setItem('token', token);
            return token;
        } catch (error: any) {
            return rejectWithValue(error.response.data.message || 'Login failed');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('token');
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<string>) => {
                state.status = 'succeeded';
                state.token = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;