import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/store.ts';
import { fetchUsers } from '../entities/user/userSlice.ts';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, CircularProgress, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import type {User} from "../entities/user/types.ts";

export const UserTable = () => {
    const dispatch = useAppDispatch();
    const { users, status } = useAppSelector((state) => state.users);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchUsers());
        }
    }, [status, dispatch]);

    if (status === 'loading') {
        return <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>;
    }

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Имя</TableCell>
                        <TableCell>Фамилия</TableCell>
                        <TableCell>Дата рождения</TableCell>
                        <TableCell>Работа</TableCell>
                        <TableCell>Телефон</TableCell>
                        <TableCell>Действия</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((user: User) => {
                        return (
                            <TableRow key={user.id}>
                                <TableCell>{user.id}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.surName}</TableCell>
                                <TableCell>{user.birthDate}</TableCell>
                                <TableCell>{user.employment}</TableCell>
                                <TableCell>{user.telephone}</TableCell>
                                <TableCell>
                                    <Button
                                        component={Link}
                                        to={`/user/edit/${user.id}`}
                                        size="small"
                                    >
                                        Редактировать
                                    </Button>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

