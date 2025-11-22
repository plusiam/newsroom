import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import storage from '../services/storage';
import permissions, { ROLES } from '../services/permissions';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [allUsers, setAllUsers] = useState([]);

    useEffect(() => {
        setAllUsers(storage.getUsers());
    }, []);

    useEffect(() => {
        storage.saveUsers(allUsers);
    }, [allUsers]);

    const login = (email) => {
        const foundUser = allUsers.find(u => u.email === email);
        if (foundUser) {
            setUser(foundUser);
            toast.success(`환영합니다, ${foundUser.name}님!`);
            return true;
        }
        toast.error('등록되지 않은 이메일입니다.');
        return false;
    };

    const quickLogin = (role) => {
        const foundUser = allUsers.find(u => u.role === role);
        if (foundUser) {
            setUser(foundUser);
            toast.success(`${foundUser.name}님으로 로그인했습니다.`);
            return true;
        }
        toast.error('해당 역할의 사용자를 찾을 수 없습니다.');
        return false;
    };

    const logout = () => {
        setUser(null);
        toast.success('로그아웃되었습니다.');
    };

    const signup = (newUser) => {
        setAllUsers([...allUsers, newUser]);
        toast.success(`${newUser.name}님이 등록되었습니다.`);
    };

    const updateUserRole = (userId, newRole) => {
        const targetUser = allUsers.find(u => u.id === userId);
        if (permissions.canAssignRole(user, targetUser, newRole)) {
            setAllUsers(allUsers.map(u =>
                u.id === userId ? { ...u, role: newRole } : u
            ));
            toast.success(`${targetUser.name}님의 역할이 변경되었습니다.`);
            return true;
        }
        toast.error('역할 변경 권한이 없습니다.');
        return false;
    };

    return (
        <AuthContext.Provider value={{
            user,
            allUsers,
            login,
            logout,
            signup,
            quickLogin,
            updateUserRole
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
