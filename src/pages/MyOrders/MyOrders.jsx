import { useEffect, useState } from "react";
import API from "../../services/api";
import "./MyOrders.css";

export default function MyOrders() {

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    API.get("/orders/my-orders")
      .then(res => setOrders(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="orders-page">

      <h2>My Orders</h2>

      {orders.length === 0 && <p>No Orders Found</p>}

      {orders.map(order => (
        <div key={order._id} className="order-card">

          <img src={order.products[0]?.image} alt="" />

          <div className="order-info">
            <h3>{order.products[0]?.name}</h3>
            <p>Order ID: {order.orderId}</p>

            <div className="order-meta">
              <span>₹ {order.totalAmount}</span>
              <span>{order.date}</span>
              <span>{order.time}</span>
            </div>

            <div className="order-actions">
              <button className="view-btn">View Details</button>
              <button className="cancel-btn">Cancel Order</button>
            </div>
          </div>

        </div>
      ))}

    </div>
  );
}
