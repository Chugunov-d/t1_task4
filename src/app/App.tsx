import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoutes.tsx';
import LoginPage from '../pages/LoginPage';
import MainPage from '../pages/MainPage';
import UserFormPage from '../pages/UserFormPage';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />

                {/* Защищенные маршруты */}
                <Route element={<PrivateRoute />}>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/user/create" element={<UserFormPage />} />
                    <Route path="/user/edit/:id" element={<UserFormPage />} />
                </Route>

                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
