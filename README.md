# 🌊 AquaWatt - Plateforme de Gestion de Services d'énergie

AquaWatt est un Portail web Full-Stack de gestion des services d’énergie (Eau potable et Electricité), permettant aux utilisateurs de s'inscrire, de naviguer à des contrats, avec des rôles administrateur et client.

## 🚀 Fonctionnalités principales

### ✅ Authentification & Sécurité
- Inscription avec vérification par e-mail
- Connexion sécurisée avec JWT
- Gestion des rôles (Client / Admin)
- Activation de compte par lien email

### 📄 Gestion des contrats
- Visualisation des contrats disponibles
- Sélection ou ajout de contrat personnalisé

### 👥 Gestion des utilisateurs
- Tableau de bord des utilisateurs (admin)
- Modification d'utilisateurs

### 📩 Réclamations et Demandes
- Soumission des réclamations/demandes
- Visualisation et gestion des réclamations/demandes

### 💬 Intégration d’un Chatbot
- Aide intelligente avec Landbot IO pour guider l’utilisateur dans la plateforme 

---

## 🛠️ Technologies utilisées

### Backend (Spring Boot)
- Java 22 + Spring Boot
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
- Node.js 20 + npm
- MySQL Workbench
- IDE (IntelliJ, VSCode, etc.)

### Cloner le projet

```bash
git clone https://github.com/siwarboussaidi2003/code-source.git
cd code-source

**Backend (Spring Boot)**
cd backend
./mvnw spring-boot:run

**Frontend (React)**
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
aquawatt/
├── backend/
│   ├── src/main/java/com/example/aquawatt/
│   └── resources/application.properties
├── frontend/
│   ├── src/
│   └── public/
