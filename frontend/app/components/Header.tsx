'use client';
import { useState } from 'react';
import Link from 'next/link';
import { LogOut, User, Home, Newspaper, Menu, X, GalleryThumbnails, Map as MapIcon, Coins, ShieldCheck, Download, Package, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';
import { useServerStatus } from '../context/ServerStatusContext';

export default function Header() {
    const [authModal, setAuthModal] = useState<'login' | 'register' | null>(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);
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
                        <NavLink href="/map" icon={<MapIcon size={15} />}>Карта</NavLink>
                        <NavLink href="/news" icon={<Newspaper size={15} />}>Новости</NavLink>
                        <NavLink href="/gallery" icon={<GalleryThumbnails size={15} />}>Галерея</NavLink>
                        <NavLink href="/how-to-play" icon={<Download size={15} />}>Как играть</NavLink>
                        <NavLink href="/shop" icon={<Coins size={15} />}>Магазин</NavLink>
                        
                        {isAdmin && (
                            <div style={{ position: 'relative' }}>
                                <button
                                    onClick={() => setAdminDropdownOpen(!adminDropdownOpen)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '6px',
                                        padding: '8px 14px',
                                        borderRadius: '8px',
                                        color: 'var(--text-secondary)',
                                        background: 'none',
                                        border: 'none',
                                        fontSize: '14px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.backgroundColor = 'var(--bg-card)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                                >
                                    <ShieldCheck size={15} /> Админ
                                    <ChevronDown size={14} style={{ transition: 'transform 0.2s', transform: adminDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                                </button>
                                
                                {adminDropdownOpen && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '100%',
                                        left: 0,
                                        marginTop: '4px',
                                        backgroundColor: 'var(--bg-card)',
                                        border: '1px solid var(--border)',
                                        borderRadius: '12px',
                                        padding: '8px',
                                        minWidth: '200px',
                                        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                                        zIndex: 101,
                                    }}>
                                        <DropdownNavLink href="/admin/mods" icon={<Package size={14} />} onClick={() => setAdminDropdownOpen(false)}>Упр. Модами</DropdownNavLink>
                                        <DropdownNavLink href="/admin/news" icon={<Newspaper size={14} />} onClick={() => setAdminDropdownOpen(false)}>Упр. Новостями</DropdownNavLink>
                                        <DropdownNavLink href="/admin/gallery" icon={<GalleryThumbnails size={14} />} onClick={() => setAdminDropdownOpen(false)}>Упр. Галереей</DropdownNavLink>
                                    </div>
                                )}
                            </div>
                        )}
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
                        <MobileNavLink href="/how-to-play" onClick={() => setMobileOpen(false)}>📥 Как играть</MobileNavLink>
                        <MobileNavLink href="/shop" onClick={() => setMobileOpen(false)}>🪙 Магазин</MobileNavLink>
                        {isAdmin && (
                            <>
                                <div style={{ padding: '8px 12px', color: 'var(--text-secondary)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Администрирование</div>
                                <MobileNavLink href="/admin/mods" onClick={() => setMobileOpen(false)}>📦 Управление модами</MobileNavLink>
                                <MobileNavLink href="/admin/news" onClick={() => setMobileOpen(false)}>📰 Управление новостями</MobileNavLink>
                                <MobileNavLink href="/admin/gallery" onClick={() => setMobileOpen(false)}>🛡️ Управление галереей</MobileNavLink>
                            </>
                        )}
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

function DropdownNavLink({ href, icon, onClick, children }: { href: string; icon: React.ReactNode; onClick?: () => void; children: React.ReactNode }) {
    return (
        <Link href={href} onClick={onClick} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 12px',
            borderRadius: '8px',
            color: 'var(--text-secondary)',
            textDecoration: 'none',
            fontSize: '14px',
            transition: 'all 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'; }}
        onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
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