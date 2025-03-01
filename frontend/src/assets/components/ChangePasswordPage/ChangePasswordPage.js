import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ChangePasswordPage.css"; // Подключаем стили

function ChangePasswordPage() {
  const [current_password, setCurrentPassword] = useState(""); // Используем только логин
  const [new_password, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();  // Переместил на верх
  
    const token = localStorage.getItem("access");
    if (!token) {
      navigate("/login");
      return;
    }
  
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/auth/users/set_password/", 
        {
          current_password,  // Текущий пароль
          new_password,      // Новый пароль
        },
        {
          headers: { 
            Authorization: `Bearer ${token}`  // Отправляем токен в заголовке
          }
        }
      );
  
      // Выводим ответ или выполняем нужные действия
      console.log(response.data);
  
      // Перенаправление на главную страницу или в другой раздел
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Ошибка изменения пароля.");
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
        <form onSubmit={handleLogin}>
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
        <button onClick={handleHome}>Главная</button> {/* Кнопка выхода */}
      </div>
    </div>
  );
}

export default ChangePasswordPage;

