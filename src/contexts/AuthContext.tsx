"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import axios from 'axios';

interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    createdAt: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string, avatar?: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const refreshUser = useCallback(async () => {
        try {
            const response = await axios.get('/api/auth/me');
            setUser(response.data.user);
        } catch {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Check auth status on mount
    useEffect(() => {
        refreshUser();
    }, [refreshUser]);

    const login = useCallback(async (email: string, password: string) => {
        const response = await axios.post('/api/auth/login', { email, password });
        setUser(response.data.user);
    }, []);

    const signup = useCallback(async (name: string, email: string, password: string, avatar?: string) => {
        const response = await axios.post('/api/auth/signup', { name, email, password, avatar });
        setUser(response.data.user);
    }, []);

    const logout = useCallback(async () => {
        await axios.post('/api/auth/logout');
        setUser(null);
    }, []);

    // Memoize the context value to prevent unnecessary re-renders
    const value = useMemo(() => ({
        user,
        isLoading,
        login,
        signup,
        logout,
        refreshUser,
    }), [user, isLoading, login, signup, logout, refreshUser]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
