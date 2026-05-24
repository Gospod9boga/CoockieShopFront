import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',  // ← полный URL, не только '/api'
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;