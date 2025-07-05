import React, { useState, useEffect } from 'react';
import './InterventionsPage.css';
import Header2 from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

const InterventionList = () => {
    const [interventions, setInterventions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInterventions = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:8080/api/interventions', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Accept': 'application/json'
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch interventions');
                }
                const data = await response.json();
                setInterventions(data);
            } catch (error) {
                console.error('Error fetching interventions:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchInterventions();
    }, []);

    if (loading) return <div>Chargement...</div>;
    if (error) return <div>Erreur: {error}</div>;

    return (
        <div className="page-wrapper">
            <Header2 />
            <main className="main-content">
                <div className="content">
                    <h1>Liste des interventions</h1>
                    
                    <div className="table-container">
                        <table className="intervention-table">
                            <thead>
                                <tr>
                                    <th>Référence</th>
                                    <th>Type Intervention</th>
                                    <th>Description</th>
                                    <th>Date</th>
                                    <th>État</th>
                                </tr>
                            </thead>
                            <tbody>
                                {interventions.map((intervention) => (
                                    <tr key={intervention.id}>
                                        <td>{intervention.reference}</td>
                                        <td>{intervention.typeIntervention}</td>
                                        <td>{intervention.description}</td>
                                        <td>{new Date(intervention.dateIntervention).toLocaleDateString()}</td>
                                        <td>
                                            <span className={`status ${intervention.etat.toLowerCase().replace(' ', '-')}`}>
                                                {intervention.etat}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default InterventionList;