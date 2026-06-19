import axios from 'axios';

// Instance Axios configurée pour pointer vers notre backend
const api = axios.create({
  baseURL: 'http://localhost:3000/api', // L'URL de notre backend Express
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour injecter automatiquement le Token JWT dans chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs (ex: Token expiré)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si l'erreur est une 401 (Non autorisé) et qu'on n'est pas sur la route de login
    if (error.response?.status === 401 && window.location.pathname !== '/login') {
      // TODO: Logique de rafraîchissement du token (Refresh Token)
      // Pour l'instant, on déconnecte l'utilisateur
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
