import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const api = axios.create({
  baseURL: "http://192.168.0.100:5000",
  timeout: 5000
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  res => res,
  async err => {
    if (err.response?.status === 401) {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("currentUser");

      alert("Session expired. Please login again.");
    }
    return Promise.reject(err);
  }
);