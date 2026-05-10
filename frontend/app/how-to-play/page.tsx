'use client';
import Link from 'next/link';
import { Download, Play, Monitor, Package, ChevronLeft, HardDrive } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getModList, registerModDownload } from '../lib/api';
import { IModItem } from '../types/mod.interface';

export default function HowToPlayPage() {
    const [mods, setMods] = useState<IModItem[]>([]);

    useEffect(() => {
        const fetchMods = async () => {
            const data = await getModList();
            setMods(data);
        };
        fetchMods();
    }, []);

    const handleDownload = async (mod: IModItem) => {
        await registerModDownload(mod.id);
        setMods(prevMods => prevMods.map(m => 
            m.id === mod.id ? { ...m, downloads: m.downloads + 1 } : m
        ));
    };

    const steps = [
        {
            icon: <Monitor size={32} />,
            title: 'Установите Minecraft Java Edition',
            description: 'Купите и установите официальную версию Minecraft Java Edition с сайта minecraft.net.',
            color: '#3b82f6'
        },
        {
            icon: <Package size={32} />,
            title: 'Установите NeoForge',
            description: 'Скачайте NeoForge с сайта neoforged.net и выберите версию 1.21.1. Убедитесь, что выбран пункт "Client" и нажмите "Далее". После установки перезапустите лаунчер.',
            color: '#ef4444'
        },
        {
            icon: <Download size={32} />,
            title: 'Скачайте нашу сборку модов',
            description: 'Загрузите готовую сборку модов с нашего сайта. Все моды уже настроены и совместимы друг с другом.',
            color: '#22c55e'
        },
        {
            icon: <Play size={32} />,
            title: 'Подключайтесь к серверу',
            description: 'Запустите Minecraft с профилем NeoForge 1.21.1 и подключитесь к нашему серверу по указанному IP адресу.',
            color: '#a855f7'
        }
    ];

    return (
        <main>
            {/* Hero Section */}
            <section style={{ 
                position: 'relative', 
                minHeight: '60vh', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                overflow: 'hidden', 
                textAlign: 'center', 
                padding: '80px 24px' 
            }}>
                <div style={{ 
                    position: 'absolute', 
                    inset: 0, 
                    background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(224,25,90,0.15) 0%, transparent 70%)', 
                    pointerEvents: 'none' 
                }} />
                
                <div style={{ position: 'relative', maxWidth: '800px' }}>
                    <Link href="/" style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        color: 'var(--text-secondary)', 
                        textDecoration: 'none', 
                        fontSize: '14px', 
                        marginBottom: '24px' 
                    }}>
                        <ChevronLeft size={16} /> На главную
                    </Link>
                    
                    <h1 style={{ 
                        fontSize: 'clamp(36px, 7vw, 64px)', 
                        fontWeight: 900, 
                        lineHeight: 1.1, 
                        marginBottom: '20px', 
                        letterSpacing: '-2px' 
                    }}>
                        Как начать играть
                    </h1>
                    
                    <p style={{ 
                        fontSize: '18px', 
                        color: '#a0a0a0', 
                        lineHeight: 1.7, 
                        maxWidth: '600px', 
                        margin: '0 auto' 
                    }}>
                        Простое руководство по установке модов и подключению к нашему серверу Minecraft
                    </p>
                </div>
            </section>

            {/* Steps Section */}
            <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px 80px' }}>
                <div style={{ marginBottom: '48px' }}>
                    <p style={{ color: '#e0195a', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
                        РУКОВОДСТВО
                    </p>
                    <h2 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 900, letterSpacing: '-1px' }}>
                        4 простых шага
                    </h2>
                </div>

                <div style={{ display: 'grid', gap: '24px' }}>
                    {steps.map((step, index) => (
                        <div 
                            key={index}
                            style={{
                                display: 'flex',
                                gap: '24px',
                                padding: '32px',
                                backgroundColor: '#161616',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '20px',
                                transition: 'all 0.25s',
                                alignItems: 'flex-start'
                            }}
                            onMouseEnter={e => {
                                const el = e.currentTarget;
                                el.style.borderColor = 'rgba(224,25,90,0.3)';
                                el.style.transform = 'translateX(8px)';
                            }}
                            onMouseLeave={e => {
                                const el = e.currentTarget;
                                el.style.borderColor = 'rgba(255,255,255,0.08)';
                                el.style.transform = 'translateX(0)';
                            }}
                        >
                            <div style={{
                                minWidth: '80px',
                                height: '80px',
                                borderRadius: '16px',
                                backgroundColor: `${step.color}15`,
                                border: `1px solid ${step.color}30`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: step.color
                            }}>
                                {step.icon}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ 
                                    display: 'inline-flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    width: '28px', 
                                    height: '28px', 
                                    borderRadius: '50%', 
                                    backgroundColor: step.color,
                                    color: '#fff',
                                    fontSize: '14px',
                                    fontWeight: 700,
                                    marginBottom: '12px'
                                }}>
                                    {index + 1}
                                </div>
                                <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>
                                    {step.title}
                                </h3>
                                <p style={{ color: '#a0a0a0', fontSize: '15px', lineHeight: 1.7, maxWidth: '600px' }}>
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Download Mods Section */}
            <section style={{ backgroundColor: '#111111', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '60px 24px' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
                        <div>
                            <p style={{ color: '#e0195a', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
                                СБОРКА МОДОВ
                            </p>
                            <h2 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 900, letterSpacing: '-1px' }}>
                                Доступные моды
                            </h2>
                        </div>
                        {mods.length > 0 && (
                            <button
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '12px 24px',
                                    backgroundColor: 'var(--accent)',
                                    color: '#fff',
                                    borderRadius: '12px',
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    height: 'fit-content'
                                }}
                                onClick={async () => {
                                    try {
                                        const response = await fetch('http://localhost:8000/api/mods/download-all/', {
                                            credentials: 'include'
                                        });
                                        if (!response.ok) throw new Error('Failed to download');
                                        const blob = await response.blob();
                                        const url = window.URL.createObjectURL(blob);
                                        const link = document.createElement('a');
                                        link.href = url;
                                        link.download = 'all-mods.zip';
                                        link.click();
                                        window.URL.revokeObjectURL(url);
                                    } catch (error) {
                                        console.error('Download failed:', error);
                                        alert('Ошибка при скачивании архива модов');
                                    }
                                }}
                            >
                                <Download size={16} /> Скачать все моды ({mods.length})
                            </button>
                        )}
                    </div>

                    {mods.length === 0 ? (
                        <div style={{ 
                            textAlign: 'center', 
                            padding: '60px', 
                            color: 'var(--text-secondary)',
                            backgroundColor: '#161616',
                            borderRadius: '20px',
                            border: '1px solid rgba(255,255,255,0.08)'
                        }}>
                            <Package size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                            <p>Моды скоро будут добавлены</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                            {mods.map((mod) => (
                                <div 
                                    key={mod.id}
                                    style={{
                                        padding: '24px',
                                        backgroundColor: '#161616',
                                        border: '1px solid rgba(255,255,255,0.08)',
                                        borderRadius: '16px',
                                        transition: 'all 0.25s'
                                    }}
                                    onMouseEnter={e => {
                                        const el = e.currentTarget;
                                        el.style.borderColor = 'rgba(224,25,90,0.3)';
                                        el.style.transform = 'translateY(-4px)';
                                    }}
                                    onMouseLeave={e => {
                                        const el = e.currentTarget;
                                        el.style.borderColor = 'rgba(255,255,255,0.08)';
                                        el.style.transform = 'translateY(0)';
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                                        <div style={{
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: '12px',
                                            backgroundColor: '#222',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0,
                                            minWidth: '48px'
                                        }}>
                                            <Package size={24} color="#666" />
                                        </div>
                                        <div style={{ minWidth: 0 }}>
                                            <h4 style={{ fontSize: '16px', fontWeight: 700, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{mod.title}</h4>
                                            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>v{mod.version}</span>
                                        </div>
                                    </div>
                                    <p style={{ fontSize: '14px', color: '#a0a0a0', marginBottom: '16px', lineHeight: 1.5 }}>
                                        {mod.description || 'Мод для улучшения игрового опыта'}
                                    </p>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                                            <HardDrive size={14} />
                                            <span>{mod.downloads} скачиваний</span>
                                        </div>
                                        <a 
                                            href={mod.file_url}
                                            download
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                padding: '8px 16px',
                                                backgroundColor: 'var(--accent)',
                                                color: '#fff',
                                                borderRadius: '8px',
                                                fontSize: '13px',
                                                fontWeight: 600,
                                                textDecoration: 'none',
                                                transition: 'all 0.2s'
                                            }}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleDownload(mod);
                                                const link = document.createElement('a');
                                                link.href = mod.file_url;
                                                link.download = mod.title;
                                                link.click();
                                            }}
                                        >
                                            <Download size={14} /> Скачать
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Server Info Section */}
            <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '80px 24px' }}>
                <div style={{ 
                    backgroundColor: '#161616', 
                    border: '1px solid rgba(224,25,90,0.3)', 
                    borderRadius: '24px', 
                    padding: '48px', 
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{ 
                        position: 'absolute', 
                        inset: 0, 
                        background: 'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(224,25,90,0.08) 0%, transparent 70%)', 
                        pointerEvents: 'none' 
                    }} />
                    
                    <div style={{ position: 'relative' }}>
                        <h2 style={{ fontSize: '32px', fontWeight: 900, marginBottom: '16px' }}>
                            Готовы начать?
                        </h2>
                        <p style={{ color: '#a0a0a0', fontSize: '16px', marginBottom: '32px', maxWidth: '500px', margin: '0 auto' }}>
                            Установите моды и подключайтесь к нашему серверу прямо сейчас!
                        </p>
                        
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
                            <Link 
                                href="/"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '14px 28px',
                                    backgroundColor: 'var(--accent)',
                                    color: '#fff',
                                    borderRadius: '12px',
                                    fontSize: '15px',
                                    fontWeight: 600,
                                    textDecoration: 'none',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <Play size={18} /> На главную
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

        </main>
    );
}