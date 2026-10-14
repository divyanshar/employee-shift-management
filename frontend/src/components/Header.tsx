
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const accessToken=localStorage.getItem("accessToken");
  function handleLogout() {
    //localStorage.removeItem("accessToken");
    localStorage.clear();
    navigate("/login", { replace: true });
  }

  return (
    <div className="Header-container">
      {accessToken && (
        <header className="page-header">
          <h2>Employee Shift Management</h2>
          <button
            type="button"
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </header>
      )}
    </div>
  );
}

export default Header;
