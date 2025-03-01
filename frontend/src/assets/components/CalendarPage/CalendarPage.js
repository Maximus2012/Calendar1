import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactCalendar from "react-calendar";
import { useNavigate } from "react-router-dom";
import "./CalendarPage.css"; // Подключаем стили

function CalendarPage() {
  const [calendarData, setCalendarData] = useState([]);
  const [date, setDate] = useState(new Date()); // Хранение текущей даты
  const navigate = useNavigate(); // Навигация для редиректа

  useEffect(() => {
    // Функция для получения данных с API
    const fetchCalendarData = async () => {
      const token = localStorage.getItem("access");
      if (!token) {
        navigate("/login"); // Перенаправляем на страницу логина, если токен не найден
        return;
      }

      try {
        const response = await axios.get("http://localhost:8000/api/calendar/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCalendarData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Ошибка при получении данных с API", error);
      }
    };

    fetchCalendarData();
  }, [navigate]);

  // Функция для проверки эмодзи для конкретной даты
  const getEmojisForDate = (currentDate) => {
    const correctedDate = new Date(currentDate);
    correctedDate.setDate(correctedDate.getDate() + 1);
    const dateString = correctedDate.toISOString().split("T")[0];
    
    const dayData = calendarData.find(item => item.data === dateString);
    if (dayData) {
      return dayData.emoji_details.map((emoji) => (
        <img 
          key={emoji.id} 
          src={emoji.image} 
          alt={emoji.name} 
          style={{ width: "40px", height: "40px", margin: "2px" }} 
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
            onClickDay={handleDateClick} // Обработчик клика по дате
            tileContent={({ date }) => (
              <div className="tile-content">
                {getEmojisForDate(date)}
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
}

export default CalendarPage;