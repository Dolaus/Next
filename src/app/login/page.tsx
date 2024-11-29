'use client';

import React from 'react';
import { Provider } from 'react-redux';
import store from "@/store/store";
import LoginPage from "@/app/login/login";

const LoginWrapper: React.FC = () => {
    return (
        <Provider store={store}>
            <LoginPage />
        </Provider>
    );
};

export default LoginWrapper;
