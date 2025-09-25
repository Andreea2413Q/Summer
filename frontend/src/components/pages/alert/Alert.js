import React from 'react';

const Home = () => {
  return (
    <div className="page-container">
      <h1>🏠 Home</h1>
      <p>Welcome to Forest Guardian - protecting our planet's forests together.</p>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Trees Saved</h3>
          <p className="stat-number">12,847</p>
        </div>
        <div className="stat-card">
          <h3>Active Alerts</h3>
          <p className="stat-number">23</p>
        </div>
        <div className="stat-card">
          <h3>Protected Areas</h3>
          <p className="stat-number">156</p>
        </div>
      </div>
    </div>
  );
};

export default Home;