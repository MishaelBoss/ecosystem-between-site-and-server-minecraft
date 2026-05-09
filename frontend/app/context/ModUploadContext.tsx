'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useRef } from 'react';
import { uploadModsBatch } from '../lib/api';

export interface BatchItem {
    name: string;
    title: string;
    status: 'success' | 'error' | 'waiting';
    error?: string;
}

export interface UploadResult {
    items: BatchItem[];
    total: number;
    completed: number;
    failed: number;
}

interface ModUploadContextValue {
    result: UploadResult | null;
    isUploading: boolean;
    startUpload: (files: File[], onItemUploaded: () => void) => void;
    dismissResult: () => void;
}

const ModUploadContext = createContext<ModUploadContextValue | undefined>(undefined);

const STORAGE_KEY = 'mod_upload_result';

function getInitialResult(): UploadResult | null {
    if (typeof window === 'undefined') return null;
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            return JSON.parse(saved) as UploadResult;
        }
    } catch {
        localStorage.removeItem(STORAGE_KEY);
    }
    return null;
}

export function ModUploadProvider({ children }: { children: ReactNode }) {
    const [result, setResult] = useState<UploadResult | null>(getInitialResult);
    const [isUploading, setIsUploading] = useState(false);
    const onItemUploadedRef = useRef<(() => void) | null>(null);

    // Сохраняем в localStorage при изменении
    useEffect(() => {
        if (result && !isUploading) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
        }
    }, [result, isUploading]);

    const startUpload = useCallback(async (files: File[], onItemUploaded: () => void) => {
        if (files.length === 0 || isUploading) return;
        setIsUploading(true);
        onItemUploadedRef.current = onItemUploaded;

        const initialResult: UploadResult = {
            items: files.map(file => ({
                name: file.name,
                title: file.name.replace(/\.jar$/i, ''),
                status: 'waiting',
            })),
            total: files.length,
            completed: 0,
            failed: 0,
        };
        setResult(initialResult);
        localStorage.removeItem(STORAGE_KEY);

        const dataTransfer = new DataTransfer();
        files.forEach(f => dataTransfer.items.add(f));

        try {
            const finalResult = await uploadModsBatch(dataTransfer.files, (completed, _total) => {
                setResult(prev => {
                    if (!prev) return prev;
                    return {
                        ...prev,
                        completed,
                        items: prev.items.map((item, i) => ({
                            ...item,
                            status: i < completed ? 'success' : 'waiting',
                        })),
                    };
                });
            });
            setResult(finalResult);
        } finally {
            setIsUploading(false);
        }
    }, [isUploading]);

    const dismissResult = useCallback(() => {
        setResult(null);
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    return (
        <ModUploadContext.Provider value={{ result, isUploading, startUpload, dismissResult }}>
            {children}
        </ModUploadContext.Provider>
    );
}

export function useModUpload() {
    const context = useContext(ModUploadContext);
    if (context === undefined) {
        throw new Error('useModUpload must be used within a ModUploadProvider');
    }
    return context;
}