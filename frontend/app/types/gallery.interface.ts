export type Status = 'pending' | 'approved' | 'rejected';

export interface IGalleryItem {
    id: number;
    author: string;
    authorInitial: string;
    title: string;
    status: Status;
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