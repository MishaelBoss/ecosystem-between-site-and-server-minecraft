'use client';
import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getNewsDetail } from '@/app/lib/api';

interface NewsItem {
  id: number;
  title: string;
  content: string;
  image: string | null;
  created_at: string;
}

export default function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        const response = await getNewsDetail(1);
        setNewsItem(response);
      } catch (error) {
        console.error("Failed to load news detail", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNewsDetail();
  }, [resolvedParams.id]);

  if (loading) {
    return <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 24px', color: 'var(--text-secondary)' }}>Загрузка...</div>;
  }

  if (!newsItem) {
    return <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 24px', color: 'var(--text-secondary)' }}>Новость не найдена.</div>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 24px' }}>
      <Link href="/news" style={{ 
        display: 'inline-flex', alignItems: 'center', gap: '8px', 
        color: 'var(--accent)', textDecoration: 'none', marginBottom: '24px', fontSize: '14px', fontWeight: 500
      }}>
        <ArrowLeft size={16} /> Назад к новостям
      </Link>

      <article>
        <h1 style={{ fontSize: '36px', color: 'var(--text-primary)', marginBottom: '16px', lineHeight: 1.2 }}>
          {newsItem.title}
        </h1>
        
        <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '32px' }}>
          {new Date(newsItem.created_at).toLocaleString()}
        </div>

        {newsItem.image && (
          <div style={{ marginBottom: '40px', borderRadius: '12px', overflow: 'hidden' }}>
            <img src={newsItem.image} alt={newsItem.title} style={{ width: '100%', height: 'auto', display: 'block' }} />
          </div>
        )}

        <div style={{ 
          fontSize: '16px', 
          color: 'var(--text-secondary)', 
          lineHeight: 1.7,
          whiteSpace: 'pre-wrap'
        }}>
          {newsItem.content}
        </div>
      </article>
    </div>
  );
}
