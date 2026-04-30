import { useState } from "react";
import { Form, Input, Button, Checkbox, message, Alert, Modal } from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./Register.css";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [agree, setAgree] = useState(false);
  const [strength, setStrength] = useState("");
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registeredUser, setRegisteredUser] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const checkStrength = (value) => {
    if (!value) {
      setStrength("");
      return;
    }

    let score = 0;
    if (value.length >= 8) score++;
    if (value.match(/[A-Z]/)) score++;
    if (value.match(/[0-9]/)) score++;
    if (value.match(/[^A-Za-z0-9]/)) score++;

    if (score <= 1) {
      setStrength("Weak");
    } else if (score === 2) {
      setStrength("Medium");
    } else {
      setStrength("Strong");
    }
  };

  const onFinish = async (values) => {
    if (!agree) {
      message.warning("Please agree to the Terms & Privacy Policy");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Prepare payload
      const payload = {
        name: values.name.trim(),
        password: values.password,
      };

      if (values.email && values.email.trim()) {
        payload.email = values.email.trim();
      }

      if (values.phone && values.phone.trim()) {
        payload.contact = values.phone.trim();
      }

      console.log("Register payload:", payload);

      const response = await api.post("/auth/register", payload);

      console.log("Registration response:", response.data);

      if (response.data.success && response.data.token && response.data.user) {
        // Auto-login
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        
        setRegisteredUser(response.data.user);
        setShowSuccessModal(true);
        
        // Redirect after 2 seconds
        setTimeout(() => {
          if (response.data.user.role === "admin") {
            navigate("/");
          } else {
            navigate("/");
          }
        }, 2000);
      } else {
        throw new Error(response.data.error || "Registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
      
      let errorMessage = "Registration failed. Please try again.";
      
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const validateContactMethod = () => {
    const email = form.getFieldValue("email");
    const phone = form.getFieldValue("phone");
    
    if (!email && !phone) {
      return Promise.reject("Either email or phone number is required");
    }
    return Promise.resolve();
  };

  return (
    <div className="register-wrapper">
      <div className="register-card">
        <h2>Create Account</h2>
        <p className="subtitle">Join our wellness community today</p>

        {error && (
          <Alert
            message="Registration Error"
            description={error}
            type="error"
            showIcon
            closable
            onClose={() => setError("")}
            style={{ marginBottom: 20 }}
          />
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="name"
            label="Full Name"
            rules={[
              { required: true, message: "Please enter your full name" },
              { min: 2, message: "Name must be at least 2 characters" },
              { max: 50, message: "Name must be less than 50 characters" }
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Enter your full name"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              { type: "email", message: "Please enter a valid email address" },
              { validator: validateContactMethod }
            ]}
            tooltip="Either email or phone number is required"
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="your@email.com"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[
              { pattern: /^[0-9]{10}$/, message: "Please enter a valid 10-digit phone number" },
              { validator: validateContactMethod }
            ]}
            tooltip="Either email or phone number is required"
          >
            <Input
              prefix={<PhoneOutlined />}
              placeholder="9876543210"
              size="large"
              maxLength={10}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: "Please enter your password" },
              { min: 6, message: "Password must be at least 6 characters" },
              { max: 50, message: "Password must be less than 50 characters" }
            ]}
            hasFeedback
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Create a strong password"
              size="large"
              onChange={(e) => checkStrength(e.target.value)}
            />
          </Form.Item>

          {strength && (
            <div className={`password-strength ${strength.toLowerCase()}`}>
              <span>Password Strength: </span>
              <strong>{strength}</strong>
              <div className="strength-bar">
                <div className={`strength-fill ${strength.toLowerCase()}`}></div>
              </div>
            </div>
          )}

          <Form.Item
            name="confirm"
            label="Confirm Password"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match"));
                },
              }),
            ]}
            hasFeedback
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirm your password"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Checkbox
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
            >
              I agree to the{" "}
              <Link to="/terms" target="_blank">Terms of Service</Link> and{" "}
              <Link to="/privacy" target="_blank">Privacy Policy</Link>
            </Checkbox>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="register-btn"
              block
              size="large"
              disabled={!agree}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </Form.Item>
        </Form>

        <div className="divider">
          <span>Already have an account?</span>
        </div>

        <Button
          onClick={() => navigate("/login")}
          className="login-redirect-btn"
          block
          size="large"
        >
          Sign In
        </Button>

        <p className="note">
          By registering, you agree to receive wellness tips and updates.
          You can unsubscribe anytime.
        </p>
      </div>

      <Modal
        title="Registration Successful! 🎉"
        open={showSuccessModal}
        footer={null}
        closable={false}
        centered
      >
        <div style={{ textAlign: "center", padding: "20px" }}>
          <div style={{ fontSize: "48px", marginBottom: "20px" }}>✅</div>
          <h3>Welcome to Aavaaram, {registeredUser?.name}!</h3>
          <p>Your account has been created successfully.</p>
          {registeredUser?.email && (
            <p style={{ color: "#17422f" }}>
              A verification email has been sent to {registeredUser.email}
            </p>
          )}
          <p>Redirecting to dashboard...</p>
        </div>
      </Modal>
    </div>
  );
}