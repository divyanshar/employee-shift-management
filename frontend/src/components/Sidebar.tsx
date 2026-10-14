
import { NavLink } from "react-router-dom";
import type { Role } from "./ProtectedRoute";

export default function Sidebar() {
  const role = localStorage.getItem("Role")?.toUpperCase() as Role;

  return (
    <aside className="sidebar">
      <h2>Main Menu</h2>

      <nav>
        {role === "ADMIN" && (
          <>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/shifts">Shift Management</NavLink>
          </>
        )}

        {role === "MANAGER" && (
          <NavLink to="/shifts">Shift Management</NavLink>
        )}

        {role === "EMPLOYEE" && (
          <>
            <NavLink to="/my-shifts">My Shifts</NavLink>
            <NavLink to="/profile">Profile</NavLink>
          </>
        )}

        <NavLink to="/leaves">Leave Management</NavLink>
      </nav>
    </aside>
  );
}
