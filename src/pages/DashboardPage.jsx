import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDashboardData } from "../services/dashboardService";

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getDashboardData();
      setDashboard(data);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Impossible de charger le dashboard.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <section>
        <h1>Dashboard</h1>
        <p>Chargement...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section>
        <h1>Dashboard</h1>
        <p className="error">{error}</p>
      </section>
    );
  }

  const { stats, recentUsers, recentContents } = dashboard;

  return (
    <section className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p className="text-muted">
            Vue d’ensemble du back-office CESIZen.
          </p>
        </div>

        <button className="btn btn-secondary" onClick={loadDashboard}>
          Rafraîchir
        </button>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <span className="dashboard-label">Utilisateurs</span>
          <strong className="dashboard-value">{stats.users}</strong>
          <span className="dashboard-subtext">
            {stats.activeUsers} actifs
          </span>
        </div>

        <div className="dashboard-card">
          <span className="dashboard-label">Contenus</span>
          <strong className="dashboard-value">{stats.contents}</strong>
          <span className="dashboard-subtext">
            {stats.publishedContents} publiés
          </span>
        </div>

        <div className="dashboard-card">
          <span className="dashboard-label">Catégories</span>
          <strong className="dashboard-value">{stats.categories}</strong>
          <span className="dashboard-subtext">
            Organisation des contenus
          </span>
        </div>

        <div className="dashboard-card">
          <span className="dashboard-label">Presets respiration</span>
          <strong className="dashboard-value">{stats.presets}</strong>
          <span className="dashboard-subtext">
            {stats.activePresets} actifs
          </span>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="card">
          <div className="section-header">
            <h2>Accès rapides</h2>
          </div>

          <div className="quick-links">
            <Link className="quick-link" to="/admin/users">
              Gérer les utilisateurs
            </Link>
            <Link className="quick-link" to="/admin/contents">
              Gérer les contenus
            </Link>
            <Link className="quick-link" to="/admin/categories">
              Gérer les catégories
            </Link>
            <Link className="quick-link" to="/admin/presets">
              Gérer les presets
            </Link>
          </div>
        </div>

        <div className="card">
          <div className="section-header">
            <h2>Derniers utilisateurs</h2>
          </div>

          {recentUsers.length === 0 ? (
            <p className="text-muted">Aucun utilisateur.</p>
          ) : (
            <div className="mini-list">
              {recentUsers.map((user) => (
                <div className="mini-list-item" key={user.id}>
                  <div>
                    <strong>{user.email}</strong>
                    <p className="text-muted">
                      Créé le{" "}
                      {new Date(user.created_at).toLocaleString("fr-FR")}
                    </p>
                  </div>

                  <span
                    className={
                      user.statut === "ACTIF"
                        ? "badge badge-success"
                        : "badge badge-muted"
                    }
                  >
                    {user.statut}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div className="section-header">
            <h2>Derniers contenus</h2>
          </div>

          {recentContents.length === 0 ? (
            <p className="text-muted">Aucun contenu.</p>
          ) : (
            <div className="mini-list">
              {recentContents.map((content) => (
                <div className="mini-list-item" key={content.id}>
                  <div>
                    <strong>{content.title}</strong>
                    <p className="text-muted">
                      Créé le{" "}
                      {new Date(content.created_at).toLocaleString("fr-FR")}
                    </p>
                  </div>

                  <span
                    className={
                      content.status === "PUBLIE"
                        ? "badge badge-success"
                        : "badge badge-muted"
                    }
                  >
                    {content.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}