'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Edit2, Trash2, Download, ChevronLeft, Package, Upload, UploadCloud, X, AlertCircle, CheckCircle2, Loader2, FileArchive } from 'lucide-react';
import Link from 'next/link';
import { getAdminModList, deleteMod, uploadModsBatch } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { IModItem, ModCategory, CATEGORY_CONFIG, STATUS_CONFIG } from '../../types/mod.interface';
import Portal from '../../components/Portal';
import ConfirmModal from '../../components/ConfirmModal';
import styles from './page.module.css';

interface BatchItem {
    name: string;
    title: string;
    status: 'success' | 'error' | 'waiting';
    error?: string;
}

export default function ModsAdminPage() {
    const [mods, setMods] = useState<IModItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<IModItem | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<IModItem | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
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

        const loadMods = async () => {
            await fetchMods();
        };

        void loadMods();
    }, [isAdmin, fetchMods, router]);

    const handleDelete = (item: IModItem) => {
        setDeleteTarget(item);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;

        try {
            await deleteMod(deleteTarget.id);
            setMods(prev => prev.filter(m => m.id !== deleteTarget.id));
        } catch (error) {
            alert('Ошибка при удалении');
        } finally {
            setShowDeleteConfirm(false);
            setDeleteTarget(null);
        }
    };

    const handleEdit = (item: IModItem) => {
        setEditingItem(item);
        setIsFormOpen(true);
    };

    if (!isAdmin) return null;

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <Link href="/" className={styles.breadcrumb}>
                        <ChevronLeft size={16} /> На главную
                    </Link>
                    <h1 className={styles.pageTitle}>Управление модами</h1>
                </div>
                <div className={styles.headerRight}>
                    <BatchUploadButton text="Загрузить" onComplete={fetchMods} />
                </div>
            </div>

            {isLoading ? (
                <div className={styles.loading}>Загрузка...</div>
            ) : (
                <div className={styles.cardsGrid}>
                    {mods.length === 0 ? (
                        <div className={styles.emptyState}>
                            <Package size={48} className={styles.emptyStateIcon} />
                            <p className={styles.emptyStateTitle}>Моды еще не добавлены</p>
                            <p className={styles.emptyStateSubtitle}>Нажмите &quot;Загрузить&quot;, чтобы добавить моды</p>
                        </div>
                    ) : (
                        mods.map((mod) => (
                            <div key={mod.id} className={styles.modCard}>
                                <div className={styles.cardContent}>
                                    <div className={styles.cardIcon}>
                                        <Package size={28} color="#444" />
                                    </div>
                                    <div>
                                        <h3 className={styles.cardTitle}>{mod.title}</h3>
                                        <div className={styles.cardMeta}>
                                            <span className={styles.metaBadge} style={{ 
                                                backgroundColor: CATEGORY_CONFIG[mod.category]?.bg,
                                                color: CATEGORY_CONFIG[mod.category]?.color,
                                                border: `1px solid ${CATEGORY_CONFIG[mod.category]?.border}`
                                            }}>
                                                {CATEGORY_CONFIG[mod.category]?.label}
                                            </span>
                                            <span className={styles.metaBadge} style={{ 
                                                backgroundColor: STATUS_CONFIG[mod.status]?.bg,
                                                color: STATUS_CONFIG[mod.status]?.color,
                                                border: `1px solid ${STATUS_CONFIG[mod.status]?.border}`
                                            }}>
                                                {STATUS_CONFIG[mod.status]?.label}
                                            </span>
                                            <span className={styles.metaVersion}>v{mod.version}</span>
                                            <span className={styles.metaDownloads}>📥 {mod.downloads}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.cardActions}>
                                    <a 
                                        href={mod.file_url} 
                                        download
                                        title="Скачать"
                                        className={styles.actionButton}
                                        onClick={() => {
                                            fetch(`/api/mods/${mod.id}/download/`, { method: 'POST', credentials: 'include' });
                                        }}
                                    >
                                        <Download size={18} />
                                    </a>
                                    <button 
                                        onClick={() => handleEdit(mod)}
                                        title="Редактировать"
                                        className={styles.actionButton}
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(mod)}
                                        title="Удалить"
                                        className={`${styles.actionButton} ${styles.deleteButton}`}
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

            {showDeleteConfirm && deleteTarget && (
                <ConfirmModal
                    title="Удалить мод"
                    description={`Вы действительно хотите удалить мод «${deleteTarget.title}»? Это действие нельзя отменить.`}
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

function BatchUploadButton({ text, onComplete }: { text?: string; onComplete: () => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const [uploadResult, setUploadResult] = useState<{
        items: BatchItem[];
        total: number;
        completed: number;
        failed: number;
    } | null>(null);

    const handleUploadStart = (initialResult: { items: BatchItem[]; total: number; completed: number; failed: number }) => {
        setIsOpen(false);
        setUploadResult(initialResult);
    };

    const handleUploadComplete = () => {
        setUploadResult(null);
        onComplete();
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className={styles.batchUploadButton}
            >
                <UploadCloud size={18} /> {text || 'Массовая загрузка'}
            </button>
            {isOpen && (
                <BatchUploadModal
                    onClose={() => setIsOpen(false)}
                    onUploadStart={handleUploadStart}
                    onUploadComplete={(result) => {
                        setUploadResult(result);
                    }}
                    onFileUploaded={onComplete}
                />
            )}
            {uploadResult && (
                <UploadProgressPanel result={uploadResult} onClose={handleUploadComplete} />
            )}
        </>
    );
}

function BatchUploadModal({ onClose, onUploadStart, onUploadComplete, onFileUploaded }: { 
    onClose: () => void;
    onUploadStart: (initialResult: { items: BatchItem[]; total: number; completed: number; failed: number }) => void;
    onUploadComplete: (result: { items: BatchItem[]; total: number; completed: number; failed: number }) => void;
    onFileUploaded: () => void;
}) {
    const [files, setFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFiles = useCallback((newFiles: FileList) => {
        const jarFiles = Array.from(newFiles).filter(f => f.name.endsWith('.jar'));
        setFiles(prev => [...prev, ...jarFiles]);
    }, []);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const startUpload = async () => {
        if (files.length === 0) return;
        setUploading(true);

        const initialResult = {
            items: files.map(file => ({ name: file.name, title: file.name, status: 'waiting' as const })),
            total: files.length,
            completed: 0,
            failed: 0,
        };
        onUploadStart(initialResult);

        const dataTransfer = new DataTransfer();
        files.forEach(f => dataTransfer.items.add(f));

        try {
                const result = await uploadModsBatch(dataTransfer.files, (completed, total) => {
                onUploadStart({
                    items: files.map((file, i) => ({
                        name: file.name,
                        title: file.name,
                        status: i < completed ? 'success' as const : 'waiting' as const,
                    })),
                    total,
                    completed,
                    failed: 0,
                });
            });
            onUploadComplete(result);
            for (const item of result.items) {
                if (item.status === 'success') {
                    onFileUploaded();
                    await new Promise(resolve => setTimeout(resolve, 80));
                }
            }
        } catch (error) {
            console.error('Ошибка загрузки', error);
            const fallbackResult = {
                items: files.map(file => ({ name: file.name, title: file.name, status: 'error' as const, error: 'Ошибка загрузки' })),
                total: files.length,
                completed: 0,
                failed: files.length,
            };
            onUploadComplete(fallbackResult);
        } finally {
            setUploading(false);
        }
    };

    return (
        <Portal>
        <div onClick={e => { if (e.target === e.currentTarget && !uploading) onClose(); }} className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <button onClick={() => !uploading && onClose()} type="button" aria-label="закрыть" className={styles.modalCloseButton}>
                    <X size={18} />
                </button>
                <div className={styles.modalHeader}>
                    <FileArchive size={48} color="#e0195a" />
                </div>
                <h2 className={styles.modalTitle}>
                    Загрузить моды
                </h2>
                <p className={styles.modalDescription}>Перетащите .jar файлы или выберите через проводник</p>
                <div 
                    onDragOver={e => { e.preventDefault(); setIsDragging(true); }} 
                    onDragLeave={() => setIsDragging(false)} 
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`${styles.dragDropZone} ${isDragging ? styles.dragActive : ''}`}
                >
                    <div className={styles.dragDropZoneIcon}>
                        <Upload size={32} color={isDragging ? '#e0195a' : '#a0a0a0'} />
                    </div>
                    <p className={styles.dragDropZoneTitle}>{isDragging ? 'Отпустите файлы' : 'Нажмите или перетащите .jar сюда'}</p>
                    <p className={styles.dragDropZoneSubtitle}>поддерживаются .jar файлы</p>
                    <input 
                        ref={fileInputRef} 
                        type="file" 
                        accept=".jar" 
                        multiple 
                        aria-label="Выбрать jar файлы"
                        className={styles.hiddenFileInput}
                        onChange={e => { if (e.target.files) handleFiles(e.target.files); }} 
                    />
                </div>
                {files.length > 0 && (
                    <div className={styles.filesList}>
                        <p className={styles.filesListHeader}>Выбрано файлов: {files.length}</p>
                        <div className={styles.filesListContainer}>
                            {files.map((file, i) => (
                                <div key={i} className={styles.fileItem}>
                                    <Package size={14} color="#a0a0a0" />
                                    <span className={styles.fileItemName}>{file.name}</span>
                                    <span className={styles.fileItemSize}>{(file.size/1024/1024).toFixed(1)} MB</span>
                                    <button 
                                        type="button"
                                        onClick={() => removeFile(i)} 
                                        aria-label={`Удалить ${file.name}`}
                                        className={styles.fileRemoveButton}
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                <button onClick={startUpload} disabled={files.length === 0 || uploading} className={styles.uploadButton}>
                    {uploading ? <Loader2 size={18} className={styles.spinAnimation} /> : <Upload size={18} />}
                    {uploading ? 'Загрузка...' : `Загрузить ${files.length > 0 ? `${files.length} мод(ов)` : ''}`}
                </button>
            </div>
        </div>
        </Portal>
    );
}

function UploadProgressPanel({ result, onClose }: { result: { items: BatchItem[]; total: number; completed: number; failed: number }; onClose: () => void }) {
    const [minimized, setMinimized] = useState(false);
    const { items, total, completed, failed } = result;
    const percent = total > 0 ? ((completed + failed) / total) * 100 : 0;

    return (
        <Portal>
        <div className={`${styles.progressPanel} ${minimized ? styles.minimized : styles.expanded}`}>
            <div onClick={() => setMinimized(!minimized)} className={`${styles.progressHeader} ${minimized ? styles.minimized : ''}`}>
                <div className={styles.progressHeaderLeft}>
                    <CheckCircle2 size={18} color="#22c55e" />
                    <span className={styles.progressHeaderTitle}>Загрузка завершена</span>
                </div>
                <div className={styles.progressHeaderRight}>
                    {!minimized && <span className={styles.progressCount}>{completed+failed}/{total}</span>}
                    <button 
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onClose(); }} 
                        aria-label="Закрыть"
                        className={styles.progressCloseButton}
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>
            {!minimized && (
                <>
                    <div className={styles.progressBar}>
                        <div className={styles.progressBarBackground}>
                            <div 
                                className={`${styles.progressBarFill} ${failed > 0 ? styles.partial : styles.success}`}
                                style={{ width: `${percent}%` }}
                            />
                        </div>
                    </div>
                    <div className={styles.progressItems}>
                        {items.map((item, i) => (
                            <div key={i} className={`${styles.progressItem} ${item.status === 'success' ? styles.success : item.status === 'error' ? styles.error : ''}`}>
                                {item.status === 'success' ? <CheckCircle2 size={12} color="#22c55e" /> : <AlertCircle size={12} color="#ef4444" />}
                                <span className={`${styles.progressItemName} ${item.status === 'success' ? styles.success : item.status === 'error' ? styles.error : ''}`}>{item.name}</span>
                                {item.status === 'success' ? <span className={styles.progressItemStatus}>✓</span> : <span className={styles.progressItemStatus}>✗ {item.error}</span>}
                            </div>
                        ))}
                    </div>
                </>
            )}
            {minimized && (
                <div className={styles.progressMinimizedContent}>
                    {completed+failed}/{total} · {failed > 0 ? `${failed} ошибок` : 'все успешно'}
                </div>
            )}
        </div>
        </Portal>
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
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title) { alert('Название обязательно'); return; }
        setIsSubmitting(true);
        try {
            const { updateMod } = await import('../../lib/api');
            await updateMod(item!.id, { title, description, version, category });
            onSuccess();
        } catch (error) {
            alert('Ошибка при обновлении');
        } finally { setIsSubmitting(false); }
    };

    return (
        <Portal>
        <div className={styles.formOverlay}>
            <div className={styles.formContent}>
                <div className={styles.formHeader}>
                    <h2 className={styles.formTitle}>Редактировать мод</h2>
                    <button type="button" onClick={onClose} aria-label="Закрыть" className={styles.formCloseButton}><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="mod-title" className={styles.formLabel}>Название мода</label>
                        <input 
                            id="mod-title"
                            type="text" 
                            value={title} 
                            onChange={e => setTitle(e.target.value)}
                            className={styles.formInput}
                            required 
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="mod-description" className={styles.formLabel}>Описание</label>
                        <textarea 
                            id="mod-description"
                            value={description} 
                            onChange={e => setDescription(e.target.value)} 
                            rows={3}
                            className={styles.formTextarea}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="mod-version" className={styles.formLabel}>Версия</label>
                        <input 
                            id="mod-version"
                            type="text" 
                            value={version} 
                            onChange={e => setVersion(e.target.value)}
                            className={styles.formInput}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="mod-category" className={styles.formLabel}>Категория</label>
                        <select 
                            id="mod-category"
                            value={category} 
                            onChange={e => setCategory(e.target.value as ModCategory)} 
                            className={styles.formSelect}
                        >
                            {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (<option key={key} value={key}>{config.label}</option>))}
                        </select>
                    </div>
                    <div className={styles.formActions}>
                        <button type="button" onClick={onClose} className={styles.formCancelButton}>Отмена</button>
                        <button type="submit" disabled={isSubmitting} className={styles.formSubmitButton}>
                            {isSubmitting ? 'Сохранение...' : 'Сохранить'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
        </Portal>
    );
}