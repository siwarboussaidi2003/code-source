import React, { useState } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import styles from "./SeConnecter.module.css";
import { useNavigate } from "react-router-dom";
import tourElectrique from "../../assets/photos/poto-électrique.jpg";
import Icon from "../../components/Icon/Icon";

const SeConnecter = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email requis";
    } else if (!/^[^\s@]+@gmail\.com$/.test(email)) {
      newErrors.email = "L'email doit être une adresse Gmail valide";
    }

    if (!password.trim()) {
      newErrors.password = "Mot de passe requis";
    } else if (password.length < 5) {
      newErrors.password = "Mot de passe trop court (min 6 caractères)";
    }

    return newErrors;
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  const validationErrors = validate();
  setErrors(validationErrors);
  setTouched({ email: true, password: true });

  if (Object.keys(validationErrors).length === 0) {
    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const text = await response.text();

      try {
        const data = JSON.parse(text);

        if (!response.ok) {
          setErrors({ general: data.message || "Erreur de connexion." });
        } else {
          // Connexion réussie
          console.log("Connexion réussie :", data);
          localStorage.setItem("token", data.token); // stocker le token JWT
          navigate("/contrat"); // ou autre page après connexion
        }
      } catch (err) {
        console.error("Réponse invalide JSON :", text);
        setErrors({ general: "Erreur serveur inattendue." });
      }

    } catch (error) {
      console.error("Erreur réseau :", error);
      setErrors({ general: "Erreur de connexion au serveur." });
    }
  }
};


  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.mainContent}>
        <div className={styles.loginSection}>
          <h2 className={styles.loginTitle}>Se connecter</h2 >
          <form onSubmit={handleSubmit}>
            <div className={styles.inputContainer}>
              <input
                type="email"
                placeholder="Email"
                className={`${styles.inputField} ${touched.email ? (errors.email ? styles.invalid : styles.valid) : ""}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched({ ...touched, email: true })}
              />
            </div>
            {touched.email && errors.email && <p className={styles.error}>{errors.email}</p>}

            <div className={styles.passwordContainer}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Mot de passe"
                className={`${styles.inputField} ${touched.password ? (errors.password ? styles.invalid : styles.valid) : ""}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched({ ...touched, password: true })}
              />
              <Icon show={showPassword} onClick={() => setShowPassword(!showPassword)} />
            </div>

            {touched.password && errors.password && <p className={styles.error}>{errors.password}</p>}

            {errors.general && <p className={styles.error}>{errors.general}</p>}

            <button type="submit" className={styles.loginButton}>
              Se connecter
            </button>



            <p className={styles.signupText}>
              Pas encore inscrit?
              <span 
                onClick={() => navigate("/sinscrire")} 
                className={styles.signupLink}
              >
                 Créer un compte
              </span>
            </p>
          </form>
        </div>
        <div className={styles.imageSection}>
          <img
            src={tourElectrique}
            alt="Tour électrique"
            className={styles.heroImage}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SeConnecter;



/*
    if (Object.keys(validationErrors).length === 0) {
      if (email === "admin@gmail.com" && password === "admin") {
        navigate("/Dash");
      } else if (email === "client@gmail.com" && password === "client") {
        navigate("/contrat");
      } else {
        setErrors({ general: "Email ou mot de passe incorrect" });
      }
    }
*/