import axios from 'axios';

const api = axios.create({
  baseURL: 'http://72.56.240.200:8080',  // ← полный URL, не только '/api'
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
