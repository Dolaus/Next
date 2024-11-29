'use client';

import React from 'react';
import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useAppDispatch } from "@/hooks/hooks";
import { removeAuthenticate, removeToken } from "@/store/slices/userSlice";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';

const NavBar = () => {
    const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
    const dispatch = useAppDispatch();
    const router = useRouter();

    const logoutHandler = () => {
        localStorage.removeItem('token');
        dispatch(removeToken());
        dispatch(removeAuthenticate());
        router.push('/login');
    };

    const loginHandler = () => {
        router.push('/login');
    };

    const logoHandler = () => {
        router.push('/exhibits');
    };

    const myExhibitHandler = () => {
        router.push('/my-post');
    };

    return (
        <AppBar position="fixed">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Typography
                        onClick={logoHandler}
                        variant="h6"
                        noWrap
                        component="a"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                            cursor: 'pointer',
                        }}
                    >
                        LOGO
                    </Typography>

                    {isAuthenticated ? (
                        <Box sx={{ flexGrow: 1 }}>
                            <Button color="inherit" onClick={() => router.push('/new-post')}>+</Button>
                            <Button onClick={myExhibitHandler} color="inherit">My exhibits</Button>
                        </Box>
                    ) : (
                        <Box sx={{ flexGrow: 1 }}> </Box>
                    )}

                    {!isAuthenticated ? (
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button onClick={loginHandler} color="inherit">Login</Button>
                        </Box>
                    ) : (
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button onClick={logoutHandler} color="inherit">Logout</Button>
                        </Box>
                    )}
                </Toolbar>
                <ToastContainer />
            </Container>
        </AppBar>
    );
};

export default NavBar;
