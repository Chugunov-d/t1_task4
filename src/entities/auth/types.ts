// Данные для формы входа
export interface LoginData {
    email: string;
    password?: string; // Пароль может быть опциональным в других контекстах, но для логина он обязателен
}

// Описание состояния (state) для authSlice
export interface AuthState {
    token: string | null;
    isAuthenticated: boolean;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}