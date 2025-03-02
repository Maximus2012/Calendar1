// src/components/HomePage.js
import React, { useState, useEffect } from "react";
import axiosInstance from "../axios"; // Используем axiosInstance
import { useNavigate } from "react-router-dom";
import "react-calendar/dist/Calendar.css"; // Стили для календаря
import "./HomePage.css"; // Подключаем стили

function HomePage() {
  const [user, setUser] = useState(null);
  const [date, setDate] = useState(new Date()); // Текущая дата
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(`${process.env.REACT_APP_API_URL}/auth/users/me/`);
        setUser(response.data);
      } catch (err) {
        // Если ошибка, удаляем токены и перенаправляем на страницу логина
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    // Удаляем токены из localStorage
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    // Перенаправляем пользователя на страницу входа
    navigate("/login");
  };

  const handleCalendar = () => {
    navigate("/calendar");
  };

  const ChangePassword = () => {
    navigate("/changepassword");
  };

  return (
    <div className="home-container">
      {user ? (
        <div>
          <h2>Привет, {user.username}!</h2>
          <p>Добро пожаловать в систему.</p>
          <button onClick={handleLogout}>Выйти</button> {/* Кнопка выхода */}
          <button onClick={ChangePassword}>Сменить пароль</button> {/* Кнопка изменения пароля */}
          <button onClick={handleCalendar}>Календарь</button> {/* Кнопка перехода в календарь */}
        </div>
      ) : (
        <p>Загрузка...</p>
      )}
    </div>
  );
}

export default HomePage;