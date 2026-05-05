'use client';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { checkAuthStatus } from '../lib/api';
import { IUser, IUserLogin, IUserRegister } from '../types/user.interface';
import { register as registerAPI, login as loginAPI, logout as logoutAPI } from "@/app/lib/api";

interface AuthContextType {
    user: IUser | null;
    isLoading: boolean;
    isAdmin: boolean;
    login: (data: IUserLogin) => Promise<void>;
    register: (data: IUserRegister) => Promise<void>;
    logout: () => Promise<void>;
    refreshAuth: () => Promise<void>;
    updateUser: (data: Partial<IUser>) => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const ADMIN_PATHS = ['/admin', '/admin/gallery'];

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    const refreshAuth = useCallback(async () => {
        try {
            const userData = await checkAuthStatus();
            setUser(userData || null);
            if (!userData && pathname?.startsWith('/admin')) {
                router.push('/');
            }
        } catch (error) {
            setUser(null);
            if (pathname?.startsWith('/admin')) router.push('/');
        } finally {
            setIsLoading(false);
        }
    }, [pathname, router]);

    const updateUser = useCallback((data: Partial<IUser>) => {
        setUser(prev => prev ? { ...prev, ...data } : null);
    }, []);

    const isAdmin = user?.is_staff === true;

    const logout = async () => {
        await logoutAPI();
        setUser(null);
        await refreshAuth();

        if (ADMIN_PATHS.some(adminPath => pathname?.startsWith(adminPath))) {
            router.push('/');
        }
    };

    const login = async (data: IUserLogin) => {
        setIsLoading(true);
        const isSuccess = await loginAPI(data);
        if (isSuccess) {
            await refreshAuth();
        }
        setIsLoading(false);
    };

    const register = async (data: IUserRegister) => {
        setIsLoading(true);
        const isSuccess = await registerAPI(data);
        if (isSuccess) {
            await refreshAuth();
        }
        setIsLoading(false);
    };

    useEffect(() => {
        let isMounted = true;
        const initAuth = async () => {
            await refreshAuth();
            if (!isMounted) return;
        };
        initAuth();
        return () => { isMounted = false; };
    }, [refreshAuth]);

    return (
        <AuthContext.Provider value={{ user, login, register, isLoading, logout, refreshAuth, updateUser, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);