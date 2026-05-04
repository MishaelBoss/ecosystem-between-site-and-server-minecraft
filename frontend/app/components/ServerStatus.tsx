'use client';
import { Users, Wifi, Server, Globe } from 'lucide-react';
import { useServerStatus } from '../context/ServerStatusContext';

export default function ServerStatus() {
  const { data, error } = useServerStatus();

  if (!data && !error) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{
            height: '120px',
            backgroundColor: 'var(--bg-card)',
            borderRadius: '12px',
            border: '1px solid var(--border)',
            animation: 'shimmer 1.5s infinite',
          }} />
        ))}
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '24px' }}>
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '16px 24px',
          color: '#ef4444',
          fontWeight: 600,
          fontSize: '16px',
        }}>
          🔴 Сервер оффлайн или временно недоступен
        </div>
      </div>
    );
  }

  const cards = [
    {
      icon: <Users size={20} color="var(--accent)" />,
      label: 'Игроков онлайн',
      value: `${data.players} / ${data.maxPlayers}`,
      sub: (
        <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#22c55e', fontSize: '12px' }}>
          <span className="online-dot" />
          Сервер онлайн
        </span>
      ),
    },
    {
      icon: <Server size={20} color="#818cf8" />,
      label: 'Версия',
      value: data.version,
      sub: (
        <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
          {data.motd}
        </span>
      ),
    },
    {
      icon: <Wifi size={20} color="#fb923c" />,
      label: 'Пинг',
      value: `${data.latency} ms`,
      sub: (
        <span style={{ 
          color: data.tps >= 19.5 ? '#22c55e' : data.tps >= 15 ? '#f59e0b' : '#ef4444',
          fontSize: '12px' 
        }}>
          TPS: {data.tps !== undefined ? data.tps.toFixed(1) : '20.0'}
        </span>
      ),
    },
    {
      icon: <Globe size={20} color="#34d399" />,
      label: 'IP адрес',
      value: data.ip,
      sub: (
        <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
          {data.mode}
        </span>
      ),
    },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
      {cards.map((card, i) => (
        <div key={i} style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '20px',
          transition: 'border-color 0.2s, transform 0.2s',
          cursor: 'default',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget;
          el.style.borderColor = 'var(--border-accent)';
          el.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={e => {
          const el = e.currentTarget;
          el.style.borderColor = 'var(--border)';
          el.style.transform = 'translateY(0)';
        }}
        >
          <div style={{ marginBottom: '12px' }}>{card.icon}</div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {card.label}
          </p>
          <p style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px', color: 'var(--text-primary)' }}>
            {card.value}
          </p>
          {card.sub}
        </div>
      ))}
    </div>
  );
}