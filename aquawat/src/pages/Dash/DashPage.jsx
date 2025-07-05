import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import StatsCard from '../../components/Stats/StatsCard';
import './DashPage.css';
import axios from 'axios';

const DashPage = () => {
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/dashboard", {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Accept': 'application/json'
                    }
                });
                const dashboardData = response.data;
                const statsData = [
                    {
                        title: "Utilisateurs Totales",
                        value: dashboardData.userCount,
                        icon: "👥",
                        bgColor: "bg-blue"
                    },
                    {
                        title: "Demandes en attentes totales",
                        value: dashboardData.demandeCount,
                        icon: "📝",
                        bgColor: "bg-yellow"
                    },
                    {
                        title: "Réclamations en attentes totales",
                        value: dashboardData.reclamationCount,
                        icon: "📋",
                        bgColor: "bg-green"
                    }
                ];

                setStats(statsData);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchDashboardData();
        const intervalId = setInterval(fetchDashboardData, 5000);
        return () => clearInterval(intervalId);
    }, []);

    if (loading) {
        return <div>Loading dashboard data...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="dashboard">
            <Sidebar />
            <main className="main-content">
                <h1>Dashboard Admin</h1>
                <div className="stats-grid">
                    {stats.map((stat, index) => (
                        <StatsCard key={index} {...stat} />
                    ))}
                </div>
            </main>
        </div>
    );
};

export default DashPage;
