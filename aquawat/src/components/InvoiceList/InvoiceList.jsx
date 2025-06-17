import React from 'react';
import './InvoiceList.css';

const InvoiceList = ({ title, invoices, onPayment, isPaid }) => {
  return (
    <div className="invoice-list">
      <h2>{title}</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Quantité</th>
            <th>Cout/Solde</th>
            <th>Statut</th>
            {!isPaid && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.id}>
              <td>{new Date(invoice.date).toLocaleDateString()}</td>
              <td>{invoice.type}</td>
              <td>
                {invoice.quantite}
                {invoice.type === 'Eau' ? ' m³' : ' kWh'}
              </td>
              <td>{invoice.montant} TND</td>
              <td>
                <span className={`status-indicator ${invoice.statut === 'Payé' ? 'paid' : 'pending'}`}>
                  <span className="status-dot"></span>
                  {invoice.statut}
                </span>
              </td>
              {!isPaid && (
                <td>
                  <button 
                    className="pay-button"
                    onClick={() => onPayment(invoice)}
                  >
                    Payer
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceList;