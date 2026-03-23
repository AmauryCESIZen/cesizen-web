import apiClient from "./apiClient";

export const getAllCategories = async () => {
  const response = await apiClient.get("/categories");
  return response.data;
};

export const createCategory = async (payload) => {
  const response = await apiClient.post("/admin/categories", payload);
  return response.data;
};

export const updateCategory = async (id, payload) => {
  const response = await apiClient.put(`/admin/categories/${id}`, payload);
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await apiClient.delete(`/admin/categories/${id}`);
  return response.data;
};
