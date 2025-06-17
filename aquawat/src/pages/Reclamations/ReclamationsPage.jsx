import React, { useState, useEffect } from 'react';
import Header2 from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import AddReclamation from '../../components/Reclamations/AddReclamation';
import './ReclamationsPage.css';

const ReclamationsPage = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [reclamations, setReclamations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReclamations = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/reclamations', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Failed to fetch reclamations');
      const data = await response.json();
      setReclamations(data);
    } catch (error) {
      setError('Error loading reclamations');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReclamations();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="reclamations-page">
      <Header2 />
      <main className="main-content">
        <div className="header-section">
          <h1>Liste des réclamations</h1>
          <button 
            className="add-button"
            onClick={() => setShowAddForm(true)}
          >
            Nouvelle réclamation
          </button>
        </div>

        <div className="table-container">
          <table className="reclamations-table">
            <thead>
              <tr>
                <th>Référence</th>
                <th>Type de contrat</th>
                <th>Type de réclamation</th>
                <th>Commentaire</th>
                <th>Photos du problème</th>
                <th>État administrative</th>
              </tr>
            </thead>
            <tbody>
              {reclamations.map((reclamation) => (
                <tr key={reclamation.id}>
                  <td>{reclamation.reference}</td>
                  <td>{reclamation.typeContrat}</td>
                  <td>{reclamation.typeReclamation}</td>
                  <td>{reclamation.commentaire || '--------'}</td>
                  <td>
                    {reclamation.photoPath ? (
                      <button className="photo-link">
                        pièce jointe
                      </button>
                    ) : (
                      '--------'
                    )}
                  </td>
                  <td>
                    <span className={`status-badge ${(reclamation.etatFinale || '').toLowerCase()}`}>
                      {reclamation.etatFinale}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      
      {showAddForm && (
        <AddReclamation 
          onClose={() => setShowAddForm(false)}
          onSuccess={() => {
            setShowAddForm(false);
            fetchReclamations();
          }}
        />
      )}
      <Footer />
    </div>
  );
};

export default ReclamationsPage;