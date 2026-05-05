'use client';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Clock, CheckCircle2, XCircle, Coins } from 'lucide-react';
import { GalleryStatus, IGalleryItem } from '@/app/types/gallery.interface';
import AdminGalleryCard from './_components/AdminGalleryCard';
import AdminGuard from '@/app/components/AdminGuard';

export default function Page() {
    return (
      <AdminGuard>
          <AdminGalleryPage />
      </AdminGuard>
    );
}

type FilterValue = 'all' | GalleryStatus;

const FILTERS: { value: FilterValue; label: string }[] = [
  { value: 'all', label: 'Все' },
  { value: 'pending', label: 'На проверке' },
  { value: 'approved', label: 'Одобрены' },
  { value: 'rejected', label: 'Отклонены' },
];

function AdminGalleryPage() {
  const [items, setItems] = useState<IGalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterValue>('all');
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get('/gallery/', { withCredentials: true });
      const galleryItems: IGalleryItem[] = res.data.map((raw: any) => ({
        id: raw.id,
        author: raw.author?.username || 'Аноним',
        title: raw.title,
        status: raw.status,
        coins: raw.coins,
        uploadedAt: raw.uploaded_at,
        tags: raw.tags || [],
        image: raw.image,
      }));
      setItems(galleryItems);
    } catch (error) {
      console.error('Ошибка загрузки галереи:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleApprove = async (id: number, coins?: number) => {
    setActionLoading(id);
    try {
      await axios.post(`/gallery/${id}/approve/`, coins !== undefined ? { coins } : {}, { withCredentials: true });
      await fetchItems();
    } catch (error) {
      console.error('Ошибка одобрения:', error);
      alert('Не удалось одобрить работу');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: number) => {
    setActionLoading(id);
    try {
      await axios.post(`/gallery/${id}/reject/`, {}, { withCredentials: true });
      await fetchItems();
    } catch (error) {
      console.error('Ошибка отклонения:', error);
      alert('Не удалось отклонить работу');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUndo = async (id: number) => {
    setActionLoading(id);
    try {
      await axios.post(`/gallery/${id}/undo/`, {}, { withCredentials: true });
      await fetchItems();
    } catch (error) {
      console.error('Ошибка возврата на проверку:', error);
      alert('Не удалось вернуть работу');
    } finally {
      setActionLoading(null);
    }
  };

  const pendingCount = items.filter(i => i.status === 'pending').length;
  const approvedCount = items.filter(i => i.status === 'approved').length;
  const rejectedCount = items.filter(i => i.status === 'rejected').length;
  const totalCoins = items.filter(i => i.status === 'approved').reduce((s, i) => s + i.coins, 0);

  const filtered = filter === 'all' ? items : items.filter(i => i.status === filter);

  if (loading && items.length === 0) {
    return (
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ textAlign: 'center', padding: '80px 0', color: '#a0a0a0' }}>Загрузка галереи...</div>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 24px 100px' }}>
      <div style={{ marginBottom: '36px' }}>
        <p style={{ color: '#e0195a', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
          АДМИН-ПАНЕЛЬ
        </p>
        <h1 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 900, letterSpacing: '-1px', marginBottom: '8px' }}>
          Галерея игроков
        </h1>
        <p style={{ color: '#a0a0a0', fontSize: '14px' }}>Проверяй скриншоты и начисляй монеты за лучшие работы</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '12px',
        marginBottom: '32px',
      }}>
        <StatCard icon={<Clock size={16} color="#d97706" />} value={pendingCount} label="На проверке" accent="rgba(217,119,6,0.1)" border="rgba(217,119,6,0.25)" />
        <StatCard icon={<CheckCircle2 size={16} color="#16a34a" />} value={approvedCount} label="Одобрено" accent="rgba(22,163,74,0.1)" border="rgba(22,163,74,0.25)" />
        <StatCard icon={<XCircle size={16} color="#dc2626" />} value={rejectedCount} label="Отклонено" accent="rgba(220,38,38,0.1)" border="rgba(220,38,38,0.25)" />
        <StatCard icon={<Coins size={16} color="#f59e0b" />} value={totalCoins} label="Монет выдано" accent="rgba(245,158,11,0.1)" border="rgba(245,158,11,0.25)" />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            style={{
              padding: '7px 16px',
              borderRadius: '20px',
              fontSize: '13px',
              border: filter === f.value ? '1px solid #e0195a' : '1px solid rgba(255,255,255,0.08)',
              backgroundColor: filter === f.value ? 'rgba(224,25,90,0.1)' : '#161616',
              color: filter === f.value ? '#e0195a' : '#a0a0a0',
              fontWeight: filter === f.value ? 600 : 400,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {f.label}
          </button>
        ))}
        <span style={{ marginLeft: 'auto', color: '#555', fontSize: '13px' }}>
          {filtered.length} {filtered.length === 1 ? 'работа' : 'работ'}
        </span>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: '#555', fontSize: '15px' }}>
          Нет работ в этой категории
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
          gap: '16px',
        }}>
          {filtered.map(item => (
            <AdminGalleryCard
              key={item.id}
              item={item}
              onApprove={handleApprove}
              onReject={handleReject}
              onUndo={handleUndo}
              loading={actionLoading === item.id}
            />
          ))}
        </div>
      )}
    </main>
  );
}

function StatCard({ icon, value, label, accent, border }: { icon: React.ReactNode; value: number; label: string; accent: string; border: string }) {
  return (
    <div style={{
      backgroundColor: accent,
      border: `1px solid ${border}`,
      borderRadius: '12px',
      padding: '16px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    }}>
      <div style={{
        width: '36px', height: '36px',
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: '8px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <p style={{ fontSize: '22px', fontWeight: 800, lineHeight: 1, color: '#fff' }}>{value}</p>
        <p style={{ fontSize: '12px', color: '#a0a0a0', marginTop: '2px' }}>{label}</p>
      </div>
    </div>
  );
}