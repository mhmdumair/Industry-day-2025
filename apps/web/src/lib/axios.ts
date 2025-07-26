// api.ts / api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 10000,                       // optional
});

export default api;
