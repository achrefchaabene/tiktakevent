const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function apiFetch(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  if (!response.ok) {
    throw new Error("API request failed");
  }

  return response.json();
}

export async function getContents() {
  return apiFetch("/contents");
}

export async function getCategories() {
  return apiFetch("/categories");
}
