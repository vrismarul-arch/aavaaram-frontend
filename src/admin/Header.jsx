import { useState, useEffect, useRef } from "react";
import { FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import "./Header.css";

export default function Header() {

  const navigate = useNavigate();
  const dropdownRef = useRef();

  const [showMenu, setShowMenu] = useState(false);
  const [admin, setAdmin] = useState(null);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  /* ✅ Check login */
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const adminName = localStorage.getItem("adminName");

    if (token) {
      setAdmin(adminName || "Admin");
    }
  }, []);

  /* ✅ Close dropdown when click outside */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* ✅ Login */
  const handleLogin = async () => {
    try {
      const res = await API.post("/admin/login", form);

      localStorage.setItem("adminToken", res.data.token);
      localStorage.setItem("adminName", res.data.name);

      setAdmin(res.data.name);
      setShowMenu(false);
      navigate("/admin/dashboard");

    } catch (err) {
      alert("Invalid Admin Login");
    }
  };

  /* ✅ Logout */
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminName");
    setAdmin(null);
    setShowMenu(false);
    navigate("/");
  };

  return (
    <div className="profile-wrapper" ref={dropdownRef}>

      <FiUser
        size={22}
        className="profile-icon"
        onClick={() => setShowMenu(!showMenu)}
      />

      {showMenu && (
        <div className="profile-dropdown">

          {admin ? (
            <>
              <p
                onClick={() => {
                  navigate("/admin/profile");
                  setShowMenu(false);
                }}
              >
                Profile
              </p>

              <p
                onClick={() => {
                  navigate("/admin/bookings");
                  setShowMenu(false);
                }}
              >
                My Bookings
              </p>

              <p
                className="logout"
                onClick={handleLogout}
              >
                Logout
              </p>
            </>
          ) : (
            <>
              <h4>Admin Login</h4>

              <input
                type="email"
                placeholder="Email"
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />

              <input
                type="password"
                placeholder="Password"
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />

              <button onClick={handleLogin}>
                Login
              </button>
            </>
          )}

        </div>
      )}
    </div>
  );
}
