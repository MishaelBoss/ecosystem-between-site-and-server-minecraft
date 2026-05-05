'use client';
import { useState } from 'react';
import Link from 'next/link';
import { LogOut, User, Home, Newspaper, Menu, X, GalleryThumbnails, Map as MapIcon, Coins, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';
import { useServerStatus } from '../context/ServerStatusContext';

export default function Header() {
  const [authModal, setAuthModal] = useState<'login' | 'register' | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAdmin, logout } = useAuth();
  const { data } = useServerStatus();

  return (
    <>
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'rgba(10, 10, 10, 0.92)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 24px',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px', height: '36px',
              background: 'linear-gradient(135deg, var(--accent), var(--accent-dim))',
              borderRadius: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '18px',
            }}>⛏️</div>
            <span style={{
              fontSize: '18px', fontWeight: 700,
              background: 'linear-gradient(90deg, #fff 40%, var(--accent))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.5px',
            }}>SwordDiscord</span>
          </Link>

          <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }} className="desktop-nav">
            <NavLink href="/" icon={<Home size={15} />}>Главная</NavLink>
            <NavLink href="/map" icon={<MapIcon size={15} />}>Карта Мира</NavLink>
            <NavLink href="/news" icon={<Newspaper size={15} />}>Новости</NavLink>
            <NavLink href="/gallery" icon={<GalleryThumbnails size={15} />}>Галерея</NavLink>
            {isAdmin && <NavLink href="/admin/gallery" icon={<ShieldCheck size={15} />}>Админка</NavLink>}
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '6px 12px',
                backgroundColor: 'var(--bg-card)',
                borderRadius: '8px',
                border: '1px solid var(--border)',
              }}>
                <User size={14} color="var(--accent)" />
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{user.username}</span>
                <span style={{ margin: '0 4px', color: 'var(--border)' }}>|</span>
                <Coins size={14} color="#ffd700" />
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>{user.coins || 0}</span>
              </div>
              <button
                onClick={logout}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 14px',
                  backgroundColor: 'transparent',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--text-secondary)',
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <LogOut size={14} /> Выйти
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAuthModal('login')}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 18px',
                backgroundColor: 'var(--accent)',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <User size={14} /> Войти
            </button>
          )}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'none' }}
              className="mobile-toggle"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            borderTop: '1px solid var(--border)',
            padding: '12px 24px',
            display: 'flex', flexDirection: 'column', gap: '4px',
          }}>
            <MobileNavLink href="/" onClick={() => setMobileOpen(false)}>🏠 Главная</MobileNavLink>
            <MobileNavLink href="/map" onClick={() => setMobileOpen(false)}>🗺️ Карта Мира</MobileNavLink>
            <MobileNavLink href="/news" onClick={() => setMobileOpen(false)}>📰 Новости</MobileNavLink>
            <MobileNavLink href="/gallery" onClick={() => setMobileOpen(false)}>🖼️ Галерея</MobileNavLink>
            {isAdmin && <MobileNavLink href="/admin/gallery" onClick={() => setMobileOpen(false)}>🛡️ Админка</MobileNavLink>}
          </div>
        )}
      </header>

      <style>{`
        @media (max-width: 640px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: flex !important; }
        }
      `}</style>

      {authModal && (
        <AuthModal
          mode={authModal}
          onClose={() => setAuthModal(null)}
          onSwitch={(m) => setAuthModal(m)}
        />
      )}
    </>
  );
}

function NavLink({ href, icon, children }: { href: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <Link href={href} style={{
      display: 'flex', alignItems: 'center', gap: '6px',
      padding: '8px 14px',
      borderRadius: '8px',
      color: 'var(--text-secondary)',
      textDecoration: 'none',
      fontSize: '14px',
      transition: 'all 0.2s',
    }}
    onMouseEnter={e => { (e.target as HTMLElement).closest('a')!.style.color = 'var(--text-primary)'; (e.target as HTMLElement).closest('a')!.style.backgroundColor = 'var(--bg-card)'; }}
    onMouseLeave={e => { (e.target as HTMLElement).closest('a')!.style.color = 'var(--text-secondary)'; (e.target as HTMLElement).closest('a')!.style.backgroundColor = 'transparent'; }}
    >
      {icon} {children}
    </Link>
  );
}

function MobileNavLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link href={href} onClick={onClick} style={{
      padding: '10px 12px',
      borderRadius: '8px',
      color: 'var(--text-secondary)',
      textDecoration: 'none',
      fontSize: '15px',
      display: 'block',
    }}>
      {children}
    </Link>
  );
}