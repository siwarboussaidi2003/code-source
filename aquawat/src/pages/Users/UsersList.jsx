import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UsersList.css';
import Sidebar from '../../components/Sidebar/Sidebar';
import EditUserPopup from '../../components/EditUserPopup/EditUserPopup';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Charger les utilisateurs
  const fetchUsers = () => {
    axios
      .get('http://localhost:8080/api/users', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          Accept: 'application/json',
        },
      })
      .then((response) => {
        setUsers(response.data);
        setFilteredUsers(response.data); // initialise aussi la liste filtrée
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filtrage des utilisateurs
  const handleSearch = () => {
    const term = searchTerm.toLowerCase();
    const results = users.filter(
      (user) =>
        user.nom.toLowerCase().includes(term) ||
        user.prenom.toLowerCase().includes(term)
    );
    setFilteredUsers(results);
  };

  // Sauvegarde après modification
  const handleSaveUser = (updatedUser) => {
    axios
      .put(`http://localhost:8080/api/users/${updatedUser.id}`, updatedUser, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        const updatedList = users.map((user) =>
          user.id === updatedUser.id ? response.data : user
        );
        setUsers(updatedList);
        setFilteredUsers(updatedList);
        setShowEditPopup(false);
      })
      .catch((error) => {
        console.error("Erreur lors de la mise à jour de l’utilisateur :", error);
        alert("Une erreur s'est produite pendant la modification.");
      });
  };

  return (
    <div className="users-page">
      <Sidebar />
      <div className="main-content">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Rechercher par nom ou prénom"
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-btn" onClick={handleSearch}>
            Chercher
          </button>
        </div>

        <h1>Liste des utilisateurs</h1>

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
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td>{user.nom}</td>
                        <td>{user.prenom}</td>
                        <td>{user.cin}</td>
                        <td>{user.telephone}</td>
                        <td>{user.email}</td>
                        <td>{user.enabled ? 'Oui' : 'Non'}</td>
                        <td>{user.role}</td>
                        <td>
                          <button
                            className="edit-btn"
                            onClick={() => {
                              setSelectedUser(user);
                              setShowEditPopup(true);
                            }}
                          >
                            Modifier
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" style={{ textAlign: 'center' }}>
                        Aucun utilisateur trouvé.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>

      {showEditPopup && selectedUser && (
        <EditUserPopup
          user={selectedUser}
          onClose={() => setShowEditPopup(false)}
          onSave={handleSaveUser}
        />
      )}
    </div>
  );
};

export default UsersList;
