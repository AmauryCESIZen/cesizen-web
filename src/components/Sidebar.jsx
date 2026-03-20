import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h2>CESIZen Admin</h2>

      <nav>
        <NavLink to="/admin">Dashboard</NavLink>
        <NavLink to="/admin/users">Utilisateurs</NavLink>
        <NavLink to="/admin/contents">Contenus</NavLink>
        <NavLink to="/admin/categories">Catégories</NavLink>
        <NavLink to="/admin/presets">Presets</NavLink>
      </nav>
    </aside>
  );
}