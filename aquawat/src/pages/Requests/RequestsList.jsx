import React, { useState, useEffect } from 'react';
import './RequestsList.css';
import Sidebar from '../../components/Sidebar/Sidebar';
import axios from 'axios';

const RequestsList = () => {
    const [demandes, setDemandes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_BASE_URL = 'http://localhost:8080/api/demandes';
    

    useEffect(() => {
        const fetchDemandes = async () => {
            try {
                const response = await axios.get(API_BASE_URL);
                setDemandes(response.data);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchDemandes();
    }, []);

    const handleAccepter = async (id) => {
        try {
            await axios.post(`${API_BASE_URL}/${id}/accepter`);
            // Refresh the list of demandes after accepting
            const updatedDemandes = await axios.get(API_BASE_URL);
            setDemandes(updatedDemandes.data);
        } catch (error) {
            console.error('Error accepting demande:', error);
            setError(error);
        }
    };

    const handleRefuser = async (id) => {
        try {
            await axios.post(`${API_BASE_URL}/${id}/refuser`);
            // Refresh the list of demandes after refusing
            const updatedDemandes = await axios.get(API_BASE_URL);
            setDemandes(updatedDemandes.data);
        } catch (error) {
            console.error('Error refusing demande:', error);
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
        <div className="requests-page">
            <Sidebar />
            <div className="main-content">
                <div className="content-wrapper">
                    <h1>Liste des demandes</h1>
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Nom et Prénom</th>
                                    <th>Référence</th>
                                    <th>Type de demande</th>
                                    <th>Date de Création</th>
                                    <th>Commentaire</th>
                                    <th>Photos</th>
                                    <th>Action</th>
                                    <th>État finale</th>
                                </tr>
                            </thead>
                            <tbody>
                                {demandes.map((demande) => (
                                    <tr key={demande.id}>
                                        <td>{demande.nomEtPrenom}</td>
                                        <td>{demande.reference}</td>
                                        <td>{demande.typeDemande}</td>
                                        <td>{demande.dateCreation}</td>
                                        <td className='truncated-text'>{demande.commentaire}</td>
                                        <td>{demande.photoPath}</td>
                                        <td className="action-cell">
                                            {demande.etatFinale === null ? (
                                                <>
                                                    <button
                                                        className="accept-btn"
                                                        onClick={() => handleAccepter(demande.id)}
                                                    >
                                                        Accepter
                                                    </button>
                                                    <button
                                                        className="reject-btn"
                                                        onClick={() => handleRefuser(demande.id)}
                                                    >
                                                        Refuser
                                                    </button>
                                                </>
                                            ) : (
                                                <span>{demande.etatFinale}</span>
                                            )}
                                        </td>
                                        <td>{demande.etatFinale}</td>
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

export default RequestsList;