import React, { useState, useEffect } from "react";
import axiosInstance from "../axios"; // Импортируем настроенный axiosInstance
import ReactCalendar from "react-calendar";
import { useNavigate } from "react-router-dom";
import "./CalendarPage.css"; // Подключаем стили

function CalendarPage() {
  const [calendarData, setCalendarData] = useState([]);
  const [date, setDate] = useState(new Date()); // Хранение текущей даты
  const navigate = useNavigate(); // Навигация для редиректа

  // Функция для получения данных с API
  const fetchCalendarData = async () => {
    try {
      const response = await axiosInstance.get("/api/calendar/"); // Используем axiosInstance
      setCalendarData(response.data);

    } catch (error) {
      console.error("Ошибка при получении данных с API", error);
      if (error.response && error.response.status === 401) {
        // Если ошибка 401 (неавторизован), перенаправляем на страницу логина
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    fetchCalendarData();
  }, [navigate]);

  // Функция для проверки эмодзи для конкретной даты
  const getEmojisForDate = (currentDate) => {
    const correctedDate = new Date(currentDate);
    correctedDate.setDate(correctedDate.getDate() + 1);
    const dateString = correctedDate.toISOString().split("T")[0];

    const dayData = calendarData.find((item) => item.data === dateString);
    if (dayData) {
      return dayData.emoji_details.map((emoji) => (
        <img
          key={emoji.id}
          src={emoji.image}
          alt={emoji.name}
          style={{ width: "60px", height: "60px", margin: "2px" }}
        />
      ));
    }
    return null;
  };

  const handleDateClick = (clickedDate) => {
    const formattedDate = clickedDate.toISOString().split("T")[0];
    navigate(`/select-emoji/${formattedDate}`);
  };

  const handleHome = () => {
    navigate("/");
  };

  return (
    <div>
      <button onClick={handleHome}>Главная</button>
      <div className="calendar-page">
        <div className="calendar-container">
          <ReactCalendar
            onChange={setDate}
            value={date}
            onClickDay={handleDateClick}
            tileContent={({ date, view }) => {
              if (view !== "month") return null; // Очищаем эмодзи, если пользователь смотрит не дни
              return <div className="tile-content">{getEmojisForDate(date)}</div>;
            }}
            onActiveStartDateChange={({ view }) => {
              if (view !== "month") {
                setCalendarData([]); // Очищаем данные при переключении на год/десятилетие
              } else {
                fetchCalendarData(); // Загружаем эмодзи заново, если вернулись к месяцу
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default CalendarPage;