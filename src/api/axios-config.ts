// src/api/axiosInstance.ts
import axios from 'axios';
import { fetchAuthSession } from 'aws-amplify/auth';
import { store } from '../redux/store';
import { logoutAsync } from '../redux/slices/auth-slice';

const baseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api';

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach token
axiosInstance.interceptors.request.use(async (config) => {
  try {
      const { idToken } = (await fetchAuthSession()).tokens ?? {};
      
      if (idToken) {
        config.headers.Authorization = `Bearer ${idToken}`;
      }
      return config;
    } catch (error) {
      console.error('Error getting token:', error);
      store.dispatch(logoutAsync());
      return Promise.reject(error instanceof Error ? error : new Error(error as string));
    }
});

// Response interceptor: handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Attempt to refresh token (Amplify usually handles this automatically)
        await fetchAuthSession({ forceRefresh: true });
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('Session expired:', refreshError);
        store.dispatch(logoutAsync());
      }
    }

    return Promise.reject(error instanceof Error ? error : new Error(error));
  }
);

export { axiosInstance as axios, baseURL };