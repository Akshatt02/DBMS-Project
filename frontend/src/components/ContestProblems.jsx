import React, { useEffect, useState, useContext } from 'react';
import api from '../api';
import AuthContext from '../context/AuthContext';

const VERDICTS = ['AC', 'WA', 'TLE', 'RE', 'CE'];

export default function ContestProblems({ contestId, onSubmit, registered }) {
  const { token, user } = useContext(AuthContext);
  const [contest, setContest] = useState(null);
  const [problems, setProblems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState({});
  const [busy, setBusy] = useState({});
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await api.fetchContestProblems(contestId, token);
        setContest(data.contest || null);
        setProblems(data.problems || []);
        setFiltered(data.problems || []);

        const init = {};
        (data.problems || []).forEach(p => (init[p.id] = VERDICTS[0]));
        setSelected(init);
      } catch (err) {
        setError(err?.message || 'Failed to load contest problems');
      } finally {
        setLoading(false);
      }
    };
    if (token) load();
  }, [contestId, token]);

  useEffect(() => {
    const s = search.trim().toLowerCase();
    if (!s) setFiltered(problems);
    else setFiltered(problems.filter(p => p.title.toLowerCase().includes(s)));
  }, [search, problems]);

  if (loading) return <div className="card">Loading problems...</div>;
  if (error) return <div className="card text-red-500">{error}</div>;
  if (!contest) return <div className="card">Contest not found</div>;

  const now = new Date();
  const start = new Date(contest.start_time);
  const end = new Date(contest.end_time);
  const isOngoing = now >= start && now <= end;
  const isPast = now > end;
  const canSubmit = isOngoing;

  const handleSelect = (pid, v) => setSelected(prev => ({ ...prev, [pid]: v }));

  const submit = async (p) => {
    if (!token) return setError('You must be logged in to submit');
    if (!canSubmit) return setError('Submissions are allowed only while contest is running');
    if (!registered) return setError('You must register for the contest to submit solutions');

    const verdict = selected[p.id] || VERDICTS[0];
    setBusy(prev => ({ ...prev, [p.id]: true }));
    setMsg('');
    setError('');

    try {
      await api.createSubmission(token, {
        contest_id: contestId,
        problem_id: p.id,
        verdict
      });
      if (typeof onSubmit === 'function') onSubmit();
      setMsg(`Submission saved: ${p.title} — ${verdict}`);
    } catch (err) {
      console.error(err);
      setError(err?.message || 'Submission failed');
    } finally {
      setBusy(prev => ({ ...prev, [p.id]: false }));
      setTimeout(() => setMsg(''), 5000);
    }
  };

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <h2 className="text-xl font-bold">Contest Problems</h2>
          <div className="text-sm text-gray-500">
            {start.toLocaleString()} → {end.toLocaleString()}
          </div>
        </div>

        <input
          type="text"
          placeholder="🔍 Search by problem name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mt-3 w-full p-2 rounded border bg-gray-800 text-white"
        />

        {!canSubmit && isPast && (
          <div className="mt-2 text-sm text-gray-400">Contest finished — submissions closed.</div>
        )}
        {!canSubmit && !isPast && (
          <div className="mt-2 text-sm text-gray-400">Contest not started yet.</div>
        )}

        {msg && <div className="mt-3 text-green-500">{msg}</div>}
        {error && <div className="mt-3 text-red-500">{error}</div>}
      </div>

      {filtered.length === 0 && <div className="card">No problems found.</div>}

      <div className="grid gap-3">
        {filtered.map((p) => (
          <div key={p.id} className="card p-4 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <div className="font-semibold">{p.title}</div>
              <div className="text-sm text-gray-400">
                Difficulty: {p.difficulty} {p.tags ? `| Tags: ${p.tags}` : ''}
              </div>
            </div>

            <div className="mt-3 md:mt-0 flex items-center gap-2">
              <select
                value={selected[p.id] ?? VERDICTS[0]}
                onChange={(e) => handleSelect(p.id, e.target.value)}
                disabled={!canSubmit || busy[p.id]}
                className="p-2 rounded border bg-gray-900 text-white"
              >
                {VERDICTS.map(v => <option key={v} value={v}>{v}</option>)}
              </select>

              <button
                className="btn btn-primary"
                onClick={() => submit(p)}
                disabled={!canSubmit || busy[p.id] || !registered}
              >
                {busy[p.id] ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
