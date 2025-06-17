import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/photos/logo.png';
import './Header2.css';

const Header2 = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('user');

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/seconnecter');
  };

  return (
    <header className="header">
      <div className="header-left">
        <img src={logo} alt="AquaWatt" className="logo" />
        <span className="company-name">AquaWatt</span>
      </div>
      
      <span className="welcome-text">Bienvenue {userName || 'Foulen'}</span>

      <div className="header-right">
        <button className="disconnect-btn" onClick={handleLogout}>
          Se déconnecter
        </button>
      </div>
    </header>
  );
};

export default Header2;