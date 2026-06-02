import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call for login
      await new Promise(resolve => setTimeout(resolve, 1000));
      set({ 
        user: { name: 'Kisan User', mobile: credentials.mobile }, 
        isAuthenticated: true, 
        isLoading: false 
      });
    } catch (error) {
      set({ error: 'Failed to login. Please check your credentials.', isLoading: false });
    }
  },

  signup: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call for signup
      await new Promise(resolve => setTimeout(resolve, 1000));
      set({ 
        user: { name: userData.name, mobile: userData.mobile }, 
        isAuthenticated: true, 
        isLoading: false 
      });
    } catch (error) {
      set({ error: 'Failed to create account.', isLoading: false });
    }
  },

  logout: () => set({ user: null, isAuthenticated: false, error: null }),
  
  clearError: () => set({ error: null })
}));

export default useAuthStore;
