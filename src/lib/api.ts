import axios from "axios";

// FIXED: Hardcoded the URL to point directly to your backend on port 5005.
// This bypasses the missing environment variable issue.
const API_BASE_URL = "http://localhost:5005/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Auto-inject JWT token from localStorage into headers if present
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("maison_token") : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  register: (data: any) => api.post("/auth/register", data),
  login: (data: any) => api.post("/auth/login", data),
  getProfile: () => api.get("/auth/profile"),
  updateProfile: (formData: FormData) =>
    api.put("/auth/profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};

// Restaurant Services
export const restaurantService = {
  getAll: (params?: { search?: string; cuisine?: string; region?: string; price?: string; rating?: string }) =>
    api.get("/restaurants", { params }),
  getById: (id: string) => api.get(`/restaurants/${id}`),
  getRecommendations: () => api.get("/restaurants/recommendations"),
};

// Booking Services
export const bookingService = {
  book: (data: { restaurantId: string; bookingDate: string; bookingTime: string; guestCount: number; tableNumber: number; specialRequest?: string }) =>
    api.post("/bookings", data),
  getMyBookings: () => api.get("/bookings/my-bookings"),
  update: (id: string, data: any) => api.put(`/bookings/${id}`, data),
  cancel: (id: string) => api.delete(`/bookings/${id}`),
};

// Favorite Services
export const favoriteService = {
  add: (restaurantId: string) => api.post("/favorites", { restaurantId }),
  remove: (id: string) => api.delete(`/favorites/${id}`),
  toggle: (id: string) => api.post(`/favorites/toggle/${id}`),
};

// Notification Services
export const notificationService = {
  getAll: () => api.get("/notifications"),
  markAllRead: () => api.put("/notifications/read"),
};

// Admin Services
export const adminService = {
  addRestaurant: (data: any) => api.post("/admin/restaurants", data),
  editRestaurant: (id: string, data: any) => api.put(`/admin/restaurants/${id}`, data),
  deleteRestaurant: (id: string) => api.delete(`/admin/restaurants/${id}`),
  addMenuItem: (restaurantId: string, data: any) => api.post(`/admin/restaurants/${restaurantId}/menu`, data),
  getUsers: () => api.get("/admin/users"),
  getBookings: () => api.get("/admin/bookings"),
  getAnalytics: () => api.get("/admin/analytics"),
};

export default api;