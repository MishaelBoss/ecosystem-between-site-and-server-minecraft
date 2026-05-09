"use client";
import Link from 'next/link';
import ServerStatus from './components/ServerStatus';
import { useServerStatus } from './context/ServerStatusContext';
import { Download } from 'lucide-react';

export default function Home() {
  const { data, isLoading } = useServerStatus();

  const features = [
    { icon: '🛡️', title: 'Anti-DDoS защита', desc: 'Защита уровня L3-L7, отражающая атаки до 1 Тбит/с. Играйте без лагов и отключений.' },
    { icon: '⚡', title: 'Производительность', desc: 'Серверы на NVMe SSD с 10 Гбит/с каналом. TPS всегда на уровне 20.' },
    { icon: '🕐', title: 'Работа 24/7', desc: 'Гарантированный аптайм 99.9%. Автоматические бекапы каждые 6 часов.' },
    { icon: '⚙️', title: 'Гибкие режимы', desc: 'Выживание, творчество, скайблок, мини-игры — выбирай что нравится.' },
    { icon: '🖥️', title: 'Удобная панель', desc: 'Личный кабинет с управлением профилем, статистикой и покупками.' },
    { icon: '🎧', title: 'Поддержка', desc: 'Живая поддержка 24/7 в Discord и на сайте. Ответим за 10 минут.' },
  ];

  const stats = [
    { value: data?.players !== undefined ? `${data.players} / ${data.maxPlayers}` : '...', label: 'Игроков онлайн' },
    { value: data?.days_online !== undefined ? `${data.days_online}` : '...', label: 'Дней в работе' },
    { value: data?.uptime || '99.9%', label: 'Аптайм сервера' },
    { value: data?.latency !== undefined ? `< ${data.latency}ms` : '...', label: 'Средний пинг' },
  ];

  return (
    <main>
      <section style={{ position: 'relative', minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', textAlign: 'center', padding: '80px 24px' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(224,25,90,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', maxWidth: '800px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(224,25,90,0.1)', border: '1px solid rgba(224,25,90,0.3)', borderRadius: '20px', padding: '6px 16px', fontSize: '13px', color: '#e0195a', marginBottom: '28px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block', animation: 'blink 2s ease infinite' }} />
            Сервер онлайн — присоединяйся!
          </div>

          <h1 style={{ fontSize: 'clamp(36px, 7vw, 72px)', fontWeight: 900, lineHeight: 1.1, marginBottom: '20px', letterSpacing: '-2px' }}>
            Лучший{' '}
            <span style={{ background: 'linear-gradient(90deg, #e0195a, #ff6b9d)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Minecraft</span>
            {' '}сервер
          </h1>

          <p style={{ fontSize: '18px', color: '#a0a0a0', lineHeight: 1.7, maxWidth: '560px', margin: '0 auto 40px' }}>
            Выживание, творчество, мини-игры — всё в одном месте. Заходи и начинай приключение прямо сейчас.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {isLoading ? (
              <div style={{ 
                height: '44px', 
                width: '200px',
                backgroundColor: '#161616', 
                border: '1px solid rgba(255,255,255,0.08)', 
                borderRadius: '10px',
                animation: 'shimmer 1.5s infinite'
              }} />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#161616', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '12px 20px', fontSize: '15px', fontWeight: 600, color: '#a0a0a0', fontFamily: 'monospace' }}>
                {data?.ip || 'сервер не доступен'}
              </div>
            )}
            <Link href="/news" style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#e0195a', borderRadius: '10px', padding: '12px 24px', fontSize: '15px', fontWeight: 600, color: '#fff', textDecoration: 'none' }}>
              Новости сервера →
            </Link>
            <a 
              href="http://localhost:8000/api/mods/download-all/" 
              download
              style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', padding: '12px 20px', fontSize: '14px', fontWeight: 500, color: '#a0a0a0', textDecoration: 'none', transition: 'all 0.25s' }}
              onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = 'rgba(224,25,90,0.4)'; el.style.color = '#fff'; }}
              onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = 'rgba(255,255,255,0.15)'; el.style.color = '#a0a0a0'; }}
            >
              <Download size={16} /> Скачать моды
            </a>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ marginBottom: '40px' }}>
          <p style={{ color: '#e0195a', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>СТАТУС СЕРВЕРА</p>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 900, letterSpacing: '-1px' }}>Текущее состояние</h2>
        </div>
        <ServerStatus />
      </section>

      <section style={{ backgroundColor: '#111111', borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '48px 24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '40px', textAlign: 'center' }}>
          {stats.map((s, i) => (
            <div key={i}>
              <p style={{ fontSize: '36px', fontWeight: 900, color: '#e0195a', letterSpacing: '-1px' }}>{s.value}</p>
              <p style={{ color: '#a0a0a0', fontSize: '13px', marginTop: '4px' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ marginBottom: '40px' }}>
          <p style={{ color: '#e0195a', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>ПРЕИМУЩЕСТВА</p>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 900, letterSpacing: '-1px' }}>Почему выбирают нас</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          {features.map((f, i) => (
            <div key={i} style={{ backgroundColor: '#161616', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '28px', transition: 'all 0.25s' }}
              onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = 'rgba(224,25,90,0.3)'; el.style.transform = 'translateY(-4px)'; }}
              onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = 'rgba(255,255,255,0.08)'; el.style.transform = 'translateY(0)'; }}
            >
              <div style={{ fontSize: '28px', marginBottom: '16px' }}>{f.icon}</div>
              <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '8px' }}>{f.title}</h3>
              <p style={{ color: '#a0a0a0', fontSize: '14px', lineHeight: 1.7 }}>{f.desc}</p>
              <p style={{ color: '#e0195a', fontSize: '13px', marginTop: '20px' }}>→ подробнее</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px 100px' }}>
        <div style={{ backgroundColor: '#161616', border: '1px solid rgba(224,25,90,0.3)', borderRadius: '20px', padding: '60px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(224,25,90,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <h2 style={{ fontSize: '36px', fontWeight: 900, marginBottom: '12px', letterSpacing: '-1px', position: 'relative' }}>Готов к приключению?</h2>
          <p style={{ color: '#a0a0a0', fontSize: '16px', marginBottom: '32px', position: 'relative' }}>Подключайся прямо сейчас — регистрация занимает 1 минуту</p>
          {isLoading ? (
            <div style={{ 
              height: '52px', 
              width: '250px',
              backgroundColor: '#111', 
              border: '1px solid rgba(255,255,255,0.08)', 
              borderRadius: '10px',
              animation: 'shimmer 1.5s infinite'
            }} />
          ) : (
            <div style={{ fontFamily: 'monospace', fontSize: '20px', fontWeight: 700, padding: '14px 28px', backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', display: 'inline-block', position: 'relative' }}>
              {data?.ip || 'сервер не доступен'}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
