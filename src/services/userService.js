import apiClient from "./apiClient";

export const getAllUsers = async () => {
  const response = await apiClient.get("/users");
  return response.data;
};

export const disableUser = async (id) => {
  const response = await apiClient.patch(`/users/${id}/disable`);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await apiClient.delete(`/users/${id}`);
  return response.data;
};
