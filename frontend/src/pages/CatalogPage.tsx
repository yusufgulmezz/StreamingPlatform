import { useEffect, useState } from 'react';
import { contentApi } from '../api/client';
import type { Content } from '../types';

const TYPE_CONFIG: Record<string, { badge: string; icon: string }> = {
  Movie: { badge: 'badge-movie', icon: '🎬' },
  Series: { badge: 'badge-series', icon: '📺' },
  Documentary: { badge: 'badge-documentary', icon: '🌍' },
  Podcast: { badge: 'badge-podcast', icon: '🎙️' },
};

function isDownloadable(type: string) {
  return type === 'Documentary' || type === 'Podcast';
}

export default function CatalogPage() {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadResult, setDownloadResult] = useState<{ id: number; msg: string } | null>(null);

  useEffect(() => {
    contentApi.getAll().then(setContents).finally(() => setLoading(false));
  }, []);

  async function handleDownload(id: number) {
    try {
      const res = await contentApi.download(id);
      setDownloadResult({ id, msg: res.result });
      setTimeout(() => setDownloadResult(null), 3000);
    } catch {
      setDownloadResult({ id, msg: '❌ İndirme başarısız!' });
    }
  }

  function renderMeta(c: Content) {
    switch (c.contentType) {
      case 'Movie':
        return (
          <>
            <div className="card-meta-row">🎥 Yönetmen: {c.director}</div>
            <div className="card-meta-row">🏷️ Tür: {c.genre}</div>
          </>
        );
      case 'Series':
        return (
          <>
            <div className="card-meta-row">📺 {c.seasons} Sezon, {c.episodes} Bölüm</div>
          </>
        );
      case 'Documentary':
        return <div className="card-meta-row">📖 Konu: {c.topic}</div>;
      case 'Podcast':
        return (
          <>
            <div className="card-meta-row">🎤 Sunucu: {c.host}</div>
            <div className="card-meta-row">📻 {c.episodeCount} Bölüm</div>
          </>
        );
      default:
        return null;
    }
  }

  if (loading) {
    return (
      <div className="page">
        <div className="loading"><div className="spinner" /> Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="page fade-in">
      <div className="page-header">
        <h1 className="page-title">🎬 İçerik Kataloğu</h1>
        <p className="page-subtitle">OOP Kalıtım, Polimorfizm & Interface Implementasyonu</p>
      </div>

      <div className="pattern-info">
        <div className="pattern-info-title">📐 OOP Prensipleri</div>
        <p>
          <strong>Content</strong> abstract sınıfından türeyen 4 alt sınıf: <strong>Movie</strong>, <strong>Series</strong>, <strong>Documentary</strong>, <strong>Podcast</strong>.
          Her kart türüne göre farklı bilgiler gösterir (polimorfizm). 
          <strong> Playable</strong> ve <strong>Downloadable</strong> interface rozetleri hangi sınıfın hangi arayüzü implement ettiğini gösterir.
        </p>
      </div>

      <div className="card-grid">
        {contents.map((c) => {
          const cfg = TYPE_CONFIG[c.contentType] || { badge: '', icon: '📄' };
          return (
            <div className="card" key={c.id}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className={`card-type-badge ${cfg.badge}`}>
                  {cfg.icon} {c.contentType}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {c.requiredAge > 0 ? `${c.requiredAge}+` : 'Tüm Yaşlar'}
                </span>
              </div>

              <h3 className="card-title">{c.title}</h3>

              <div className="card-meta">
                <div className="card-meta-row">⏱️ {c.duration} dk</div>
                {renderMeta(c)}
              </div>

              <div className="card-interfaces">
                <span className="interface-badge interface-playable">▶ Playable</span>
                {isDownloadable(c.contentType) && (
                  <span className="interface-badge interface-downloadable">⬇ Downloadable</span>
                )}
              </div>

              <div className="card-actions">
                {isDownloadable(c.contentType) && (
                  <button className="btn btn-sm btn-success" onClick={() => handleDownload(c.id)}>
                    ⬇ İndir
                  </button>
                )}
              </div>

              {downloadResult?.id === c.id && (
                <div className="status-message status-info">{downloadResult.msg}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
