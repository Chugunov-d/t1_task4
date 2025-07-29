import { useEffect } from 'react';
import {useForm, Controller, useWatch} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {useParams, useNavigate} from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/store';
import { createUser, fetchUserById, updateUser, clearCurrentUser } from '../entities/user/userSlice';
import { TextField, Button, Box, Typography, Container, Select, MenuItem, FormControl, InputLabel, Checkbox, FormControlLabel, CircularProgress } from '@mui/material';
import type {User} from "../entities/user/types.ts";

const phoneRegex = new RegExp(
    /^\+7\d{10}$/
);

const userSchema = z.object({
    name: z.string().min(1, 'Имя обязательно').max(64),
    surName: z.string().min(1, 'Фамилия обязательна').max(64),
    fullName: z.string().min(1, 'Полное имя обязательно').max(130),
    email: z.string().email('Неверный формат email').optional(),
    // Пароль делаем опциональным, т.к. при редактировании он не нужен
    password: z.string().optional(),
    birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Формат даты: YYYY-MM-DD').optional(),
    telephone: z.string().regex(phoneRegex, 'Неверный формат телефона').or(z.literal('')).optional(),
    // Используем z.enum для точного соответствия типам
    employment: z.enum(['employed', 'unemployed']).optional(),
    userAgreement: z.boolean().optional(),
}).refine(data => data.password || data.name, { // Пароль обязателен только при создании
    message: "Пароль обязателен",
    path: ["password"],
});


type UserFormData = z.infer<typeof userSchema> & { id?: string };

const UserFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const isEditing = !!id;
    const { currentUser, status } = useAppSelector((state) => state.users);

    const { control, handleSubmit, formState: { errors }, reset, setValue } = useForm<UserFormData>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            name: '',
            surName: '',
            fullName: '',
            email: '',
            birthDate: '',
            password: '',
            telephone: '',
            employment: 'unemployed',
            userAgreement: false,
        },
    });

    const name = useWatch({ control, name: 'name' });
    const surName = useWatch({ control, name: 'surName' });

    useEffect(() => {
        setValue('fullName', `${name} ${surName}`.trim());
    }, [name, surName, setValue]);

    // Загрузка данных при редактировании и очистка при уходе со страницы
    useEffect(() => {
        if (isEditing) {
            dispatch(fetchUserById(id));
        }
        // Функция очистки, которая сработает при размонтировании компонента
        return () => {
            dispatch(clearCurrentUser());
        }
    }, [id, isEditing, dispatch]);

    useEffect(() => {
        if (isEditing && currentUser) {
            reset(currentUser);
        }
    }, [currentUser, isEditing, reset]);


    const onSubmit = (data: UserFormData) => {
        if (isEditing && id) {
            const { email, password, ...updateData } = data;
            dispatch(updateUser({ ...updateData, id} as Omit<Partial<User>, 'email'> & { id: string }));
        } else {
            dispatch(createUser(data as Omit<UserFormData, 'id'>));
        }
        navigate('/');
    };

    if (isEditing && status === 'loading') {
        return <CircularProgress />
    }

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" sx={{ mb: 2 }}>
                {isEditing ? 'Редактировать пользователя' : 'Создать пользователя'}
            </Typography>
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <Controller name="name" control={control} render={({ field }) => <TextField {...field} label="Имя" fullWidth margin="normal" error={!!errors.name} helperText={errors.name?.message} />} />
                <Controller name="surName" control={control} render={({ field }) => <TextField {...field} label="Фамилия" fullWidth margin="normal" error={!!errors.surName} helperText={errors.surName?.message} />} />
                <Controller name="fullName" control={control} render={({ field }) => <TextField {...field} label="Полное имя" fullWidth margin="normal" error={!!errors.fullName} helperText={errors.fullName?.message} />} />
                {!isEditing && (
                <Controller name="email" control={control} render={({ field }) => <TextField {...field} label="Email" fullWidth margin="normal" error={!!errors.email} helperText={errors.email?.message} disabled={isEditing} />} />
                )}
                {!isEditing && (
                    <Controller name="password" control={control} render={({ field }) => <TextField {...field} type="password" label="Пароль" fullWidth margin="normal" error={!!errors.password} helperText={errors.password?.message} />} />
                )}
                <Controller name="birthDate" control={control} render={({ field }) => (<TextField{...field} type="date" label="Дата рождения" fullWidth margin="normal" error={!!errors.birthDate} InputLabelProps={{ shrink: true }} helperText={errors.birthDate?.message}/>)}/>
                <Controller name="telephone" control={control} render={({ field }) => <TextField {...field} label="Телефон" fullWidth margin="normal" error={!!errors.telephone} helperText={errors.telephone?.message} inputProps={{ pattern: "^\\+7\\d{10}$" }} />} />

                <FormControl fullWidth margin="normal">
                    <InputLabel>Занятость</InputLabel>
                    <Controller name="employment" control={control} render={({ field }) => (
                        <Select {...field} label="Занятость">
                            <MenuItem value="employed">Работает</MenuItem>
                            <MenuItem value="unemployed">Не работает</MenuItem>
                        </Select>
                    )} />
                </FormControl>

                <FormControlLabel
                    control={<Controller name="userAgreement" control={control} render={({ field }) => <Checkbox {...field} checked={field.value} />} />}
                    label="Согласен с условиями"
                />

                <Button type="submit" variant="contained" sx={{ mt: 2 }}>Сохранить</Button>
            </Box>
        </Container>
    );
};

export default UserFormPage;