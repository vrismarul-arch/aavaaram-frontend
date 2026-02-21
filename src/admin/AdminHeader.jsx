import { useAdmin } from "../context/AdminContext";
import { useNavigate } from "react-router-dom";
// import "./AdminHeader.css";

export default function AdminHeader({ title }) {
  const { logout } = useAdmin();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="admin-header">
      <h2 className="admin-title">{title}</h2>

      <button
        className="admin-logout-btn"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
}