import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import type {RootState} from './store.ts';
import { MainLayout } from './MainLayout.tsx'

export const PrivateRoute = () => {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Если пользователь авторизован, показываем основной макет с контентом
    return (
        <MainLayout>
            <Outlet />
        </MainLayout>
    );
};