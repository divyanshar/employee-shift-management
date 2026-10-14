import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ShiftDetails from "./pages/ShiftDetails";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Shifts from "./pages/Shifts";
import CreateShift from "./pages/CreateShift";
import EditShift from "./pages/EditShift";
import MyShifts from "./pages/MyShifts";
import Leaves from "./pages/Leaves";
import LeaveForm from "./components/LeaveForm";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./layouts/AppLayout";

function RoleHomeRedirect() {
  const role = localStorage.getItem("Role")?.toUpperCase();
  if (role === "ADMIN") return <Navigate to="/dashboard" replace />;
  if (role === "MANAGER") return <Navigate to="/shifts" replace />;
  if (role === "EMPLOYEE") return <Navigate to="/my-shifts" replace />;

  return <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
            <Route
              element={<ProtectedRoute allowedRoles={["ADMIN", "MANAGER"]} />}
            >
              <Route path="/shifts" element={<Shifts />} />
              <Route path="/shifts/create" element={<CreateShift />} />
              <Route path="/shifts/:id/edit" element={<EditShift />} />
            </Route>
            <Route element={<ProtectedRoute allowedRoles={["EMPLOYEE"]} />}>
              <Route path="/my-shifts" element={<MyShifts />} />
              <Route path="/leaves/new" element={<LeaveForm />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/leaves/:id/edit" element={<LeaveForm />}/>
            </Route>
            <Route path="/leaves" element={<Leaves />} />
            <Route path="/shifts/:id" element={<ShiftDetails />} />
            <Route path="/home" element={<RoleHomeRedirect />} />
            <Route path="/" element={<RoleHomeRedirect />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
