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

  const truncate = (text, max = 90) => {
  if (!text) return "";
  return text.length > max ? `${text.slice(0, max)}…` : text;
};

export default function ContentsPage() {
  const [contents, setContents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

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

  const handleEdit = (content) => {
    setEditingId(content.id);
    setForm({
      title: content.title || "",
      body: content.body || "",
      status: content.status || "BROUILLON",
      categoryIds: (content.categories || []).map((cat) => cat.id),
    });
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(initialForm);
    setIsFormOpen(false);
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

  const handleCreateClick = () => {
    resetForm();
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
      <div className="page-header">
        <div>
          <h1>Contenus</h1>
          <p className="text-muted">
            Gérer les contenus
          </p>
        </div>

        <button className="btn btn-primary" onClick={handleCreateClick}>
          Créer un contenu
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {isFormOpen && (
        <div className="card form-card">
          <div className="form-card-header">
            <div>
              <h2>{editingId ? "Modifier un contenu" : "Créer un contenu"}</h2>
              <p className="text-muted">
                Remplis les informations puis enregistre.
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

              {form.categoryIds.length > 0 && (
                <div className="tag-list">
                  {categories
                    .filter((category) => form.categoryIds.includes(category.id))
                    .map((category) => (
                      <span key={category.id} className="tag">
                        {category.name}
                      </span>
                    ))}
                </div>
              )}
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
                  <td colSpan="6" className="empty-state">
                    Aucun contenu trouvé.
                  </td>
                </tr>
              ) : (
                contents.map((content) => (
                  <tr key={content.id}>
                    <td className="table-id">#{content.id}</td>

                    <td>
                      <div className="table-cell-title">
                        <strong>{content.title}</strong>
                        <span>{truncate(content.body, 80)}</span>
                      </div>
                    </td>

                    <td>
                      {content.categories && content.categories.length > 0 ? (
                        <div className="tag-list">
                          {content.categories.slice(0, 2).map((category) => (
                            <span key={category.id} className="tag">
                              {category.name}
                            </span>
                          ))}

                          {content.categories.length > 2 && (
                            <span className="tag tag-more">
                              +{content.categories.length - 2}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted">Aucune</span>
                      )}
                    </td>

                    <td>
                      <StatusBadge value={content.status} />
                    </td>

                    <td className="table-date">
                      {new Date(content.created_at).toLocaleString("fr-FR")}
                    </td>

                    <td>
                      <div className="table-actions">
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