import { useEffect, useState } from "react";
import API from "../services/api";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await API.get("/orders");
    setOrders(res.data);
  };

  return (
    <div style={{ padding: 50 }}>
      <h2>Orders</h2>

      {orders.map((order) => (
        <div key={order._id}>
          <p>{order._id}</p>
          <p>{order.paymentMethod}</p>
          <p>{order.paymentStatus}</p>
          <p>₹ {order.totalAmount}</p>
        </div>
      ))}
    </div>
  );
}