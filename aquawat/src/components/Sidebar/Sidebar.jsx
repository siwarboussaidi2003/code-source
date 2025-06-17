import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';
import logo from '../../assets/photos/logo.png';

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="sidebar">
      <div className="logo-container">
        <div className="logo-header">
          <img src={logo} alt="AquaWatt" className="logo" />
          <span className="company-name">AquaWatt</span>
        </div>
      </div>

      <nav className="nav-menu">
        <Link to="/dash" className={`nav-item ${location.pathname === '/dash' ? 'active' : ''}`}>
          Accueil
        </Link>
        <Link to="/admin-users" className={`nav-item ${location.pathname === '/admin-users' ? 'active' : ''}`}>
          Liste des utilisateurs
        </Link>
        <Link to="/admin-requests" className={`nav-item ${location.pathname === '/admin-requests' ? 'active' : ''}`}>
          Liste des demandes
        </Link>
        <Link to="/admin-claims" className={`nav-item ${location.pathname === '/admin-claims' ? 'active' : ''}`}>
          Liste des réclamations
        </Link>
        <Link to="/" className="nav-item logout">
          Se déconnecter
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;