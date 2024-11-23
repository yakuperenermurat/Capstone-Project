import axios from 'axios';

const API_URL = "https://open-sisile-patikadevs-7d054301.koyeb.app/api/v1";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
