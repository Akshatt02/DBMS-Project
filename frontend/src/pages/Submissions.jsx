import React, { useEffect, useState, useContext } from 'react';
import api from '../api';
import AuthContext from '../context/AuthContext';

export default function Submissions() {
  const { token } = useContext(AuthContext);
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true); setErr(null);
      try {
        const res = await api.getMySubmissions(token);
        setSubs(res.data || []);
      } catch (e) {
        setErr(e?.message || JSON.stringify(e));
      } finally { setLoading(false); }
    };
    load();
  }, [token]);

  return (
    <div>
      <div className="card mb-4">
        <h2 className="text-2xl">My Submissions</h2>
        <div className="muted">Latest submissions are shown below</div>
      </div>
      {loading && <div className="card">Loading...</div>}
      {err && <div className="card text-red-400">{err}</div>}
      <div className="space-y-3">
        {subs.map(s => (
          <div key={s.id} className="card flex justify-between items-center">
            <div>
              <div className="text-lg">{s.title}</div>
              <div className="muted text-sm">{new Date(s.created_at).toLocaleString()}</div>
            </div>
            <div className="badge">{s.verdict}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
