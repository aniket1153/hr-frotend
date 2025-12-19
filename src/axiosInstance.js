// src/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: "https://hr-backend-coral.vercel.app",
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
