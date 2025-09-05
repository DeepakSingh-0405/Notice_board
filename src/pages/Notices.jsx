import { useEffect, useState } from 'react';
import { listAnnouncements } from '../lib/appwrite';
import NoticeCard from '../components/NoticeCard';
import { useAuth } from '../state/AuthContext';
import { isAdmin } from '../lib/appwrite';

export default function Notices() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const admin = isAdmin(user);

  async function refresh() {
    setLoading(true);
    const docs = await listAnnouncements();
    setItems(docs);
    setLoading(false);
  }

  useEffect(() => { refresh(); }, []);

  if (loading) return <div className="container">Loading notices…</div>;

  return (
    <div className="container grid">
      <h2>Latest Notices</h2>
      <div className="list">
        {items.length === 0 && <div className="card">No announcements yet.</div>}
        {items.map(n => (
          <NoticeCard key={n.$id} notice={n} isAdmin={admin} onEdit={()=>{}} onDelete={()=>{}} />
        ))}
      </div>
    </div>
  );
}