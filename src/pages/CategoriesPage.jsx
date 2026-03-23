import { useEffect, useState } from "react";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "../services/categoryService";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await getAllCategories();
      setCategories(result.data || []);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Impossible de charger les catégories.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const resetForm = () => {
    setName("");
    setEditingId(null);
    setIsFormOpen(false);
  };

  const handleCreateClick = () => {
    resetForm();
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEdit = (category) => {
    setEditingId(category.id);
    setName(category.name);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (editingId) {
        await updateCategory(editingId, { name });
      } else {
        await createCategory({ name });
      }

      resetForm();
      await loadCategories();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Impossible d'enregistrer la catégorie.",
      );
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Supprimer cette catégorie ?");
    if (!confirmed) return;

    try {
      await deleteCategory(id);
      await loadCategories();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Impossible de supprimer la catégorie.",
      );
    }
  };

  if (loading) {
    return (
      <section>
        <h1>Catégories</h1>
        <p>Chargement...</p>
      </section>
    );
  }

  return (
    <section>
      <div className="page-header">
        <div>
          <h1>Catégories</h1>
          <p className="text-muted">
            Gérer les catégories utilisées pour classer les contenus.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={handleCreateClick}
        >
          Créer une catégorie
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {isFormOpen && (
        <div className="card form-card">
          <div className="form-card-header">
            <div>
              <h2>
                {editingId ? "Modifier une catégorie" : "Créer une catégorie"}
              </h2>
              <p className="text-muted">
                Renseigne le nom de la catégorie puis enregistre.
              </p>
            </div>

            <button
              className="btn btn-secondary"
              type="button"
              onClick={resetForm}
            >
              Fermer
            </button>
          </div>

          <form className="admin-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nom</label>
              <input
                type="text"
                placeholder="Nom de la catégorie"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-actions">
              <button className="btn btn-primary" type="submit">
                {editingId ? "Enregistrer" : "Créer"}
              </button>

              <button
                className="btn btn-secondary"
                type="button"
                onClick={resetForm}
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Date de création</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan="4" className="empty-state">
                    Aucune catégorie trouvée.
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category.id}>
                    <td className="table-id">#{category.id}</td>

                    <td>
                      <span className="tag">{category.name}</span>
                    </td>

                    <td className="table-date">
                      {new Date(category.created_at).toLocaleString("fr-FR")}
                    </td>

                    <td>
                      <div className="table-actions">
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => handleEdit(category)}
                        >
                          Modifier
                        </button>

                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => handleDelete(category.id)}
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