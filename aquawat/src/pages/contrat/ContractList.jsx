import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ContractList.css';
import Header2 from '../../components/Header2/Header2';
import Footer from '../../components/Footer/Footer';

const ContractList = () => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newContract, setNewContract] = useState({
    reference: '',
    localisation: '',
    dateCreation: new Date().toISOString()
  });
  const [errors, setErrors] = useState({
    reference: '',
    localisation: ''
  });

  useEffect(() => {
    fetchContracts();
  }, []);


  const token = localStorage.getItem('token'); // Ou sessionStorage selon ton implémentation
  console.log(localStorage.getItem("token"));

  const fetchContracts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:8080/api/contracts', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch contracts');
      }
      const data = await response.json();
      setContracts(data);
    } catch (error) {
      console.error('Error:', error);
      setError('Échec du chargement des contrats');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      reference: '',
      localisation: ''
    };

    if (!newContract.reference) {
      newErrors.reference = 'La référence est obligatoire';
      isValid = false;
    } else if (!/^\d{6,8}$/.test(newContract.reference)) {
      newErrors.reference = 'La référence doit contenir entre 6 et 8 chiffres';
      isValid = false;
    }

    if (!newContract.localisation) {
      newErrors.localisation = 'La localisation est obligatoire';
      isValid = false;
    } else if (newContract.localisation.length < 3) {
      newErrors.localisation = 'La localisation doit contenir au moins 3 caractères';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleAddContract = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/contracts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}` 

        },
        body: JSON.stringify(newContract)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Échec de l\'ajout du contrat');
      }

      await fetchContracts();
      handleClosePopup();
      setError(null);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    }
  };

  const handleChoose = (contract) => {
    navigate('/dashboard', {
      state: {
        reference: contract.reference,
        localisation: contract.localisation,
        dateCreation: contract.dateCreation
      }
    });
  };

  const handleAddClick = () => {
    setShowPopup(true);
    setError(null);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setNewContract({
      reference: '',
      localisation: '',
      dateCreation: new Date().toISOString()
    });
    setErrors({ reference: '', localisation: '' });
  };

  if (loading) {
    return <div className="loading">Chargement en cours...</div>;
  }

  return (
    <div className="page-wrapper">
      <Header2 />
      <div className="content-header">
        <h1>Liste des contrats</h1>
        <button className="add-button" onClick={handleAddClick}>Ajouter</button>
      </div>

        {error && <div className="error-message">{error}</div>}
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Référence</th>
                <th>Localisation</th>
                <th>Date de création</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map((contract) => (
                <tr key={contract.id}>
                  <td>{contract.reference}</td>
                  <td>{contract.localisation}</td>
                  <td>{new Date(contract.dateCreation).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="choose-button"
                      onClick={() => handleChoose(contract)}
                    >
                      Choisir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showPopup && (
          <div className="popup-overlay">
            <div className="popup-content">
              <h2>Ajouter un contrat</h2>
              <div className="popup-body">
                <div className="form-group">
                  <label>Référence</label>
                  <input
                    type="text"
                    value={newContract.reference}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      setNewContract({
                        ...newContract,
                        reference: value
                      });
                    }}
                    className={errors.reference ? 'error' : ''}
                    placeholder="Entrez 6 à 8 chiffres"
                  />
                  {errors.reference && <span className="error-text">{errors.reference}</span>}
                </div>
                <div className="form-group">
                  <label>Localisation</label>
                  <input
                    type="text"
                    value={newContract.localisation}
                    onChange={(e) => setNewContract({
                      ...newContract,
                      localisation: e.target.value
                    })}
                    className={errors.localisation ? 'error' : ''}
                    placeholder="Ex: Tunis, Bardo"
                  />
                  {errors.localisation && <span className="error-text">{errors.localisation}</span>}
                </div>
                <div className="popup-footer">
                  <button className="cancel-button" onClick={handleClosePopup}>
                    Annuler
                  </button>
                  <button className="add-button" onClick={handleAddContract}>
                    Ajouter
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      <Footer />
    </div>
  );
};

export default ContractList;
