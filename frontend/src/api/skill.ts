import axios from "axios";

export interface SkillRead {
  id: string;
  name: string;
  level?: number;
  category?: string;
  created_at: string;
  updated_at: string;
}

export interface SkillCreate {
  name: string;
  level?: number;
  category?: string;
}

export interface SkillUpdate {
  name?: string;
  level?: number;
  category?: string;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1/skill";

const getAuthHeader = () => {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchSkills = async (skip = 0, limit = 100): Promise<SkillRead[]> => {
  const response = await axios.get<SkillRead[]>(`${API_URL}?skip=${skip}&limit=${limit}`);
  return response.data;
};
