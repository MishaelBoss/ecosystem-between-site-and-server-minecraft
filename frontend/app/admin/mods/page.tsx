'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Plus, Edit2, Trash2, Download, ChevronLeft, Package, Upload, UploadCloud, X, AlertCircle, CheckCircle2, Loader2, FileArchive } from 'lucide-react';
import Link from 'next/link';
import { getAdminModList, deleteMod, uploadModsBatch } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { IModItem, ModCategory, CATEGORY_CONFIG, STATUS_CONFIG } from '../../types/mod.interface';
import Portal from '../../components/Portal';

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
                <div style={{ display: 'flex', gap: '10px' }}>
                    <BatchUploadButton onComplete={fetchMods} />
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
            </div>

            {isLoading ? (
                <div style={{ textAlign: 'center', padding: '60px' }}>Загрузка...</div>
            ) : (
                <div style={{ display: 'grid', gap: '16px' }}>
                    {mods.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
                            <Package size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                            <p>Моды еще не добавлены</p>
                            <p style={{ fontSize: '14px', marginTop: '8px' }}>Нажмите "Массовая загрузка" или "Добавить мод"</p>
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

// ===== КОМПОНЕНТ МАССОВОЙ ЗАГРУЗКИ =====
function BatchUploadButton({ onComplete }: { onComplete: () => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const [uploadResult, setUploadResult] = useState<{
        items: BatchItem[];
        total: number;
        completed: number;
        failed: number;
    } | null>(null);

    const handleUploadComplete = () => {
        setUploadResult(null);
        onComplete();
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    backgroundColor: 'transparent', color: 'var(--text-primary)',
                    border: '1px solid var(--border)', borderRadius: '10px',
                    padding: '12px 24px', fontWeight: 600, cursor: 'pointer',
                    transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
            >
                <UploadCloud size={18} /> Массовая загрузка
            </button>
            {isOpen && (
                <BatchUploadModal
                    onClose={() => setIsOpen(false)}
                    onUploadComplete={(result) => {
                        setIsOpen(false);
                        setUploadResult(result);
                    }}
                />
            )}
            {uploadResult && (
                <UploadProgressPanel result={uploadResult} onClose={handleUploadComplete} />
            )}
        </>
    );
}

function BatchUploadModal({ onClose, onUploadComplete }: { 
    onClose: () => void; 
    onUploadComplete: (result: { items: BatchItem[]; total: number; completed: number; failed: number }) => void 
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
        const dataTransfer = new DataTransfer();
        files.forEach(f => dataTransfer.items.add(f));
        try {
            const result = await uploadModsBatch(dataTransfer.files);
            onUploadComplete(result);
        } catch (error) {
            console.error('Ошибка загрузки', error);
            setUploading(false);
        }
    };

    return (
        <Portal>
        <div onClick={e => { if (e.target === e.currentTarget && !uploading) onClose(); }}
            style={{ position:'fixed', inset:0, zIndex:1000, backgroundColor:'rgba(0,0,0,0.8)', backdropFilter:'blur(8px)', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
            <div style={{ backgroundColor:'#111', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'20px', padding:'36px', width:'100%', maxWidth:'600px', animation:'fadeInUp 0.25s ease', position:'relative' }}>
                <button onClick={() => !uploading && onClose()} type="button" aria-label="закрыть"
                    style={{ position:'absolute', top:'16px', right:'16px', background:'none', border:'none', color:'#a0a0a0', cursor: uploading ? 'not-allowed' : 'pointer', display:'flex' }}>
                    <X size={18} />
                </button>
                <h2 style={{ fontSize:'22px', fontWeight:800, marginBottom:'6px', background:'linear-gradient(90deg, #fff, #e0195a)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                    Массовая загрузка модов
                </h2>
                <p style={{ color:'#a0a0a0', fontSize:'13px', marginBottom:'28px' }}>Перетащите .jar файлы или выберите через проводник</p>
                <div onDragOver={e => { e.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    style={{ border:`2px dashed ${isDragging ? '#e0195a' : 'rgba(255,255,255,0.12)'}`, borderRadius:'14px', padding:'40px', textAlign:'center', cursor:'pointer', transition:'all 0.2s', backgroundColor: isDragging ? 'rgba(224,25,90,0.05)' : 'rgba(255,255,255,0.02)', marginBottom:'20px' }}>
                    <FileArchive size={40} color={isDragging ? '#e0195a' : '#a0a0a0'} style={{ marginBottom:'12px' }} />
                    <p style={{ color:'#fff', fontSize:'14px', fontWeight:600, marginBottom:'4px' }}>{isDragging ? 'Отпустите файлы' : 'Перетащите .jar файлы сюда'}</p>
                    <p style={{ color:'#a0a0a0', fontSize:'12px' }}>или нажмите для выбора · поддерживаются .jar файлы</p>
                    <input ref={fileInputRef} type="file" accept=".jar" multiple style={{ display:'none' }}
                        onChange={e => { if (e.target.files) handleFiles(e.target.files); }} />
                </div>
                {files.length > 0 && (
                    <div style={{ marginBottom:'20px' }}>
                        <p style={{ color:'#a0a0a0', fontSize:'12px', fontWeight:600, marginBottom:'8px' }}>Выбрано файлов: {files.length}</p>
                        <div style={{ maxHeight:'200px', overflow:'auto', display:'flex', flexDirection:'column', gap:'6px' }}>
                            {files.map((file, i) => (
                                <div key={i} style={{ display:'flex', alignItems:'center', gap:'10px', padding:'8px 12px', backgroundColor:'#161616', borderRadius:'8px', border:'1px solid rgba(255,255,255,0.06)' }}>
                                    <Package size={14} color="#a0a0a0" />
                                    <span style={{ flex:1, fontSize:'13px', color:'#fff' }}>{file.name}</span>
                                    <span style={{ fontSize:'11px', color:'#a0a0a0' }}>{(file.size/1024/1024).toFixed(1)} MB</span>
                                    <button onClick={() => removeFile(i)} style={{ background:'none', border:'none', color:'#ef4444', cursor:'pointer', padding:'2px' }}><X size={14} /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                <button onClick={startUpload} disabled={files.length === 0 || uploading}
                    style={{ width:'100%', padding:'13px', backgroundColor: files.length === 0 ? '#2a2a2a' : '#e0195a', border:'none', borderRadius:'10px',
                        color: files.length === 0 ? '#666' : '#fff', fontSize:'15px', fontWeight:600, cursor: files.length === 0 ? 'not-allowed' : 'pointer',
                        display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', transition:'all 0.2s' }}>
                    {uploading ? <Loader2 size={18} style={{ animation:'spin 1s linear infinite' }} /> : <Upload size={18} />}
                    {uploading ? 'Загрузка...' : `Загрузить ${files.length > 0 ? `${files.length} мод(ов)` : ''}`}
                </button>
            </div>
        </div>
        </Portal>
    );
}

// ===== ПЛАВАЮЩАЯ ПАНЕЛЬ РЕЗУЛЬТАТА =====
function UploadProgressPanel({ result, onClose }: { result: { items: BatchItem[]; total: number; completed: number; failed: number }; onClose: () => void }) {
    const [minimized, setMinimized] = useState(false);
    const { items, total, completed, failed } = result;
    const percent = total > 0 ? ((completed + failed) / total) * 100 : 0;

    return (
        <Portal>
        <div style={{ position:'fixed', bottom:'24px', right:'24px', zIndex:9999, width: minimized ? 'auto' : '380px', maxWidth:'calc(100vw - 48px)',
            backgroundColor:'#111', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'16px', boxShadow:'0 8px 32px rgba(0,0,0,0.6)', animation:'fadeInUp 0.3s ease', overflow:'hidden' }}>
            <div onClick={() => setMinimized(!minimized)} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 16px', borderBottom: minimized ? 'none' : '1px solid rgba(255,255,255,0.06)', cursor:'pointer' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                    <CheckCircle2 size={18} color="#22c55e" />
                    <span style={{ fontSize:'14px', fontWeight:600, color:'#fff' }}>Загрузка завершена</span>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                    {!minimized && <span style={{ fontSize:'12px', color:'#a0a0a0' }}>{completed+failed}/{total}</span>}
                    <button onClick={(e) => { e.stopPropagation(); onClose(); }} style={{ background:'none', border:'none', color:'#a0a0a0', cursor:'pointer', padding:'2px' }}><X size={16} /></button>
                </div>
            </div>
            {!minimized && (
                <>
                    <div style={{ padding:'0 16px 12px' }}>
                        <div style={{ height:'4px', backgroundColor:'#222', borderRadius:'2px', overflow:'hidden' }}>
                            <div style={{ height:'100%', width:`${percent}%`, backgroundColor: failed > 0 ? '#f59e0b' : '#22c55e', borderRadius:'2px', transition:'width 0.3s ease' }} />
                        </div>
                    </div>
                    <div style={{ maxHeight:'220px', overflow:'auto', padding:'0 16px 12px', display:'flex', flexDirection:'column', gap:'4px' }}>
                        {items.map((item, i) => (
                            <div key={i} style={{ display:'flex', alignItems:'center', gap:'8px', padding:'6px 8px', borderRadius:'6px', backgroundColor: item.status === 'success' ? 'rgba(34,197,94,0.06)' : item.status === 'error' ? 'rgba(239,68,68,0.06)' : 'transparent', fontSize:'12px' }}>
                                {item.status === 'success' ? <CheckCircle2 size={12} color="#22c55e" /> : <AlertCircle size={12} color="#ef4444" />}
                                <span style={{ flex:1, color: item.status === 'success' ? '#22c55e' : '#ef4444', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{item.name}</span>
                                {item.status === 'success' ? <span style={{ color:'#22c55e' }}>✓</span> : <span style={{ color:'#ef4444' }}>✗ {item.error}</span>}
                            </div>
                        ))}
                    </div>
                </>
            )}
            {minimized && (
                <div style={{ padding:'0 16px 12px', fontSize:'12px', color:'#a0a0a0' }}>
                    {completed+failed}/{total} · {failed > 0 ? `${failed} ошибок` : 'все успешно'}
                </div>
            )}
        </div>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </Portal>
    );
}

// ===== ФОРМА ДОБАВЛЕНИЯ/РЕДАКТИРОВАНИЯ ОДНОГО МОДА =====
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
        if (!title) { alert('Название обязательно'); return; }
        if (!file && !item) { alert('Файл обязателен'); return; }
        setIsSubmitting(true);
        try {
            const { uploadMod } = await import('../../lib/api');
            await uploadMod({ title, description, file: file || undefined, version, category });
            onSuccess();
        } catch (error) {
            const axiosError = error as { response?: { data?: { message?: string } } };
            alert(axiosError?.response?.data?.message || 'Ошибка при загрузке мода');
        } finally { setIsSubmitting(false); }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault(); setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && (droppedFile.name.endsWith('.jar') || droppedFile.name.endsWith('.zip'))) setFile(droppedFile);
        else alert('Пожалуйста, перетащите файл .jar или .zip');
    };

    return (
        <Portal>
        <div style={{ position:'fixed', inset:0, backgroundColor:'rgba(0,0,0,0.7)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, backdropFilter:'blur(4px)' }}>
            <div style={{ backgroundColor:'#1a1a1a', border:'1px solid var(--border)', borderRadius:'20px', padding:'32px', width:'100%', maxWidth:'500px', maxHeight:'90vh', overflow:'auto', animation:'fadeInUp 0.25s ease' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px' }}>
                    <h2 style={{ fontSize:'24px', fontWeight:700 }}>{item ? 'Редактировать мод' : 'Добавить мод'}</h2>
                    <button onClick={onClose} style={{ background:'none', border:'none', color:'#a0a0a0', cursor:'pointer' }}><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom:'20px' }}>
                        <label style={{ display:'block', marginBottom:'8px', fontSize:'14px', fontWeight:600 }}>Название мода *</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Например: OptiFine"
                            style={{ width:'100%', padding:'12px', borderRadius:'10px', border:'1px solid var(--border)', backgroundColor:'#111', color:'var(--text-primary)', fontSize:'14px' }} required />
                    </div>
                    <div style={{ marginBottom:'20px' }}>
                        <label style={{ display:'block', marginBottom:'8px', fontSize:'14px', fontWeight:600 }}>Описание</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Описание мода..." rows={3}
                            style={{ width:'100%', padding:'12px', borderRadius:'10px', border:'1px solid var(--border)', backgroundColor:'#111', color:'var(--text-primary)', fontSize:'14px', resize:'vertical' }} />
                    </div>
                    <div style={{ marginBottom:'20px' }}>
                        <label style={{ display:'block', marginBottom:'8px', fontSize:'14px', fontWeight:600 }}>Версия</label>
                        <input type="text" value={version} onChange={e => setVersion(e.target.value)} placeholder="1.0"
                            style={{ width:'100%', padding:'12px', borderRadius:'10px', border:'1px solid var(--border)', backgroundColor:'#111', color:'var(--text-primary)', fontSize:'14px' }} />
                    </div>
                    <div style={{ marginBottom:'20px' }}>
                        <label style={{ display:'block', marginBottom:'8px', fontSize:'14px', fontWeight:600 }}>Категория</label>
                        <select value={category} onChange={e => setCategory(e.target.value as ModCategory)} title="Категория мода"
                            style={{ width:'100%', padding:'12px', borderRadius:'10px', border:'1px solid var(--border)', backgroundColor:'#111', color:'var(--text-primary)', fontSize:'14px' }}>
                            {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (<option key={key} value={key}>{config.label}</option>))}
                        </select>
                    </div>
                    <div style={{ marginBottom:'24px' }}>
                        <label style={{ display:'block', marginBottom:'8px', fontSize:'14px', fontWeight:600 }}>Файл мода (.jar, .zip) {!item && '*'}</label>
                        <div onDrop={handleDrop} onDragOver={e => { e.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)}
                            onClick={() => document.getElementById('mod-file-input')?.click()}
                            style={{ border:`2px dashed ${isDragging ? 'var(--accent)' : 'var(--border)'}`, borderRadius:'12px', padding:'32px', textAlign:'center', backgroundColor: isDragging ? 'rgba(224,25,90,0.05)' : '#111', transition:'all 0.2s', cursor:'pointer' }}>
                            {file ? (<div><Package size={32} color="var(--accent)" style={{ marginBottom:'8px' }} /><p style={{ fontSize:'14px', fontWeight:600, marginBottom:'4px' }}>{file.name}</p><p style={{ fontSize:'12px', color:'var(--text-secondary)' }}>{(file.size/1024/1024).toFixed(2)} MB</p>
                                <button type="button" onClick={(e) => { e.stopPropagation(); setFile(null); }} style={{ marginTop:'8px', padding:'4px 12px', backgroundColor:'transparent', border:'1px solid #ef4444', color:'#ef4444', borderRadius:'6px', fontSize:'12px', cursor:'pointer' }}>Удалить файл</button></div>
                            ) : (<div><Download size={32} color="var(--text-secondary)" style={{ marginBottom:'12px' }} /><p style={{ fontSize:'14px', color:'var(--text-secondary)', marginBottom:'4px' }}>Перетащите файл сюда или кликните для выбора</p>
                                <p style={{ fontSize:'12px', color:'var(--text-secondary)', opacity:0.7 }}>Поддерживаются файлы .jar и .zip</p></div>)}
                        </div>
                        <input id="mod-file-input" type="file" accept=".jar,.zip" onChange={e => setFile(e.target.files?.[0] || null)} title="Выбрать файл мода" style={{ display:'none' }} />
                    </div>
                    <div style={{ display:'flex', gap:'12px', justifyContent:'flex-end' }}>
                        <button type="button" onClick={onClose} style={{ padding:'12px 24px', borderRadius:'10px', border:'1px solid var(--border)', backgroundColor:'transparent', color:'var(--text-secondary)', fontSize:'14px', fontWeight:600, cursor:'pointer' }}>Отмена</button>
                        <button type="submit" disabled={isSubmitting} style={{ padding:'12px 24px', borderRadius:'10px', border:'none', backgroundColor:'var(--accent)', color:'#fff', fontSize:'14px', fontWeight:600, cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.7 : 1 }}>{isSubmitting ? 'Загрузка...' : 'Сохранить'}</button>
                    </div>
                </form>
            </div>
        </div>
        </Portal>
    );
}