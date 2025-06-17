// src/components/Users/EditUserPopup.jsx
import React, { useState, useEffect } from 'react';
import './EditUserPopup.css';

const EditUserPopup = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    cin: '',
    telephone: '',
    email: '',
    role: '',
    enabled: false
  });

  useEffect(() => {
    if (user) {
      setFormData({ ...user });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        <h2>Modifier l'utilisateur</h2>
        <form onSubmit={handleSubmit}>
          <input name="nom" value={formData.nom} onChange={handleChange} placeholder="Nom" />
          <input name="prenom" value={formData.prenom} onChange={handleChange} placeholder="Prénom" />
          <input name="cin" value={formData.cin} onChange={handleChange} placeholder="CIN" />
          <input name="telephone" value={formData.telephone} onChange={handleChange} placeholder="Téléphone" />
          <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
          <input name="role" value={formData.role} onChange={handleChange} placeholder="Rôle" />
          <label>
            Activé :
            <input type="checkbox" name="enabled" checked={formData.enabled} onChange={handleChange} />
          </label>
          <div className="popup-actions">
            <button type="submit">Enregistrer</button>
            <button type="button" onClick={onClose}>Annuler</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserPopup;
