'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { getDataServer } from '../lib/api';

export interface ServerStatusData {
    online: boolean;
    players: number;
    maxPlayers: number;
    version: string;
    motd: string;
    latency: number;
    playersList: string[];
    tps: number;
    ip?: string;
    port?: number;
    mode?: string;
}

interface ServerStatusContextValue {
    data: ServerStatusData | null;
    error: boolean;
    isLoading: boolean;
    refetch: () => void;
}

const ServerStatusContext = createContext<ServerStatusContextValue | undefined>(undefined);

export function ServerStatusProvider({ children }: { children: ReactNode }) {
    const [data, setData] = useState<ServerStatusData | null>(null);
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const fetchStatus = useCallback(async () => {
        try {
            const raw = await getDataServer();
            if (!raw || !raw.online) {
                setError(true);
                setData(null);
                return;
            }
            setError(false);
            setData({
                online: raw.online ?? false,
                players: raw.players ?? 0,
                maxPlayers: raw.maxPlayers ?? 0,
                version: raw.version ?? '?',
                motd: raw.motd ?? '',
                latency: Math.round(raw.latency ?? 0),
                tps: raw.tps ? +raw.tps.toFixed(1) : 20.0,
                playersList: raw.playersList ?? [],
                ip: raw.ip ?? 'play.craftworld.ru',
                port: raw.port ?? 20167,
                mode: raw.mode ?? 'Выживание',
            });
        } catch (err) {
            console.error('Ошибка при загрузке статуса сервера', err);
            setError(true);
            setData(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            if (!cancelled) {
                await fetchStatus();
            }
        };

        load();
        const interval = setInterval(() => {
            if (!cancelled) fetchStatus();
        }, 20000);

        return () => {
            cancelled = true;
            clearInterval(interval);
        };
    }, [fetchStatus]);

    return (
        <ServerStatusContext.Provider value={{ data, error, isLoading, refetch: fetchStatus }}>
            {children}
        </ServerStatusContext.Provider>
    );
}

export function useServerStatus() {
    const context = useContext(ServerStatusContext);
    if (context === undefined) {
        throw new Error('useServerStatus must be used within a ServerStatusProvider');
    }
    return context;
}