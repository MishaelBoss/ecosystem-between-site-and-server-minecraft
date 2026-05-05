export type GalleryStatus = 'pending' | 'approved' | 'rejected';

export interface IGalleryItem {
    id: number;
    author: string;
    authorInitial: string;
    title: string;
    status: GalleryStatus;
    coins: number;
    uploadedAt: string;
    tags: string[];
    gradient: string;
    image: string;
}

export interface IGalleryCreate {
    title: string;
    image?: File;
}

export const STATUS_CONFIG: Record<GalleryStatus, {
    label: string;
    color: string;
    bg: string;
    border: string;
}> = {
    pending:  { label: 'На проверке', color: '#d97706', bg: 'rgba(217,119,6,0.1)',  border: 'rgba(217,119,6,0.3)'  },
    approved: { label: 'Одобрено',    color: '#16a34a', bg: 'rgba(22,163,74,0.1)',  border: 'rgba(22,163,74,0.3)'  },
    rejected: { label: 'Отклонено',   color: '#dc2626', bg: 'rgba(220,38,38,0.1)',  border: 'rgba(220,38,38,0.3)'  },
};

export function getInitial(author: string | null): string {
    return (author ?? '?')[0].toUpperCase();
}