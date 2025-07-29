import axios from 'axios';
import { store } from '../../app/store';

const axiosInstance = axios.create({
    baseURL: '/api', // Будет проксироваться через Vite
    withCredentials: true
});

// Interceptor для добавления токена авторизации в заголовки
axiosInstance.interceptors.request.use(
    (config) => {
        const token = store.getState().auth.token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;