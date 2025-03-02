// src/axios.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("access");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Перехватчик ответа для обработки ошибки 401 (Unauthorized)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refresh");

      if (refreshToken) {
        try {
          const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/auth/jwt/refresh/`,
            { refresh: refreshToken }
          );
          const newAccessToken = response.data.access;

          // Сохраняем новый access токен
          localStorage.setItem("access", newAccessToken);
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

          return axiosInstance(originalRequest); // Повторный запрос с новым токеном
        } catch (refreshError) {
          console.error("Ошибка при обновлении токена", refreshError);
          // Удаляем токены и перенаправляем на страницу логина
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          window.location.href = "/login"; // Перенаправление на страницу входа
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;