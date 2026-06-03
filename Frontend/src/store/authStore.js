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
      return true;
    } catch (error) {
      set({ error: 'Failed to login. Please check your credentials.', isLoading: false });
      return false;
    }
  },

  signup: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call for signup
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In Signup -> Login flow, we do NOT set isAuthenticated to true here.
      // We just resolve to let the component handle redirecting to Login.
      set({ 
        isLoading: false 
      });
      return true;
    } catch (error) {
      set({ error: 'Failed to create account.', isLoading: false });
      return false;
    }
  },

  logout: () => set({ user: null, isAuthenticated: false, error: null }),
  
  clearError: () => set({ error: null })
}));

export default useAuthStore;
