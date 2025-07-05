import React, { useState, useEffect } from 'react';
import Header2 from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import AddDemande from '../../components/Demandes/AddDemande';
import './DemandesPage.css';

const DemandesPage = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [demandes, setDemandes] = useState([]);

  const fetchDemandes = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/demandes', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Failed to fetch demandes');
      const data = await response.json();
      setDemandes(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchDemandes();
  }, []);

  return (
    <div className="demandes-page">
      <Header2 />
      <main className="main-content">
        <div className="header-section">
          <h1>Liste des demandes</h1>
          <button 
            className="add-button"
            onClick={() => setShowAddForm(true)}
          >
            Ajouter une demande
          </button>
        </div>

        <div className="table-container">
          <table className="demandes-table">
            <thead>
              <tr>
                <th>Référence</th>
                <th>Type de contrat</th>
                <th>Type de demande</th>
                <th>Date de création</th>
                <th>État administrative</th>
              </tr>
            </thead>
            <tbody>
              {demandes.map((demande) => (
                <tr key={demande.id}>
                  <td>{demande.reference}</td>
                  <td>{demande.typeContrat}</td>
                  <td>{demande.typeDemande}</td>
                  <td>{new Date(demande.dateCreation).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge ${(demande.etatFinale|| '').toLowerCase()}`}>
                      {demande.etatFinale}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      
      {showAddForm && (
        <AddDemande 
          onClose={() => setShowAddForm(false)}
          onSuccess={() => {
            setShowAddForm(false);
            fetchDemandes();
          }}
        />
      )}
      <Footer />
    </div>
  );
};

export default DemandesPage;