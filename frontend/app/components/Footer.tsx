export default function Footer() {
    return (
        <footer style={{ 
            borderTop: '1px solid rgba(255,255,255,0.08)', 
            padding: '32px 24px', 
            textAlign: 'center', 
            color: '#a0a0a0', 
            fontSize: '13px' 
        }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '20px' }}>⛏️</span>
                <span style={{ fontWeight: 700, color: '#fff' }}>SwordDiscord</span>
            </div>
            <p>© 2026 ShowDiscord. Все права защищены. Не является официальным продуктом Mojang Studios.</p>
        </footer>
    );
}