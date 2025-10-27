import axios from "axios";

export interface ExperienceRead {
  id: string;
  title: string;
  company?: string;
  start_date?: string;
  end_date?: string;
  location?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface ExperienceCreate {
  title: string;
  company?: string;
  start_date?: string;
  end_date?: string;
  location?: string;
  description?: string;
}

export interface ExperienceUpdate {
  title?: string;
  company?: string;
  start_date?: string;
  end_date?: string;
  location?: string;
  description?: string;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1/experience";

const getAuthHeader = () => {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchExperiences = async (skip = 0, limit = 100): Promise<ExperienceRead[]> => {
  const response = await axios.get<ExperienceRead[]>(`${API_URL}?skip=${skip}&limit=${limit}`);
  return response.data;
};
