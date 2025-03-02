import { useState } from "react";
import axiosInstance from "../axios"; // Импортируем настроенный axiosInstance
import { useNavigate } from "react-router-dom";
import "./ChangePasswordPage.css"; // Подключаем стили

function ChangePasswordPage() {
  const [current_password, setCurrentPassword] = useState(""); // Текущий пароль
  const [new_password, setNewPassword] = useState(""); // Новый пароль
  const [error, setError] = useState(""); // Ошибка
  const navigate = useNavigate(); // Навигация для редиректа

  // Функция для отправки запроса на изменение пароля
  const handleChangePassword = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("access");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await axiosInstance.post(
        "/auth/users/set_password/", // Используем axiosInstance
        {
          current_password, // Текущий пароль
          new_password, // Новый пароль
        }
      );

      console.log(response.data); // Для отладки

      // Перенаправление на главную страницу или в другой раздел
      navigate("/");
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 401) {
        // Если токен истек, пробуем обновить его
        const newToken = await refreshAccessToken();
        if (newToken) {
          // Если новый токен получен, пробуем снова выполнить запрос
          handleChangePassword(e);
        }
      } else {
        setError("Ошибка изменения пароля.");
      }
    }
  };

  // Функция для получения нового access токена
  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refresh");
    if (!refreshToken) {
      navigate("/login"); // Перенаправляем на страницу логина, если нет refresh токена
      return null;
    }

    try {
      const response = await axiosInstance.post("/auth/jwt/refresh/", {
        refresh: refreshToken,
      });

      // Сохраняем новый access токен
      const { access } = response.data;
      localStorage.setItem("access", access);
      return access;
    } catch (error) {
      console.error("Ошибка при обновлении токена", error);
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      navigate("/login"); // Перенаправляем на страницу логина в случае ошибки
      return null;
    }
  };

  const handleHome = () => {
    navigate("/");
  };

  return (
    <div className="login-container">
      <div className="form-container">
        <h2>Изменить пароль</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleChangePassword}>
          <input
            type="password"
            placeholder="Текущий пароль"
            value={current_password}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Новый пароль"
            value={new_password}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button type="submit">Изменить</button>
        </form>
        <button onClick={handleHome}>Главная</button>
      </div>
    </div>
  );
}

export default ChangePasswordPage;