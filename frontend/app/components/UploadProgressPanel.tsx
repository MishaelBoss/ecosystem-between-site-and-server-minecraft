'use client';
import { useState } from 'react';
import { X, CheckCircle2, AlertCircle } from 'lucide-react';
import Portal from './Portal';
import { useModUpload } from '../context/ModUploadContext';
import type { BatchItem } from '../context/ModUploadContext';

export default function UploadProgressPanelGlobal() {
    const { result, dismissResult, isUploading } = useModUpload();
    const [minimized, setMinimized] = useState(false);

    if (!result && !isUploading) return null;

    const items: BatchItem[] = result?.items || [];
    const total = result?.total || 0;
    const completed = result?.completed || 0;
    const failed = result?.failed || 0;
    const percent = total > 0 ? ((completed + failed) / total) * 100 : 0;

    return (
        <Portal>
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 9999,
            width: minimized ? '280px' : '380px',
            maxHeight: minimized ? 'auto' : '500px',
            backgroundColor: '#1a1a1a',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
        }}>
            <div
                onClick={() => setMinimized(!minimized)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    cursor: 'pointer',
                    borderBottom: minimized ? 'none' : '1px solid rgba(255,255,255,0.06)',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {isUploading ? (
                        <div style={{ width: '16px', height: '16px', border: '2px solid #e0195a', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    ) : (
                        <CheckCircle2 size={16} color={failed > 0 ? '#e0195a' : '#22c55e'} />
                    )}
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>
                        {isUploading ? 'Загрузка...' : 'Загрузка завершена'}
                    </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {!minimized && <span style={{ fontSize: '12px', color: '#a0a0a0' }}>{completed + failed}/{total}</span>}
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); dismissResult(); }}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#a0a0a0',
                            cursor: 'pointer',
                            padding: '2px',
                            display: 'flex',
                        }}
                        aria-label="Закрыть"
                    >
                        <X size={14} />
                    </button>
                </div>
            </div>
            {!minimized && (
                <>
                    <div style={{ padding: '0 16px' }}>
                        <div style={{ height: '4px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
                            <div style={{
                                height: '100%',
                                width: `${percent}%`,
                                backgroundColor: failed > 0 && completed === total ? '#e0195a' : '#22c55e',
                                borderRadius: '2px',
                                transition: 'width 0.3s ease',
                            }} />
                        </div>
                    </div>
                    <div style={{ maxHeight: '300px', overflowY: 'auto', padding: '8px 16px 12px' }}>
                        {items.map((item, i) => (
                            <div key={i} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '4px 0',
                                fontSize: '12px',
                                color: item.status === 'success' ? '#22c55e' : item.status === 'error' ? '#ef4444' : '#a0a0a0',
                                opacity: item.status === 'waiting' ? 0.5 : 1,
                            }}>
                                {item.status === 'success' ? <CheckCircle2 size={12} /> : item.status === 'error' ? <AlertCircle size={12} /> : <div style={{ width: '12px', height: '12px', borderRadius: '50%', border: '2px solid #a0a0a0' }} />}
                                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</span>
                                {item.status === 'success' && <span style={{ color: '#22c55e' }}>✓</span>}
                                {item.status === 'error' && <span style={{ color: '#ef4444', fontSize: '11px' }}>{item.error || '✗'}</span>}
                            </div>
                        ))}
                    </div>
                </>
            )}
            {minimized && (
                <div style={{ padding: '8px 16px 12px', fontSize: '12px', color: '#a0a0a0' }}>
                    {completed + failed}/{total} · {failed > 0 ? `${failed} ошибок` : 'все успешно'}
                </div>
            )}
        </div>
        </Portal>
    );
}