import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <span className="sidebar__brand-name">The Ledger</span>
        <span className="sidebar__brand-sub">Admin</span>
      </div>

      <nav className="sidebar__nav">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
        >
          <span className="sidebar__icon">▦</span>
          Posts
        </NavLink>
        <NavLink
          to="/posts/new"
          className={({ isActive }) => `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
        >
          <span className="sidebar__icon">+</span>
          New Post
        </NavLink>
      </nav>

      <div className="sidebar__footer">
        <span className="sidebar__user">{user?.username}</span>
        <button className="sidebar__logout" onClick={handleLogout}>Sign out</button>
      </div>
    </aside>
  );
}
