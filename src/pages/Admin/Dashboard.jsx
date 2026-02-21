import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext";

export default function AdminDashboard() {
  const { adminToken } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!adminToken) {
      navigate("/admin-login");
    }
  }, [adminToken, navigate]);

  if (!adminToken) {
    return null; // prevent flash before redirect
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>Admin Dashboard</h1>
      <p>Welcome! Manage your website content here.</p>
    </div>
  );
}