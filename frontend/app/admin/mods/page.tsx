'use client';
import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, Download, ChevronLeft, Package } from 'lucide-react';
import Link from 'next/link';
import { getAdminModList, deleteMod, uploadMod } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { IModItem, ModCategory, CATEGORY_CONFIG, STATUS_CONFIG } from '../../types/mod.interface';

export default function ModsAdminPage() {
    const [mods, setMods] = useState<IModItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<IModItem | null>(null);
    const { isAdmin } = useAuth();
    const router = useRouter();

    const fetchMods = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getAdminModList();
            setMods(data);
        } catch (error) {
            console.error('Failed to fetch mods', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!isAdmin) {
            router.push('/');
            return;
        }
        fetchMods();
    }, [isAdmin, fetchMods]);

    const handleDelete = async (id: number) => {
        if (confirm('Вы уверены, что хотите удалить этот мод?')) {
            try {
                await deleteMod(id);
                setMods(mods.filter(m => m.id !== id));
            } catch (error) {
                alert('Ошибка при удалении');
            }
        }
    };

    const handleEdit = (item: IModItem) => {
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
                    <h1 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-1px' }}>Управление модами</h1>
                </div>
                <button 
                    onClick={handleCreate}
                    style={{ 
                        display: 'flex', alignItems: 'center', gap: '8px', 
                        backgroundColor: 'var(--accent)', color: '#fff', border: 'none', 
                        borderRadius: '10px', padding: '12px 24px', fontWeight: 600, cursor: 'pointer' 
                    }}
                >
                    <Plus size={18} /> Добавить мод
                </button>
            </div>

            {isLoading ? (
                <div style={{ textAlign: 'center', padding: '60px' }}>Загрузка...</div>
            ) : (
                <div style={{ display: 'grid', gap: '16px' }}>
                    {mods.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
                            <Package size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                            <p>Моды еще не добавлены</p>
                        </div>
                    ) : (
                        mods.map((mod) => (
                            <div key={mod.id} style={{ 
                                backgroundColor: '#161616', border: '1px solid var(--border)', 
                                borderRadius: '16px', padding: '20px', display: 'flex', 
                                alignItems: 'center', justifyContent: 'space-between', gap: '20px' 
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1 }}>
                                    <div style={{ 
                                        width: '60px', height: '60px', borderRadius: '12px', 
                                        backgroundColor: '#222', display: 'flex', alignItems: 'center', 
                                        justifyContent: 'center' 
                                    }}>
                                        <Package size={28} color="#444" />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>{mod.title}</h3>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                                            <span style={{ 
                                                padding: '2px 8px', borderRadius: '6px', fontSize: '12px',
                                                backgroundColor: CATEGORY_CONFIG[mod.category]?.bg,
                                                color: CATEGORY_CONFIG[mod.category]?.color,
                                                border: `1px solid ${CATEGORY_CONFIG[mod.category]?.border}`
                                            }}>
                                                {CATEGORY_CONFIG[mod.category]?.label}
                                            </span>
                                            <span style={{ 
                                                padding: '2px 8px', borderRadius: '6px', fontSize: '12px',
                                                backgroundColor: STATUS_CONFIG[mod.status]?.bg,
                                                color: STATUS_CONFIG[mod.status]?.color,
                                                border: `1px solid ${STATUS_CONFIG[mod.status]?.border}`
                                            }}>
                                                {STATUS_CONFIG[mod.status]?.label}
                                            </span>
                                            <span>v{mod.version}</span>
                                            <span>📥 {mod.downloads}</span>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <a 
                                        href={mod.file_url} 
                                        download
                                        title="Скачать"
                                        style={{ 
                                            padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', 
                                            background: 'none', color: 'var(--text-secondary)', cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', textDecoration: 'none'
                                        }}
                                        onClick={(e) => {
                                            fetch(`/api/mods/${mod.id}/download/`, { method: 'POST', credentials: 'include' });
                                        }}
                                    >
                                        <Download size={18} />
                                    </a>
                                    <button 
                                        onClick={() => handleEdit(mod)}
                                        title="Редактировать"
                                        style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(mod.id)}
                                        title="Удалить"
                                        style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'none', color: '#ef4444', cursor: 'pointer' }}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {isFormOpen && (
                <ModForm 
                    item={editingItem} 
                    onClose={() => setIsFormOpen(false)} 
                    onSuccess={() => {
                        setIsFormOpen(false);
                        fetchMods();
                    }} 
                />
            )}
        </div>
    );
}

function ModForm({ item, onClose, onSuccess }: { 
    item: IModItem | null; 
    onClose: () => void; 
    onSuccess: () => void;
}) {
    const [title, setTitle] = useState(item?.title || '');
    const [description, setDescription] = useState(item?.description || '');
    const [version, setVersion] = useState(item?.version || '1.0');
    const [category, setCategory] = useState<ModCategory>(item?.category || 'other');
    const [file, setFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title) {
            alert('Название обязательно');
            return;
        }
        if (!file && !item) {
            alert('Файл обязателен для нового мода');
            return;
        }

        setIsSubmitting(true);
        try {
            await uploadMod({
                title,
                description,
                file: file || undefined,
                version,
                category,
            });
            onSuccess();
        } catch (error) {
            const axiosError = error as { response?: { data?: { message?: string } } };
            alert(axiosError?.response?.data?.message || 'Ошибка при загрузке мода');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && (droppedFile.name.endsWith('.jar') || droppedFile.name.endsWith('.zip'))) {
            setFile(droppedFile);
        } else {
            alert('Пожалуйста, перетащите файл .jar или .zip');
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
            <div style={{
                backgroundColor: '#1a1a1a', border: '1px solid var(--border)',
                borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '500px',
                maxHeight: '90vh', overflow: 'auto'
            }}>
                <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px' }}>
                    {item ? 'Редактировать мод' : 'Добавить мод'}
                </h2>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>
                            Название мода *
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Например: OptiFine"
                            style={{
                                width: '100%', padding: '12px', borderRadius: '10px',
                                border: '1px solid var(--border)', backgroundColor: '#111',
                                color: 'var(--text-primary)', fontSize: '14px'
                            }}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>
                            Описание
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Описание мода..."
                            rows={3}
                            style={{
                                width: '100%', padding: '12px', borderRadius: '10px',
                                border: '1px solid var(--border)', backgroundColor: '#111',
                                color: 'var(--text-primary)', fontSize: '14px', resize: 'vertical'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>
                            Версия
                        </label>
                        <input
                            type="text"
                            value={version}
                            onChange={(e) => setVersion(e.target.value)}
                            placeholder="1.0"
                            style={{
                                width: '100%', padding: '12px', borderRadius: '10px',
                                border: '1px solid var(--border)', backgroundColor: '#111',
                                color: 'var(--text-primary)', fontSize: '14px'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>
                            Категория
                        </label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value as ModCategory)}
                            title="Категория мода"
                            style={{
                                width: '100%', padding: '12px', borderRadius: '10px',
                                border: '1px solid var(--border)', backgroundColor: '#111',
                                color: 'var(--text-primary)', fontSize: '14px'
                            }}
                        >
                            {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                                <option key={key} value={key}>{config.label}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>
                            Файл мода (.jar, .zip) {!item && '*'}
                        </label>
                        <div
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            style={{
                                border: `2px dashed ${isDragging ? 'var(--accent)' : 'var(--border)'}`,
                                borderRadius: '12px',
                                padding: '32px',
                                textAlign: 'center',
                                backgroundColor: isDragging ? 'rgba(224,25,90,0.05)' : '#111',
                                transition: 'all 0.2s',
                                cursor: 'pointer'
                            }}
                            onClick={() => document.getElementById('mod-file-input')?.click()}
                        >
                            {file ? (
                                <div>
                                    <Package size={32} color="var(--accent)" style={{ marginBottom: '8px' }} />
                                    <p style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>{file.name}</p>
                                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setFile(null);
                                        }}
                                        style={{
                                            marginTop: '8px',
                                            padding: '4px 12px',
                                            backgroundColor: 'transparent',
                                            border: '1px solid #ef4444',
                                            color: '#ef4444',
                                            borderRadius: '6px',
                                            fontSize: '12px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Удалить файл
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <Download size={32} color="var(--text-secondary)" style={{ marginBottom: '12px' }} />
                                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                                        Перетащите файл сюда или кликните для выбора
                                    </p>
                                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', opacity: 0.7 }}>
                                        Поддерживаются файлы .jar и .zip
                                    </p>
                                </div>
                            )}
                        </div>
                        <input
                            id="mod-file-input"
                            type="file"
                            accept=".jar,.zip"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                            title="Выбрать файл мода"
                            style={{ display: 'none' }}
                            required={!item}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                padding: '12px 24px', borderRadius: '10px',
                                border: '1px solid var(--border)', backgroundColor: 'transparent',
                                color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 600,
                                cursor: 'pointer'
                            }}
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            style={{
                                padding: '12px 24px', borderRadius: '10px',
                                border: 'none', backgroundColor: 'var(--accent)',
                                color: '#fff', fontSize: '14px', fontWeight: 600,
                                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                opacity: isSubmitting ? 0.7 : 1
                            }}
                        >
                            {isSubmitting ? 'Загрузка...' : 'Сохранить'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}