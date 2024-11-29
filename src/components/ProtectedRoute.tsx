import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {RootState} from "../store/store";

interface ProtectedRouteProps {
    children: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const isAllowed = useSelector((state: RootState) => state.user.isAuthenticated);
    const location = useLocation();

    if (!isAllowed) {
        console.log(isAllowed);
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return <>{children}</>;
};
