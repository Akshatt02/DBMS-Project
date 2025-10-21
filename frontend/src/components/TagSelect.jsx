import React, { useState, useEffect, useRef } from 'react';

export default function TagSelect({ tags = [], selected = [], onChange }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const containerRef = useRef();

  useEffect(() => {
    const onDoc = (e) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  const toggleTag = (tag) => {
    if (selected.includes(tag)) onChange(selected.filter(t => t !== tag));
    else onChange([...selected, tag]);
  };

  const filtered = tags.filter(t => t.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="relative" ref={containerRef}>
      <button onClick={() => setOpen(s => !s)} className="border rounded px-3 py-2 flex items-center gap-2 bg-white">
        <span className="text-sm text-gray-700">Tags</span>
        <span className="text-xs text-gray-500">{selected.length ? `${selected.length} selected` : 'Any'}</span>
      </button>

      {open && (
        <div className="absolute mt-2 right-0 w-64 bg-white shadow-lg border rounded z-40">
          <div className="p-2">
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search tags" className="w-full border p-2 rounded text-sm" />
          </div>
          <div className="max-h-56 overflow-auto px-2 pb-2">
            {filtered.length === 0 && <div className="p-2 text-sm text-gray-500">No tags</div>}
            {filtered.map(tag => (
              <label key={tag} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                <input type="checkbox" checked={selected.includes(tag)} onChange={() => toggleTag(tag)} />
                <span className="text-sm text-gray-700">{tag}</span>
              </label>
            ))}
          </div>
          <div className="flex justify-between p-2 border-t">
            <button onClick={() => onChange([])} className="text-sm text-indigo-600">Clear</button>
            <button onClick={() => setOpen(false)} className="text-sm text-gray-600">Done</button>
          </div>
        </div>
      )}
    </div>
  );
}
