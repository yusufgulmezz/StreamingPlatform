import { useEffect, useState } from 'react';
import { contentApi, userApi } from '../api/client';
import type { Content, User } from '../types';

export default function PlayerPage() {
  const [contents, setContents] = useState<Content[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedContentId, setSelectedContentId] = useState<number | ''>('');
  const [selectedUserId, setSelectedUserId] = useState<number | ''>('');
  const [playResult, setPlayResult] = useState<{ type: 'success' | 'error' | 'warning'; msg: string } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    Promise.all([contentApi.getAll(), userApi.getAll()])
      .then(([c, u]) => { setContents(c); setUsers(u); })
      .finally(() => setLoading(false));
  }, []);

  async function handlePlay() {
    if (!selectedContentId || !selectedUserId) return;
    setIsPlaying(true);
    setPlayResult(null);
    try {
      const res = await contentApi.play(Number(selectedContentId), Number(selectedUserId));
      const msg = res.result;
      if (msg.includes('⛔') || msg.includes('Engel')) {
        setPlayResult({ type: 'error', msg });
      } else if (msg.includes('⚠')) {
        setPlayResult({ type: 'warning', msg });
      } else {
        setPlayResult({ type: 'success', msg });
      }
    } catch (e) {
      setPlayResult({ type: 'error', msg: '❌ Bir hata oluştu: ' + (e instanceof Error ? e.message : 'Bilinmeyen hata') });
    } finally {
      setIsPlaying(false);
    }
  }

  const selectedContent = contents.find(c => c.id === Number(selectedContentId));
  const selectedUser = users.find(u => u.id === Number(selectedUserId));
  const isAgeBlocked = selectedContent && selectedUser && selectedUser.age < selectedContent.requiredAge;

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
        <h1 className="page-title">▶️ İçerik Oynatıcı</h1>
        <p className="page-subtitle">Proxy Pattern — Yaş Kısıtlaması Kontrolü</p>
      </div>

      <div className="pattern-info">
        <div className="pattern-info-title">🛡️ Proxy Pattern</div>
        <p>
          <strong>ContentPlayProxy</strong> sınıfı, gerçek <strong>Playable</strong> nesnesini sarmalayarak 
          oynatma öncesinde yaş kontrolü uygular. Kullanıcı yaşı içeriğin <strong>requiredAge</strong> 
          değerinden küçükse erişim engellenir. Bu sayede gerçek nesneye dokunmadan ek kontrol katmanı eklenir.
        </p>
      </div>

      <div className="player-demo">
        {/* Sol Panel — Seçim */}
        <div className="demo-panel">
          <div className="demo-panel-title">🎛️ Oynatma Kontrolü</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Kullanıcı Seç</label>
              <select
                className="form-select"
                value={selectedUserId}
                onChange={e => { setSelectedUserId(Number(e.target.value)); setPlayResult(null); }}
              >
                <option value="">— Kullanıcı seçin —</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.username} (Yaş: {u.age})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">İçerik Seç</label>
              <select
                className="form-select"
                value={selectedContentId}
                onChange={e => { setSelectedContentId(Number(e.target.value)); setPlayResult(null); }}
              >
                <option value="">— İçerik seçin —</option>
                {contents.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.title} ({c.contentType}) {c.requiredAge > 0 ? `[${c.requiredAge}+]` : '[Tüm Yaşlar]'}
                  </option>
                ))}
              </select>
            </div>

            {/* Ön Bilgi */}
            {selectedContent && selectedUser && (
              <div style={{
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: isAgeBlocked ? 'var(--danger-bg)' : 'var(--success-bg)',
                border: `1px solid ${isAgeBlocked ? 'rgba(239,68,68,0.25)' : 'rgba(34,197,94,0.25)'}`,
                fontSize: '0.8rem',
                color: isAgeBlocked ? 'var(--danger)' : 'var(--success)'
              }}>
                {isAgeBlocked
                  ? `⚠ Dikkat: ${selectedUser.username} (${selectedUser.age} yaş) → "${selectedContent.title}" ${selectedContent.requiredAge}+ içerik. Erişim engellenecek!`
                  : `✓ ${selectedUser.username} (${selectedUser.age} yaş) → "${selectedContent.title}" erişim izni var.`
                }
              </div>
            )}

            <button
              className="btn btn-primary"
              onClick={handlePlay}
              disabled={!selectedContentId || !selectedUserId || isPlaying}
            >
              {isPlaying ? '⏳ Kontrol ediliyor...' : '▶ Oynat'}
            </button>
          </div>
        </div>

        {/* Sağ Panel — Sonuç */}
        <div className="demo-panel">
          <div className="demo-panel-title">📊 Proxy Akışı & Sonuç</div>

          {/* Akış Diyagramı */}
          <div className="flow-diagram">
            <div className="flow-step">
              👤 {selectedUser ? selectedUser.username : 'Kullanıcı'}
            </div>
            <span className="flow-arrow">→</span>
            <div className="flow-step proxy">
              🛡️ ContentPlayProxy
            </div>
            <span className="flow-arrow">→</span>
            {playResult ? (
              playResult.type === 'error' ? (
                <div className="flow-step blocked">⛔ Engellendi</div>
              ) : (
                <div className="flow-step allowed">▶ Oynatıldı</div>
              )
            ) : (
              <div className="flow-step">❓ Sonuç Bekleniyor</div>
            )}
          </div>

          {/* Sonuç Mesajı */}
          {playResult && (
            <div className={`status-message ${
              playResult.type === 'success' ? 'status-success' :
              playResult.type === 'warning' ? 'status-warning' : 'status-error'
            }`}>
              {playResult.msg}
            </div>
          )}

          {!playResult && (
            <div className="empty-state" style={{ padding: '2rem' }}>
              <div className="empty-state-icon">🎮</div>
              <div className="empty-state-text">Kullanıcı ve içerik seçerek Proxy Pattern'ı test edin</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
