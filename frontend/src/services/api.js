// src/services/api.js
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

const instance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// --- AUTH ---
export const registerUser = (data) => instance.post('/auth/register', data);
export const loginUser = (data) => instance.post('/auth/login', data);

// --- TASKS ---
export const fetchTasks = (token) =>
  instance.get('/tasks', {
    headers: { Authorization: `Bearer ${token}` },
  });

export const createTask = (task, token) =>
  instance.post('/tasks', task, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateTask = (id, task, token) =>
  instance.put(`/tasks/${id}`, task, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteTask = (id, token) =>
  instance.delete(`/tasks/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const toggleTask = (id, token) =>
  instance.patch(`/tasks/${id}/toggle`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getUpcomingTasks = (token) =>
  instance.get('/tasks/upcoming', {
    headers: { Authorization: `Bearer ${token}` },
  });
