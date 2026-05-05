export type ModStatus = 'pending' | 'approved' | 'rejected';
export type ModCategory = 'core' | 'world' | 'tech' | 'magic' | 'utility' | 'other';

export interface IModItem {
    id: number;
    author: string;
    title: string;
    description: string;
    file: string;
    file_url: string;
    version: string;
    category: ModCategory;
    category_display: string;
    status: ModStatus;
    status_display: string;
    downloads: number;
    uploaded_at: string;
}

export interface IModCreate {
    title: string;
    description?: string;
    file?: File;
    version?: string;
    category?: ModCategory;
}

export const CATEGORY_CONFIG: Record<ModCategory, {
    label: string;
    color: string;
    bg: string;
    border: string;
}> = {
    core:      { label: 'Основные',    color: '#ef4444', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.3)'   },
    world:     { label: 'Мир',         color: '#22c55e', bg: 'rgba(34,197,94,0.1)',   border: 'rgba(34,197,94,0.3)'   },
    tech:      { label: 'Техника',     color: '#3b82f6', bg: 'rgba(59,130,246,0.1)',  border: 'rgba(59,130,246,0.3)'  },
    magic:     { label: 'Магия',       color: '#a855f7', bg: 'rgba(168,85,247,0.1)',  border: 'rgba(168,85,247,0.3)'  },
    utility:   { label: 'Утилиты',     color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.3)'  },
    other:     { label: 'Другое',      color: '#6b7280', bg: 'rgba(107,114,128,0.1)', border: 'rgba(107,114,128,0.3)' },
};

export const STATUS_CONFIG: Record<ModStatus, {
    label: string;
    color: string;
    bg: string;
    border: string;
}> = {
    pending:  { label: 'На проверке', color: '#d97706', bg: 'rgba(217,119,6,0.1)',  border: 'rgba(217,119,6,0.3)'  },
    approved: { label: 'Одобрено',    color: '#16a34a', bg: 'rgba(22,163,74,0.1)',  border: 'rgba(22,163,74,0.3)'  },
    rejected: { label: 'Отклонено',   color: '#dc2626', bg: 'rgba(220,38,38,0.1)',  border: 'rgba(220,38,38,0.3)'  },
};