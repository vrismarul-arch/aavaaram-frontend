import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import api from "../../services/api";
import "./Login.css";
import loginImage from "../../assets/login/loginImage.jpg";
import logo from "./logo.png";

export default function Login() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState("email");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    contact: "",
    password: ""
  });
  const navigate = useNavigate();

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (token && user) {
      navigate("/");
    }
  }, [navigate]);

  // Load saved credentials
  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    const savedContact = localStorage.getItem("savedContact");
    if (savedEmail) setFormData(prev => ({ ...prev, email: savedEmail }));
    if (savedContact) setFormData(prev => ({ ...prev, contact: savedContact }));
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let endpoint = "/auth/login";
      let payload = {};

      if (loginMethod === "email") {
        if (!formData.email) {
          setError("Email is required");
          setLoading(false);
          return;
        }
        payload = {
          email: formData.email.trim(),
          password: formData.password
        };
        if (rememberMe) {
          localStorage.setItem("savedEmail", formData.email);
        } else {
          localStorage.removeItem("savedEmail");
        }
      } else {
        if (!formData.contact) {
          setError("Phone number is required");
          setLoading(false);
          return;
        }
        endpoint = "/auth/login/phone";
        payload = {
          contact: formData.contact.trim(),
          password: formData.password
        };
        if (rememberMe) {
          localStorage.setItem("savedContact", formData.contact);
        } else {
          localStorage.removeItem("savedContact");
        }
      }

      const res = await api.post(endpoint, payload);

      if (res.data.token && res.data.user) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        
        document.body.classList.add("login-success");
        setTimeout(() => {
          if (res.data.user.role === "admin") {
            navigate("/admin/dashboard");
          } else {
            navigate("/");
          }
        }, 500);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.error ||
        err.message ||
        "Login failed. Please check your credentials and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = useCallback(async (credentialResponse) => {
    setLoading(true);
    setError("");

    try {
      if (!credentialResponse?.credential) {
        throw new Error("No credential received from Google");
      }

      const decoded = jwtDecode(credentialResponse.credential);
      
      
      if (!decoded.email) {
        throw new Error("No email received from Google");
      }

      // Send request to backend
      const res = await api.post("/auth/google-login", {
        email: decoded.email,
        name: decoded.name || decoded.email.split('@')[0],
        googleId: decoded.sub,
        picture: decoded.picture || ""
      });


      if (res.data.token && res.data.user) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        
        document.body.classList.add("login-success");
        setTimeout(() => {
          if (res.data.user.role === "admin") {
            navigate("/admin/dashboard");
          } else {
            navigate("/");
          }
        }, 500);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      console.error("Google login error:", err);
      console.error("Error details:", err.response?.data);
      setError(
        err.response?.data?.error ||
        err.message ||
        "Google login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const handleGoogleError = useCallback(() => {
    console.error("Google login error occurred");
    setError("Google login failed. Please make sure you've configured the Google Client ID correctly.");
    setLoading(false);
  }, []);

  return (
    <div className="login-wrapper">
      {/* LEFT IMAGE SECTION */}
      <div className="login-left">
        <div className="image-overlay">
          <div className="image-gradient"></div>
          <img src={loginImage} alt="Wellness" className="login-image" />
        </div>
        <div className="image-content">
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
          <div className="content-wrapper">
            <div className="quote-icon">“</div>
            <h2>Wellness Journey</h2>
            <p>Your path to a healthier life begins here</p>
            <div className="testimonial">
              <div className="stars">★★★★★</div>
              <p>"Best wellness platform I've ever used!"</p>
              <span>- Sarah Johnson</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT FORM SECTION */}
      <div className="login-right">
        <div className="login-card">
          <div className="brand">
            <div className="brand-icon">
              <div className="logo-wrapper">
                <img src={logo} alt="Logo" className="logo-image" />
              </div>
            </div>
            <h1>Welcome Back</h1>
            <p className="welcome-text">Sign in to continue your wellness journey</p>
          </div>

          {/* Login Method Toggle */}
          <div className="login-method-toggle">
            <button
              type="button"
              className={`method-btn ${loginMethod === "email" ? "active" : ""}`}
              onClick={() => {
                setLoginMethod("email");
                setError("");
              }}
            >
              
              Email
            </button>
            <button
              type="button"
              className={`method-btn ${loginMethod === "phone" ? "active" : ""}`}
              onClick={() => {
                setLoginMethod("phone");
                setError("");
              }}
            >
            
              Phone
            </button>
          </div>

          <form onSubmit={handleSubmit} className="login-form" noValidate>
            {loginMethod === "email" ? (
              <div className="input-group">
               
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  autoComplete="email"
                />
              </div>
            ) : (
              <div className="input-group">
              
                <input
                  type="tel"
                  name="contact"
                  placeholder="Phone Number"
                  value={formData.contact}
                  onChange={handleInputChange}
                  required
                  autoComplete="tel"
                />
              </div>
            )}

            <div className="input-group">
              
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M2.458 12C3.732 7.943 7.523 5 12 5C16.477 5 20.268 7.943 21.542 12C20.268 16.057 16.477 19 12 19C7.523 19 3.732 16.057 2.458 12Z" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M2 2L22 22M6.712 6.712C4.554 8.18 2.958 10.369 2.458 12C3.732 16.057 7.523 19 12 19C13.796 19 15.503 18.466 16.956 17.538M9.879 9.879C9.336 10.422 9 11.173 9 12C9 13.6569 10.3431 15 12 15C12.827 15 13.578 14.664 14.121 14.121" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M17.788 5.788C15.932 4.627 13.797 4 12 4C7.523 4 3.732 7.057 2.458 11.2C2.406 11.371 2.365 11.545 2.335 11.721" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                )}
              </button>
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="forgot-link">
                Forgot Password?
              </Link>
            </div>

            <button 
              type="submit" 
              className="login-btn" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="btn-spinner"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className="divider">
            <span>Or continue with</span>
          </div>

          <div className="google-auth-section">
            <div className="google-button-wrapper" style={{ 
              width: '100%', 
              maxWidth: '400px', 
              margin: '0 auto',
              display: 'flex',
              justifyContent: 'center'
            }}>
              {!loading ? (
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  theme="outline"
                  size="large"
                  text="signin_with"
                  shape="pill"
                  width="400"
                  locale="en"
                  ux_mode="popup"
                />
              ) : (
                <div className="loading-container">
                  <div className="spinner"></div>
                  <span>Signing in...</span>
                </div>
              )}
            </div>

            {error && (
              <div className="error-container">
                <svg className="error-icon" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M12 8V12M12 16H12.01" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                <span>{error}</span>
              </div>
            )}
          </div>

          <p className="terms">
            Don't have an account? <Link to="/register">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}