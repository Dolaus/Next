'use client';

import React, { useEffect } from 'react';
import { useAppDispatch } from '@/hooks/hooks';
import { useSelector } from 'react-redux';
import { checkUser, loadTokenFromLocalStorage } from '@/store/slices/userSlice';
import { RootState } from '@/store/store';

const AuthInitializer = () => {
    const dispatch = useAppDispatch();
    const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);

    useEffect(() => {
        dispatch(loadTokenFromLocalStorage());
        if (isAuthenticated) {
            dispatch(checkUser());
        }
    }, [dispatch, isAuthenticated]);

    return null;
};

export default AuthInitializer;
