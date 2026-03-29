import { useEffect, useState } from 'react';
import { userApi } from '../api/client';
import type { User, SubscriptionInfo } from '../types';

const PLANS = [
  { type: 'BASIC', name: 'Basic', resolution: '720p', price: 49.99, cssClass: 'sub-basic' },
  { type: 'STANDARD', name: 'Standard', resolution: '1080p', price: 79.99, cssClass: 'sub-standard' },
  { type: 'PREMIUM', name: 'Premium', resolution: '4K', price: 119.99, cssClass: 'sub-premium' },
];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [subInfo, setSubInfo] = useState<SubscriptionInfo | null>(null);
  const [changeResult, setChangeResult] = useState<string | null>(null);
  
  // Yeni kullanıcı formu state'leri
  const [isCreating, setIsCreating] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', email: '', age: '', subscriptionType: 'BASIC' });
  const [createResult, setCreateResult] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  useEffect(() => {
    userApi.getAll().then(setUsers).finally(() => setLoading(false));
  }, []);

  async function selectUser(user: User) {
    setSelectedUser(user);
    setChangeResult(null);
    try {
      const info = await userApi.getSubscription(user.id);
      setSubInfo(info);
    } catch {
      setSubInfo(null);
    }
  }

  async function handleChangePlan(type: string) {
    if (!selectedUser) return;
    try {
      const info = await userApi.changeSubscription(selectedUser.id, type);
      setSubInfo(info);
      setChangeResult(`✅ Plan "${info.plan}" olarak değiştirildi! Çözünürlük: ${info.maxResolution}, Fiyat: ${info.price} TL`);
      // Kullanıcı listesini güncelle
      const updated = await userApi.getAll();
      setUsers(updated);
      setSelectedUser(updated.find(u => u.id === selectedUser.id) || null);
      setTimeout(() => setChangeResult(null), 4000);
    } catch {
      setChangeResult('❌ Plan değişikliği başarısız!');
    }
  }

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();
    if (!newUser.username || !newUser.email || !newUser.age) return;
    try {
      await userApi.create({
        username: newUser.username,
        email: newUser.email,
        age: Number(newUser.age),
        subscriptionType: newUser.subscriptionType as any
      });
      setCreateResult({ type: 'success', msg: `✅ Kullanıcı başarıyla oluşturuldu: ${newUser.username}` });
      setNewUser({ username: '', email: '', age: '', subscriptionType: 'BASIC' });
      setIsCreating(false);
      
      const updated = await userApi.getAll();
      setUsers(updated);
      setTimeout(() => setCreateResult(null), 3000);
    } catch {
      setCreateResult({ type: 'error', msg: '❌ Kullanıcı eklenirken hata oluştu!' });
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
        <h1 className="page-title">👤 Kullanıcılar & Abonelik</h1>
        <p className="page-subtitle">Strategy Pattern — Abonelik Plan Yönetimi</p>
      </div>

      <div className="pattern-info">
        <div className="pattern-info-title">🎯 Strategy Pattern</div>
        <p>
          Her abonelik tipi (<strong>Basic</strong>, <strong>Standard</strong>, <strong>Premium</strong>) 
          farklı bir <strong>SubscriptionStrategy</strong> concrete sınıfına karşılık gelir. 
          Runtime'da plan değiştirildiğinde, ilgili strateji nesnesi <code>SubscriptionType.toStrategy()</code> 
          ile oluşturulur ve <code>getMaxResolution()</code>, <code>getPrice()</code> metotları çağrılır. 
          Yeni bir plan eklemek için sadece yeni bir strateji sınıfı yazmak yeterlidir (Open/Closed Principle).
        </p>
      </div>

      {/* Kullanıcı Listesi */}
      <div className="section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 className="section-title" style={{ margin: 0 }}>👥 Kullanıcı Listesi</h2>
          <button className="btn btn-sm btn-primary" onClick={() => setIsCreating(!isCreating)}>
            {isCreating ? '✕ İptal' : '➕ Yeni Kullanıcı Ekle'}
          </button>
        </div>

        {createResult && (
          <div className={`status-message ${createResult.type === 'success' ? 'status-success' : 'status-error'}`} style={{ marginBottom: '1rem' }}>
            {createResult.msg}
          </div>
        )}

        {isCreating && (
          <form className="demo-panel" style={{ marginBottom: '1.5rem', borderLeft: '3px solid var(--accent-purple)' }} onSubmit={handleCreateUser}>
            <div className="demo-panel-title">✨ Yeni Kullanıcı Oluştur</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Kullanıcı Adı</label>
                <input className="form-input" required value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">E-posta</label>
                <input className="form-input" type="email" required value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Yaş</label>
                <input className="form-input" type="number" required min="1" value={newUser.age} onChange={e => setNewUser({...newUser, age: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Abonelik Tipi</label>
                <select className="form-select" value={newUser.subscriptionType} onChange={e => setNewUser({...newUser, subscriptionType: e.target.value})}>
                  <option value="BASIC">Basic (720p)</option>
                  <option value="STANDARD">Standard (1080p)</option>
                  <option value="PREMIUM">Premium (4K)</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-success">Kaydet</button>
          </form>
        )}

        <div className="users-list">
          {users.map(user => (
            <div
              key={user.id}
              className={`user-row ${selectedUser?.id === user.id ? 'selected' : ''}`}
              onClick={() => selectUser(user)}
            >
              <div className="user-info">
                <div className="user-avatar">{user.username.charAt(0).toUpperCase()}</div>
                <div>
                  <div className="user-name">{user.username}</div>
                  <div className="user-detail">{user.email} · {user.age} yaş</div>
                </div>
              </div>
              <span className={`user-sub-badge ${
                user.subscriptionType === 'BASIC' ? 'sub-basic' : 
                user.subscriptionType === 'STANDARD' ? 'sub-standard' : 'sub-premium'
              }`}>
                {user.subscriptionType}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Plan Seçimi */}
      {selectedUser && (
        <div className="section fade-in">
          <h2 className="section-title">
            🎯 Abonelik Planı Değiştir — <span style={{ color: 'var(--accent-purple)' }}>{selectedUser.username}</span>
          </h2>

          <div className="plans-grid">
            {PLANS.map(plan => (
              <div
                key={plan.type}
                className={`plan-card ${subInfo?.plan === plan.name ? 'active' : ''}`}
                onClick={() => handleChangePlan(plan.type)}
              >
                <div className="plan-name">{plan.name}</div>
                <div className="plan-resolution">{plan.resolution}</div>
                <div className="plan-price">
                  <strong>{plan.price}</strong> TL/ay
                </div>
                <button className="btn btn-sm btn-primary" style={{ width: '100%' }}>
                  {subInfo?.plan === plan.name ? '✓ Aktif Plan' : 'Seç'}
                </button>
              </div>
            ))}
          </div>

          {subInfo && (
            <div className="demo-panel" style={{ marginTop: '1rem' }}>
              <div className="demo-panel-title">📊 Mevcut Plan Detayı (Strategy Çıktısı)</div>
              <div className="card-meta" style={{ gap: '0.5rem' }}>
                <div className="card-meta-row">👤 Kullanıcı: <strong>{subInfo.username}</strong></div>
                <div className="card-meta-row">📋 Plan: <strong>{subInfo.plan}</strong></div>
                <div className="card-meta-row">📺 Maks. Çözünürlük: <strong>{subInfo.maxResolution}</strong></div>
                <div className="card-meta-row">💰 Fiyat: <strong>{subInfo.price} TL</strong></div>
              </div>
            </div>
          )}

          {changeResult && (
            <div className={`status-message ${changeResult.startsWith('✅') ? 'status-success' : 'status-error'}`}>
              {changeResult}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
