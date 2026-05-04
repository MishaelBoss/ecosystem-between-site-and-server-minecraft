'use client';
import { useState, useEffect } from 'react';
import { Users, Wifi, Server, Globe } from 'lucide-react';

interface ServerData {
  online: boolean;
  players: { online: number; max: number; list: string[] };
  version: string;
  motd: string;
  ping: number;
  tps: number;
  map: string;
  mode: string;
  ip: string;
}

const MOCK_SERVER: ServerData = {
  online: true,
  players: { online: 0, max: 10, list: ['Steve', 'Alex', 'Notch', 'Herobrine', 'xXx_Killer', 'DiamondMiner99', 'CraftQueen'] },
  version: 'Java 1.21.1',
  motd: 'Лучший Minecraft сервер рунета ✨',
  ping: 0,
  tps: 0,
  map: 'Survival',
  mode: 'Выживание',
  ip: '---------',
};

export default function ServerStatus() {
  const [data, setData] = useState<ServerData | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setData(MOCK_SERVER), 400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1);
      setData(prev => prev ? {
        ...prev,
        players: {
          ...prev.players,
          online: Math.max(1, prev.players.online + Math.floor(Math.random() * 3) - 1),
        },
        ping: Math.max(8, prev.ping + Math.floor(Math.random() * 5) - 2),
      } : prev);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!data) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{
            height: '90px',
            backgroundColor: 'var(--bg-card)',
            borderRadius: '12px',
            border: '1px solid var(--border)',
            backgroundImage: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.03) 50%, transparent 100%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
          }} />
        ))}
      </div>
    );
  }

  const cards = [
    {
      icon: <Users size={20} color="var(--accent)" />,
      label: 'Игроков онлайн',
      value: `${data.players.online} / ${data.players.max}`,
      sub: data.online ? (
        <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#22c55e', fontSize: '12px' }}>
          <span className="online-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block' }} />
          Сервер онлайн
        </span>
      ) : (
        <span style={{ color: '#ef4444', fontSize: '12px' }}>Сервер оффлайн</span>
      ),
    },
    {
      icon: <Server size={20} color="#818cf8" />,
      label: 'Версия',
      value: data.version,
      sub: <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{data.mode}</span>,
    },
    {
      icon: <Wifi size={20} color="#fb923c" />,
      label: 'Пинг',
      value: `${data.ping} ms`,
      sub: <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>TPS: {data.tps.toFixed(1)}</span>,
    },
    {
      icon: <Globe size={20} color="#34d399" />,
      label: 'IP адрес',
      value: data.ip,
      sub: <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{data.map}</span>,
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
