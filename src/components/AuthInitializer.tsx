'use client';

import { useEffect } from "react";
import { useAppDispatch } from "@/hooks/hooks";
import { loadTokenFromLocalStorage, checkUser } from "@/store/slices/userSlice";

const AuthInitializer = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(loadTokenFromLocalStorage());
        dispatch(checkUser());
    }, [dispatch]);

    return null;
};

export default AuthInitializer;
