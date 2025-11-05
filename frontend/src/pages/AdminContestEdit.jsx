import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import api from '../api';

export default function AdminContestEdit() {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [contest, setContest] = useState(null);
  const [problems, setProblems] = useState([]);
  const [message, setMessage] = useState('');

  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const [problemForm, setProblemForm] = useState({ title: '', statement: '', difficulty: 'easy', tags: '' });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await api.fetchContestById(id, token);
        setContest(res.contest);
        setProblems(res.problems || []);
        setTitle(res.contest.title || '');
        setStartTime(res.contest.start_time ? res.contest.start_time.substring(0,16) : '');
        setEndTime(res.contest.end_time ? res.contest.end_time.substring(0,16) : '');
      } catch (err) {
        console.error(err);
        setMessage(err.message || 'Failed to load contest');
      } finally {
        setLoading(false);
      }
    };
    if (token) load();
  }, [id, token]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await api.updateContestAdmin(token, id, { title, start_time: startTime, end_time: endTime });
      setMessage('Contest updated');
    } catch (err) {
      console.error(err);
      setMessage(err.message || 'Error updating contest');
    }
  };

  const handleDeleteContest = async () => {
    if (!confirm('Delete this contest? This cannot be undone.')) return;
    try {
      await api.deleteContestAdmin(token, id);
      navigate('/admin/contests');
    } catch (err) {
      console.error(err);
      setMessage(err.message || 'Error deleting contest');
    }
  };

  const handleRemoveProblem = async (pId) => {
    if (!confirm('Remove this problem from the contest?')) return;
    try {
      await api.removeProblemFromContestAdmin(token, id, pId);
      setProblems(prev => prev.filter(p => p.id !== pId));
      setMessage('Problem removed');
    } catch (err) {
      console.error(err);
      setMessage(err.message || 'Error removing problem');
    }
  };

  const handleAddProblem = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const tags = problemForm.tags.split(',').map(t => t.trim()).filter(Boolean);
      const probRes = await api.createProblem(token, {
        title: problemForm.title,
        statement: problemForm.statement,
        difficulty: problemForm.difficulty,
        tags,
      });
      // add problem to contest using faculty helper (works if same endpoint exists for admin) or direct admin route
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/admin/contests/${id}/problems`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ problemId: probRes.problemId }),
      });
      const refreshed = await api.fetchContestById(id, token);
      setProblems(refreshed.problems || []);
      setProblemForm({ title: '', statement: '', difficulty: 'easy', tags: '' });
      setMessage('Problem added to contest');
    } catch (err) {
      console.error(err);
      setMessage(err.message || 'Error adding problem');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="card p-6 bg-gray-800 rounded">
        <h2 className="text-xl font-semibold mb-3">Edit Contest #{id} (Admin)</h2>
        {message && <div className="text-green-400 mb-3">{message}</div>}
        <form onSubmit={handleUpdate} className="space-y-3">
          <input className="input w-full" value={title} onChange={e => setTitle(e.target.value)} />
          <div className="flex gap-2">
            <input type="datetime-local" className="input flex-1" value={startTime} onChange={e => setStartTime(e.target.value)} />
            <input type="datetime-local" className="input flex-1" value={endTime} onChange={e => setEndTime(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <button className="btn btn-primary" type="submit">Save changes</button>
            <button type="button" className="btn btn-danger" onClick={handleDeleteContest}>Delete contest</button>
          </div>
        </form>
      </div>

      <div className="card p-6 bg-gray-800 rounded">
        <h3 className="text-lg font-semibold mb-3">Problems in Contest</h3>
        {problems.length === 0 ? (
          <p className="text-gray-400">No problems yet</p>
        ) : (
          <ul className="space-y-2">
            {problems.map(p => (
              <li key={p.id} className="flex justify-between items-center p-2 bg-gray-900 rounded">
                <div>
                  <div className="font-medium text-white">{p.title}</div>
                  <div className="text-sm text-gray-400">{p.difficulty} — {p.tags}</div>
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-sm" onClick={() => navigate(`/problems/${p.id}`)}>View</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleRemoveProblem(p.id)}>Remove</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="card p-6 bg-gray-800 rounded">
        <h3 className="text-lg font-semibold mb-3">Create & Add Problem</h3>
        <form onSubmit={handleAddProblem} className="space-y-3">
          <input className="input w-full" placeholder="Title" value={problemForm.title} onChange={e => setProblemForm({...problemForm, title: e.target.value})} required />
          <textarea className="input w-full" placeholder="Statement" value={problemForm.statement} onChange={e => setProblemForm({...problemForm, statement: e.target.value})} required />
          <select className="input w-full" value={problemForm.difficulty} onChange={e => setProblemForm({...problemForm, difficulty: e.target.value})}>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <input className="input w-full" placeholder="Tags (comma separated)" value={problemForm.tags} onChange={e => setProblemForm({...problemForm, tags: e.target.value})} required />
          <button className="btn btn-secondary">Create & Add</button>
        </form>
      </div>
    </div>
  );
}
