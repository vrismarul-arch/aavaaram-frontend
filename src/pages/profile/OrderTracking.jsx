// OrderTracking.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiMapPin,
  FiCreditCard,
  FiDollarSign,
  FiCalendar,
  FiBox,
  FiUser,
  FiPhone,
  FiMail,
  FiRefreshCw,
  FiDownload,
  FiPrinter
} from "react-icons/fi";
import api from "../../services/api";
import "./OrderTracking.css";

export default function OrderTracking() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trackingEvents, setTrackingEvents] = useState([]);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get(`/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrder(res.data);
      generateTrackingEvents(res.data);
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateTrackingEvents = (orderData) => {
    const events = [];
    
    // Order Placed
    events.push({
      status: "Order Placed",
      date: orderData.createdAt,
      description: "Your order has been successfully placed",
      completed: true,
      icon: "placed"
    });
    
    // Payment Confirmed
    if (orderData.paymentStatus === "Paid") {
      events.push({
        status: "Payment Confirmed",
        date: orderData.paymentDate || orderData.createdAt,
        description: "Payment has been successfully processed",
        completed: true,
        icon: "payment"
      });
    }
    
    // Processing
    if (orderData.status !== "Pending") {
      events.push({
        status: "Processing",
        date: orderData.processedAt || orderData.updatedAt,
        description: "Your order is being prepared",
        completed: ["Processing", "Shipped", "Delivered"].includes(orderData.status),
        icon: "processing"
      });
    }
    
    // Shipped
    if (["Shipped", "Delivered"].includes(orderData.status)) {
      events.push({
        status: "Shipped",
        date: orderData.shippedAt || orderData.updatedAt,
        description: `Your order has been shipped via ${orderData.carrier || "Standard Shipping"}`,
        completed: true,
        icon: "shipped"
      });
    }
    
    // Out for Delivery
    if (orderData.status === "Delivered" || orderData.outForDelivery) {
      events.push({
        status: "Out for Delivery",
        date: orderData.outForDeliveryDate || orderData.updatedAt,
        description: "Your order is out for delivery",
        completed: orderData.status === "Delivered",
        icon: "delivery"
      });
    }
    
    // Delivered
    if (orderData.status === "Delivered") {
      events.push({
        status: "Delivered",
        date: orderData.deliveredAt || orderData.updatedAt,
        description: "Your order has been delivered successfully",
        completed: true,
        icon: "delivered"
      });
    }
    
    setTrackingEvents(events);
  };

  const getCurrentStep = () => {
    const statusMap = {
      "Pending": 1,
      "Processing": 2,
      "Shipped": 3,
      "Delivered": 4,
      "Cancelled": -1
    };
    return statusMap[order?.status] || 0;
  };

  const getProgressPercentage = () => {
    const step = getCurrentStep();
    if (step === -1) return 0;
    return (step / 4) * 100;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getStatusColor = () => {
    switch (order?.status?.toLowerCase()) {
      case "delivered": return "#4caf50";
      case "shipped": return "#2196f3";
      case "processing": return "#ff9800";
      case "cancelled": return "#f44336";
      default: return "#ffc107";
    }
  };

  const getStatusIcon = () => {
    switch (order?.status?.toLowerCase()) {
      case "delivered": return <FiCheckCircle />;
      case "shipped": return <FiTruck />;
      case "processing": return <FiClock />;
      default: return <FiPackage />;
    }
  };

  if (loading) {
    return (
      <div className="tracking-loading">
        <div className="spinner"></div>
        <p>Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="tracking-error">
        <FiPackage />
        <h2>Order Not Found</h2>
        <p>We couldn't find the order you're looking for.</p>
        <button onClick={() => navigate("/profile")}>Back to Profile</button>
      </div>
    );
  }

  return (
    <div className="tracking-container">
      <div className="tracking-background">
        <div className="bg-pattern"></div>
      </div>

      <div className="tracking-content">
        {/* Header */}
        <div className="tracking-header">
          <button className="back-btn" onClick={() => navigate("/profile")}>
            <FiArrowLeft />
            Back to Profile
          </button>
          <div className="header-actions">
            <button className="action-btn" onClick={() => window.print()}>
              <FiPrinter />
              Print
            </button>
            <button className="action-btn" onClick={fetchOrderDetails}>
              <FiRefreshCw />
              Refresh
            </button>
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="order-summary-card">
          <div className="order-summary-header">
            <div>
              <h1>Order #{order._id?.slice(-8)}</h1>
              <p className="order-date-header">
                <FiCalendar />
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>
            <div className="order-status-badge" style={{ background: `${getStatusColor()}15`, color: getStatusColor() }}>
              {getStatusIcon()}
              <span>{order.status || "Pending"}</span>
            </div>
          </div>

          {/* Progress Tracker */}
          {order.status !== "Cancelled" && (
            <div className="progress-tracker">
              <div className="progress-steps">
                <div className={`step ${getCurrentStep() >= 1 ? "active" : ""}`}>
                  <div className="step-icon">
                    <FiPackage />
                  </div>
                  <div className="step-label">Order Placed</div>
                </div>
                <div className={`step ${getCurrentStep() >= 2 ? "active" : ""}`}>
                  <div className="step-icon">
                    <FiClock />
                  </div>
                  <div className="step-label">Processing</div>
                </div>
                <div className={`step ${getCurrentStep() >= 3 ? "active" : ""}`}>
                  <div className="step-icon">
                    <FiTruck />
                  </div>
                  <div className="step-label">Shipped</div>
                </div>
                <div className={`step ${getCurrentStep() >= 4 ? "active" : ""}`}>
                  <div className="step-icon">
                    <FiCheckCircle />
                  </div>
                  <div className="step-label">Delivered</div>
                </div>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${getProgressPercentage()}%` }}></div>
              </div>
            </div>
          )}

          {order.status === "Cancelled" && (
            <div className="cancelled-banner">
              <FiPackage />
              <div>
                <h3>Order Cancelled</h3>
                <p>This order has been cancelled. Your refund will be processed within 5-7 business days.</p>
              </div>
            </div>
          )}
        </div>

        <div className="tracking-grid">
          {/* Left Column - Order Items */}
          <div className="tracking-left">
            <div className="info-card">
              <h3>
                <FiBox />
                Order Items
              </h3>
              <div className="items-list">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="tracking-item">
                    <img 
                      src={item.product?.image || item.image || "/placeholder.jpg"} 
                      alt={item.product?.name || item.name}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/80x80?text=Product";
                      }}
                    />
                    <div className="item-details">
                      <h4>{item.product?.name || item.name}</h4>
                      <p className="item-sku">SKU: {item.product?.sku || "N/A"}</p>
                      <div className="item-meta">
                        <span className="item-quantity">Quantity: {item.quantity}</span>
                        <span className="item-price">₹{item.price?.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="item-total">
                      <span>Total</span>
                      <strong>₹{(item.price * item.quantity).toLocaleString()}</strong>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="order-summary">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>₹{order.subtotal?.toLocaleString() || order.totalAmount?.toLocaleString()}</span>
                </div>
                {order.shippingCost > 0 && (
                  <div className="summary-row">
                    <span>Shipping</span>
                    <span>₹{order.shippingCost?.toLocaleString()}</span>
                  </div>
                )}
                {order.tax > 0 && (
                  <div className="summary-row">
                    <span>Tax</span>
                    <span>₹{order.tax?.toLocaleString()}</span>
                  </div>
                )}
                <div className="summary-row total">
                  <span>Grand Total</span>
                  <span>₹{order.totalAmount?.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="info-card">
              <h3>
                <FiCreditCard />
                Payment Information
              </h3>
              <div className="payment-details">
                <div className="payment-row">
                  <span>Payment Method:</span>
                  <strong>{order.paymentMethod || "Not specified"}</strong>
                </div>
                <div className="payment-row">
                  <span>Payment Status:</span>
                  <span className={`payment-status-badge ${order.paymentStatus?.toLowerCase()}`}>
                    {order.paymentStatus || "Pending"}
                  </span>
                </div>
                {order.transactionId && (
                  <div className="payment-row">
                    <span>Transaction ID:</span>
                    <code>{order.transactionId}</code>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Shipping & Timeline */}
          <div className="tracking-right">
            {/* Shipping Address */}
            <div className="info-card">
              <h3>
                <FiMapPin />
                Shipping Address
              </h3>
              <div className="shipping-address-details">
                <p><strong>{order.shippingAddress?.name || order.name}</strong></p>
                <p>{order.shippingAddress?.address || order.address}</p>
                <p>
                  {order.shippingAddress?.city || order.city}, 
                  {order.shippingAddress?.state || order.state} - 
                  {order.shippingAddress?.pincode || order.pincode}
                </p>
                <p><FiPhone /> {order.shippingAddress?.phone || order.phone}</p>
                {order.shippingAddress?.email && <p><FiMail /> {order.shippingAddress.email}</p>}
              </div>
            </div>

            {/* Tracking Information */}
            {order.trackingNumber && (
              <div className="info-card">
                <h3>
                  <FiTruck />
                  Tracking Information
                </h3>
                <div className="tracking-details">
                  <div className="tracking-row">
                    <span>Tracking Number:</span>
                    <strong>{order.trackingNumber}</strong>
                  </div>
                  <div className="tracking-row">
                    <span>Carrier:</span>
                    <span>{order.carrier || "Standard Shipping"}</span>
                  </div>
                  <button 
                    className="track-btn"
                    onClick={() => window.open(`https://tracking.example.com/${order.trackingNumber}`, "_blank")}
                  >
                    <FiTruck />
                    Track Package
                  </button>
                </div>
              </div>
            )}

            {/* Order Timeline */}
            <div className="info-card">
              <h3>
                <FiClock />
                Order Timeline
              </h3>
              <div className="timeline-vertical">
                {trackingEvents.map((event, idx) => (
                  <div key={idx} className={`timeline-event ${event.completed ? "completed" : "pending"}`}>
                    <div className="timeline-marker">
                      <div className="marker-dot"></div>
                      {idx < trackingEvents.length - 1 && <div className="marker-line"></div>}
                    </div>
                    <div className="event-content">
                      <div className="event-header">
                        <h4>{event.status}</h4>
                        <span className="event-date">{formatDate(event.date)}</span>
                      </div>
                      <p className="event-description">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Need Help */}
            <div className="help-card">
              <FiUser />
              <div>
                <h4>Need Help?</h4>
                <p>Having issues with your order? Contact our support team</p>
                <button className="contact-support-btn">Contact Support</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


