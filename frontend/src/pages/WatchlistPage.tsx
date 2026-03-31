import { useEffect, useState } from 'react';
import { contentApi, userApi, watchlistApi } from '../api/client';
import type { Content, User, WatchlistItem } from '../types';

export default function WatchlistPage() {
  const [contents, setContents] = useState<Content[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedUserId, setSelectedUserId] = useState<number | ''>('');
  const [selectedContentId, setSelectedContentId] = useState<number | ''>('');
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [result, setResult] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  useEffect(() => {
    Promise.all([contentApi.getAll(), userApi.getAll()])
      .then(([c, u]) => { setContents(c); setUsers(u); })
      .finally(() => setLoading(false));
  }, []);

  async function loadWatchlist(userId: number) {
    try {
      const items = await watchlistApi.get(userId);
      setWatchlist(items);
    } catch {
      setWatchlist([]);
    }
  }

  async function handleUserSelect(userId: number) {
    setSelectedUserId(userId);
    setResult(null);
    await loadWatchlist(userId);
  }

  async function handleAdd() {
    if (!selectedUserId || !selectedContentId) return;
    try {
      const res = await watchlistApi.add(Number(selectedUserId), Number(selectedContentId));
      setResult({ type: 'success', msg: res.result });
      await loadWatchlist(Number(selectedUserId));
      setTimeout(() => setResult(null), 3000);
    } catch {
      setResult({ type: 'error', msg: '❌ Ekleme başarısız!' });
    }
  }

  async function handleRemove(contentId: number) {
    if (!selectedUserId) return;
    try {
      const res = await watchlistApi.remove(Number(selectedUserId), contentId);
      setResult({ type: 'success', msg: res.result });
      await loadWatchlist(Number(selectedUserId));
      setTimeout(() => setResult(null), 3000);
    } catch {
      setResult({ type: 'error', msg: '❌ Kaldırma başarısız!' });
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
        <h1 className="page-title">📋 İzleme Listesi</h1>
        <p className="page-subtitle">Iterator Pattern — Veri Yapısından Bağımsız Sıralı Gezinme</p>
      </div>

      <div className="pattern-info">
        <div className="pattern-info-title" style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>🔄 Iterator Design Pattern (Yineleyici Tasarım Deseni)</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>🔹 Veri Yapısını Gizleme (Encapsulation)</h4>
            <p style={{ marginBottom: '1rem' }}>
              İzleme Listesi (Watchlist) arka planda karmaşık bir veri yapısı kullanabilir (örn. List, Set veya Tree). 
              Iterator deseni sayesinde, listeyi okuyacak olan kodun (istemci) arka plandaki bu veri yapılarını bilmesine gerek kalmaz.
            </p>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>🔹 Standartlaştırılmış Gezinme</h4>
            <p>
              Listenin elemanları üzerinde sadece <code>hasNext()</code> (sırada eleman var mı?) ve <code>next()</code> (sıradakini getir) 
              metotları kullanılarak standart ve güvenli bir şekilde dolaşılır. Dış müdahaleler (yanlış indexleme vb.) önlenmiş olur.
            </p>
          </div>
          <div style={{ background: 'var(--bg-elevated)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <h4 style={{ color: 'var(--text-primary)', fontSize: '0.85rem', marginBottom: '0.5rem', fontFamily: 'var(--font-mono)' }}>Uygulama Mimarisi</h4>
            <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <li><strong>Koleksiyon:</strong> <code>Watchlist</code> sınıfı kalıtımla standart <code>Iterable</code> arayüzünü uygular.</li>
              <li><strong>İteratör Sınıfı:</strong> Sırayı tutmak için özel <code>WatchlistIterator</code> nesnesi döndürülür.</li>
              <li><strong>Esneklik:</strong> Yarın veritabanı veya liste yapımız değişip Array yerine Node Tree olsa bile, Frontend kodu aynı kalır.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="watchlist-container">
        {/* Sol Panel — Ekleme */}
        <div className="demo-panel">
          <div className="demo-panel-title">➕ İzleme Listesine Ekle</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Kullanıcı Seç</label>
              <select
                className="form-select"
                value={selectedUserId}
                onChange={e => handleUserSelect(Number(e.target.value))}
              >
                <option value="">— Kullanıcı seçin —</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.username}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">İçerik Seç</label>
              <select
                className="form-select"
                value={selectedContentId}
                onChange={e => setSelectedContentId(Number(e.target.value))}
              >
                <option value="">— İçerik seçin —</option>
                {contents.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.title} ({c.contentType})
                  </option>
                ))}
              </select>
            </div>

            <button
              className="btn btn-primary"
              onClick={handleAdd}
              disabled={!selectedUserId || !selectedContentId}
            >
              ➕ Listeye Ekle
            </button>

            {result && (
              <div className={`status-message ${result.type === 'success' ? 'status-success' : 'status-error'}`}>
                {result.msg}
              </div>
            )}
          </div>
        </div>

        {/* Sağ Panel — Liste (Iterator) */}
        <div className="demo-panel">
          <div className="demo-panel-title">
            🔄 İzleme Listesi
            {watchlist.length > 0 && (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400, marginLeft: '0.5rem' }}>
                (WatchlistIterator ile {watchlist.length} öğe gezinildi)
              </span>
            )}
          </div>

          {!selectedUserId ? (
            <div className="empty-state">
              <div className="empty-state-icon">👤</div>
              <div className="empty-state-text">Bir kullanıcı seçin</div>
            </div>
          ) : watchlist.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📭</div>
              <div className="empty-state-text">İzleme listesi boş. İçerik ekleyin!</div>
            </div>
          ) : (
            <div className="watchlist-items">
              {watchlist.map(item => (
                <div className="watchlist-item" key={`${item.order}-${item.id}`}>
                  <div className="watchlist-order">{item.order}</div>
                  <div className="watchlist-info">
                    <div className="watchlist-title">{item.title}</div>
                    <div className="watchlist-meta">{item.type} · {item.duration}</div>
                  </div>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleRemove(item.id)}
                    title="Listeden kaldır"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
