const API_URL = import.meta.env.VITE_API_URL;

async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Error de conexión' }));
    throw new Error(error.error || 'Error desconocido');
  }
  return response.json();
}

export const api = {
  categories: {
    list: async () => {
      const res = await fetch(`${API_URL}/api/categories`);
      return handleResponse(res);
    },
    create: async (name) => {
      const res = await fetch(`${API_URL}/api/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      return handleResponse(res);
    },
    delete: async (name) => {
      const res = await fetch(`${API_URL}/api/categories/${encodeURIComponent(name)}`, {
        method: 'DELETE'
      });
      return handleResponse(res);
    }
  },
  notes: {
    list: async (category) => {
      const res = await fetch(`${API_URL}/api/notes/${encodeURIComponent(category)}`);
      return handleResponse(res);
    },
    get: async (category, filename) => {
      const res = await fetch(`${API_URL}/api/notes/${encodeURIComponent(category)}/${encodeURIComponent(filename)}`);
      return handleResponse(res);
    },
    create: async (category, title, content) => {
      const res = await fetch(`${API_URL}/api/notes/${encodeURIComponent(category)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content })
      });
      return handleResponse(res);
    },
    update: async (category, filename, content) => {
      const res = await fetch(`${API_URL}/api/notes/${encodeURIComponent(category)}/${encodeURIComponent(filename)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
      return handleResponse(res);
    },
    delete: async (category, filename) => {
      const res = await fetch(`${API_URL}/api/notes/${encodeURIComponent(category)}/${encodeURIComponent(filename)}`, {
        method: 'DELETE'
      });
      return handleResponse(res);
    }
  },
  search: {
    query: async (q) => {
      const res = await fetch(`${API_URL}/api/search?q=${encodeURIComponent(q)}`);
      return handleResponse(res);
    }
  }
};
