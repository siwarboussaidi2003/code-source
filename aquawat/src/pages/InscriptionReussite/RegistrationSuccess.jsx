import React from 'react';
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

const RegistrationSuccess = () => {
  return (
    <>
      <Header showWelcome={false} />
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Inscription réussie !</h2>
        <p>Please check your email to activate your account.</p>
      </div>
      <Footer />
    </>
  );
};

export default RegistrationSuccess;
