import { useEffect, useState } from "react";
import API from "../services/api";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const email = localStorage.getItem("userEmail");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await API.get(`/orders/user/${email}`);
    setOrders(res.data);
  };

  return (
    <div style={{ padding: 50 }}>
      <h2>My Orders</h2>

      {orders.map((order) => (
        <div key={order._id}>
          <p>₹ {order.totalAmount}</p>
          <p>{order.paymentStatus}</p>
        </div>
      ))}
    </div>
  );
}