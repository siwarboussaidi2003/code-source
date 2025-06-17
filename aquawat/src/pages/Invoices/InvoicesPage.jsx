import React, { useState, useEffect } from 'react';
import InvoiceList from '../../components/InvoiceList/InvoiceList';
import PaymentForm from '../../components/paiement/PaymentForm';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './InvoicesPage.css';

const InvoicesPage = () => {
  const [paidInvoices, setPaidInvoices] = useState([]);
  const [unpaidInvoices, setUnpaidInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const userId = 1;
      const [unpaidResponse, paidResponse] = await Promise.all([
        fetch(`http://localhost:8080/api/factures/user/${userId}/en-attente`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }),
        fetch(`http://localhost:8080/api/factures/user/${userId}/payees`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
      ]);

      if (!unpaidResponse.ok || !paidResponse.ok) {
        throw new Error('Erreur lors du chargement des factures');
      }

      const [unpaidData, paidData] = await Promise.all([
        unpaidResponse.json(),
        paidResponse.json()
      ]);

      setUnpaidInvoices(unpaidData);
      setPaidInvoices(paidData);
      setError(null);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handlePayment = (invoice) => {
    setSelectedInvoice(invoice);
    setShowPaymentForm(true);
  };

  const handlePaymentComplete = async () => {
    await fetchInvoices();
    setShowPaymentForm(false);
    setSelectedInvoice(null);
  };

  if (loading) return <div className="loading">Chargement...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="app-container">
      <Header />
      <div className="page-container">
        <div className="invoices-page">
          <div className="invoices-section">
            <div className="invoices-grid">
              <div className="invoice-column">
                <InvoiceList
                  title="Factures payées"
                  invoices={paidInvoices}
                  isPaid={true}
                />
              </div>
              <div className="invoice-column">
                <InvoiceList
                  title="Factures non payées"
                  invoices={unpaidInvoices}
                  onPayment={handlePayment}
                  isPaid={false}
                />
              </div>
            </div>
          </div>

          {showPaymentForm && selectedInvoice && (
            <PaymentForm
              invoice={selectedInvoice}
              onClose={() => {
                setShowPaymentForm(false);
                fetchInvoices();
              }}
              onPaymentComplete={handlePaymentComplete}
            />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default InvoicesPage;