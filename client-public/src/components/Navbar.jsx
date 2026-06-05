import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <header className="navbar">
      <Link to="/" className="navbar__brand">The Ledger</Link>
      <nav className="navbar__links">
        {user ? (
          <>
            <span className="navbar__user">{user.username}</span>
            <button className="navbar__btn" onClick={handleLogout}>Sign out</button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar__link">Sign in</Link>
            <Link to="/register" className="navbar__btn navbar__btn--outline">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
