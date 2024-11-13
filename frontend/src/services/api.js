import axios from "axios";

const API_URL = 'https://frozen-sea-50755-1f37732e6aa8.herokuapp.com/api';

export const signup = (username, password) => {
  return axios.post(`${API_URL}/auth/signup`, { username, password });
};

export const login = (username, password) => {
  return axios.post(`${API_URL}/auth/login`, { username, password });
};

export const createProject = (userId, projectName, description, projectId) => {
  return axios.post(`${API_URL}/projects/create_project`, {
    user_id: userId,
    project_name: projectName,
    description,
    project_id: projectId,
  });
};

export const getProjects = (userId) => {
  return axios.get(`${API_URL}/projects/get_projects/${userId}`);
};

export const addViewer = (projectId, userId) => {
  return axios.post(`${API_URL}/projects/add_viewer`, {
    project_id: projectId,
    user_id: userId,
  });
};

export const removeViewer = (projectId, userId) => {
  return axios.post(`${API_URL}/projects/remove_viewer`, {
    project_id: projectId,
    user_id: userId,
  });
};

export const getProjectResources = (projectId) => {
  return axios.get(`${API_URL}/projects/project_resources/${projectId}`);
};

export const checkoutResource = (resourceId, units, projectId) => {
  return axios.post(`${API_URL}/resources/checkout`, {
    resource_id: resourceId,
    units,
    project_id: projectId,
  });
};

export const checkinResource = (resourceId, units, projectId) => {
  return axios.post(`${API_URL}/resources/checkin`, {
    resource_id: resourceId,
    units,
    project_id: projectId,
  });
};

export const createResource = (name, totalUnits) => {
  return axios.post(`${API_URL}/resources/create`, {
    name,
    total_units: totalUnits,
  });
};

export const getAllResources = () => {
    return axios.get(`${API_URL}/resources/all`)
        .then(response => response.data)
        .catch(error => {
            console.error("Error fetching resources:", error);
            throw error;
        });
};

export const joinProject = (projectId, userId) => {
  return axios.post(`${API_URL}/projects/join`, {
    project_id: projectId,
    user_id: userId,
  });
};

export const leaveProject = (projectId, userId) => {
  return axios.post(`${API_URL}/projects/leave`, {
    project_id: projectId,
    user_id: userId,
  });
};
