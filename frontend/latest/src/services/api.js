import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore'; 

const api = axios.create({
  baseURL: 'https://eco-ciclo-pfe-poo-aps-backend.onrender.com/api' 
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Exporta o seu serviço exatamente como já estava
export const wasteService = {
  listar: async () => {
    const response = await api.get('/waste-items');
    return response.data;
  },
  cadastrar: async (item) => {
    const response = await api.post('/waste-items', item);
    return response.data;
  },
  atualizar: async (id, item) => {
    const response = await api.put(`/waste-items/${id}`, item);
    return response.data;
  },
  deletar: async (id) => {
    await api.delete(`/waste-items/${id}`);
  }
};

export default api;