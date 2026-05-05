'use client';
import { getInitial, IGalleryItem, STATUS_CONFIG } from '@/app/types/gallery.interface';
import { Coins, RotateCcw, Check, X, Loader2 } from 'lucide-react';

interface Props {
  item: IGalleryItem;
  onApprove: (id: number, coins?: number) => void;
  onReject: (id: number) => void;
  onUndo: (id: number) => void;
  loading?: boolean;
}

export default function AdminGalleryCard({ item, onApprove, onReject, onUndo, loading }: Props) {
  const st = STATUS_CONFIG[item.status];
  const isDone = item.status !== 'pending';
  const isLoading = loading === true;

  return (
    <div
      style={{
        backgroundColor: '#161616',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '14px',
        overflow: 'hidden',
        opacity: isDone ? 0.6 : 1,
        transition: 'opacity 0.2s, border-color 0.2s, transform 0.2s',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.16)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div style={{ height: '160px', backgroundColor: '#0f0f0f', position: 'relative', overflow: 'hidden' }}>
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'rgba(255,255,255,0.12)', fontSize: '13px',
          }}>
            Нет изображения
          </div>
        )}
        <div style={{
          position: 'absolute', top: '10px', left: '10px',
          display: 'flex', alignItems: 'center', gap: '4px',
          padding: '3px 10px', borderRadius: '20px',
          fontSize: '11px', fontWeight: 600,
          backgroundColor: st.bg, color: st.color,
          border: `1px solid ${st.border}`,
          backdropFilter: 'blur(8px)',
        }}>
          <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: st.color, flexShrink: 0 }} />
          {st.label}
        </div>
        {item.status === 'approved' && (
          <div style={{
            position: 'absolute', top: '10px', right: '10px',
            display: 'flex', alignItems: 'center', gap: '4px',
            padding: '3px 10px', borderRadius: '20px',
            fontSize: '11px', fontWeight: 700,
            backgroundColor: 'rgba(217,119,6,0.15)', color: '#f59e0b',
            border: '1px solid rgba(217,119,6,0.3)',
            backdropFilter: 'blur(8px)',
          }}>
            <Coins size={11} /> +{item.coins}
          </div>
        )}
      </div>

      <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
        <div>
          <p style={{
            fontSize: '14px', fontWeight: 600, color: '#fff',
            marginBottom: '5px', whiteSpace: 'nowrap',
            overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {item.title}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '18px', height: '18px', borderRadius: '50%',
              backgroundColor: '#e0195a',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '9px', fontWeight: 700, color: '#fff', flexShrink: 0,
            }}>
              {getInitial(item.author)}
            </div>
            <span style={{ fontSize: '12px', color: '#a0a0a0' }}>{item.author ?? 'Аноним'}</span>
            <span style={{ fontSize: '12px', color: '#555', marginLeft: 'auto' }}>
              {new Date(item.uploadedAt).toLocaleDateString('ru-RU')}
            </span>
          </div>
        </div>

        {item.tags.length > 0 && (
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {item.tags.map(tag => (
              <span key={tag} style={{
                padding: '2px 8px', borderRadius: '4px', fontSize: '11px',
                backgroundColor: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                color: '#666',
              }}>
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div style={{ marginTop: 'auto' }}>
          {isDone ? (
            <button
              onClick={() => onUndo(item.id)}
              disabled={isLoading}
              style={{
                width: '100%', padding: '8px',
                backgroundColor: 'transparent',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px', color: '#a0a0a0',
                fontSize: '12px', cursor: isLoading ? 'wait' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { if (!isLoading) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = '#fff'; } }}
              onMouseLeave={e => { if (!isLoading) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#a0a0a0'; } }}
            >
              {isLoading ? <Loader2 size={12} className="animate-spin" /> : <RotateCcw size={12} />}
              Вернуть на проверку
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={() => onApprove(item.id)}
                disabled={isLoading}
                style={{
                  flex: 1, padding: '8px 0',
                  backgroundColor: 'rgba(22,163,74,0.1)',
                  border: '1px solid rgba(22,163,74,0.3)',
                  borderRadius: '8px', color: '#16a34a',
                  fontSize: '12px', fontWeight: 600, cursor: isLoading ? 'wait' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                  transition: 'background-color 0.15s',
                }}
                onMouseEnter={e => { if (!isLoading) e.currentTarget.style.backgroundColor = 'rgba(22,163,74,0.2)'; }}
                onMouseLeave={e => { if (!isLoading) e.currentTarget.style.backgroundColor = 'rgba(22,163,74,0.1)'; }}
              >
                {isLoading ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                Принять
              </button>
              <button
                onClick={() => onReject(item.id)}
                disabled={isLoading}
                style={{
                  flex: 1, padding: '8px 0',
                  backgroundColor: 'rgba(220,38,38,0.1)',
                  border: '1px solid rgba(220,38,38,0.3)',
                  borderRadius: '8px', color: '#dc2626',
                  fontSize: '12px', fontWeight: 600, cursor: isLoading ? 'wait' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                  transition: 'background-color 0.15s',
                }}
                onMouseEnter={e => { if (!isLoading) e.currentTarget.style.backgroundColor = 'rgba(220,38,38,0.2)'; }}
                onMouseLeave={e => { if (!isLoading) e.currentTarget.style.backgroundColor = 'rgba(220,38,38,0.1)'; }}
              >
                {isLoading ? <Loader2 size={13} className="animate-spin" /> : <X size={13} />}
                Отклонить
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}