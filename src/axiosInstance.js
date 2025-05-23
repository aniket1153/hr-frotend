// src/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: "https://hr-backend-liart.vercel.app",
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
