import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';


const ProtectedRoute = ({ element }) => {
    const { currentUser, authLoading } = useContext(AuthContext);

    if (authLoading) {
        return <div>Loading...</div>; // Show a loading indicator while checking auth
    }

    if (!currentUser) {
        return <Navigate to="/login" />; // Redirect to login if not authenticated
    }

    return element; // Render the requested component if authenticated
};

export default ProtectedRoute;
