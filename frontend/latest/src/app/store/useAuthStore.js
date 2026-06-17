import { create } from 'zustand';
import { persist } from 'zustand/middleware'; 

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,

      login: (userData, authToken) => set({ user: userData, token: authToken }),

      logout: () => set({ user: null, token: null }),
      
      setUser: (userData) => set((state) => ({ ...state, user: userData })),
    }),
    {
      name: 'ecociclo-auth',
    }
  )
);