import apiClient from "./apiClient";

export const getAllAdminContents = async () => {
  const response = await apiClient.get("/admin/contents");
  return response.data;
};

export const getAdminContentById = async (id) => {
  const response = await apiClient.get(`/admin/contents/${id}`);
  return response.data;
};

export const createContent = async (payload) => {
  const response = await apiClient.post("/admin/contents", payload);
  return response.data;
};

export const updateContent = async (id, payload) => {
  const response = await apiClient.put(`/admin/contents/${id}`, payload);
  return response.data;
};

export const deleteContent = async (id) => {
  const response = await apiClient.delete(`/admin/contents/${id}`);
  return response.data;
};
