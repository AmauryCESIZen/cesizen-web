import { useEffect, useState } from "react";
import {
  createPreset,
  deletePreset,
  getAllPresets,
  updatePreset,
} from "../services/presetService";
import StatusBadge from "../components/StatusBadge";

const initialForm = {
  code: "",
  inspiration_s: "",
  apnee_s: "",
  expiration_s: "",
  actif: true,
};

export default function PresetsPage() {
  const [presets, setPresets] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPresets = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await getAllPresets();
      setPresets(result.data || []);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Impossible de charger les presets.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPresets();
  }, []);

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const handleEdit = (preset) => {
    setEditingId(preset.id);
    setForm({
      code: preset.code ?? "",
      inspiration_s: preset.inspiration_s ?? "",
      apnee_s: preset.apnee_s ?? "",
      expiration_s: preset.expiration_s ?? "",
      actif: preset.actif ?? true,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const payload = {
      code: form.code,
      inspiration_s: Number(form.inspiration_s),
      apnee_s: Number(form.apnee_s),
      expiration_s: Number(form.expiration_s),
      actif: form.actif,
    };

    try {
      if (editingId) {
        await updatePreset(editingId, payload);
      } else {
        await createPreset(payload);
      }

      resetForm();
      await loadPresets();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Impossible d'enregistrer le preset.",
      );
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Supprimer ce preset ?");
    if (!confirmed) return;

    try {
      await deletePreset(id);
      await loadPresets();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Impossible de supprimer le preset.",
      );
    }
  };

  const handleToggleActif = async (preset) => {
    try {
      await updatePreset(preset.id, {
        actif: !preset.actif,
      });
      await loadPresets();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Impossible de modifier le statut du preset.",
      );
    }
  };

  if (loading) {
    return (
      <section>
        <h1>Presets respiration</h1>
        <p>Chargement...</p>
      </section>
    );
  }

  return (
    <section>
      <h1>Presets respiration</h1>

      {error && <p className="error">{error}</p>}

      <div className="card form-card">
        <h2>{editingId ? "Modifier un preset" : "Créer un preset"}</h2>

        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Code</label>
              <input
                type="text"
                name="code"
                placeholder="Ex : 748"
                value={form.code}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Inspiration (s)</label>
              <input
                type="number"
                name="inspiration_s"
                min="1"
                value={form.inspiration_s}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Apnée (s)</label>
              <input
                type="number"
                name="apnee_s"
                min="0"
                value={form.apnee_s}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Expiration (s)</label>
              <input
                type="number"
                name="expiration_s"
                min="1"
                value={form.expiration_s}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group inline-check">
            <label className="checkbox-item">
              <input
                type="checkbox"
                name="actif"
                checked={form.actif}
                onChange={handleChange}
              />
              <span>Preset actif</span>
            </label>
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
                <th>Code</th>
                <th>Rythme</th>
                <th>Statut</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {presets.length === 0 ? (
                <tr>
                  <td colSpan="6">Aucun preset trouvé.</td>
                </tr>
              ) : (
                presets.map((preset) => (
                  <tr key={preset.id}>
                    <td>{preset.id}</td>
                    <td>
                      <span className="tag">{preset.code}</span>
                    </td>
                    <td>
                      {preset.inspiration_s}s / {preset.apnee_s}s / {preset.expiration_s}s
                    </td>
                    <td>
                      <StatusBadge value={preset.actif ? "ACTIF" : "INACTIF"} />
                    </td>
                    <td>
                      {new Date(preset.created_at).toLocaleString("fr-FR")}
                    </td>
                    <td className="actions">
                      <button
                        className="btn btn-primary"
                        onClick={() => handleEdit(preset)}
                      >
                        Modifier
                      </button>

                      <button
                        className="btn btn-warning"
                        onClick={() => handleToggleActif(preset)}
                      >
                        {preset.actif ? "Désactiver" : "Activer"}
                      </button>

                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(preset.id)}
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