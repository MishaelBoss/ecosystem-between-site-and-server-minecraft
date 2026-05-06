'use client';
import { useState } from 'react';
import { X, Upload, Save } from 'lucide-react';
import { createNews, updateNews } from '../../../lib/api';
import Portal from '../../../components/Portal';

interface NewsFormProps {
    item?: any;
    onClose: () => void;
    onSuccess: () => void;
}

export default function NewsForm({ item, onClose, onSuccess }: NewsFormProps) {
    const [title, setTitle] = useState(item?.title || '');
    const [content, setContent] = useState(item?.content || '');
    const [excerpt, setExcerpt] = useState(item?.excerpt || '');
    const [category, setCategory] = useState(item?.category || 'Обновление');
    const [image, setImage] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('excerpt', excerpt);
        formData.append('category', category);
        if (image) {
            formData.append('image', image);
        }

        try {
            if (item) {
                await updateNews(item.id, formData);
            } else {
                await createNews(formData);
            }
            onSuccess();
        } catch (error) {
            alert('Ошибка при сохранении новости');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Portal>
        <div style={{ 
            position: 'fixed', inset: 0, zIndex: 1000, 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', padding: '20px' 
        }}>
            <div style={{ 
                backgroundColor: '#111', border: '1px solid var(--border)', 
                borderRadius: '20px', width: '100%', maxWidth: '600px', 
                maxHeight: '90vh', overflowY: 'auto', position: 'relative' 
            }}>
                <div style={{ 
                    padding: '24px', borderBottom: '1px solid var(--border)', 
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                    position: 'sticky', top: 0, backgroundColor: '#111', zIndex: 10 
                }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 800 }}>{item ? 'Редактировать новость' : 'Новая новость'}</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Заголовок</label>
                        <input 
                            type="text" required value={title} onChange={e => setTitle(e.target.value)}
                            style={{ width: '100%', backgroundColor: '#161616', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px', color: '#fff' }}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Категория</label>
                            <select 
                                value={category} onChange={e => setCategory(e.target.value)}
                                style={{ width: '100%', backgroundColor: '#161616', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px', color: '#fff' }}
                            >
                                <option value="Обновление">Обновление</option>
                                <option value="Событие">Событие</option>
                                <option value="Техническое">Техническое</option>
                                <option value="Анонс">Анонс</option>
                                <option value="Конкурс">Конкурс</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Изображение</label>
                            <label style={{ 
                                display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center',
                                backgroundColor: '#161616', border: '1px dashed var(--border)', borderRadius: '10px', 
                                padding: '12px', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '13px'
                            }}>
                                <Upload size={16} /> {image ? image.name : 'Выбрать файл'}
                                <input type="file" accept="image/*" onChange={e => setImage(e.target.files?.[0] || null)} style={{ display: 'none' }} />
                            </label>
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Краткое описание</label>
                        <textarea 
                            rows={2} value={excerpt} onChange={e => setExcerpt(e.target.value)}
                            style={{ width: '100%', backgroundColor: '#161616', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px', color: '#fff', resize: 'vertical' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Контент (текст новости)</label>
                        <textarea 
                            required rows={8} value={content} onChange={e => setContent(e.target.value)}
                            style={{ width: '100%', backgroundColor: '#161616', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px', color: '#fff', resize: 'vertical' }}
                        />
                    </div>

                    <button 
                        type="submit" disabled={isSubmitting}
                        style={{ 
                            marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center',
                            backgroundColor: 'var(--accent)', color: '#fff', border: 'none', 
                            borderRadius: '10px', padding: '14px', fontWeight: 700, cursor: isSubmitting ? 'not-allowed' : 'pointer',
                            opacity: isSubmitting ? 0.7 : 1
                        }}
                    >
                        <Save size={18} /> {isSubmitting ? 'Сохранение...' : 'Сохранить новость'}
                    </button>
                </form>
            </div>
        </div>
        </Portal>
    );
}
