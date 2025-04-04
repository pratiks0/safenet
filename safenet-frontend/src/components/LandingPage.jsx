// src/components/LandingPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="landing-container">
      <div className="container">
        <h1>Welcome to SafeNet</h1>
        <p>Detect and classify harmful content in text and images.</p>
        <Link to="/classify" className="btn btn-custom btn-lg">
          Get Started
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
