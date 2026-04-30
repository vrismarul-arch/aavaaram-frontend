import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Result, Button, Card } from "antd";
import "./FailurePage.css";

export default function FailurePage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Optional: keep pendingBooking so user can retry
  }, []);

  return (
    <div className="failure-page-wrapper">
      <Result
        status="error"
        title="Payment Failed"
        subTitle="Your payment could not be completed. Please try again."
      />

      <Card className="failure-card">
        <p>
          ❌ The transaction was unsuccessful or cancelled.
        </p>
        <p>
          💡 If money was deducted, it will be refunded within 3–5 working days.
        </p>
        <p>
          🔁 You can retry the payment or go back to cart.
        </p>
      </Card>

      <div className="failure-actions">
        <Button
          type="primary"
          onClick={() => navigate("/payment")}
        >
          Retry Payment
        </Button>

        <Button
          danger
          onClick={() => {
            localStorage.removeItem("pendingBooking");
            navigate("/cart");
          }}
        >
          Go to Cart
        </Button>
      </div>
    </div>
  );
}
