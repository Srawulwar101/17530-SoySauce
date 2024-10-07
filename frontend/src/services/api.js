import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000/api';

export const signup = (username, password) => {
    return axios.post(`${API_URL}/auth/signup`, { username, password });
};

export const login = (username, password) => {
    return axios.post(`${API_URL}/auth/login`, { username, password });
};

export const createProject = (userId, projectName, description, projectId) => {
    return axios.post(`${API_URL}/projects/create_project`, { user_id: userId, project_name: projectName, description, project_id: projectId });
};

export const getProjects = (userId) => {
    return axios.get(`${API_URL}/projects/get_projects/${userId}`);
};

export const checkoutResource = (resourceId, units) => {
    return axios.post(`${API_URL}/resources/checkout`, { resource_id: resourceId, units });
};

export const checkinResource = (resourceId, units) => {
    return axios.post(`${API_URL}/resources/checkin`, { resource_id: resourceId, units });
};
