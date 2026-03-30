import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-brand">
          🎬 <span>StreamPlatform</span>
        </NavLink>
        <ul className="navbar-links">
          <li>
            <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''} end>
              🎬 Katalog
            </NavLink>
          </li>
          <li>
            <NavLink to="/users" className={({ isActive }) => isActive ? 'active' : ''}>
              👤 Kullanıcılar
            </NavLink>
          </li>
          <li>
            <NavLink to="/player" className={({ isActive }) => isActive ? 'active' : ''}>
              ▶️ Oynatıcı
            </NavLink>
          </li>
          <li>
            <NavLink to="/watchlist" className={({ isActive }) => isActive ? 'active' : ''}>
              📋 İzleme Listesi
            </NavLink>
          </li>
        </ul>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
          <button 
            className="btn btn-secondary btn-sm" 
            onClick={toggleTheme}
            style={{ padding: '0.4rem 0.6rem', fontSize: '1.2rem', background: 'transparent', border: 'none', boxShadow: 'none' }}
            title={theme === 'dark' ? 'Açık Temaya Geç' : 'Koyu Temaya Geç'}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </nav>
  );
}
