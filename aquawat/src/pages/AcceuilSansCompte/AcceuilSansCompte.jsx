import React, { useEffect } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { useNavigate } from "react-router-dom";
import styles from "./AcceuilSansCompte.module.css";
import unnamed from "../../assets/photos/unnamed.jpg";

function AcceuilSansCompte() {
  const navigate = useNavigate();

  useEffect(() => {
    const initLandbot = () => {
      if (!window.myLandbot) {
        const script = document.createElement('script');
        script.type = 'module';
        script.async = true;
        script.src = 'https://cdn.landbot.io/landbot-3/landbot-3.0.0.mjs';

        script.addEventListener('load', () => {
          window.myLandbot = new window.Landbot.Popup({
            configUrl: 'https://storage.googleapis.com/landbot.online/v3/H-2968881-603R4WNHW1D0833S/index.json',
          });
        });

        document.body.appendChild(script);
      }
    };

    // Ajoute les écouteurs d'événements pour lancer Landbot au survol ou au toucher
    window.addEventListener('mouseover', initLandbot, { once: true });
    window.addEventListener('touchstart', initLandbot, { once: true });

    return () => {
      // Nettoyage des écouteurs si le composant est démonté
      window.removeEventListener('mouseover', initLandbot);
      window.removeEventListener('touchstart', initLandbot);
    };
  }, []);

  return (
    <div className={styles.acceuilsanscompte}>
      <Header showWelcome={false} />
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.imageColumn}>
            <img
              src={unnamed}
              alt="Hero illustration"
              className={styles.heroImage}
            />
          </div>
          <div className={styles.contentColumn}>
            <div className={styles.contentWrapper}>
              <h2 className={styles.heroTitle}>
                Pilotez vos services, maîtrisez votre avenir.
              </h2>
              <div className={styles.buttonGroup}>
                <button
                  onClick={() => navigate("/sinscrire")}
                  className={styles.signUpButton}
                >
                  S'inscrire
                </button>
                <button
                  onClick={() => navigate("/seconnecter")}
                  className={styles.loginButton}
                >
                  Se connecter
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default AcceuilSansCompte;
