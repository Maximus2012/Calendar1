import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css"; // Подключаем стили

function LoginPage() {
  const [username, setUsername] = useState(""); // Используем только логин
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://127.0.0.1:8000/auth/jwt/create/", {
        username, // Логин
        password,
      });

      console.log(response.data); // Для отладки

      // Сохраняем токены
      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);

      // Перенаправление на главную страницу или в другой раздел
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Ошибка входа. Проверьте логин и пароль.");
    }
  };

  return (
    <div className="login-container">
      <div className="form-container">
        <h2>Вход</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Логин"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Войти</button>
        </form>
        <p>
          Нет аккаунта? <a href="/register">Зарегистрироваться</a>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;