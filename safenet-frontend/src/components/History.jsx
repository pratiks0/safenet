// src/components/History.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const History = () => {
  const [history, setHistory] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }
    const storedHistory = JSON.parse(localStorage.getItem('history')) || [];
    const userHistory = storedHistory.filter(entry => entry.username === user.username);
    setHistory(userHistory);
  }, [user, navigate]);

  return (
    <div className="container mt-5">
      <h2>Classification History for {user && user.username}</h2>
      {history.length === 0 ? (
        <p>No history available.</p>
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
            {history.map((entry, index) => (
              <tr key={index}>
                <td>{entry.type}</td>
                <td>{entry.input}</td>
                <td>{entry.result}</td>
                <td>{entry.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default History;
