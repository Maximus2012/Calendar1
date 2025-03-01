import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar"; // Импортируем компонент календаря
import "react-calendar/dist/Calendar.css"; // Стили для календаря
import "./HomePage.css"; // Подключаем стили

function HomePage() {
  const [user, setUser] = useState(null);
  const [date, setDate] = useState(new Date()); // Текущая дата
  const [emojis, setEmojis] = useState({}); // Состояние для хранения эмоджи на дни
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("access");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get("http://127.0.0.1:8000/auth/users/me/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (err) {
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


  return (
    <div className="home-container">
      {user ? (
        <div>
          <h2>Привет, {user.username}!</h2>
          <p>Добро пожаловать в систему.</p>
          <button onClick={handleLogout}>Выйти</button> {/* Кнопка выхода */}
          <button onClick={handleCalendar}>Календарь</button> {/* Кнопка выхода */}
         
        </div>
      ) : (
        <p>Загрузка...</p>
      )}
    </div>
  );
}

export default HomePage;