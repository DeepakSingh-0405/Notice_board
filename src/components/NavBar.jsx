import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../state/AuthContext';
import { logout } from '../lib/appwrite';
import { isAdmin as isAdminUtil } from '../lib/appwrite';

export default function NavBar() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const isAdmin = isAdminUtil(user);

  return (
    <nav className="nav z-10">
      <Link to="/" className="brand">🗞️ Community Board</Link>
      <div className="spacer" />
      

      <Link to="/">Notices</Link>
      <Link to="/buy">Buy</Link>
      {isAdmin && <Link to="/admin">Admin</Link>}
      {user && <Link to="/marketplace">Buy & Sell</Link>}
      {user ? (
        <button className="btn ghost" onClick={async()=>{ await logout(); setUser(null); navigate('/'); }}>Logout</button>
      ) : (
        <>
          <Link to="/login" className="btn ghost">Login</Link>
          <Link to="/signup" className="btn">Sign up</Link>
        </>
      )}
    </nav>
  );
}