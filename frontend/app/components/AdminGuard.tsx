'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
    const { isLoading, isAdmin } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAdmin) {
            router.push('/');
        }
    }, [isLoading, isAdmin, router]);

    if (isLoading) {
        return <div style={{ textAlign: 'center', padding: '40px', color: '#a0a0a0' }}>Загрузка...</div>;
    }

    return isAdmin ? <>{children}</> : null;
}