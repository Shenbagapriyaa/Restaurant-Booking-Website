import React, { createContext, useContext, useState, useEffect } from "react";
import { authService, favoriteService, notificationService } from "../lib/api";
import { toast } from "sonner";

interface Notification {
  _id: string;
  title: string;
  body: string;
  icon: string;
  unread: boolean;
  createdAt: string;
}

interface User {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  profileImage?: string;
  role: "user" | "admin";
  favoriteRestaurants: string[];
  favoriteDishes: string[];
  notifications: Notification[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (fullName: string, email: string, password: string, phoneNumber?: string) => Promise<boolean>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  toggleFavorite: (restaurantId: string) => Promise<void>;
  markNotificationsAsRead: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("maison_token");
      if (storedToken) {
        setToken(storedToken);
        try {
          // Fetch full user profile
          const res = await authService.getProfile();
          if (res.data.success) {
            setUser(res.data.user);
          } else {
            // Token invalid or expired
            localStorage.removeItem("maison_token");
            setToken(null);
          }
        } catch (err) {
          console.error("Auth initialization failed:", err);
          localStorage.removeItem("maison_token");
          setToken(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const res = await authService.login({ email, password });
      
      if (res.data.success) {
        const { token: userToken, ...userData } = res.data;
        localStorage.setItem("maison_token", res.data.token);
        setToken(res.data.token);
        
        // Load full user details
        const profileRes = await authService.getProfile();
        setUser(profileRes.data.user);
        
        toast.success(`Welcome back, ${res.data.fullName}`);
        setAuthModalOpen(false);
        return true;
      }
      return false;
    } catch (err: any) {
      const message = err.response?.data?.message || "Login failed. Please check credentials.";
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (fullName: string, email: string, password: string, phoneNumber?: string): Promise<boolean> => {
    try {
      setLoading(true);
      const res = await authService.register({ fullName, email, password, phoneNumber });
      
      if (res.data.success) {
        localStorage.setItem("maison_token", res.data.token);
        setToken(res.data.token);
        
        // Load full user details
        const profileRes = await authService.getProfile();
        setUser(profileRes.data.user);

        toast.success("Account registered successfully!");
        setAuthModalOpen(false);
        return true;
      }
      return false;
    } catch (err: any) {
      const message = err.response?.data?.message || "Registration failed. Try again.";
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("maison_token");
    setToken(null);
    setUser(null);
    toast.success("Logged out successfully");
  };

  const refreshProfile = async () => {
    if (!token) return;
    try {
      const res = await authService.getProfile();
      if (res.data.success) {
        setUser(res.data.user);
      }
    } catch (err) {
      console.error("Failed to refresh user profile:", err);
    }
  };

  const toggleFavorite = async (restaurantId: string) => {
    if (!user || !token) {
      setAuthModalOpen(true);
      toast.info("Please login to save favorite restaurants");
      return;
    }

    try {
      const res = await favoriteService.toggle(restaurantId);
      if (res.data.success) {
        setUser((prev) => {
          if (!prev) return null;
          
          const isFav = prev.favoriteRestaurants.some((fav: any) => 
            (fav._id || fav) === restaurantId
          );
          
          let updatedFavs = [];
          if (isFav) {
            updatedFavs = prev.favoriteRestaurants.filter((fav: any) => 
              (fav._id || fav) !== restaurantId
            );
            toast.success("Removed from favorites");
          } else {
            // Optimistically add just the ID or retrieve fully if seeding populated it
            updatedFavs = [...prev.favoriteRestaurants, restaurantId];
            toast.success("Added to favorites");
          }

          return {
            ...prev,
            favoriteRestaurants: updatedFavs,
          };
        });
      }
    } catch (err) {
      toast.error("Failed to update favorites");
    }
  };

  const markNotificationsAsRead = async () => {
    if (!user || !token) return;

    try {
      const res = await notificationService.markAllRead();
      if (res.data.success) {
        setUser((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            notifications: prev.notifications.map((n) => ({ ...n, unread: false })),
          };
        });
        toast.success("All notifications marked as read");
      }
    } catch (err) {
      console.error("Failed to mark notifications read:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        authModalOpen,
        setAuthModalOpen,
        login,
        register,
        logout,
        refreshProfile,
        toggleFavorite,
        markNotificationsAsRead,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
