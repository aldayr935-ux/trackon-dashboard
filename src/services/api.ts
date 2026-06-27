const BASE_URL = import.meta.env.VITE_API_URL

// Helper base — agrega el token automáticamente a cada request
const request = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('trackon_token')

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Error en la petición')
  }

  return response.json()
}

// Auth
export const authService = {
  register: (data: { name: string; email: string; password: string }) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  login: (data: { email: string; password: string }) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),

  me: () => request('/auth/me'),
}

// Shipments
export const shipmentsService = {
  getAll: () => request('/shipments'),
  getById: (id: string) => request(`/shipments/${id}`),
  create: (data: object) =>
    request('/shipments', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: object) =>
    request(`/shipments/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) =>
    request(`/shipments/${id}`, { method: 'DELETE' }),
}

// Vehicles
export const vehiclesService = {
  getAll: () => request('/vehicles'),
  create: (data: object) =>
    request('/vehicles', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: object) =>
    request(`/vehicles/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) =>
    request(`/vehicles/${id}`, { method: 'DELETE' }),
}

// Routes
export const routesService = {
  getAll: () => request('/routes'),
  create: (data: object) =>
    request('/routes', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: object) =>
    request(`/routes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
}

// Alerts
export const alertsService = {
  getAll: () => request('/alerts'),
  getUnread: () => request('/alerts/unread'),
  markAsRead: (id: string) =>
    request(`/alerts/${id}/read`, { method: 'PUT' }),
  markAllAsRead: () =>
    request('/alerts/read-all', { method: 'PUT' }),
}

// Dashboard
export const dashboardService = {
  getStats: () => request('/dashboard'),
}