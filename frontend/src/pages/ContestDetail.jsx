// src/pages/ContestDetail.jsx
import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import AuthContext from '../context/AuthContext';
import ContestSubmissions from '../components/ContestSubmissions';
import ContestLeaderboard from '../components/ContestLeaderboard';
import ContestProblems from '../components/ContestProblems';

export default function ContestDetail() {
  const { id } = useParams();
  const { token, user } = useContext(AuthContext);

  const [contest, setContest] = useState(null);
  const [tab, setTab] = useState('leaderboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [registered, setRegistered] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [loadingParticipants, setLoadingParticipants] = useState(false);

  // Load contest data
  useEffect(() => {
    const loadContest = async () => {
      try {
        const data = await api.fetchContestProblems(id, token);
        console.log('Fetched contest data:', data);
        setContest(data.contest);
      } catch (err) {
        console.error('Error loading contest:', err);
        setError('Failed to load contest');
      } finally {
        setLoading(false);
      }
    };
    if (token) loadContest();
  }, [id, token]);

  // Load participants + registration state after contest loads
  useEffect(() => {
    const loadParticipants = async () => {
      if (!token || !contest) return;
      setLoadingParticipants(true);
      try {
        const data = await api.fetchContestParticipants(token, contest.id);
        setParticipants(data.participants || []);
        setRegistered(Boolean(data.registered));
      } catch (err) {
        console.error('Failed to load participants', err);
      } finally {
        setLoadingParticipants(false);
      }
    };
    loadParticipants();
  }, [token, contest?.id]);

  const handleRegister = async () => {
    if (!token) return alert('Please log in to register.');
    try {
      const data = await api.registerForContest(token, contest.id);
      setRegistered(true);
      setParticipants(data.participants || []);
    } catch (err) {
      console.error('Register error', err);
      alert(err?.message || 'Failed to register');
    }
  };

  if (loading) return <div className="card">Loading contest...</div>;
  if (error || !contest)
    return <div className="card text-red-500">{error || 'Contest not found'}</div>;

  const now = new Date();
  const start = new Date(contest.start_time);
  const end = new Date(contest.end_time);

  const isUpcoming = now < start;
  const isOngoing = now >= start && now <= end;
  const isPast = now > end;
  const showRegisterButton = (isUpcoming || isOngoing) && user;

  return (
    <div className="space-y-6">
      {/* Contest header */}
      <div className="card">
        <h1 className="text-2xl font-bold">{contest.title}</h1>
        <div className="text-sm text-gray-400">
          {contest.department_name ? `${contest.department_name} Department` : 'College-wide'}
        </div>
        <div className="mt-2 text-gray-500">
          {start.toLocaleString()} → {end.toLocaleString()}
        </div>

        {/* Tabs + Register Button */}
        <div className="mt-4 flex flex-wrap gap-2 items-center">
          <button
            className={`btn ${tab === 'leaderboard' ? 'btn-active' : ''}`}
            onClick={() => setTab('leaderboard')}
          >
            Leaderboard
          </button>
          <button
            className={`btn ${tab === 'submissions' ? 'btn-active' : ''}`}
            onClick={() => setTab('submissions')}
          >
            Submissions
          </button>
          <button
            className={`btn ${tab === 'problems' ? 'btn-active' : ''}`}
            onClick={() => setTab('problems')}
          >
            Problems
          </button>

          {showRegisterButton && (
            registered ? (
              <span className="badge badge-success">Registered</span>
            ) : (
              <button
                className="btn btn-outline"
                onClick={handleRegister}
                disabled={loadingParticipants}
              >
                {loadingParticipants ? 'Please wait...' : 'Register for Contest'}
              </button>
            )
          )}
        </div>
      </div>

      {/* Participants list */}
      <div className="card">
        <h3 className="text-lg font-semibold">
          Participants ({participants.length})
        </h3>
        {loadingParticipants ? (
          <div className="text-gray-500">Loading participants...</div>
        ) : participants.length > 0 ? (
          <div className="text-sm text-gray-400 mt-2 space-y-1">
            {participants.slice(0, 10).map((p) => (
              <div key={p.user_id}>{p.user_name}</div>
            ))}
            {participants.length > 10 && (
              <div className="text-gray-500">
                +{participants.length - 10} more
              </div>
            )}
          </div>
        ) : (
          <div className="text-gray-500">No participants yet.</div>
        )}
      </div>

      {/* Tabs */}
      {tab === 'leaderboard' && (
        <ContestLeaderboard contest={contest} token={token} />
      )}

      {tab === 'submissions' && (
        <ContestSubmissions contest={contest} token={token} />
      )}

      {tab === 'problems' && (
        <div className="card">
          {isUpcoming ? (
            <div className="text-gray-500">
              Contest hasn’t started yet. Problems will be visible once it begins.
            </div>
          ) : (
            <ContestProblems contestId={id} />
          )}
        </div>
      )}
    </div>
  );
}
