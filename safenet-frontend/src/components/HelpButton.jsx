// src/components/HelpButton.jsx
import React, { useState, useEffect } from 'react';
import { HelpCircle } from 'lucide-react';
import ReactDOM from 'react-dom';

export default function HelpButton({ message }) {
  const [open, setOpen] = useState(false);
  const [portalTarget, setPortalTarget] = useState(null);

  useEffect(() => {
    const target = document.getElementById('help-portal');
    if (!target) {
      const div = document.createElement('div');
      div.id = 'help-portal';
      document.body.appendChild(div);
      setPortalTarget(div);
    } else {
      setPortalTarget(target);
    }
  }, []);

  if (!portalTarget) return null;

  return ReactDOM.createPortal(
    <>
      {/* Floating question mark */}
      <button
        onClick={() => setOpen(o => !o)}
        className="position-fixed bottom-4 end-4 btn btn-primary rounded-circle"
        style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem',width: 56, height: 56, zIndex: 9999 }}
        aria-label="Help"
      >
        <HelpCircle size={24} color="white" />
      </button>

      {open && (
        <div
          className="position-fixed"
          style={{
            bottom: '5.5rem',
            right: '1rem',
            background: 'rgba(0,0,0,0.85)',
            color: 'white',
            padding: '1rem',
            borderRadius: '0.5rem',
            zIndex: 1050,
            maxWidth: '300px',
            boxShadow: '0 0 15px rgba(0,0,0,0.3)'
          }}
        >
          <p className="mb-2 small">{message}</p>
          {/* <button
            className="btn btn-sm btn-light"
            onClick={() => setOpen(false)}
          >
            Close
          </button> */}
        </div>
      )}
    </>,
    portalTarget
  );
}
