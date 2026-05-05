export interface INewsItem {
    id: number;
    title: string;
    excerpt: string;
    category: string;
    categoryColor: string;
    date: string;
    author: string;
    image?: string;
    content?: string;
}