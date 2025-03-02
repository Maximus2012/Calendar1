import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css"; // Подключаем стили

function LoginPage() {
  const [username, setUsername] = useState(""); // Логин
  const [password, setPassword] = useState(""); // Пароль
  const [error, setError] = useState(""); // Сообщения об ошибках
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/jwt/create/`, {
        username, // Логин
        password,
      });

      if (response.data && response.data.access && response.data.refresh) {
        localStorage.setItem("access", response.data.access);
        localStorage.setItem("refresh", response.data.refresh);

        // Перенаправление после успешного входа
        navigate("/");
      } else {
        setError("Ошибка входа. Попробуйте снова.");
      }
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