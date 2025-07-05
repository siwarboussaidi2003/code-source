# 🌊 AquaWatt - Plateforme de Gestion de Contrats Énergétiques

AquaWatt est une application web complète de gestion des contrats d’énergie, permettant aux utilisateurs de s'inscrire, de consulter et de souscrire à des contrats énergétiques, avec des rôles administrateur et client.

## 🚀 Fonctionnalités principales

### ✅ Authentification & Sécurité
- Inscription avec vérification par e-mail
- Connexion sécurisée avec JWT
- Gestion des rôles (Client / Admin)
- Activation de compte par lien email

### 📄 Gestion des contrats
- Visualisation des contrats disponibles
- Sélection ou ajout de contrat personnalisé
- Modification ou suppression de contrat (admin)

### 👥 Gestion des utilisateurs
- Tableau de bord des utilisateurs (admin)
- Modification et suppression d'utilisateurs

### 📩 Réclamations (optionnel)
- Soumission de réclamations
- Visualisation et gestion des réclamations

### 💬 Intégration d’un Chatbot
- Aide intelligente pour guider l’utilisateur dans la plateforme

---

## 🛠️ Technologies utilisées

### Backend (Spring Boot)
- Java + Spring Boot
- Spring Security + JWT
- Spring Data JPA + Hibernate
- MySQL
- JavaMailSender (activation compte)

### Frontend (React)
- ReactJS + React Router + Vite
- Axios (requêtes HTTP)
- Formulaires dynamiques
- Gestion d’état avec Hooks

---

## 📦 Installation locale

### Prérequis
- Java 17+
- Node.js + npm
- MySQL Workbench
- IDE (IntelliJ, VSCode, etc.)

### Cloner le projet

```bash
git clone https://github.com/votre-nom/aquawatt.git
cd aquawatt

Backend (Spring Boot)
cd backend
./mvnw spring-boot:run

Frontend (React)
cd frontend
npm install
npm start

🔐 Variables d’environnement
Backend (application.properties)
spring.datasource.url=jdbc:mysql://localhost:3306/aquawatt_db
spring.datasource.username=root
spring.datasource.password=...
jwt.secret=secret-key
spring.mail.username=votre.email@gmail.com
spring.mail.password=motdepasse

Frontend (.env)
REACT_APP_API_URL=http://localhost:8080/api

📂 Structure du projet
swift
Copy
Edit
aquawatt/
├── backend/
│   ├── src/main/java/com/example/aquawatt/
│   └── resources/application.properties
├── frontend/
│   ├── src/
│   └── public/
