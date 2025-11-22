import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
    const { user } = useAuth();
    const location = useLocation();

    if (!user) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    if (requiredRole && user.role !== requiredRole && user.role !== 'admin') {
        // 간단한 권한 체크: 요구된 역할이 아니면(그리고 관리자가 아니면) 접근 불가
        // 실제로는 permissions.js의 로직을 더 정교하게 태울 수도 있음
        // 여기서는 단순하게 구현
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default ProtectedRoute;
