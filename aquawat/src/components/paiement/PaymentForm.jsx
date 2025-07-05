import React, { useState } from 'react';
import './PaymentForm.css';

const PaymentForm = ({ invoice, onClose, onPaymentComplete }) => {
  const [formData, setFormData] = useState({
    nomCarte: '',
    numeroCarte: '',
    dateExpiration: '',
    codeSecurite: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleCardName = (e) => {
    const value = e.target.value.replace(/[^A-Za-z\s]/g, '').toUpperCase();
    setFormData({ ...formData, nomCarte: value });
  };

  const handleCardNumber = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    setFormData({ ...formData, numeroCarte: value });
  };

  const handleExpiryDate = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      const month = parseInt(value.slice(0, 2));
      if (month > 12) value = '12' + value.slice(2);
      value = value.slice(0, 2) + (value.length > 2 ? '/' + value.slice(2) : '');
    }
    if (value.length > 5) value = value.slice(0, 5);
    setFormData({ ...formData, dateExpiration: value });
  };

  const handleSecurityCode = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 3);
    setFormData({ ...formData, codeSecurite: value });
  };

  const validateForm = () => {
    if (formData.nomCarte.trim().length < 3) {
      throw new Error('Le nom sur la carte est invalide');
    }
    if (formData.numeroCarte.replace(/\s/g, '').length !== 16) {
      throw new Error('Le numéro de carte doit contenir 16 chiffres');
    }
    if (!/^\d{2}\/\d{2}$/.test(formData.dateExpiration)) {
      throw new Error('La date d\'expiration doit être au format MM/YY');
    }
    const [month, year] = formData.dateExpiration.split('/');
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;
    if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
      throw new Error('La carte est expirée');
    }
    if (formData.codeSecurite.length !== 3) {
      throw new Error('Le code de sécurité doit contenir 3 chiffres');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      validateForm();

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Utilisateur non authentifié. Veuillez vous reconnecter.');
      }

      const paymentData = {
        nomCarte: formData.nomCarte,
        numeroCarte: formData.numeroCarte.replace(/\s/g, ''),
        dateExpiration: formData.dateExpiration,
        codeSecurite: formData.codeSecurite,
        factureId: invoice.id,
        montant: invoice.montant
      };

      const response = await fetch(`http://localhost:8080/api/factures/${invoice.id}/payer`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json' // Ajout indispensable
        },
        body: JSON.stringify(paymentData)
      });

      if (!response.ok) {
        let errorMessage = 'Erreur lors du paiement';
        try {
          const errorData = await response.json();
          if (errorData.message) errorMessage = errorData.message;
        } catch (e) {
          // réponse non JSON, on garde message générique
        }
        throw new Error(errorMessage);
      }

      await onPaymentComplete();
      onClose();
    } catch (error) {
      console.error('Erreur lors du paiement:', error);
      setError(error.message || 'Erreur lors du paiement. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="payment-form">
          <h2>Paiement de facture</h2>
          <div className="invoice-details">
            <p className="amount">Montant: {invoice.montant} DT</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nom sur la carte *</label>
              <input
                type="text"
                value={formData.nomCarte}
                onChange={handleCardName}
                placeholder="CHAOUACHI EMNA"
                className="input-field"
                required
                minLength={3}
              />
            </div>

            <div className="form-group">
              <label>Numéro de carte *</label>
              <input
                type="text"
                value={formData.numeroCarte}
                onChange={handleCardNumber}
                placeholder="2222 2222 2222 2222"
                className="input-field"
                required
                maxLength="19"
              />
            </div>

            <div className="two-columns">
              <div className="form-group">
                <label>Date d'expiration *</label>
                <input
                  type="text"
                  value={formData.dateExpiration}
                  onChange={handleExpiryDate}
                  placeholder="MM/YY"
                  className="input-field"
                  required
                  maxLength="5"
                />
              </div>
              <div className="form-group">
                <label>Code de sécurité *</label>
                <input
                  type="password"
                  value={formData.codeSecurite}
                  onChange={handleSecurityCode}
                  placeholder="123"
                  className="input-field"
                  required
                  maxLength="3"
                />
              </div>
            </div>

            <div className="button-group">
              <button
                type="button"
                className="cancel-button"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Traitement...' : 'Payer maintenant'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
