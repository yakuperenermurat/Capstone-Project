import axios from 'axios';
// Base URL for the API used in the application
const API_URL = "https://open-sisile-patikadevs-7d054301.koyeb.app/api/v1";

// Creating an axios instance for reusable HTTP configurations
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
