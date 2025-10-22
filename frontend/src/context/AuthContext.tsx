import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

import apiClient from "@api/apiClient";

export interface UserRead {
  id: string;
  email: string;
  is_active: boolean;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: UserRead | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchCurrentUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserRead | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("access_token"));

  const login = async (email: string, password: string) => {
    const res = await apiClient.post("/api/v1/auth/login", { username: email, password });
    localStorage.setItem("access_token", res.data.access_token);
    setToken(res.data.access_token);
    await fetchCurrentUser();
  };

  const signup = async (email: string, password: string) => {
    await apiClient.post("/api/v1/auth/signup", { email, password });
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setToken(null);
    setUser(null);
  };

  const fetchCurrentUser = async () => {
    if (!token) return;
    try {
      const res = await apiClient.get("/api/v1/auth/me");
      setUser(res.data);
    } catch {
      logout();
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, fetchCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
