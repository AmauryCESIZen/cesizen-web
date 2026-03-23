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
  };

  const handleEdit = (category) => {
    setEditingId(category.id);
    setName(category.name);
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
      <h1>Catégories</h1>

      {error && <p className="error">{error}</p>}

      <div className="card form-card">
        <h2>{editingId ? "Modifier une catégorie" : "Créer une catégorie"}</h2>

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

            {editingId && (
              <button
                className="btn btn-secondary"
                type="button"
                onClick={resetForm}
              >
                Annuler
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="card">
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
                <td colSpan="4">Aucune catégorie trouvée.</td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category.id}>
                  <td>{category.id}</td>
                  <td>{category.name}</td>
                  <td>
                    {new Date(category.created_at).toLocaleString("fr-FR")}
                  </td>
                  <td className="actions">
                    <button
                      className="btn btn-primary"
                      onClick={() => handleEdit(category)}
                    >
                      Modifier
                    </button>

                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(category.id)}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}