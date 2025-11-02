import React, { useEffect, useState, useContext } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import api from '../api';
import AuthContext from '../context/AuthContext';

const VERDICTS = ['AC', 'WA', 'TLE', 'RE', 'CE'];

export default function ProblemDetail() {
    const { id } = useParams();
    const { state } = useLocation();
    const { token } = useContext(AuthContext);
    const [problem, setProblem] = useState(state?.problem || null);
    const [verdict, setVerdict] = useState('AC');
    const [ok, setOk] = useState(null);
    const [err, setErr] = useState(null);

    useEffect(() => {
        const load = async () => {
            if (problem) return;
            try {
                const res = await api.fetchProblems(token, { limit: 1000 });
                const found = (res.data || []).find(p => String(p.id) === String(id));
                setProblem(found || null);
            } catch (e) {
                console.error(e);
            }
        };
        load();
    }, [id]);

    const submit = async (e) => {
        e.preventDefault(); setOk(null); setErr(null);
        if (!problem) return setErr('No problem loaded');
        try {
            await api.createSubmission(token, { problem_id: problem.id, verdict });
            setOk('Submission saved');
        } catch (e) {
            setErr(e?.message || JSON.stringify(e));
        }
    };

    if (!problem) return <div className="card">Problem not found or loading...</div>;

    return (
        <div className="space-y-4">
            <div className="card">
                <h2 className="text-2xl">{problem.title}</h2>
                <div className="muted mb-2">Difficulty: {problem.difficulty} • AC%: {problem.ac_percent ?? 0}</div>
                <div className="mt-3 p-3 bg-transparent border border-white/5 rounded" dangerouslySetInnerHTML={{ __html: problem.statement }} />
            </div>

            <div className="card">
                <h3 className="text-lg mb-2">Submit (simulated)</h3>
                {ok && <div className="text-green-400">{ok}</div>}
                {err && <div className="text-red-400">{err}</div>}
                <form onSubmit={submit} className="flex items-center gap-3">
                    <select value={verdict} onChange={e => setVerdict(e.target.value)} className="p-2 rounded bg-transparent border border-white/5">
                        {VERDICTS.map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                    <button className="btn btn-primary">Submit</button>
                </form>
            </div>
        </div>
    );
}
