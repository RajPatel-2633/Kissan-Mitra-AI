import { create } from 'zustand';
import api from '../lib/axios';
import toast from 'react-hot-toast';

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  checkAuth: async () => {
    try {
      const res = await api.get('/auth/profile');
      set({ 
        user: res.data.data, 
        isAuthenticated: true 
      });
    } catch (error) {
      set({ user: null, isAuthenticated: false });
    }
  },

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      await api.post('/auth/login', credentials);
      const profileRes = await api.get('/auth/profile');
      
      set({ 
        user: profileRes.data.data, 
        isAuthenticated: true, 
        isLoading: false 
      });
      toast.success("Welcome back!");
      return true;
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to login. Please check your credentials.';
      set({ error: msg, isLoading: false });
      toast.error(msg);
      return false;
    }
  },

  signup: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      await api.post('/auth/register', userData);
      set({ isLoading: false });
      toast.success("Account created successfully! Please log in.");
      return true;
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to create account.';
      set({ error: msg, isLoading: false });
      toast.error(msg);
      return false;
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error", error);
      toast.error("Failed to log out properly.");
    } finally {
      set({ user: null, isAuthenticated: false, error: null });
    }
  },
  
  clearError: () => set({ error: null })
}));

export default useAuthStore;
