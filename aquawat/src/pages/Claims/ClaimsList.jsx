import React, { useState, useEffect } from 'react';
import './ClaimsList.css';
import Sidebar from '../../components/Sidebar/Sidebar';
import axios from 'axios';

const ClaimsList = () => {
    const [reclamations, setReclamations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_BASE_URL = 'http://localhost:8080/api/reclamations';
    const token = localStorage.getItem("token");

    // Définir les headers une seule fois
    const headers = {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
    };

    useEffect(() => {
        const fetchReclamations = async () => {
            try {
                const response = await axios.get(API_BASE_URL, { headers });
                setReclamations(response.data);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchReclamations();
    }, []);

    const handleAccepter = async (id) => {
        try {
            await axios.post(`${API_BASE_URL}/${id}/accepter`, {}, { headers });
            const updatedReclamations = await axios.get(API_BASE_URL, { headers });
            setReclamations(updatedReclamations.data);
        } catch (error) {
            console.error('Error accepting reclamation:', error);
            setError(error);
        }
    };

    const handleRefuser = async (id) => {
        try {
            await axios.post(`${API_BASE_URL}/${id}/refuser`, {}, { headers });
            const updatedReclamations = await axios.get(API_BASE_URL, { headers });
            setReclamations(updatedReclamations.data);
        } catch (error) {
            console.error('Error refusing reclamation:', error);
            setError(error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="claims-page">
            <Sidebar />
            <div className="main-content">
                <div className="content-wrapper">
                    <h1>Liste des réclamations</h1>
                    <div className="table-containner">
                        <table>
                            <thead>
                                <tr>
                                    <th>Référence</th>
                                    <th>Type de réclamation</th>
                                    <th>Date de Création</th>
                                    <th>Commentaire</th>
                                    <th>Action</th>
                                    <th>État finale</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reclamations.map((reclamation) => (
                                    <tr key={reclamation.id}>
                                        <td>{reclamation.reference}</td>
                                        <td>{reclamation.typeReclamation}</td>
                                        <td>{reclamation.dateCreation}</td>
                                        <td className='truncated-text'>{reclamation.commentaire}</td>
                                        <td className="action-cell">
                                            {reclamation.etatFinale === null ? (
                                                <>
                                                    <button
                                                        className="accept-btn"
                                                        onClick={() => handleAccepter(reclamation.id)}
                                                    >
                                                        Accepter
                                                    </button>
                                                    <button
                                                        className="reject-btn"
                                                        onClick={() => handleRefuser(reclamation.id)}
                                                    >
                                                        Refuser
                                                    </button>
                                                </>
                                            ) : (
                                                <span>{reclamation.etatFinale}</span>
                                            )}
                                        </td>
                                        <td>{reclamation.etatFinale}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClaimsList;
