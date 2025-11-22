import React, { createContext, useContext, useState, useEffect } from 'react';
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
            return true;
        }
        return false;
    };

    const quickLogin = (role) => {
        const foundUser = allUsers.find(u => u.role === role);
        if (foundUser) {
            setUser(foundUser);
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
    };

    const signup = (newUser) => {
        setAllUsers([...allUsers, newUser]);
    };

    const updateUserRole = (userId, newRole) => {
        const targetUser = allUsers.find(u => u.id === userId);
        if (permissions.canAssignRole(user, targetUser, newRole)) {
            setAllUsers(allUsers.map(u =>
                u.id === userId ? { ...u, role: newRole } : u
            ));
            return true;
        }
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
