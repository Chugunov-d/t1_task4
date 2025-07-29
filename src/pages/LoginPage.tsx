// src/pages/LoginPage.tsx
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/store';
import { loginUser } from '../entities/auth/authSlice';
import type {LoginData} from '../entities/auth/types';
import { Container, TextField, Button, Box, Typography, Alert, CircularProgress } from '@mui/material';

const LoginPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { status, error } = useAppSelector((state) => state.auth);

    const { register, handleSubmit, formState: { errors } } = useForm<LoginData>();

    const onSubmit = (data: LoginData) => {
        dispatch(loginUser(data)).then((result) => {
            if (loginUser.fulfilled.match(result)) {
                navigate('/');
            }
        });
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">Вход</Typography>
                <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email"
                        autoComplete="email"
                        autoFocus
                        {...register('email', { required: 'Email обязателен' })}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Пароль"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        {...register('password', { required: 'Пароль обязателен' })}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                    />
                    {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={status === 'loading'}
                    >
                        {status === 'loading' ? <CircularProgress size={24} /> : 'Войти'}
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default LoginPage;
