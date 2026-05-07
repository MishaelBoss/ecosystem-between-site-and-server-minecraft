'use client';

import { uploadImage } from '@/app/lib/api';
import Portal from '@/app/components/Portal';
import { IGalleryCreate } from '@/app/types/gallery.interface';
import { Upload, X, Coins } from 'lucide-react';
import { useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

interface Props {
    onClose: () => void;
    onSuccess?: () => void;
}

export default function UploadImageModel({ onClose, onSuccess }: Props) {
    const [dragging, setDragging] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const { register, handleSubmit, setValue, control, reset, formState: { isSubmitting } } = useForm<IGalleryCreate>({ 
        defaultValues: { 
            title: '', 
            image: undefined 
        },
    });

    const watchedTitle = useWatch({
        control,
        name: 'title'
    });

    const watchedImage = useWatch({
        control,
        name: 'image'
    });

    const handleFile = (file: File) => {
        if (!file.type.startsWith('image/')) return;
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setValue('image', file, { shouldValidate: true });
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    };

    const onSubmit = async (data: IGalleryCreate) => {
        if (!data.image || !data.title.trim()) return;
        setUploadSuccess(true);

        try {
            await uploadImage(data);

            setUploadSuccess(false);
            onSuccess?.();
            onClose();
            reset({
                title: '',
                image: undefined
            });
            setPreviewUrl(null);
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
            console.error(msg);
            setUploadSuccess(false);
        }
    };

    return (
        <Portal>
        <div
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}
            style={{
                position: 'fixed', inset: 0, zIndex: 200,
                backgroundColor: 'rgba(0,0,0,0.8)',
                backdropFilter: 'blur(10px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '20px',
            }}
        >
            <div style={{
                backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '20px', padding: '36px',
                width: '100%', maxWidth: '500px',
                animation: 'fadeInUp 0.25s ease', position: 'relative',
            }}>
                <button 
                    onClick={() => onClose()} 
                    type="button"
                    aria-label="закрыть"
                    style={{ 
                        position: 'absolute', 
                        top: '16px', 
                        right: '16px', 
                        background: 'none', 
                        border: 'none', 
                        color: '#a0a0a0', 
                        cursor: 'pointer', 
                        display: 'flex' }}>
                        <X size={18} />
                </button>

                <h2 
                    style={{ 
                        fontSize: '22px', 
                        fontWeight: 800, 
                        marginBottom: '6px', 
                        background: 'linear-gradient(90deg, #fff, #e0195a)',
                        WebkitBackgroundClip: 'text', 
                        WebkitTextFillColor: 'transparent' 
                    }}
                >
                    Загрузить скриншот
                </h2>

                <p style={{ color: '#a0a0a0', fontSize: '13px', marginBottom: '28px' }}>После проверки администратором вы получите монеты</p>

                <div style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    backgroundColor: 'rgba(245,158,11,0.08)',
                    border: '1px solid rgba(245,158,11,0.2)',
                    borderRadius: '10px', padding: '12px 16px', marginBottom: '20px',
                    }}
                >
                    <Coins size={16} color="#f59e0b" />
                    <span style={{ fontSize: '13px', color: '#f59e0b' }}>
                        За одобренный скриншот начисляется от <b>100</b> до <b>300</b> монет
                    </span>
                </div>

                <div
                    onDragOver={e => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileRef.current?.click()}
                    style={{
                        border: `2px dashed ${dragging ? '#e0195a' : previewUrl ? '#22c55e' : 'rgba(255,255,255,0.12)'}`,
                        borderRadius: '14px',
                        padding: '32px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        backgroundColor: dragging ? 'rgba(224,25,90,0.05)' : previewUrl ? 'rgba(34,197,94,0.05)' : 'rgba(255,255,255,0.02)',
                        marginBottom: '16px',
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    {previewUrl ? (
                        <>
                        <img src={previewUrl} alt="preview" style={{ maxHeight: '160px', maxWidth: '100%', borderRadius: '8px', objectFit: 'cover' }} />
                        <p style={{ color: '#22c55e', fontSize: '13px', marginTop: '10px', fontWeight: 600 }}>✓ Файл загружен — нажмите чтобы заменить</p>
                        </>
                    ) : (
                        <>
                        <div 
                            style={{ 
                                width: '52px', 
                                height: '52px', 
                                backgroundColor: 'rgba(255,255,255,0.04)', 
                                borderRadius: '12px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                margin: '0 auto 12px' 
                            }}
                        >
                            <Upload size={22} color="#a0a0a0" />
                        </div>
                        <p style={{ color: '#fff', fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>Перетащите скриншот сюда</p>
                        <p style={{ color: '#a0a0a0', fontSize: '12px' }}>или нажмите для выбора файла · PNG, JPG до 10 МБ</p>
                        </>
                    )}
                    <input 
                        aria-label='Выберите изображение для загрузки' 
                        ref={fileRef} 
                        type="file" 
                        accept="image/*" 
                        style={{ display: 'none' }} 
                        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} 
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ color: '#a0a0a0', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>
                        Название работы
                    </label>
                    <input
                        {...register('title')}
                        placeholder="Например: Мой замок на горе"
                        style={{
                            width: '100%', padding: '12px 14px',
                            backgroundColor: '#161616', border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '10px', color: '#fff', fontSize: '14px',
                            outline: 'none', boxSizing: 'border-box',
                        }}
                        onFocus={e => (e.target.style.borderColor = 'rgba(255,255,255,0.2)')}
                        onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
                    />
                </div>

                {uploadSuccess ? (
                    <div style={{ textAlign: 'center', padding: '14px', borderRadius: '10px', backgroundColor: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e', fontWeight: 600 }}>
                        ✓ Скриншот отправлен на проверку!
                    </div>
                ) : (
                    <button
                        onClick={handleSubmit(onSubmit)}
                        disabled={!watchedImage || !watchedTitle?.trim() || isSubmitting}
                        style={{
                            width: '100%', padding: '13px',
                            backgroundColor: !watchedImage || !watchedTitle.trim() ? '#2a2a2a' : '#e0195a',
                            border: 'none', borderRadius: '10px',
                            color: !watchedImage || !watchedTitle.trim() ? '#666' : '#fff',
                            fontSize: '15px', fontWeight: 600,
                            cursor: !watchedImage || !watchedTitle.trim() ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => { if (watchedImage && watchedTitle.trim()) e.currentTarget.style.backgroundColor = '#c41450'; }}
                        onMouseLeave={e => { if (watchedImage && watchedTitle.trim()) e.currentTarget.style.backgroundColor = '#e0195a'; }}
                    >
                        Отправить на проверку
                    </button>
                )}
            </div>
        </div>
        </Portal>
    );
}
