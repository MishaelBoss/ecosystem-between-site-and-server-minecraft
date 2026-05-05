'use client';
import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Newspaper, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { getListNews, deleteNews } from '../../lib/api';
import NewsForm from './_components/NewsForm';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function NewsAdminPage() {
    const [news, setNews] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any | null>(null);
    const { isAdmin } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAdmin) {
            router.push('/');
            return;
        }
        fetchNews();
    }, [isAdmin]);

    const fetchNews = async () => {
        setIsLoading(true);
        try {
            const data = await getListNews(0, 100);
            setNews(data);
        } catch (error) {
            console.error('Failed to fetch news', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('Вы уверены, что хотите удалить эту новость?')) {
            try {
                await deleteNews(id);
                setNews(news.filter(n => n.id !== id));
            } catch (error) {
                alert('Ошибка при удалении');
            }
        }
    };

    const handleEdit = (item: any) => {
        setEditingItem(item);
        setIsFormOpen(true);
    };

    const handleCreate = () => {
        setEditingItem(null);
        setIsFormOpen(true);
    };

    if (!isAdmin) return null;

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
                <div>
                    <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', marginBottom: '12px' }}>
                        <ChevronLeft size={16} /> На главную
                    </Link>
                    <h1 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-1px' }}>Управление новостями</h1>
                </div>
                <button 
                    onClick={handleCreate}
                    style={{ 
                        display: 'flex', alignItems: 'center', gap: '8px', 
                        backgroundColor: 'var(--accent)', color: '#fff', border: 'none', 
                        borderRadius: '10px', padding: '12px 24px', fontWeight: 600, cursor: 'pointer' 
                    }}
                >
                    <Plus size={18} /> Добавить новость
                </button>
            </div>

            {isLoading ? (
                <div style={{ textAlign: 'center', padding: '60px' }}>Загрузка...</div>
            ) : (
                <div style={{ display: 'grid', gap: '16px' }}>
                    {news.map((item) => (
                        <div key={item.id} style={{ 
                            backgroundColor: '#161616', border: '1px solid var(--border)', 
                            borderRadius: '16px', padding: '20px', display: 'flex', 
                            alignItems: 'center', justifyContent: 'space-between', gap: '20px' 
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1 }}>
                                {item.image ? (
                                    <img src={item.image} alt="" style={{ width: '100px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ width: '100px', height: '60px', borderRadius: '8px', backgroundColor: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Newspaper size={24} color="#444" />
                                    </div>
                                )}
                                <div>
                                    <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>{item.title}</h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{item.category} • {new Date(item.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button 
                                    onClick={() => handleEdit(item)}
                                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                                >
                                    <Edit2 size={18} />
                                </button>
                                <button 
                                    onClick={() => handleDelete(item.id)}
                                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'none', color: '#ef4444', cursor: 'pointer' }}
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
        </div>
    );
}
