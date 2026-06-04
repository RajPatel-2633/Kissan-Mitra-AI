import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  withCredentials: true, // Important for sending/receiving HTTP-Only cookies
});

export default api;
