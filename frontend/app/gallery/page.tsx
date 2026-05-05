'use client';

import { useEffect, useState } from 'react';
import { X, ZoomIn, Coins, CheckCircle2, Clock, XCircle, ImagePlus, Trophy, Star, Filter } from 'lucide-react';
import UploadImageModel from './_components/UploadImageModel';
import { useAuth } from '../context/AuthContext';
import { getGalleryList } from '../lib/api';
import { GalleryStatus, IGalleryItem } from '../types/gallery.interface';
import Image from 'next/image';

const STATUS_CONFIG: Record<GalleryStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  approved: { label: 'Одобрено', color: '#22c55e', bg: 'rgba(34,197,94,0.1)', icon: <CheckCircle2 size={12} /> },
  pending:  { label: 'На проверке', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', icon: <Clock size={12} /> },
  rejected: { label: 'Отклонено', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', icon: <XCircle size={12} /> },
};

const FILTERS: { value: GalleryStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Все' },
  { value: 'approved', label: 'Одобренные' },
  { value: 'pending', label: 'На проверке' },
  { value: 'rejected', label: 'Отклонённые' },
];

export default function GalleryPage() {
  const { user } = useAuth();

  const [items, setItems] = useState<IGalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<GalleryStatus | 'all'>('all');
  const [lightbox, setLightbox] = useState<IGalleryItem | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await getGalleryList();

        setItems(res.data || res);
      } catch (err) {
        console.error('Ошибка загрузки галереи', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const filtered = filter === 'all' ? items : items.filter(i => i.status === filter);

  const totalCoins = items.filter(i => i.status === 'approved').reduce((s, i) => s + (i.coins || 0), 0);
  const approvedCount = items.filter(i => i.status === 'approved').length;
  const pendingCount = items.filter(i => i.status === 'pending').length;

  if (loading) {
    return (
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '60px 24px 100px', textAlign: 'center' }}>
        <p style={{ color: '#a0a0a0' }}>Загрузка галереи...</p>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '60px 24px 100px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', marginBottom: '48px' }}>
        <div>
          <p style={{ color: '#e0195a', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>ГАЛЕРЕЯ</p>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 900, letterSpacing: '-1.5px', marginBottom: '10px' }}>
            Скриншоты игроков
          </h1>
          <p style={{ color: '#a0a0a0', fontSize: '15px' }}>
            Делись своими постройками — получай монеты за лучшие работы
          </p>
        </div>
        {user && (
          <button
            onClick={() => setUploadOpen(true)}
            type="button"
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '12px 22px',
              backgroundColor: '#e0195a',
              border: 'none', borderRadius: '10px',
              color: '#fff', fontSize: '14px', fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.2s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#c41450')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#e0195a')}
            aria-label="Загрузить скриншот"
          >
            <ImagePlus size={16} /> Загрузить скриншот
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '40px' }}>
        {[
          { icon: <Trophy size={18} color="#f59e0b" />, value: String(approvedCount), label: 'Одобрено работ' },
          { icon: <Clock size={18} color="#f59e0b" />, value: String(pendingCount), label: 'На проверке' },
          { icon: <Coins size={18} color="#f59e0b" />, value: `${totalCoins}`, label: 'Монет выдано' },
          { icon: <Star size={18} color="#f59e0b" />, value: String(items.length), label: 'Всего загрузок' },
        ].map((s, i) => (
          <div key={i} style={{
            backgroundColor: '#161616', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px', padding: '16px 20px',
            display: 'flex', alignItems: 'center', gap: '12px',
          }}>
            <div style={{ width: '36px', height: '36px', backgroundColor: 'rgba(245,158,11,0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {s.icon}
            </div>
            <div>
              <p style={{ fontSize: '20px', fontWeight: 800, lineHeight: 1 }}>{s.value}</p>
              <p style={{ color: '#a0a0a0', fontSize: '11px', marginTop: '2px' }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px', flexWrap: 'wrap' }}>
        <Filter size={14} color="#a0a0a0" />
        {FILTERS.map(f => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            style={{
              padding: '7px 16px', borderRadius: '20px', fontSize: '13px',
              border: filter === f.value ? '1px solid #e0195a' : '1px solid rgba(255,255,255,0.08)',
              backgroundColor: filter === f.value ? 'rgba(224,25,90,0.1)' : '#161616',
              color: filter === f.value ? '#e0195a' : '#a0a0a0',
              fontWeight: filter === f.value ? 600 : 400,
              cursor: 'pointer', transition: 'all 0.2s',
            }}
            aria-label="фильтр"
          >
            {f.label}
          </button>
        ))}
        <span style={{ marginLeft: 'auto', color: '#a0a0a0', fontSize: '13px' }}>{filtered.length} работ</span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '16px',
      }}>
        {filtered.map(item => (
          <GalleryCard key={item.id} item={item} onOpen={() => setLightbox(item)} />
        ))}
      </div>

      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 200,
            backgroundColor: 'rgba(0,0,0,0.92)',
            backdropFilter: 'blur(12px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '24px',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '20px', overflow: 'hidden',
              maxWidth: '780px', width: '100%',
              animation: 'fadeInUp 0.2s ease',
            }}
          >
            <div style={{ position: 'relative', height: '340px' }}>
              <Image
                src={lightbox.image}
                alt={lightbox.title || 'Увеличенное изображение'}
                fill
                style={{ objectFit: 'cover' }}
              />
              <button
                type="button"
                onClick={() => setLightbox(null)}
                style={{
                  position: 'absolute', top: '16px', right: '16px',
                  background: 'rgba(0,0,0,0.6)', border: 'none',
                  borderRadius: '8px', padding: '8px', color: '#fff',
                  cursor: 'pointer', display: 'flex',
                }}
                aria-label="Закрыть"
              ><X size={18} /></button>
              <div style={{
                position: 'absolute', top: '16px', left: '16px',
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                backgroundColor: STATUS_CONFIG[lightbox.status].bg,
                color: STATUS_CONFIG[lightbox.status].color,
                border: `1px solid ${STATUS_CONFIG[lightbox.status].color}40`,
              }}>
                {STATUS_CONFIG[lightbox.status].icon}
                {STATUS_CONFIG[lightbox.status].label}
              </div>
            </div>

            <div style={{ padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '6px' }}>{lightbox.title}</h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#a0a0a0', fontSize: '13px' }}>
                    <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#e0195a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, color: '#fff' }}>
                      {lightbox.authorInitial || lightbox.author?.[0]?.toUpperCase() || 'U'}
                    </div>
                    {lightbox.author} · {lightbox.uploadedAt}
                  </div>
                </div>
                {lightbox.status === 'approved' && (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '8px 16px', borderRadius: '10px',
                    backgroundColor: 'rgba(245,158,11,0.1)',
                    border: '1px solid rgba(245,158,11,0.3)',
                    color: '#f59e0b', fontSize: '16px', fontWeight: 700,
                    whiteSpace: 'nowrap',
                  }}>
                    <Coins size={16} /> +{lightbox.coins}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {lightbox.tags?.map(tag => (
                  <span key={tag} style={{
                    padding: '4px 10px', borderRadius: '6px', fontSize: '12px',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: '#a0a0a0',
                  }}>#{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {uploadOpen && (
        <UploadImageModel onClose={() => setUploadOpen(false)} />
      )}
    </main>
  );
}

function GalleryCard({ item, onOpen }: { item: IGalleryItem; onOpen: () => void }) {
  const st = STATUS_CONFIG[item.status];
  return (
    <div
      onClick={onOpen}
      style={{
        backgroundColor: '#161616', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '14px', overflow: 'hidden',
        cursor: 'pointer', transition: 'all 0.25s',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget;
        el.style.borderColor = 'rgba(224,25,90,0.3)';
        el.style.transform = 'translateY(-4px)';
        el.style.boxShadow = '0 12px 40px rgba(0,0,0,0.4)';
      }}
      onMouseLeave={e => {
        const el = e.currentTarget;
        el.style.borderColor = 'rgba(255,255,255,0.08)';
        el.style.transform = 'translateY(0)';
        el.style.boxShadow = 'none';
      }}
    >
      <div style={{
        height: '180px',
        position: 'relative',
        backgroundColor: '#0a0a0a',
      }}>
        <Image
          src={item.image}
          alt={item.title || 'Увеличенное изображение'}
          fill
          style={{ objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background-color 0.2s',
        }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.4)')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0)')}
        >
          <ZoomIn size={28} color="rgba(255,255,255,0.8)" style={{ opacity: 0, transition: 'opacity 0.2s' }} />
        </div>
        <div style={{
          position: 'absolute', top: '10px', right: '10px',
          display: 'flex', alignItems: 'center', gap: '4px',
          padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600,
          backgroundColor: st.bg, color: st.color,
          border: `1px solid ${st.color}40`,
        }}>
          {st.icon} {st.label}
        </div>
      </div>

      <div style={{ padding: '16px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '8px', color: '#fff' }}>{item.title}</h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#a0a0a0', fontSize: '12px' }}>
            <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#e0195a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 700, color: '#fff' }}>
              {item.authorInitial || item.author?.[0]?.toUpperCase() || 'U'}
            </div>
            {item.author}
          </div>
          {item.status === 'approved' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b', fontSize: '12px', fontWeight: 700 }}>
              <Coins size={13} /> +{item.coins}
            </div>
          )}
        </div>

        {item.tags && item.tags.length > 0 && (
          <div style={{ display: 'flex', gap: '4px', marginTop: '10px', flexWrap: 'wrap' }}>
            {item.tags.map(tag => (
              <span key={tag} style={{
                padding: '2px 8px', borderRadius: '4px', fontSize: '11px',
                backgroundColor: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                color: '#777',
              }}>#{tag}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}