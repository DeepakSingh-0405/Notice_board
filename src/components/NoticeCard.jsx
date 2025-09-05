import { formatDistanceToNow } from 'date-fns';

export default function NoticeCard({ notice, onEdit, onDelete, isAdmin }) {
  const created = formatDistanceToNow(new Date(notice.$createdAt), { addSuffix: true });
  return (
    <article className="card">
      <h3 style={{marginTop:0}} className='font-bold'>{notice.title}</h3>
      {notice.pinned && <div className="small">📌 Pinned</div>}
      <p style={{whiteSpace:'pre-wrap'}}>{notice.body}</p>
      <div className="small">Posted {created}</div>
      {isAdmin && (
        <div className="actions">
          <button className="btn ghost" onClick={()=>onEdit(notice)}>Edit</button>
          <button className="btn" onClick={()=>onDelete(notice)}>Delete</button>
        </div>
      )}
    </article>
  );
}