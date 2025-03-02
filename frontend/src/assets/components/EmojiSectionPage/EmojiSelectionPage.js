import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addDays, format } from 'date-fns'; // Импортируем нужные функции из date-fns
import axiosInstance from '../axios'; // Импортируем настроенный axios
import "./EmojiSelectionPage.css";

function EmojiSelectionPage() {
  const { date } = useParams();
  const [categories, setCategories] = useState([]);
  const [emojis, setEmojis] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedEmojis, setSelectedEmojis] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryImage, setNewCategoryImage] = useState(null);
  const [newEmoji, setNewEmoji] = useState("");
  const [newEmojiImage, setNewEmojiImage] = useState(null);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddEmoji, setShowAddEmoji] = useState(false);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  // Преобразуем date из параметров маршрута и добавляем 1 день
  const nextDate = addDays(new Date(date), 1); // Добавляем 1 день к текущей дате
  const formattedDate = format(nextDate, 'yyyy-MM-dd'); // Форматируем дату в нужный вид

  const apiRequest = async (url, method = "get", data = null) => {
    try {
      const response = await axiosInstance({
        method,
        url,
        data,
      });
      return response;
    } catch (error) {
      console.error("Ошибка при запросе", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await apiRequest(`${process.env.REACT_APP_API_URL}/auth/users/me/`);
        setUserId(response.data.id);
      } catch (error) {
        console.error("Ошибка при получении данных пользователя", error);
        navigate("/login");
      }
    };

    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiRequest(`${process.env.REACT_APP_API_URL}/api/categories/`);
        setCategories(response.data);
      } catch (error) {
        console.error("Ошибка при получении категорий", error);
      }
    };

    fetchCategories();
  }, []);

  const fetchEmojis = async (categoryId) => {
    try {
      const response = await apiRequest(`${process.env.REACT_APP_API_URL}/api/emogis/by-category/${categoryId}/`);
      setEmojis(response.data);
      setSelectedCategory(categoryId);
    } catch (error) {
      console.error("Ошибка при получении эмодзи", error);
    }
  };

  const handleAddEmoji = async (emojiId) => {
    if (selectedEmojis.includes(emojiId)) {
      setSelectedEmojis(selectedEmojis.filter(id => id !== emojiId));
    } else {
      if (selectedEmojis.length < 3) {
        setSelectedEmojis([...selectedEmojis, emojiId]);
      }
    }
  };

  const handleSendEmojis = async () => {
    if (selectedEmojis.length === 0) {
      alert("Пожалуйста, выберите хотя бы одно эмодзи.");
      return;
    }

    try {
      await apiRequest(
        `${process.env.REACT_APP_API_URL}/api/calendar/`,
        "post",
        {
          data: formattedDate, // Отправляем новую дату (добавленную на 1 день)
          user: userId,
          emoji: selectedEmojis,
        }
      );
      navigate("/calendar");
    } catch (error) {
      console.error("Ошибка при отправке эмодзи", error);
    }
  };

  const ClearSendEmojis = async () => {
    try {
      await apiRequest(
        `${process.env.REACT_APP_API_URL}/api/calendar/`,
        "post",
        {
          data: formattedDate, // Отправляем новую дату (добавленную на 1 день)
          user: userId,
          emoji: [],
        }
      );
      navigate("/calendar");
    } catch (error) {
      console.error("Ошибка при отправке эмодзи", error);
    }
  };

  const handleAddCategory = async () => {
    if (!userId) {
      alert("Не удалось получить данные пользователя.");
      return;
    }

    const formData = new FormData();
    formData.append("name", newCategoryName);
    formData.append("image", newCategoryImage);
    formData.append("user", userId);

    try {
      const response = await apiRequest(
        `${process.env.REACT_APP_API_URL}/api/categories/`,
        "post",
        formData
      );
      setCategories([...categories, response.data]);
      setShowAddCategory(false);
      setNewCategoryName("");
      setNewCategoryImage(null);
    } catch (error) {
      console.error("Ошибка при добавлении категории", error);
    }
  };

  const handleAddEmojiToCategory = async () => {
    if (!userId) {
      alert("Не удалось получить данные пользователя.");
      return;
    }

    if (!selectedCategory) {
      alert("Пожалуйста, выберите категорию для эмодзи.");
      return;
    }

    const formData = new FormData();
    formData.append("name", newEmoji);
    formData.append("image", newEmojiImage);
    formData.append("category", selectedCategory);
    formData.append("user_id", userId);

    try {
      const response = await apiRequest(
        `${process.env.REACT_APP_API_URL}/api/emogis/`,
        "post",
        formData
      );
      setEmojis([...emojis, response.data]);
      setShowAddEmoji(false);
      setNewEmoji("");
      setNewEmojiImage(null);
    } catch (error) {
      console.error("Ошибка при добавлении эмодзи", error);
    }
  };

  const handleCategorySelection = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await apiRequest(`${process.env.REACT_APP_API_URL}/api/categories/${categoryId}/`, "delete");
      setCategories(categories.filter((category) => category.id !== categoryId));
    } catch (error) {
      console.error("Ошибка при удалении категории", error);
    }
  };

  const handleDeleteEmoji = async (emojiId) => {
    try {
      await apiRequest(`${process.env.REACT_APP_API_URL}/api/emogis/${emojiId}/`, "delete");
      setEmojis(emojis.filter((emoji) => emoji.id !== emojiId));
    } catch (error) {
      console.error("Ошибка при удалении эмодзи", error);
    }
  };

  const handleHome = () => {
    navigate("/calendar");
  };

  return (
    <div className="emoji-selection">
      <button onClick={handleHome}>Кадендарь</button>

      <h2>Выберите категорию эмодзи для {formattedDate}</h2>
      <div className="categories">
        {categories.map((category) => (
          <div className="category-item" key={category.id}>
            <img
              src={category.image}
              alt={category.name}
              className="category-image"
              onClick={() => fetchEmojis(category.id)}
            />
            <button
              className="delete-button"
              onClick={() => handleDeleteCategory(category.id)}
            >
              X
            </button>
          </div>
        ))}
        <button onClick={() => setShowAddCategory(true)} className="add-category-button">
          Добавить категорию
        </button>
      </div>

      {selectedCategory && (
        <div className="emojis">
          <h3>Выберите эмодзи (до 3)</h3>
          <div className="emoji-list">
            {emojis.map((emoji) => (
              <div className="emoji-item" key={emoji.id}>
                <img
                  src={emoji.image}
                  alt={emoji.name}
                  className={`category-image emoji-image ${selectedEmojis.includes(emoji.id) ? 'selected' : ''}`}
                  onClick={() => handleAddEmoji(emoji.id)}
                />
                <button
                  className="delete-button"
                  onClick={() => handleDeleteEmoji(emoji.id)}
                >
                  X
                </button>
              </div>
            ))}
          </div>
          <button onClick={() => setShowAddEmoji(true)} className="add-emoji-button">
            Добавить эмодзи
          </button>
        </div>
      )}

      {showAddEmoji && (
        <div className="modal">
          <div className="modal-content">
            <h3>Добавить эмодзи</h3>
            <input
              type="text"
              value={newEmoji}
              onChange={(e) => setNewEmoji(e.target.value)}
              placeholder="Название эмодзи"
            />
            <input
              type="file"
              onChange={(e) => setNewEmojiImage(e.target.files[0])}
            />
            <div className="categories-select">
              <h4>Выберите категорию</h4>
              {categories.map((category) => (
                <div
                  key={category.id}
                  className={`category-option ${selectedCategory === category.id ? "selected" : ""}`}
                  onClick={() => handleCategorySelection(category.id)}
                >
                  <img src={category.image} alt={category.name} className={"category-image emoji-image"} />
                  <p>{category.name}</p>
                </div>
              ))}
            </div>
            <button onClick={handleAddEmojiToCategory}>Добавить</button>
            <button onClick={() => setShowAddEmoji(false)}>Закрыть</button>
          </div>
        </div>
      )}

      {showAddCategory && (
        <div className="modal">
          <div className="modal-content">
            <h3>Добавить категорию</h3>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Название категории"
            />
            <input
              type="file"
              onChange={(e) => setNewCategoryImage(e.target.files[0])}
            />
            <button onClick={handleAddCategory}>Добавить</button>
            <button onClick={() => setShowAddCategory(false)}>Закрыть</button>
          </div>
        </div>
      )}

      <button onClick={handleSendEmojis} className="send-emojis-button">
        Отправить эмодзи
      </button>
      <button onClick={ClearSendEmojis} color="red" className="send-emojis-button">
        Очистить дату
      </button>
    </div>
  );
}

export default EmojiSelectionPage;