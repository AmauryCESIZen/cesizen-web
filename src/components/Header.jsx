import { useNavigate } from "react-router-dom";
import { removeToken } from "../utils/authStorage";

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    navigate("/login");
  };

  return (
    <header className="header">
      <span>Back-Office CESIZen</span>
      <button onClick={handleLogout}>Déconnexion</button>
    </header>
  );
}