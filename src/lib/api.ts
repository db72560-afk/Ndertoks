// Detect API URL dynamically based on current host
const getApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  
  // If environment variable is set, use it
  if (envUrl) {
    return envUrl;
  }

  // Otherwise, use the current host with port 5000
  const protocol = window.location.protocol; // http: or https:
  const hostname = window.location.hostname; // localhost, 192.168.x.x, etc.
  const port = 5000;
  
  return `${protocol}//${hostname}:${port}`;
};

const API_URL = getApiUrl();

export const apiClient = {
  async get(endpoint: string, token?: string, params?: Record<string, any>) {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    let url = `${API_URL}${endpoint}`;
    if (params) {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          query.append(key, String(value));
        }
      });
      if (query.toString()) {
        url += `?${query.toString()}`;
      }
    }

    const response = await fetch(url, {
      headers,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return response.json();
  },

  async post(endpoint: string, data: any, token?: string) {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `API error: ${response.status}`);
    }

    return response.json();
  },

  async patch(endpoint: string, data: any, token?: string) {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `API error: ${response.status}`);
    }

    return response.json();
  },

  async delete(endpoint: string, token?: string) {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `API error: ${response.status}`);
    }

    return response.json();
  },
};
