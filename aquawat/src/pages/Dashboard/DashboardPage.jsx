import React from 'react';
import Header from '../../components/Header2/Header2';
import UserInfo from '../../components/UserInfo/UserInfo';
import ActionButtons from '../../components/ActionButtons/ActionButtons';
import Footer from '../../components/Footer/Footer';
import './DashboardPage.css';

const DashboardPage = () => {
  return (
    <div className="dashboard">
      <Header />
      <main className="dashboard-content">
        <UserInfo />
        <ActionButtons />
      </main>
      <Footer />
    </div>
  );
};

export default DashboardPage;