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

  // Yeni İçerik Form State'leri
  const [isCreating, setIsCreating] = useState(false);
  const [newContent, setNewContent] = useState<Partial<Content>>({
    contentType: 'Movie', title: '', requiredAge: 0, duration: 0
  });
  const [createResult, setCreateResult] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

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

  async function handleCreateContent(e: React.FormEvent) {
    e.preventDefault();
    if (!newContent.title || !newContent.contentType) return;
    try {
      await contentApi.create(newContent);
      setCreateResult({ type: 'success', msg: `✅ İçerik eklendi: ${newContent.title}` });
      setNewContent({ contentType: 'Movie', title: '', requiredAge: 0, duration: 0 });
      setIsCreating(false);
      
      const updated = await contentApi.getAll();
      setContents(updated);
      setTimeout(() => setCreateResult(null), 3000);
    } catch {
      setCreateResult({ type: 'error', msg: '❌ İçerik eklenirken hata oluştu!' });
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
        <div className="pattern-info-title" style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>📐 Nesne Yönelimli Programlama (OOP) Prensipleri</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>🔹 Kalıtım (Inheritance) & Soyutlama (Abstraction)</h4>
            <p style={{ marginBottom: '1rem' }}>
              Sistemdeki tüm içerik tipleri ortak özellikleri (<code>id</code>, <code>title</code>, <code>duration</code>) barındıran soyut (abstract) <code>Content</code> sınıfından türer. 
              <strong>Movie</strong>, <strong>Series</strong>, <strong>Documentary</strong> ve <strong>Podcast</strong> sınıfları bu mimari üzerine inşa edilmiştir.
            </p>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>🔹 Çok Biçimlilik (Polymorphism)</h4>
            <p>
              Aşağıdaki kartlarda döngü (map) tek bir <code>Content[]</code> listesi üzerinde çalışır. 
              Ancak her bir nesnenin kendi türüne özgü alanları (örn. Dizi için Sezon bilgisi, Film için Yönetmen) dinamik olarak ekrana basılır. Aynı arayüz, farklı nesne tipleri için farklı şekillerde davranır.
            </p>
          </div>
          <div>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>🔹 Arayüzler (Interfaces)</h4>
            <p style={{ marginBottom: '1rem' }}>
              Java tarafında çoklu kalıtım (multiple inheritance) desteklenmediği için yetenekler arayüzler ile kazandırılır:
            </p>
            <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <li><code>Playable</code>: İçeriğin video veya ses formatında oynatılabilir olduğunu belirtir. Belirli yaş kurallarına tabi olabilir.</li>
              <li><code>Downloadable</code>: İçeriğin cihaza çevrimdışı indirilme yeteneğini temsil eder. (Örn: Sadece Belgesel ve Podcast)</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="section" style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 className="section-title" style={{ margin: 0 }}>📺 İçerikler</h2>
          <button className="btn btn-sm btn-primary" onClick={() => setIsCreating(!isCreating)}>
            {isCreating ? '✕ İptal' : '➕ Yeni İçerik Ekle'}
          </button>
        </div>

        {createResult && (
          <div className={`status-message ${createResult.type === 'success' ? 'status-success' : 'status-error'}`} style={{ marginBottom: '1rem' }}>
            {createResult.msg}
          </div>
        )}

        {isCreating && (
          <form className="demo-panel" style={{ marginBottom: '1.5rem', borderLeft: '3px solid var(--accent-purple)' }} onSubmit={handleCreateContent}>
            <div className="demo-panel-title">✨ Yeni İçerik Oluştur</div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div className="form-group">
                <label className="form-label">İçerik Tipi</label>
                <select className="form-select" required value={newContent.contentType} onChange={e => setNewContent({ contentType: e.target.value, title: '', requiredAge: 0, duration: 0 })}>
                  <option value="Movie">Film (Movie)</option>
                  <option value="Series">Dizi (Series)</option>
                  <option value="Documentary">Belgesel (Documentary)</option>
                  <option value="Podcast">Podcast</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Başlık</label>
                <input className="form-input" required value={newContent.title || ''} onChange={e => setNewContent({...newContent, title: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Süre (Dk)</label>
                <input className="form-input" type="number" required min="1" value={newContent.duration || ''} onChange={e => setNewContent({...newContent, duration: Number(e.target.value)})} />
              </div>
              <div className="form-group">
                <label className="form-label">Yaş Sınırı</label>
                <input className="form-input" type="number" required min="0" value={newContent.requiredAge || ''} onChange={e => setNewContent({...newContent, requiredAge: Number(e.target.value)})} />
              </div>

              {/* Dinamik Alanlar */}
              {newContent.contentType === 'Movie' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Yönetmen</label>
                    <input className="form-input" required value={newContent.director || ''} onChange={e => setNewContent({...newContent, director: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tür</label>
                    <input className="form-input" required value={newContent.genre || ''} onChange={e => setNewContent({...newContent, genre: e.target.value})} />
                  </div>
                </>
              )}
              {newContent.contentType === 'Series' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Sezon Sayısı</label>
                    <input className="form-input" type="number" required min="1" value={newContent.seasons || ''} onChange={e => setNewContent({...newContent, seasons: Number(e.target.value)})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Bölüm Sayısı</label>
                    <input className="form-input" type="number" required min="1" value={newContent.episodes || ''} onChange={e => setNewContent({...newContent, episodes: Number(e.target.value)})} />
                  </div>
                </>
              )}
              {newContent.contentType === 'Documentary' && (
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Konu</label>
                  <input className="form-input" required value={newContent.topic || ''} onChange={e => setNewContent({...newContent, topic: e.target.value})} />
                </div>
              )}
              {newContent.contentType === 'Podcast' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Sunucu</label>
                    <input className="form-input" required value={newContent.host || ''} onChange={e => setNewContent({...newContent, host: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Bölüm Sayısı</label>
                    <input className="form-input" type="number" required min="1" value={newContent.episodeCount || ''} onChange={e => setNewContent({...newContent, episodeCount: Number(e.target.value)})} />
                  </div>
                </>
              )}
            </div>
            <button type="submit" className="btn btn-success">İçeriği Kaydet</button>
          </form>
        )}

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
    </div>
  );
}
