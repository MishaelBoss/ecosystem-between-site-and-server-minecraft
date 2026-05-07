'use client';
import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, Newspaper, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { getListNews, deleteNews } from '../../lib/api';
import NewsForm from './_components/NewsForm';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import ConfirmModal from '../../components/ConfirmModal';
import styles from './page.module.css';
import { INewsItem } from '../../types/news.interface';

export default function NewsAdminPage() {
    const [news, setNews] = useState<INewsItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<INewsItem | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<INewsItem | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const { isAdmin } = useAuth();
    const router = useRouter();

    const fetchNews = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getListNews(0, 100);
            setNews(data);
        } catch (error) {
            console.error('Failed to fetch news', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!isAdmin) {
            router.push('/');
            return;
        }

        const loadNews = async () => {
            await fetchNews();
        };

        void loadNews();
    }, [isAdmin, fetchNews, router]);

    const handleDelete = (item: INewsItem) => {
        setDeleteTarget(item);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;

        try {
            await deleteNews(deleteTarget.id);
            setNews(prev => prev.filter(n => n.id !== deleteTarget.id));
        } catch (error) {
            alert('Ошибка при удалении');
        } finally {
            setShowDeleteConfirm(false);
            setDeleteTarget(null);
        }
    };

    const handleEdit = (item: INewsItem) => {
        setEditingItem(item);
        setIsFormOpen(true);
    };

    const handleCreate = () => {
        setEditingItem(null);
        setIsFormOpen(true);
    };

    if (!isAdmin) return null;

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div>
                    <Link href="/" className={styles.breadcrumbLink}>
                        <ChevronLeft size={16} /> На главную
                    </Link>
                    <h1 className={styles.pageTitle}>Управление новостями</h1>
                </div>
                <button
                    type="button"
                    onClick={handleCreate}
                    className={styles.addButton}
                >
                    <Plus size={18} /> Добавить новость
                </button>
            </div>

            {isLoading ? (
                <div className={styles.loading}>Загрузка...</div>
            ) : (
                <div className={styles.cardsGrid}>
                    {news.map((item) => (
                        <div key={item.id} className={styles.card}>
                            <div className={styles.cardInfo}>
                                {item.image ? (
                                    <img src={item.image} alt={item.title} className={styles.cardImage} />
                                ) : (
                                    <div className={styles.cardImageFallback}>
                                        <Newspaper size={24} color="#444" />
                                    </div>
                                )}
                                <div>
                                    <h3 className={styles.cardTitle}>{item.title}</h3>
                                    <p className={styles.cardMeta}>{item.category} • {new Date(item.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className={styles.cardActions}>
                                <button
                                    type="button"
                                    onClick={() => handleEdit(item)}
                                    className={styles.actionButton}
                                    aria-label={`Редактировать новость ${item.title}`}
                                >
                                    <Edit2 size={18} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(item)}
                                    className={`${styles.actionButton} ${styles.actionButtonDanger}`}
                                    aria-label={`Удалить новость ${item.title}`}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isFormOpen && (
                <NewsForm 
                    item={editingItem} 
                    onClose={() => setIsFormOpen(false)} 
                    onSuccess={() => {
                        setIsFormOpen(false);
                        fetchNews();
                    }} 
                />
            )}

            {showDeleteConfirm && deleteTarget && (
                <ConfirmModal
                    title="Удалить новость"
                    description={`Вы действительно хотите удалить новость «${deleteTarget.title}»? Это действие нельзя отменить.`}
                    confirmText="Удалить"
                    cancelText="Отмена"
                    onConfirm={confirmDelete}
                    onClose={() => {
                        setShowDeleteConfirm(false);
                        setDeleteTarget(null);
                    }}
                />
            )}
        </div>
    );
}
