// src/api/projects.ts
import axios from "axios";

export interface ProjectRead {
  id: number;
  title: string;
  description?: string;
  tech_stack?: string;
  github_url?: string;
  live_url?: string;
  image_url?: string;
  is_featured?: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProjectCreate {
  title: string;
  description?: string;
  tech_stack?: string;
  github_url?: string;
  live_url?: string;
  image_url?: string;
  is_featured?: boolean;
}

export interface ProjectUpdate {
  title?: string;
  description?: string;
  tech_stack?: string;
  github_url?: string;
  live_url?: string;
  image_url?: string;
  is_featured?: boolean;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1/projects";

const getAuthHeader = () => {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchProjects = async (skip = 0, limit = 100): Promise<ProjectRead[]> => {
  const response = await axios.get<ProjectRead[]>(`${API_URL}?skip=${skip}&limit=${limit}`);
  return response.data;
};

export const fetchProjectById = async (id: number): Promise<ProjectRead> => {
  const response = await axios.get<ProjectRead>(`${API_URL}/${id}`);
  return response.data;
};

export const createProject = async (project: ProjectCreate): Promise<ProjectRead> => {
  const response = await axios.post<ProjectRead>(API_URL, project, { headers: getAuthHeader() });
  return response.data;
};

export const updateProject = async (id: number, project: ProjectUpdate): Promise<ProjectRead> => {
  const response = await axios.put<ProjectRead>(`${API_URL}/${id}`, project, { headers: getAuthHeader() });
  return response.data;
};

export const deleteProject = async (id: number): Promise<ProjectRead> => {
  const response = await axios.delete<ProjectRead>(`${API_URL}/${id}`, { headers: getAuthHeader() });
  return response.data;
};
