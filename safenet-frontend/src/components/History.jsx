// src/components/History.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import HelpButton from './HelpButton';

const History = () => {
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }
    const stored = JSON.parse(localStorage.getItem('history')) || [];
    const userHistory = stored.filter(entry => entry.username === user.username);
    setHistory(userHistory);
  }, [user, navigate]);

  // Filter by type, input, or result
  const filteredHistory = history.filter(entry => {
    const q = filter.toLowerCase();
    return (
      entry.type.toLowerCase().includes(q) ||
      entry.input.toLowerCase().includes(q) ||
      entry.result.toLowerCase().includes(q)
    );
  });

  return (
    <div className="container mt-5 relative">
      <h2>Classification History for {user?.username}</h2>

      {/* Search bar */}
      <div className="my-3">
        <input
          type="text"
          placeholder="Search history…"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="form-control"
        />
      </div>

      {/* Table */}
      {filteredHistory.length === 0 ? (
        <p>No matching history entries.</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Type</th>
              <th>Input</th>
              <th>Result</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.map((entry, idx) => (
              <tr key={idx}>
                <td>{entry.type}</td>
                <td>{entry.input}</td>
                <td>{entry.result}</td>
                <td>{entry.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Help icon */}
      <HelpButton message="&nbsp;Search your history by type, input text, or result label.&nbsp;" />
    </div>
  );
};

export default History;
