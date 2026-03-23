import { NavLink } from "react-router-dom";
import logo from "../assets/cesizen-logo.png";

const navItems = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/users", label: "Utilisateurs" },
  { to: "/admin/contents", label: "Contenus" },
  { to: "/admin/categories", label: "Catégories" },
  { to: "/admin/presets", label: "Presets" },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <img src={logo} alt="Logo CESIZen" className="sidebar-logo" />

        <div>
          <h2>CESIZen</h2>
          <p>Back-Office</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}