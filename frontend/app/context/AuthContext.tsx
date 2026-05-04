'use client';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { checkAuthStatus } from '../lib/api';
import { IUser, IUserLogin, IUserRegister } from '../types/user.interface';
import { register as registerAPI, login as loginAPI, logout as logoutAPI } from "@/app/lib/api";

interface AuthContextType {
    user: IUser | null;
    isLoading: boolean;
    login: (data: IUserLogin) => Promise<void>;
    register: (data: IUserRegister) => Promise<void>;
    logout: () => void;
    refreshAuth: () => Promise<void>;
    updateUser: (data: Partial<IUser>) => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const refreshAuth = useCallback(async () => {
        try {
            const userData = await checkAuthStatus();
            setUser(userData || null);
        } catch (error) {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const updateUser = useCallback((data: Partial<IUser>) => {
        setUser(prev => prev ? { ...prev, ...data } : null);
    }, []);

    const login = async (data: IUserLogin) => {
        setIsLoading(true);

        const isSuccess = await loginAPI(data);

        if(isSuccess) {
            await refreshAuth();
        }

        setIsLoading(false);
    };

    const register = async (data: IUserRegister) => {
        setIsLoading(true);

        const isSuccess = await registerAPI(data);

        if(isSuccess) {
            await refreshAuth();
        }

        setIsLoading(false);
    };

    const logout = async () => {
        await logoutAPI();
        setUser(null);
        await refreshAuth();
    };

    useEffect(() => {
        let isMounted = true;

        const initAuth = async () => {
            await refreshAuth();
            if (!isMounted) return; 
        };

        initAuth();

        return () => {
            isMounted = false;
        };
    }, [refreshAuth]);

    return (
        <AuthContext.Provider value={{ user, login, register, isLoading, logout,refreshAuth, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);