// Описание сущности "Пользователь" в соответствии с API
export interface User {
    id: string;
    email: string;
    name: string;
    surName: string;
    fullName: string;
    // Пароль не должен приходить с бэкенда, но нужен для создания
    password?: string;
    birthDate?: string;
    telephone?: string;
    employment?: 'employed' | 'unemployed';
    userAgreement?: boolean;
}

// Описание состояния (state) для userSlice
export interface UserState {
    users: User[];
    currentUser: User | null; // Для страницы редактирования
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}