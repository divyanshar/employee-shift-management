import { Navigate, Outlet } from "react-router-dom";

export type Role = "ADMIN" | "MANAGER" | "EMPLOYEE";
interface ProtectedRouteProps {
  allowedRoles?: Role[];
}
export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const token = localStorage.getItem("accessToken");
  const role = localStorage.getItem("Role")?.toUpperCase() as Role | undefined;

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!role || !["ADMIN", "MANAGER", "EMPLOYEE"].includes(role)) {
    // localStorage.removeItem("accessToken");
    // localStorage.removeItem("Role");
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === "EMPLOYEE") {
      return <Navigate to="/my-shifts" replace />;
    }

    if (role === "MANAGER") {
      return <Navigate to="/shifts" replace />;
    }

    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
