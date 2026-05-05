'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { getListNews } from '../lib/api';
import { INewsItem } from '../types/news.interface';

const PAGE_SIZE = 20;

const CATEGORIES = ['Обновление', 'Событие', 'Техническое', 'Анонс', 'Конкурс'];
const CATEGORY_COLORS: Record<string, string> = {
  'Обновление': '#e0195a',
  'Событие': '#818cf8',
  'Техническое': '#fb923c',
  'Анонс': '#34d399',
  'Конкурс': '#f59e0b',
};

const formatDate = (isoString?: string): string => {
  if (!isoString) return '01.01.2024';
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

const toNewsItem = (raw: any): INewsItem => ({
  id: raw.id,
  title: raw.title || 'Без названия',
  excerpt: raw.excerpt || '',
  category: raw.category || 'Обновление',
  categoryColor: raw.categoryColor || '#e0195a',
  date: formatDate(raw.date || raw.created_at),
  author: raw.author || 'Admin',
  image: raw.image,
  content: raw.content,
});

export default function NewsPage() {
  const [news, setNews] = useState<INewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState<string | null>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  
  const allNewsRef = useRef<INewsItem[] | null>(null);
  const loadingAllRef = useRef(false);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      if (!allNewsRef.current) {
        if (loadingAllRef.current) return;
        loadingAllRef.current = true;
        const data = await getListNews(0, 10000);
        if (Array.isArray(data)) {
          allNewsRef.current = data.map(toNewsItem);
        } else if (data?.results && Array.isArray(data.results)) {
          allNewsRef.current = data.results.map(toNewsItem);
        } else {
          console.error('Неизвестный формат ответа', data);
          setHasMore(false);
          return;
        }
        loadingAllRef.current = false;
      }

      const allNews = allNewsRef.current!;
      const total = allNews.length;
      const currentCount = news.length;
      const nextBatch = allNews.slice(currentCount, currentCount + PAGE_SIZE);
      
      if (nextBatch.length === 0) {
        setHasMore(false);
      } else {
        setNews(prev => [...prev, ...nextBatch]);
        if (currentCount + nextBatch.length >= total) {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error('Ошибка загрузки новостей:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, news.length]);

  useEffect(() => {
    loadMore();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          loadMore();
        }
      },
      { threshold: 0.5 }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loadMore, loading, hasMore]);

  const filtered = filter ? news.filter(n => n.category === filter) : news;

  return (
    <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px 24px 100px' }}>
      <div style={{ marginBottom: '48px' }}>
        <p style={{ color: '#e0195a', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>НОВОСТИ</p>
        <h1 style={{ fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 900, letterSpacing: '-1.5px', marginBottom: '16px' }}>
          Последние обновления
        </h1>
        <p style={{ color: '#a0a0a0', fontSize: '16px' }}>Следи за жизнью сервера — анонсы, события и технические новости</p>
      </div>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '40px' }}>
        <FilterBtn active={!filter} onClick={() => setFilter(null)}>Все</FilterBtn>
        {CATEGORIES.map(cat => (
          <FilterBtn key={cat} active={filter === cat} onClick={() => setFilter(cat)} color={CATEGORY_COLORS[cat]}>
            {cat}
          </FilterBtn>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
        {filtered.map((item, i) => (
          <Link href={`/news/${item.id}`} key={`${item.id}-${i}`} style={{ textDecoration: 'none' }}>
            <NewsCard item={item} />
          </Link>
        ))}
      </div>

      <div ref={loaderRef} style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#a0a0a0', fontSize: '14px' }}>
            <div style={{ width: '20px', height: '20px', border: '2px solid rgba(224,25,90,0.3)', borderTopColor: '#e0195a', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            Загружаем новости...
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </main>
  );
}

function FilterBtn({ active, onClick, color, children }: { active: boolean; onClick: () => void; color?: string; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '7px 16px',
        borderRadius: '20px',
        border: active ? `1px solid ${color || '#e0195a'}` : '1px solid rgba(255,255,255,0.08)',
        backgroundColor: active ? (color ? `${color}22` : 'rgba(224,25,90,0.1)') : '#161616',
        color: active ? (color || '#e0195a') : '#a0a0a0',
        fontSize: '13px',
        fontWeight: active ? 600 : 400,
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
    >
      {children}
    </button>
  );
}

function NewsCard({ item }: { item: INewsItem }) {
  return (
    <article style={{
      backgroundColor: '#161616',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '14px',
      padding: '24px',
      transition: 'all 0.25s',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
    }}
    onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = 'rgba(224,25,90,0.25)'; el.style.transform = 'translateY(-3px)'; }}
    onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = 'rgba(255,255,255,0.08)'; el.style.transform = 'translateY(0)'; }}
    >
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
        <span style={{
          padding: '4px 10px',
          borderRadius: '6px',
          fontSize: '11px',
          fontWeight: 600,
          backgroundColor: `${item.categoryColor}20`,
          color: item.categoryColor,
          border: `1px solid ${item.categoryColor}40`,
        }}>
          {item.category}
        </span>
      </div>

      <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '10px', lineHeight: 1.4, color: '#fff' }}>
        {item.title}
      </h3>
      <p style={{ color: '#a0a0a0', fontSize: '13px', lineHeight: 1.7, flex: 1 }}>{item.excerpt}</p>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ color: '#a0a0a0', fontSize: '12px' }}>📅 {item.date}</span>
          <span style={{ color: '#a0a0a0', fontSize: '12px' }}>✍️ {item.author}</span>
        </div>
        <span style={{ color: '#e0195a', fontSize: '13px' }}>→</span>
      </div>
    </article>
  );
}