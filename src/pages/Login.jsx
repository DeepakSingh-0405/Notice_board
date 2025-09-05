import { useState } from 'react';
import { login } from '../lib/appwrite';
import { useAuth } from '../state/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useAuth();
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const u = await login(email, password);
      setUser(u);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  }

  return (
    <div className="container" style={{maxWidth:480}}>
      <h2>Login</h2>
      <form className="card" onSubmit={onSubmit}>
        <div className="form-row">
          <label className="label">Email</label>
          <input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        <div className="form-row">
          <label className="label">Password</label>
          <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" />
        </div>
        {error && <div className="small" style={{color:'#ff7b7b'}}>{error}</div>}
        <div className="actions">
          <button className="btn" type="submit">Login</button>
        </div>
        <div className="small">No account? <Link className="link" to="/signup">Sign up</Link></div>
      </form>
    </div>
  );
}