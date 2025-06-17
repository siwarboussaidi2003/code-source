import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UsersList.css';
import Sidebar from '../../components/Sidebar/Sidebar';
import EditUserPopup from '../../components/EditUserPopup/EditUserPopup'; // importe le popup

const UsersList = () => {

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditPopup, setShowEditPopup] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:8080/api/users')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
      });
  },
  
  
  []);

  return (
    <div className="users-page">
      <Sidebar />
      <div className="main-content">
        <div className="search-wrapper">
          <input type="text" placeholder="Rechercher" className="search-input" />
          <button className="search-btn">Chercher</button>
        </div>
        <h2>Liste des utilisateurs</h2>

        <div className="tables-container">
          <section className="table-section">
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Prénom</th>
                    <th>CIN</th>
                    <th>Téléphone</th>
                    <th>Email</th>
                    <th>Etat d'activation</th>
                    <th>Rôle</th>
                    <th>Action</th>

                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={index}>
                      <td>{user.nom}</td>
                      <td>{user.prenom}</td>
                      <td>{user.cin}</td>
                      <td>{user.telephone}</td>
                      <td>{user.email}</td>
                      <td>{user.enabled ? 'Oui' : 'Non'}</td>
                      <td>{user.role}</td>
                      <td>
                        <button
                          className="edit-btn" onClick={() => { setSelectedUser(user); setShowEditPopup(true);}}
                        >
                          Modifier
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>


      {showEditPopup && (
        <EditUserPopup
          user={selectedUser}
          onClose={() => setShowEditPopup(false)}
          onSave={(updatedUser) => {
            axios.put(`http://localhost:8080/api/users/${updatedUser.id}`, updatedUser)
              .then(response => {
                // Mise à jour dans le tableau local
                setUsers(prevUsers =>
                  prevUsers.map(user => user.id === updatedUser.id ? response.data : user)
                );
                setShowEditPopup(false);
              })
              .catch(error => {
                console.error('Erreur lors de la mise à jour de l’utilisateur :', error);
                alert("Une erreur s'est produite pendant la modification.");
              });
          }}
        />

      )}
    </div>
  );

  
};

export default UsersList;
