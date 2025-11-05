import React, { useState, useEffect } from 'react';
import api from '../api';

export default function RatingManager({ contest, participants, token, onUpdated }) {
  const [local, setLocal] = useState([]);
  const [saving, setSaving] = useState({});

  useEffect(() => {
    setLocal(
      participants.map(p => ({
        ...p,
        newRating: p.rating_after ?? p.rating_before,
      }))
    );
  }, [participants]);

  const handleChange = (userId, value) => {
    setLocal((l) =>
      l.map(p =>
        p.user_id === userId ? { ...p, newRating: Number(value) } : p
      )
    );
  };

  const save = async (userId) => {
    const p = local.find(x => x.user_id === userId);
    if (!p) return;

    if (p.rating_after !== null && typeof p.rating_after !== 'undefined') {
      alert('Rating already set and cannot be changed');
      return;
    }

    setSaving(s => ({ ...s, [userId]: true }));
    try {
      await api.updateParticipantRating(token, contest.id, userId, p.newRating);
      if (onUpdated) await onUpdated();
    } catch (err) {
      alert(err?.message || 'Failed to update rating');
    } finally {
      setSaving(s => ({ ...s, [userId]: false }));
    }
  };

  if (!participants || participants.length === 0) return null;

  return (
    <div className="card bg-base-100 p-5 shadow-md">
      <h3 className="text-xl font-semibold mb-4">Rating Manager</h3>

      <div className="overflow-x-auto">
        <table className="table w-full border">
          <thead>
            <tr className="bg-base-200">
              <th className="py-2 px-3 text-left">Participant</th>
              <th className="py-2 px-3 text-center">Rating Before</th>
              <th className="py-2 px-3 text-center">Rating After</th>
              <th className="py-2 px-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {local.map((p) => (
              <tr key={p.user_id} className="border-t hover:bg-base-200/40">
                <td className="py-2 px-3">{p.user_name}</td>
                <td className="py-2 px-3 text-center">{p.rating_before ?? '-'}</td>
                <td className="py-2 px-3 text-center">
                  {p.rating_after !== null && typeof p.rating_after !== 'undefined' ? (
                    <span>{p.rating_after}</span>
                  ) : (
                    <input
                      type="number"
                      className="input input-bordered input-sm w-24 text-center"
                      value={p.newRating}
                      onChange={(e) => handleChange(p.user_id, e.target.value)}
                    />
                  )}
                </td>
                <td className="py-2 px-3 text-center">
                  {p.rating_after !== null && typeof p.rating_after !== 'undefined' ? (
                    <button className="btn btn-sm btn-disabled opacity-70 cursor-not-allowed">
                      Locked
                    </button>
                  ) : (
                    <button
                      className={`btn btn-sm btn-primary ${
                        saving[p.user_id] ? 'loading' : ''
                      }`}
                      onClick={() => save(p.user_id)}
                      disabled={saving[p.user_id]}
                    >
                      {saving[p.user_id] ? 'Saving...' : 'Save'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
