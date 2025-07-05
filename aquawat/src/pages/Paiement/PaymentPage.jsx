import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header2 from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import PaymentForm from '../../components/paiement/PaymentForm';
import './PaymentPage.css';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedInvoice = location.state?.selectedInvoice;
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!selectedInvoice) {
    navigate('/factures');
    return null;
  }

  const handlePayment = async (paymentData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`http://localhost:8080/api/factures/${selectedInvoice.id}/payer`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          nomCarte: paymentData.cardName,
          numeroCarte: paymentData.cardNumber.replace(/\s/g, ''),
          dateExpiration: paymentData.expiryDate,
          codeSecurite: paymentData.cvv
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Payment failed');
      }

      const updatedInvoice = await response.json();
      setShowPaymentForm(false);
      navigate('/factures', { 
        state: { 
          paymentSuccess: true,
          message: 'Payment processed successfully'
        }
      });
    } catch (error) {
      console.error('Payment error:', error);
      setError(error.message || 'Failed to process payment');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <div className="payment-page">
      <Header2 />
      <main className="payment-content">
        <h1 className="payment-title">Paiement en ligne</h1>
        {error && <div className="error-message">{error}</div>}
        <div className="payment-single-container">
          <table className="payment-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Référence</th>
                <th>Type</th>
                <th>Montant Total</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{formatDate(selectedInvoice.date)}</td>
                <td>{selectedInvoice.reference}</td>
                <td>{selectedInvoice.type}</td>
                <td>{selectedInvoice.montant} DT</td>
                <td>
                  <span className={`status-badge ${selectedInvoice.statut.toLowerCase()}`}>
                    {selectedInvoice.statut}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="payment-actions">
            <button 
              className="pay-button"
              onClick={() => setShowPaymentForm(true)}
              disabled={loading || selectedInvoice.statut === 'Payé'}
            >
              {loading ? 'Processing...' : 'Payer'}
            </button>
          </div>
        </div>
      </main>
      {showPaymentForm && (
        <PaymentForm 
          onClose={() => setShowPaymentForm(false)}
          onSubmit={handlePayment}
          amount={selectedInvoice.montant}
          loading={loading}
        />
      )}
      <Footer />
    </div>
  );
};

export default PaymentPage;