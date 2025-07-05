import React, { useState } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import styles from './Sinscrire.module.css';
import robinette from "../../assets/photos/robinette.avif";
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/Icon/Icon';

const Sinscrire = () => {


  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    cin: '',
    telephone: '',
    email: '',
    motDePasse: '',
    confirmerMotDePasse: ''
  });

  const validate = (values) => {
    const errors = {};
    if (!values.nom) {
      errors.nom = 'Nom requis';
    } else if (values.nom.length > 20) {
      errors.nom = 'Nom ne doit pas dépasser 20 caractères';
    }

    if (!values.prenom) {
      errors.prenom = 'Prénom requis';
    }

    if (!values.cin) {
      errors.cin = 'CIN requis';
    } else if (!/^\d{1,8}$/.test(values.cin)) {
      errors.cin = 'CIN invalide (max 8 chiffres)';
    }

    if (!values.telephone) {
      errors.telephone = 'Téléphone requis';
    } else if (!/^\d{1,8}$/.test(values.telephone)) {
      errors.telephone = 'Téléphone invalide (max 8 chiffres)';
    }

    if (!values.email) {
      errors.email = 'Email requis';
    } else if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(values.email)) {
      errors.email = 'L\'email doit être une adresse Gmail valide';
    }

    if (!values.confirmerMotDePasse) {
      errors.confirmerMotDePasse = 'Confirmation du mot de passe requise';
    } else if (values.motDePasse !== values.confirmerMotDePasse) {
      errors.confirmerMotDePasse = 'Les mots de passe ne correspondent pas';
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let filteredValue = value;

    if (name === 'nom' || name === 'prenom') {
      // Autoriser seulement les lettres et les espaces, max 20 caractères
      filteredValue = value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '').slice(0, 20);
    } else if (name === 'cin' || name === 'telephone') {
      // Autoriser seulement les chiffres, max 8 chiffres
      filteredValue = value.replace(/\D/g, '').slice(0, 8);
    }

    const updatedForm = { ...formData, [name]: filteredValue };
    setFormData(updatedForm);
    setErrors(validate(updatedForm));
  };


  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
  };



  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate(formData); // ✅ définir cette variable
    setErrors(validationErrors);
    setTouched({
      nom: true, prenom: true, cin: true, telephone: true,
      email: true, motDePasse: true, confirmerMotDePasse: true
    });

    if (Object.keys(validationErrors).length === 0) {
      fetch('http://localhost:8080/api/auth/register', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
        .then(async response => {
          const text = await response.text();

          try {
            const data = JSON.parse(text);
            if (!response.ok) {
              throw new Error(data.message || 'Erreur lors de l’inscription');
            }
            console.log('Inscription réussie:', data);
          } catch (err) {
            if (response.ok) {
              console.log('Inscription réussie (texte brut):', text);
            } else {
              console.error('Erreur de parsing JSON:', err);
              console.error('Réponse brute:', text);
            }
          }

          // Redirection si succès
          if (response.ok) {
            navigate('/RegistrationSuccess');
          }
        })
        .catch(error => {
          console.error('Erreur de requête:', error);
        });
    }
  };


  return (
    <div className={styles.page}>
      <Header showWelcome={false} />
      <div className={styles.container}>
        <div className={styles.formSection}>
          <h2>S'inscrire</h2>
          <div className={styles.formGroup}>
            <div className={styles.nameFields}>
              <input
                type="text"
                name="nom"
                placeholder="Nom"
                value={formData.nom}
                onChange={handleChange}
                onBlur={handleBlur}
                className={touched.nom ? (errors.nom ? styles.invalid : styles.valid) : ''}
              />

              {touched.nom && errors.nom && <p className={styles.error}>{errors.nom}</p>}

              <input
                type="text"
                name="prenom"
                placeholder="Prénom"
                value={formData.prenom}
                onChange={handleChange}
                onBlur={handleBlur}
                className={touched.prenom ? (errors.prenom ? styles.invalid : styles.valid) : ''}
              />

              {touched.prenom && errors.prenom && <p className={styles.error}>{errors.prenom}</p>}

            </div>
            <div className={styles.nameFields}>
              <input
                type="text"
                name="cin"
                placeholder="Carte d'Identité National "
                value={formData.cin}
                onChange={handleChange}
                onBlur={handleBlur}
                className={touched.cin ? (errors.cin ? styles.invalid : styles.valid) : ''}
              />

              {touched.cin && errors.cin && <p className={styles.error}>{errors.cin}</p>}

              <input
                type="text"
                name="telephone"
                placeholder="Numéro de Télephone"
                value={formData.telephone}
                onChange={handleChange}
                onBlur={handleBlur}
                className={touched.telephone ? (errors.telephone ? styles.invalid : styles.valid) : ''}
              />
              {touched.telephone && errors.telephone && <p className={styles.error}>{errors.telephone}</p>}

            </div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={touched.email ? (errors.email ? styles.invalid : styles.valid) : ''}
            />

            {touched.email && errors.email && <p className={styles.error}>{errors.email}</p>}

            <div className={styles.passwordContainer}>
              <input
                type={showPassword ? "text" : "password"}
                name="motDePasse"
                placeholder="Mot de passe"
                value={formData.motDePasse}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`${touched.motDePasse ? (errors.motDePasse ? styles.invalid : styles.valid) : ''}`}
              />
              <Icon show={showPassword} onClick={() => setShowPassword(!showPassword)} />
            </div>
            {touched.motDePasse && errors.motDePasse && <p className={styles.error}>{errors.motDePasse}</p>}

            <div className={styles.passwordContainer}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmerMotDePasse"
                placeholder="Confirmer le mot de passe"
                value={formData.confirmerMotDePasse}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`${touched.confirmerMotDePasse ? (errors.confirmerMotDePasse ? styles.invalid : styles.valid) : ''}`}
              />
              <Icon show={showConfirmPassword} onClick={() => setShowConfirmPassword(!showConfirmPassword)} />
            </div>
            {touched.confirmerMotDePasse && errors.confirmerMotDePasse && <p className={styles.error}>{errors.confirmerMotDePasse}</p>}




            <button type="submit" className={styles.submitButton} onClick={handleSubmit}>
              S'inscrire
            </button>

            <p className={styles.loginText}>
              Avez déjà un compte? <a href="/seconnecter">Se connecter</a>
            </p>
          </div>
        </div>

        <div className={styles.imageSection}>
          <img src={robinette} alt="robinette" className={styles.heroImage} />
        </div>

      </div>
      <Footer />
    </div>
  );
};

export default Sinscrire;