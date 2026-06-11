import axios from "axios";
import { getToken } from "../utils/authStorage";

// En production = l'API est servie sur le même domaine sous /api
// En local = on pointe vers le serveur de développement.
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3546/api";

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default apiClient;
