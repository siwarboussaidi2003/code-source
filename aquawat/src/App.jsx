import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashPage from './pages/Dash/DashPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import InvoicesPage from './pages/Invoices/InvoicesPage';
import PaymentPage from './pages/Paiement/PaymentPage';
import ReclamationsPage from './pages/Reclamations/ReclamationsPage';
import DemandesPage from './pages/Demandes/DemandesPage';
import InterventionsPage from './pages/Interventions/InterventionsPage';
import ContractList from './pages/contrat/ContractList';
import AcceuilSansCompte from './pages/AcceuilSansCompte/AcceuilSansCompte';
import SeConnecter from './pages/SeConnecter/SeConnecter';
import Sinscrire from './pages/Sinscrire/Sinscrire';
import UsersList from './pages/Users/UsersList';
import RequestsList from './pages/Requests/RequestsList';
import ClaimsList from './pages/Claims/ClaimsList';
import RegistrationSuccess from './pages/InscriptionReussite/RegistrationSuccess';
import LoginAdmin from './pages/SeConnecterAdmin/LoginAdmin';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<AcceuilSansCompte />} />
        <Route path="/seconnecter" element={<SeConnecter />} />
        <Route path="/sinscrire" element={<Sinscrire />} />
        <Route path="/RegistrationSuccess" element={<RegistrationSuccess />} />
        <Route path="/LoginAdmin" element={<LoginAdmin />} />


        {/* Admin routes */}
        <Route path="/dash" element={<DashPage />} />
        <Route path="/admin-users" element={<UsersList />} />
        <Route path="/admin-requests" element={<RequestsList />} />
        <Route path="/admin-claims" element={<ClaimsList />} />

        {/* Client routes */}
        <Route path="/contrat" element={<ContractList />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/factures" element={<InvoicesPage />} />
        <Route path="/paiement" element={<PaymentPage />} />
        <Route path="/reclamations" element={<ReclamationsPage />} />
        <Route path="/demandes" element={<DemandesPage />} />
        <Route path="/interventions" element={<InterventionsPage />} />
        
      </Routes>
    </BrowserRouter>
  );
};

export default App;