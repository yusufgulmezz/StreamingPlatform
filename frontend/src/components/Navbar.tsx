import { NavLink } from 'react-router-dom';

export default function Navbar() {
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
      </div>
    </nav>
  );
}
