import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./assets/components/LoginPage/LoginPage";
import RegisterPage from "./assets/components/RegisterPage/RegisterPage";
import HomePage from "./assets/components/HomePage/HomePage";
import ChangePasswordPage from "./assets/components/ChangePasswordPage/ChangePasswordPage";
import CalendarPage from "./assets/components/CalendarPage/CalendarPage";
import EmojiSelectionPage from "./assets/components/EmojiSectionPage/EmojiSelectionPage";

function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/changepassword" element={<ChangePasswordPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/select-emoji/:date" element={<EmojiSelectionPage />} />
      </Routes>
    </Router>
  );
}

export default App;