import React, { useState } from 'react';
import './AddReclamation.css';

const AddReclamation = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    reference: '',
    typeContrat: '',
    typeReclamation: '',
    commentaire: '',
    photo: null
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
    if (!formData.typeReclamation) newErrors.typeReclamation = 'Type de réclamation requis';
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
  formDataToSend.append('typeReclamation', formData.typeReclamation);
  formDataToSend.append('commentaire', formData.commentaire || '');
  formDataToSend.append('etatFinale', 'Attente'); // Optional: set or let backend default
  formDataToSend.append('userId', 1); // Adjust if dynamic
  formDataToSend.append('dateCreation', new Date().toISOString()); // Optional

  if (formData.photo) {
    formDataToSend.append('photo', formData.photo);
  }

  try {
    const response = await fetch('http://localhost:8080/api/reclamations', {
      method: 'POST',
      body: formDataToSend,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Échec de la création de la réclamation');
    }

    onSuccess();
    onClose();
  } catch (error) {
    console.error('Error:', error);
    setErrors({ submit: error.message || 'Erreur lors de la création de la réclamation' });
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Nouvelle réclamation</h2>
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
            <label>Type de réclamation</label>
            <select
              value={formData.typeReclamation}
              onChange={(e) => setFormData({ ...formData, typeReclamation: e.target.value })}
              className={errors.typeReclamation ? 'error' : ''}
            >
              <option value="">Sélectionner le type</option>
              {formData.typeContrat === 'EAU' ? (
                <>
                  <option value="REDRESSEMENT">Redressement</option>
                  <option value="CONTESTATION_FORFAIT">Contestation du forfait consommation</option>
                  <option value="FACTURATION_TORT">Facturation à tort d'une rubrique</option>
                  <option value="PAIEMENT_DOUBLE">Paiement double</option>
                  <option value="PAIEMENT_NON_IDENTIFIE">Paiement non identifié</option>
                  <option value="PAIEMENT_PLUS">Paiement en plus</option>
                  <option value="FACTURE_COMPLEMENTAIRE">Facture complémentaire</option>
                  <option value="AUTRE">Autre</option>
                </>
              ) : formData.typeContrat === 'ELECTRICITE' ? (
                <>
                  <option value="FACTURE_ELEVEE">Facture anormalement élevée</option>
                  <option value="COUPURES_FREQUENTES">Coupures fréquentes de courant</option>
                  <option value="PROBLEME_COMPTEUR">Problème de branchement ou compteur défectueux</option>
                  <option value="DOUBLE_FACTURATION">Double facturation ou erreur de période</option>
                  <option value="PAIEMENT_NON_PRIS">Non-prise en compte d'un paiement effectué</option>
                  <option value="RETARD_TRAITEMENT">Retard dans le traitement d'une demande</option>
                </>
              ) : null}
            </select>
            {errors.typeReclamation && <span className="error-text">{errors.typeReclamation}</span>}
          </div>

          <div className="form-group">
            <label>Commentaire</label>
            <textarea
              value={formData.commentaire}
              onChange={(e) => setFormData({ ...formData, commentaire: e.target.value })}
              rows="4"
              placeholder="Décrivez votre réclamation..."
            />
          </div>

          <div className="form-group">
            <label>Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFormData({ ...formData, photo: e.target.files[0] })}
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

export default AddReclamation;