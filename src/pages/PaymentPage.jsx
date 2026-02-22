import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../services/api";

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { amount, orderData } = location.state;

  useEffect(() => {
    loadRazorpay();
  }, []);

  const loadRazorpay = async () => {
    const res = await API.post("/payment/razorpay", {
      amount,
    });

    const options = {
      key: "YOUR_RAZORPAY_KEY",
      amount: res.data.amount,
      order_id: res.data.id,

      handler: async () => {
        await API.post("/payment/verify", {
          orderData,
        });
        navigate("/success");
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return <h2 style={{ padding: 100 }}>Processing Payment...</h2>;
}