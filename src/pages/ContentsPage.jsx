import { useEffect, useState } from "react";
import {
  createContent,
  deleteContent,
  getAllAdminContents,
  updateContent,
} from "../services/contentService";
import { getAllCategories } from "../services/categoryService";
import StatusBadge from "../components/StatusBadge";

const initialForm = {
  title: "",
  body: "",
  status: "BROUILLON",
  categoryIds: [],
};

export default function ContentsPage() {
  const [contents, setContents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [contentsResult, categoriesResult] = await Promise.all([
        getAllAdminContents(),
        getAllCategories(),
      ]);

      setContents(contentsResult.data || []);
      setCategories(categoriesResult.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Impossible de charger les contenus.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryChange = (categoryId) => {
    setForm((prev) => {
      const exists = prev.categoryIds.includes(categoryId);

      return {
        ...prev,
        categoryIds: exists
          ? prev.categoryIds.filter((id) => id !== categoryId)
          : [...prev.categoryIds, categoryId],
      };
    });
  };

  const handleEdit = async (content) => {
    setEditingId(content.id);
    setForm({
      title: content.title || "",
      body: content.body || "",
      status: content.status || "BROUILLON",
      categoryIds: (content.categories || []).map((cat) => cat.id),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(initialForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (editingId) {
        await updateContent(editingId, form);
      } else {
        await createContent(form);
      }

      resetForm();
      await loadData();
    } catch (err) {
      setError(err?.response?.data?.message || "Impossible d'enregistrer le contenu.");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Supprimer ce contenu ?");
    if (!confirmed) return;

    try {
      await deleteContent(id);
      await loadData();
    } catch (err) {
      setError(err?.response?.data?.message || "Impossible de supprimer le contenu.");
    }
  };

  const handleToggleStatus = async (content) => {
    const nextStatus = content.status === "PUBLIE" ? "BROUILLON" : "PUBLIE";

    try {
      await updateContent(content.id, {
        status: nextStatus,
      });
      await loadData();
    } catch (err) {
      setError(err?.response?.data?.message || "Impossible de modifier le statut.");
    }
  };

  if (loading) {
    return (
      <section>
        <h1>Contenus</h1>
        <p>Chargement...</p>
      </section>
    );
  }

  return (
    <section>
      <h1>Contenus</h1>

      {error && <p className="error">{error}</p>}

      <div className="card form-card">
        <h2>{editingId ? "Modifier un contenu" : "Créer un contenu"}</h2>

        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Titre</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Titre du contenu"
            />
          </div>

          <div className="form-group">
            <label>Contenu</label>
            <textarea
              name="body"
              value={form.body}
              onChange={handleChange}
              placeholder="Rédiger le contenu..."
              rows={6}
            />
          </div>

          <div className="form-group">
            <label>Statut</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="BROUILLON">Brouillon</option>
              <option value="PUBLIE">Publié</option>
            </select>
          </div>

          <div className="form-group">
            <label>Catégories</label>
            <div className="checkbox-list">
              {categories.map((category) => (
                <label key={category.id} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={form.categoryIds.includes(category.id)}
                    onChange={() => handleCategoryChange(category.id)}
                  />
                  <span>{category.name}</span>
                </label>
              ))}
            </div>
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
        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Titre</th>
                <th>Catégories</th>
                <th>Statut</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {contents.length === 0 ? (
                <tr>
                  <td colSpan="6">Aucun contenu trouvé.</td>
                </tr>
              ) : (
                contents.map((content) => (
                  <tr key={content.id}>
                    <td>{content.id}</td>
                    <td>{content.title}</td>

                    <td>
                      {content.categories && content.categories.length > 0 ? (
                        <div className="tag-list">
                          {content.categories.map((category) => (
                            <span key={category.id} className="tag">
                              {category.name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted">Aucune</span>
                      )}
                    </td>

                    <td>
                      <StatusBadge value={content.status} />    
                    </td>

                    <td>{new Date(content.created_at).toLocaleString("fr-FR")}</td>

                    <td className="actions">
                      <button
                        className="btn btn-primary"
                        onClick={() => handleEdit(content)}
                      >
                        Modifier
                      </button>

                      <button
                        className="btn btn-warning"
                        onClick={() => handleToggleStatus(content)}
                      >
                        {content.status === "PUBLIE" ? "Dépublier" : "Publier"}
                      </button>

                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(content.id)}
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
      </div>
    </section>
  );
}