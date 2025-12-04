import axios from "axios";

// Change this to your Django backend URL
const API_BASE = "http://127.0.0.1:8000/api/";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // needed if Django uses session-based auth
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

// === Helper functions ===
export async function loginUser(username, password) {
  const response = await api.post("login/", { username, password });
  return response.data; // Django should return user info or token
}

export async function signupUser(username, password, email) {
  const response = await api.post("signup/", { username, password, email });
  return response.data;
}

export async function fetchProjects(token) {
  const response = await api.get("projects/", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}
