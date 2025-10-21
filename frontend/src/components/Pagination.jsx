import React from 'react';

export default function Pagination({ page, pageSize, total, onPage }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pages = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex items-center gap-2">
      <button onClick={() => onPage(1)} disabled={page === 1} className="px-3 py-1 border rounded">First</button>
      <button onClick={() => onPage(page-1)} disabled={page === 1} className="px-3 py-1 border rounded">Prev</button>
      {start > 1 && <span className="px-2">...</span>}
      {pages.map(p => (
        <button key={p} onClick={() => onPage(p)} className={`px-3 py-1 rounded ${p === page ? 'bg-indigo-600 text-white' : 'border'}`}>{p}</button>
      ))}
      {end < totalPages && <span className="px-2">...</span>}
      <button onClick={() => onPage(page+1)} disabled={page === totalPages} className="px-3 py-1 border rounded">Next</button>
      <button onClick={() => onPage(totalPages)} disabled={page === totalPages} className="px-3 py-1 border rounded">Last</button>
    </div>
  );
}
