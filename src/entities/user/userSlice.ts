import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../shared/api/axiosInstance';
import type {User, UserState} from './types';

const initialState: UserState = {
    users: [],
    currentUser: null,
    status: 'idle',
    error: null,
};

// Thunks для CRUD операций
export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
    const response = await axiosInstance.get<User[]>('/users');
    return response.data;
});

export const createUser = createAsyncThunk('users/createUser', async (userData: Omit<User, 'id'>) => {
    const response = await axiosInstance.post<User>('/users', userData);
    return response.data;
});

export const fetchUserById = createAsyncThunk('users/fetchUserById', async (userId: string) => {
    const response = await axiosInstance.get<User>(`/users/${userId}`);
    return response.data;
});

export const updateUser = createAsyncThunk('users/updateUser', async (userData: Omit<Partial<User>, 'email'> & { id: string }) => {
    const { id, ...data } = userData;
    const response = await axiosInstance.patch<User>(`/users/${id}`, data);
    return response.data;
});

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        clearCurrentUser: (state) => {
            state.currentUser = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Users
            .addCase(fetchUsers.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
                state.status = 'succeeded';
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch users';
            })
            .addCase(fetchUserById.fulfilled, (state, action: PayloadAction<User>) => {
                state.currentUser = action.payload;
            })
            .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
                const index = state.users.findIndex(user => user.id === action.payload.id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
                state.currentUser = null; // Очищаем после обновления
            })
            // Create User
            .addCase(createUser.fulfilled, (state, action: PayloadAction<User>) => {
                state.users.push(action.payload);
            });
    },
});

export const { clearCurrentUser } = userSlice.actions;
export default userSlice.reducer;
