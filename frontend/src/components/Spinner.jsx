import React from 'react';

export default function Spinner({ size = 6 }) {
  return (
    <div className="flex items-center justify-center">
      <div className={`animate-spin rounded-full border-t-2 border-b-2 border-indigo-600`} style={{ width: `${size}rem`, height: `${size}rem` }} />
    </div>
  );
}
