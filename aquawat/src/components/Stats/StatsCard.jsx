import React from 'react';
import './StatsCard.css';

const StatsCard = ({ title, value, icon, bgColor }) => {
  return (
    <div className="stats-card">
      <div className="stats-info">
        <div className="stats-text">
          <p className="stats-label">{title}</p>
          <h3 className="stats-value">{value}</h3>
        </div>
        <div className={`stats-icon ${bgColor}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;