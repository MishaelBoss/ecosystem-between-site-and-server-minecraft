'use client';

import { ReactNode } from 'react';
import Portal from './Portal';

interface ConfirmModalProps {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmModal({
  title,
  description,
  confirmText = 'Удалить',
  cancelText = 'Отмена',
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  return (
    <Portal>
      <div
        onClick={e => {
          if (e.target === e.currentTarget) onClose();
        }}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(4px)',
          padding: '20px',
        }}
      >
        <div
          role="dialog"
          aria-modal="true"
          style={{
            width: '100%',
            maxWidth: '420px',
            backgroundColor: '#111',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '20px',
            padding: '28px',
            boxShadow: '0 24px 80px rgba(0,0,0,0.4)',
          }}
        >
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '10px' }}>{title}</h2>
            <p style={{ color: '#a0a0a0', lineHeight: 1.6, fontSize: '14px' }}>{description}</p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '12px 18px',
                borderRadius: '10px',
                border: '1px solid var(--border)',
                background: 'transparent',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              style={{
                padding: '12px 18px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: '#e0195a',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
