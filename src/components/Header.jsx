import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMe } from "../services/authService";
import { removeToken } from "../utils/authStorage";

export default function Header() {
  const navigate = useNavigate();
  const [me, setMe] = useState(null);

  useEffect(() => {
    const loadMe = async () => {
      try {
        const result = await getMe();
        setMe(result.data);
      } catch (err) {
        console.error("Impossible de récupérer le profil admin.");
      }
    };

    loadMe();
  }, []);

  const handleLogout = () => {
    removeToken();
    navigate("/login");
  };

  return (
    <header className="header">
      <div>
        <strong>Back-Office CESIZen</strong>
      </div>

      <div className="header-right">
        {me && (
          <div className="header-user">
            <span className="header-user-email">{me.email}</span>
            <span className="header-user-role">{me.role}</span>
          </div>
        )}

        <button onClick={handleLogout}>Déconnexion</button>
      </div>
    </header>
  );
}