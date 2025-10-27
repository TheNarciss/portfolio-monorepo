// src/api/education.ts
import axios from "axios";

export interface EducationRead {
  id: string;
  degree: string;
  school?: string;
  start_date?: string;
  end_date?: string;
  location?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface EducationCreate {
  degree: string;
  school?: string;
  start_date?: string;
  end_date?: string;
  location?: string;
  description?: string;
}

export interface EducationUpdate {
  degree?: string;
  school?: string;
  start_date?: string;
  end_date?: string;
  location?: string;
  description?: string;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1/education";

const getAuthHeader = () => {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchEducations = async (skip = 0, limit = 100): Promise<EducationRead[]> => {
  const response = await axios.get<EducationRead[]>(`${API_URL}?skip=${skip}&limit=${limit}`);
  return response.data;
};

export const fetchEducationById = async (id: string): Promise<EducationRead> => {
  const response = await axios.get<EducationRead>(`${API_URL}/${id}`);
  return response.data;
};

export const createEducation = async (edu: EducationCreate): Promise<EducationRead> => {
  const response = await axios.post<EducationRead>(API_URL, edu, { headers: getAuthHeader() });
  return response.data;
};

export const updateEducation = async (id: string, edu: EducationUpdate): Promise<EducationRead> => {
  const response = await axios.put<EducationRead>(`${API_URL}/${id}`, edu, { headers: getAuthHeader() });
  return response.data;
};

export const deleteEducation = async (id: string): Promise<EducationRead> => {
  const response = await axios.delete<EducationRead>(`${API_URL}/${id}`, { headers: getAuthHeader() });
  return response.data;
};
