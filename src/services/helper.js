import axios from "axios";
import { getToken } from "../auth";

// export const BASE_URL = "http://192.168.100.146:9090/api";
export const BASE_URL = "http://172.22.250.26:9090/api";
//export const BASE_URL = "http://localhost:9090/api";
export const myAxios = axios.create({
  baseURL: BASE_URL,
});

export const privateAxios = axios.create({
  baseURL: BASE_URL,
});

privateAxios.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      //config.headers.common.Authorization = `Bearer ${token}`;
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);
