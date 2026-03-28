import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
    };

    const refreshUser = async () => {
        if (!user || !user.id) return;
        try {
            const { data } = await axios.get(`${API_BASE_URL}/api/users/${user.id}`);
            // Merge with existing token
            const updatedUser = { ...user, ...data };
            setUser(updatedUser);
            return updatedUser;
        } catch (error) {
            console.error('Failed to refresh user:', error);
            if (error.response?.status === 404) {
                logout();
            }
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, refreshUser, API_BASE_URL }}>
            {children}
        </AuthContext.Provider>
    );
};

