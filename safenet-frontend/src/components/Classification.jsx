// src/components/Classification.jsx
import React, { useState, useContext, useRef } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import HelpButton from './HelpButton';

const Classification = () => {
  const [inputType, setInputType] = useState('text');
  const [textInput, setTextInput] = useState('');
  const [imageInput, setImageInput] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const { user } = useContext(AuthContext);
  const fileInputRef = useRef();

  // 1) Save to history
  const saveHistory = (entry) => {
    const history = JSON.parse(localStorage.getItem('history')) || [];
    history.push(entry);
    localStorage.setItem('history', JSON.stringify(history));
  };

  // 2) Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const payload = { type: inputType };
      if (inputType === 'text') payload.text = textInput;
      else payload.image = imageInput;

      const { data } = await axios.post(
        'https://harm-api-production.up.railway.app/classify',
        payload
      );

      const { label, score } = data;
      const message = `Classified as: ${label}`;

      setResult({ label, score, message });

      if (user) {
        saveHistory({
          username: user.username,
          type: inputType,
          input: inputType === 'text' ? textInput : 'Image uploaded',
          result: label,
          timestamp: new Date().toLocaleString(),
        });
      }
    } catch (err) {
      console.error(err);
      setResult({ label: 'Error', score: null, message: 'Processing error.' });
    } finally {
      setLoading(false);
    }
  };

  // 3) File reader
  const handleFile = (file) => {
    if (!file) return;

    if (file.type.startsWith('image/')) {
      setInputType('image');
      const reader = new FileReader();
      reader.onloadend = () => setImageInput(reader.result);
      reader.readAsDataURL(file);
      setTextInput('');
    } else if (file.type === 'text/plain') {
      setInputType('text');
      const reader = new FileReader();
      reader.onload = () => setTextInput(reader.result);
      reader.readAsText(file);
      setImageInput(null);
    }
  };

  // 4) Drag & drop
  const onDragEnter = e => { e.preventDefault(); setDragOver(true); };
  const onDragOver  = e => { e.preventDefault(); setDragOver(true); };
  const onDragLeave = e => { e.preventDefault(); setDragOver(false); };
  const onDrop      = e => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  // 5) Copy result
  const copyResult = () => {
    if (!result) return;
    const txt = result.score != null
      ? `${result.label} (${result.score.toFixed(2)})`
      : result.label;
    navigator.clipboard.writeText(txt);
    alert(`Copied: ${txt}`);
  };

  // 6) Safe styling
  const isSafe = result && (
    result.label.includes('totally fine') ||
    result.label === 'not sensitive/harmful'
  );

  return (
    <div className="container mt-5"
         onDragEnter={onDragEnter}
         onDragOver={onDragOver}
         onDragLeave={onDragLeave}
         onDrop={onDrop}
    >
      <h2 className="mb-4">Content Classification</h2>

      {/* Drop Zone */}
      <div
        className={`mb-4 p-4 text-center rounded 
          ${dragOver ? 'border border-primary bg-light' : 'border border-secondary'}`}
        style={{ borderStyle: 'dashed', cursor: 'pointer' }}
        onClick={() => fileInputRef.current.click()}
      >
        <p className="h5 text-secondary mb-1">
          {imageInput
            ? '🖼️ Image selected'
            : textInput
              ? '📄 Text selected'
              : 'Drag & drop an image or text file here'}
        </p>
        {!imageInput && !textInput && (
          <p className="text-secondary small ">or click to browse</p>
        )}
        <input
          type="file"
          accept="text/plain,image/*"
          ref={fileInputRef}
          onChange={e => handleFile(e.target.files[0])}
          style={{ display: 'none' }}
        />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Select Input Type:</label>
          <select
            className="form-select"
            value={inputType}
            onChange={e => {
              const val = e.target.value;
              setInputType(val);
              setResult(null);
              if (val === 'text') {
                setImageInput(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              } else {
                setTextInput('');
              }
            }}
          >
            <option value="text">Text</option>
            <option value="image">Image</option>
          </select>
        </div>

        {inputType === 'text' ? (
          <div className="mb-3">
            <label className="form-label">Enter Text:</label>
            <textarea
              className="form-control"
              value={textInput}
              onChange={e => setTextInput(e.target.value)}
              rows="4"
              required
            />
          </div>
        ) : (
          <div className="mb-3">
            {/* <label className="form-label">Upload Image:</label> */}
            {imageInput && (
              <div className="mb-3 text-center">
                <img
                  src={imageInput}
                  alt="Preview"
                  className="img-fluid rounded"
                  style={{ maxHeight: '200px' }}
                />
              </div>
            )}
            {/* <input
              type="file"
              accept="image/*"
              className="form-control"
              onChange={e => handleFile(e.target.files[0])}
              required={!imageInput}
            /> */}
          </div>
        )}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Processing…' : 'Classify'}
        </button>
      </form>

      {/* Loading Spinner */}
      {loading && (
        <div className="text-center my-4">
          <div className="spinner-border text-primary" role="status" />
        </div>
      )}

      {/* Result + Copy */}
      {result && !loading && (
        <div
          className="position-relative mt-4 p-4 rounded"
          style={{
            backgroundColor: isSafe ? '#d1e7dd' : '#f8d7da',
            color: isSafe ? '#0f5132' : '#842029',
          }}
        >
          <h5>Result</h5>
          <p>{result.message}</p>
          <button
            onClick={copyResult}
            className="btn btn-outline-secondary btn-lg position-absolute"
            style={{ top: '0.75rem', right: '0.75rem' }}
          >
            📋 Copy
          </button>
        </div>
      )}

      <HelpButton message="&nbsp;Drag-and-drop a file here or use the form above to classify content.&nbsp;" />
    </div>
  );
};

export default Classification;
