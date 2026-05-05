'use client';
import Link from 'next/link';
import { ChevronLeft, Sparkles } from 'lucide-react';

export default function ShopPage() {
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
                        Магазин
                    </h1>
                    
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        backgroundColor: 'rgba(224,25,90,0.1)',
                        border: '1px solid rgba(224,25,90,0.3)',
                        borderRadius: '20px',
                        padding: '8px 20px',
                        fontSize: '14px',
                        color: '#e0195a',
                        marginBottom: '24px'
                    }}>
                        <Sparkles size={16} />
                        Скоро открытие
                    </div>
                    
                    <p style={{ 
                        fontSize: '18px', 
                        color: '#a0a0a0', 
                        lineHeight: 1.7, 
                        maxWidth: '500px', 
                        margin: '0 auto' 
                    }}>
                        В нашем магазине вы сможете приобрести уникальные привилегии, 
                        внутриигровую валюту и эксклюзивные предметы. Следите за новостями!
                    </p>
                </div>
            </section>

            {/* Footer is now in layout.tsx */}
        </main>
    );
}