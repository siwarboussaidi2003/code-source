import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ActionButtons.css';

const ActionButtons = () => {
  const navigate = useNavigate();

  return (
    <div className="action-buttons">
      <button 
        className="action-button"
        onClick={() => navigate('/factures')}
      >
        Consultation<br />des factures
      </button>
      <button 
        className="action-button"
        onClick={() => navigate('/reclamations')}
      >
        Réclamations
      </button>
      <button 
        className="action-button"
        onClick={() => navigate('/demandes')}
      >
        Demandes
      </button>
      <button 
        className="action-button"
        onClick={() => navigate('/interventions')}
      >
        Intervention
      </button>
    </div>
  );
};

export default ActionButtons;