import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../../assets/photos/logo.png';
import { IoArrowBack } from 'react-icons/io5';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const handleBack = () => {
    if (location.pathname.includes('/seconnecter') || 
        location.pathname.includes('/sinscrire')) {
      navigate('/');
    } else if (location.pathname.includes('/factures')) {
      navigate('/dashboard');
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="header-container">
      <div className="header-left">
        <img src={logo} alt="AquaWatt" className="logo" />
        <span className="company-name">AquaWatt</span>
      </div>

      {isHomePage && (
        <div>
          <button onClick={() => navigate("/LoginAdmin")} className="Adminbutton">Admin</button>
        </div>
      )}

      {!isHomePage && (
        <div className="header-right">
          <span className="welcome-text"></span>
          <button className="back-button" onClick={handleBack}>
            <IoArrowBack />
          </button>
        </div>
      )}
    </div>
  );
};

export default Header;
