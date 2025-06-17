import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './UserInfo.css';

const UserInfo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userInfo, setUserInfo] = useState({
    nom: 'Chaouachi Emna',
    reference: '12345678',
    localisation: 'Tunis, Les Berges du Lac'
  });

  useEffect(() => {
    if (location.state) {
      setUserInfo(prev => ({
        ...prev,
        reference: location.state.reference,
        localisation: location.state.localisation
      }));
    }
  }, [location]);

  return (
    <div className="user-info">
      <button 
        className="contract-list-button"
        onClick={() => navigate('/contrat')}
      >
        Liste des contrats
      </button>
      <div className="info-card">
        <div className="info-row">
          <span className="info-label">Nom et Prénom</span>
          <span className="info-value">{userInfo.nom}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Référence</span>
          <span className="info-value">{userInfo.reference}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Localisation</span>
          <span className="info-value">{userInfo.localisation}</span>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;