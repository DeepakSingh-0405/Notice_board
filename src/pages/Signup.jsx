import { useState } from 'react';
import { signup } from '../lib/appwrite';
import { useAuth } from '../state/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useAuth();
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const u = await signup(email, password, name);
      setUser(u);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Signup failed');
    }
  }

  return (
    <div className="container" style={{maxWidth:480}}>
      <h2>Sign up</h2>
      <form className="card" onSubmit={onSubmit}>
        <div className="form-row">
          <label className="label">Name</label>
          <input className="input" value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" />
        </div>
        <div className="form-row">
          <label className="label">Email</label>
          <input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        <div className="form-row">
          <label className="label">Password</label>
          <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="At least 8 characters" />
        </div>
        {error && <div className="small" style={{color:'#ff7b7b'}}>{error}</div>}
        <div className="actions">
          <button className="btn" type="submit">Create account</button>
        </div>
        <div className="small">Already have an account? <Link className="link" to="/login">Login</Link></div>
      </form>
    </div>
  );
}