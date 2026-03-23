import apiClient from "./apiClient";

export const getAllPresets = async () => {
  const response = await apiClient.get("/admin/presets");
  return response.data;
};

export const createPreset = async (payload) => {
  const response = await apiClient.post("/admin/presets", payload);
  return response.data;
};

export const updatePreset = async (id, payload) => {
  const response = await apiClient.put(`/admin/presets/${id}`, payload);
  return response.data;
};

export const deletePreset = async (id) => {
  const response = await apiClient.delete(`/admin/presets/${id}`);
  return response.data;
};
