// src/components/Classification.jsx
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Classification = () => {
  const [inputType, setInputType] = useState('text'); // 'text' or 'image'
  const [textInput, setTextInput] = useState('');
  const [imageInput, setImageInput] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  // Save classification history (using localStorage)
  const saveHistory = (entry) => {
    const history = JSON.parse(localStorage.getItem('history')) || [];
    history.push(entry);
    localStorage.setItem('history', JSON.stringify(history));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    setLoading(true);

    try {
      const payload = { type: inputType };
      if (inputType === 'text') {
        payload.text = textInput;
      } else {
        payload.image = imageInput;
      }
      const response = await axios.post('https://harm-api-production.up.railway.app/classify', payload);
      // For text: safe if label is "totally fine"; for images: safe if label is "not sensitive/harmful"
      const descriptiveMessage = inputType === 'text'
        ? `The text you submitted was classified as: ${response.data.label}. This means that ${response.data.label.includes('totally fine') ? "it appears safe." : "it may contain sensitive content."}`
        : `The image you submitted is ${response.data.label}. This indicates that ${response.data.label === "not sensitive/harmful" ? "the image appears safe." : "the image may contain harmful content."}`;
      setResult({ message: descriptiveMessage, label: response.data.label });
      
      if (user) {
        const historyEntry = {
          username: user.username,
          type: inputType,
          input: inputType === 'text' ? textInput : 'Image uploaded',
          result: response.data.label,
          timestamp: new Date().toLocaleString()
        };
        saveHistory(historyEntry);
      }
    } catch (error) {
      console.error("Error during classification:", error);
      setResult({ message: "There was an error processing your input. Please try again.", label: "" });
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImageInput(reader.result);
    reader.readAsDataURL(file);
  };

  // For text, safe if label includes "totally fine"
  const isSafe = inputType === 'text'
    ? result && result.label.includes("totally fine")
    : result && result.label === "not sensitive/harmful";

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Content Classification</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Select Input Type:</label>
          <select 
            className="form-select" 
            value={inputType} 
            onChange={(e) => {
              setInputType(e.target.value);
              setResult(null);
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
              onChange={(e) => setTextInput(e.target.value)} 
              rows="4" 
              required
            ></textarea>
          </div>
        ) : (
          <div className="mb-3">
            <label className="form-label">Upload Image:</label>
            <input 
              type="file" 
              accept="image/*" 
              className="form-control" 
              onChange={handleImageChange} 
              required
            />
          </div>
        )}
        <button type="submit" className="btn btn-custom">Classify</button>
      </form>
      {loading && (
        <div className="loader">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      {result && !loading && (
        <div 
          className="result-box mt-4"
          style={{ backgroundColor: isSafe ? "#d1e7dd" : "#f8d7da", color: isSafe ? "#0f5132" : "#842029" }}
        >
          <h5>Result</h5>
          <p>{result.message}</p>
        </div>
      )}
    </div>
  );
};

export default Classification;
