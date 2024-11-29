'use client';

import React from 'react';
import { Provider } from 'react-redux';
import store from "@/store/store";
import LoginPage from "@/app/login/login";
import RegistrationPage from "@/app/register/register";

const LoginWrapper: React.FC = () => {
    return (
        <Provider store={store}>
            <RegistrationPage />
        </Provider>
    );
};

export default LoginWrapper;
