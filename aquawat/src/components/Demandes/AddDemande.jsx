import React, { useState } from 'react';
import './AddDemande.css';

const AddDemande = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    reference: '',
    typeContrat: '',
    typeDemande: '',
    commentaire: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.reference) {
      newErrors.reference = 'Référence requise';
    } else if (!/^\d{6,8}$/.test(formData.reference)) {
      newErrors.reference = 'La référence doit contenir entre 6 et 8 chiffres';
    }
    if (!formData.typeContrat) newErrors.typeContrat = 'Type de contrat requis';
    if (!formData.typeDemande) newErrors.typeDemande = 'Type de demande requis';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const formDataToSend = new FormData();

    formDataToSend.append('reference', formData.reference);
    formDataToSend.append('typeContrat', formData.typeContrat);
    formDataToSend.append('typeDemande', formData.typeDemande);
    formDataToSend.append('commentaire', formData.commentaire || '');
    formDataToSend.append('etatFinale', 'Attente'); // Optionnel
    formDataToSend.append('userId', 1); // Adapter si dynamique
    formDataToSend.append('dateCreation', new Date().toISOString()); // Optionnel


    try {
      const response = await fetch('http://localhost:8080/api/demandes', {
        method: 'POST',
        body: formDataToSend,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Échec de la création de la demande');
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error:', error);
      setErrors({ submit: error.message || 'Erreur lors de la création de la demande' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Nouvelle demande</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Référence</label>
            <input
              type="text"
              value={formData.reference}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                setFormData({ ...formData, reference: value });
              }}
              className={errors.reference ? 'error' : ''}
              placeholder="Entrez 6 à 8 chiffres"
              maxLength="8"
            />
            {errors.reference && <span className="error-text">{errors.reference}</span>}
          </div>

          <div className="form-group">
            <label>Type de contrat</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  value="EAU"
                  checked={formData.typeContrat === 'EAU'}
                  onChange={(e) => setFormData({ ...formData, typeContrat: e.target.value })}
                /> Eau
              </label>
              <label>
                <input
                  type="radio"
                  value="ELECTRICITE"
                  checked={formData.typeContrat === 'ELECTRICITE'}
                  onChange={(e) => setFormData({ ...formData, typeContrat: e.target.value })}
                /> Électricité
              </label>
            </div>
            {errors.typeContrat && <span className="error-text">{errors.typeContrat}</span>}
          </div>

          <div className="form-group">
            <label>Type de demande</label>
            <select
              value={formData.typeDemande}
              onChange={(e) => setFormData({ ...formData, typeDemande: e.target.value })}
              className={errors.typeDemande ? 'error' : ''}
            >
              <option value="">Sélectionner le type</option>
              {(formData.typeContrat === 'EAU' || formData.typeContrat === 'ELECTRICITE') && (
                <>
                  <option value="MUTATION">Mutation</option>
                  <option value="REABONNEMENT">Réabonnement</option>
                  <option value="RESILIATION">Résiliation</option>
                  <option value="REPRISE_BRANCHEMENT">Reprise de Branchement</option>
                  <option value="SEPARATION_COMPTEUR">Séparation Compteur</option>
                </>
              )}
            </select>
            {errors.typeDemande && <span className="error-text">{errors.typeDemande}</span>}
          </div>

          <div className="form-group">
            <label>Commentaire</label>
            <textarea
              value={formData.commentaire}
              onChange={(e) => setFormData({ ...formData, commentaire: e.target.value })}
              rows="4"
              placeholder="Décrivez votre demande..."
            />
          </div>

          {errors.submit && <div className="error-message">{errors.submit}</div>}

          <div className="button-group">
            <button type="button" onClick={onClose} className="cancel-btn" disabled={isSubmitting}>
              Annuler
            </button>
            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDemande;
