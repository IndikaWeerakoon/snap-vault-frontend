import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../auth-context/AuthContext';

const PrivateRouter: React.FC = () => {
    const auth = useAuth();
    const location = useLocation();

    if (!auth?.isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <Outlet />;
};

export default PrivateRouter;