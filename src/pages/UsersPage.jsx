import { useEffect, useState } from "react";
import { deleteUser, disableUser, getAllUsers } from "../services/userService";
import StatusBadge from "../components/StatusBadge";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await getAllUsers();
      setUsers(result.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Impossible de charger les utilisateurs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDisable = async (id) => {
    try {
      await disableUser(id);
      await loadUsers();
    } catch (err) {
      setError(err?.response?.data?.message || "Impossible de désactiver l'utilisateur.");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Supprimer cet utilisateur ?");
    if (!confirmed) return;

    try {
      await deleteUser(id);
      await loadUsers();
    } catch (err) {
      setError(err?.response?.data?.message || "Impossible de supprimer l'utilisateur.");
    }
  };

  if (loading) {
    return (
      <section>
        <h1>Utilisateurs</h1>
        <p>Chargement...</p>
      </section>
    );
  }

  return (
    <section>
      <h1>Utilisateurs</h1>

      {error && <p className="error">{error}</p>}

      <div className="card">
        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Statut</th>
                <th>Créé le</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="empty-state">
                    Aucun utilisateur trouvé.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td className="table-id">#{user.id}</td>

                    <td>
                      <div className="table-cell-title">
                        <strong>{user.email}</strong>
                        <span>{user.role}</span>
                      </div>
                    </td>

                    <td>{user.role}</td>

                    <td>
                      <StatusBadge value={user.statut} />
                    </td>

                    <td className="table-date">
                      {new Date(user.created_at).toLocaleString("fr-FR")}
                    </td>

                    <td>
                      <div className="table-actions">
                        {user.statut === "ACTIF" && (
                          <button
                            className="btn btn-warning"
                            onClick={() => handleDisable(user.id)}
                          >
                            Désactiver
                          </button>
                        )}

                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(user.id)}
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}