import { API_BASE_URL, API_STAGE } from "../config/apiConfig";

export async function apiFetch(endpoint, options = {}) {
  const fullUrl = `${API_BASE_URL}/${API_STAGE}${endpoint}`;

  const response = await fetch(fullUrl, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`API error: ${response.status} ${message}`);
  }

  return response.json();
}
