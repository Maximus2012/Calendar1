import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./EmojiSelectionPage.css";

function EmojiSelectionPage() {
  const { date } = useParams();
  const [categories, setCategories] = useState([]);
  const [emojis, setEmojis] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedEmojis, setSelectedEmojis] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryImage, setNewCategoryImage] = useState(null); // Новое состояние для изображения категории
  const [newEmoji, setNewEmoji] = useState("");
  const [newEmojiImage, setNewEmojiImage] = useState(null);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddEmoji, setShowAddEmoji] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      const token = localStorage.getItem("access");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const response = await axios.get("http://localhost:8000/api/categories/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(response.data);
      } catch (error) {
        console.error("Ошибка при получении категорий", error);
      }
    };

    fetchCategories();
  }, [navigate]);

  const fetchEmojis = async (categoryId) => {
    const token = localStorage.getItem("access");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const response = await axios.get(`http://localhost:8000/api/emogis/by-category/${categoryId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
      // Ограничение на выбор до 3 эмодзи
      if (selectedEmojis.length < 3) {
        setSelectedEmojis([...selectedEmojis, emojiId]);
      }
    }

    const token = localStorage.getItem("access");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        "http://localhost:8000/api/calendar/",
        { data: date, emoji_id: selectedEmojis },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/calendar");
    } catch (error) {
      console.error("Ошибка при добавлении эмодзи", error);
    }
  };

  const handleAddCategory = async () => {
    const token = localStorage.getItem("access");
    if (!token) {
      navigate("/login");
      return;
    }

    const formData = new FormData();
    formData.append("name", newCategoryName);
    formData.append("image", newCategoryImage); // Добавляем изображение категории

    try {
      const response = await axios.post(
        "http://localhost:8000/api/categories/",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCategories([...categories, response.data]);
      setShowAddCategory(false);
      setNewCategoryName(""); // Очистить поле имени
      setNewCategoryImage(null); // Очистить выбранное изображение
    } catch (error) {
      console.error("Ошибка при добавлении категории", error);
    }
  };

  const handleAddEmojiToCategory = async () => {
    const token = localStorage.getItem("access");
    if (!token) {
      navigate("/login");
      return;
    }
  
    // Проверка на выбор категории
    if (!selectedCategory) {
      alert("Пожалуйста, выберите категорию для эмодзи.");
      return;
    }
  
    const formData = new FormData();
    formData.append("name", newEmoji);
    formData.append("image", newEmojiImage);
    formData.append("category", selectedCategory);
    console.log(selectedCategory) // Передаем id выбранной категории
  
    try {
      const response = await axios.post(
        "http://localhost:8000/api/emogis/",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEmojis([...emojis, response.data]);
      setShowAddEmoji(false);
      setNewEmoji(""); // Очистить поле имени эмодзи
      setNewEmojiImage(null); // Очистить выбранное изображение
    } catch (error) {
      console.error("Ошибка при добавлении эмодзи", error);
    }
  };
  
  const handleCategorySelection = (categoryId) => {
    setSelectedCategory(categoryId); // Обновляем выбранную категорию
  };
  
  return (
    <div className="emoji-selection">
      <h2>Выберите категорию эмодзи для {date}</h2>
      <div className="categories">
        {categories.map((category) => (
          <img
            key={category.id}
            src={category.image}
            alt={category.name}
            className=" category-image "
            onClick={() => fetchEmojis(category.id)}
          />
        ))}
        <button onClick={() => setShowAddCategory(true)} className="add-category-button">Добавить категорию</button>
      </div>
  
      {selectedCategory && (
        <div className="emojis">
          <h3>Выберите эмодзи (до 3)</h3>
          <div className="emoji-list">
            {emojis.map((emoji) => (
              <img 
                key={emoji.id}
                src={emoji.image}
                alt={emoji.name}
                className={`category-image emoji-image ${selectedEmojis.includes(emoji.id) ? 'selected' : ''}`}
                onClick={() => handleAddEmoji(emoji.id)}
              />
            ))}
          </div>
          <button onClick={() => setShowAddEmoji(true)} className="add-emoji-button">Добавить эмодзи</button>
        </div>
      )}
  
      {/* Форма для добавления эмодзи */}
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
                  onClick={() => handleCategorySelection(category.id)} // Обновляем selectedCategory
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

      {/* Форма для добавления новой категории */}
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
    </div>
  );
}

export default EmojiSelectionPage;