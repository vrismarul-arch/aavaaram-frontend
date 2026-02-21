import { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import api from "../../services/api";
import "./auth.css";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // =============================
  // Email/Password Login
  // =============================
  const onFinish = async (values) => {
    try {
      setLoading(true);

      const res = await api.post("/auth/login", values);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      message.success("Login successful");

      if (res.data.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      message.error(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // Google Login
  // =============================
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      console.log("Google Response:", credentialResponse);

      if (!credentialResponse?.credential) {
        message.error("No Google credential received");
        return;
      }

      const res = await api.post("/auth/google", {
        credential: credentialResponse.credential,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      message.success("Google login successful");

      if (res.data.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      message.error("Google login failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="overlay" />
      </div>

      <div className="auth-right">
        <div className="auth-box">
          <h2 className="title text-center">Login</h2>

          <Form onFinish={onFinish} className="auth-form">
            <Form.Item
              name="email"
              rules={[{ required: true, message: "Enter your email!" }]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Email"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: "Enter your password!" }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
            >
              Login
            </Button>
          </Form>

          <div style={{ margin: "20px 0", textAlign: "center" }}>
            OR
          </div>

          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => message.error("Google login failed")}
          />
        </div>
      </div>
    </div>
  );
}