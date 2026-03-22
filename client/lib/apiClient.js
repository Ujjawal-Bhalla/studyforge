import API_URL from "./api";
import { getToken } from "./auth";

const request = async (endpoint, method = "GET", body = null) => {
  const token = getToken();

  const res = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : null,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};

export const api = {
  get: (endpoint) => request(endpoint, "GET"),
  post: (endpoint, body) => request(endpoint, "POST", body),
  put: (endpoint, body) => request(endpoint, "PUT", body),
  delete: (endpoint) => request(endpoint, "DELETE"),
};
