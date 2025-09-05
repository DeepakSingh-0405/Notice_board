import { useEffect, useState } from 'react';
import { createAnnouncement, deleteAnnouncement, listAnnouncements, updateAnnouncement } from '../lib/appwrite';
import NoticeCard from '../components/NoticeCard';

export default function Admin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', body: '', pinned: false });
  const [editing, setEditing] = useState(null);

  async function refresh() {
    setLoading(true);
    const docs = await listAnnouncements();
    setItems(docs);
    setLoading(false);
  }
  useEffect(() => { refresh(); }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.body.trim()) return;

    if (editing) {
      await updateAnnouncement(editing.$id, form);
    } else {
      await createAnnouncement(form);
    }
    setForm({ title: '', body: '', pinned: false });
    setEditing(null);
    refresh();
  }

  async function handleDelete(n) {
    if (!confirm('Delete this announcement?')) return;
    await deleteAnnouncement(n.$id);
    refresh();
  }

  function startEdit(n) {
    setEditing(n);
    setForm({ title: n.title, body: n.body, pinned: !!n.pinned });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="container grid">
      <h2>Admin Panel</h2>

      <form className="card" onSubmit={handleSubmit}>
        <div className="form-row">
          <label className="label">Title</label>
          <input className="input" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} placeholder="Announcement title"/>
        </div>
        <div className="form-row">
          <label className="label">Body</label>
          <textarea className="input" rows={6} value={form.body} onChange={e=>setForm({...form, body:e.target.value})} placeholder="Write the announcement…"/>
        </div>
        <div className="form-row">
          <label style={{display:'flex', alignItems:'center', gap:8}}>
            <input type="checkbox" checked={form.pinned} onChange={e=>setForm({...form, pinned:e.target.checked})} />
            Pinned
          </label>
        </div>
        <div className="actions">
          {editing && <button type="button" className="btn ghost" onClick={()=>{ setEditing(null); setForm({ title:'', body:'', pinned:false }); }}>Cancel</button>}
          <button className="btn" type="submit">{editing ? 'Update' : 'Publish'}</button>
        </div>
      </form>

      <div className="list">
        {loading ? (
          <div className="card">Loading…</div>
        ) : items.length === 0 ? (
          <div className="card">No announcements yet.</div>
        ) : (
          items.map(n => (
            <NoticeCard key={n.$id} notice={n} isAdmin={true} onEdit={startEdit} onDelete={handleDelete} />
          ))
        )}
      </div>
    </div>
  );
}