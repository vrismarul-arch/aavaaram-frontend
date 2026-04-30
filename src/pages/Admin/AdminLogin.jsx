import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { useAdmin } from "../../context/AdminContext";
import "./Adminlogin.css";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAdmin();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/admin/login", form);

      login(res.data.token);

      navigate("/admin/dashboard");

    } catch (err) {
      alert("Invalid Email or Password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-container">
      
      {/* LEFT SIDE */}
      <div className="left-panel">
        <h1>Welcome Admin</h1>
        <p>Manage your system efficiently and securely.</p>
      </div>

      {/* RIGHT SIDE */}
      <div className="right-panel">
        <div className="login-box">
          <h2>Admin Login</h2>

          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />

          <button onClick={handleLogin} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </div>

    </div>
  );
}