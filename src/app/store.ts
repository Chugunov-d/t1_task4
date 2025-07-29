// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../entities/auth/authSlice';
import userReducer from '../entities/user/userSlice';
import {type TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        users: userReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;