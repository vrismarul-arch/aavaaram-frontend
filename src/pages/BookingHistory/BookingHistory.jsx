import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import "./BookingHistory.css";

export default function BookingHistory() {
  const [orders, setOrders] = useState([]);
  const [cancelOrderId, setCancelOrderId] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const rawUser = localStorage.getItem("user");
    if (!rawUser) {
      setLoading(false);
      return;
    }

    const storedUser = JSON.parse(rawUser);

    API.get(`/orders/user/${storedUser.email}`)
      .then(res => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const openCancelModal = (id) => {
    setCancelOrderId(id);
    setCancelReason("");
  };

  const submitCancel = async () => {
    if (!cancelReason.trim()) {
      alert("Please enter cancel reason");
      return;
    }

    try {
      const res = await API.put(`/orders/cancel/${cancelOrderId}`, {
        reason: cancelReason
      });

      setOrders(prev =>
        prev.map(order =>
          order._id === cancelOrderId ? res.data : order
        )
      );

      setCancelOrderId(null);
      setCancelReason("");
    } catch (err) {
      console.error(err);
      alert("Cancel failed");
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "delivered":
        return "status-success";
      case "pending":
      case "processing":
        return "status-pending";
      case "cancelled":
        return "status-cancelled";
      case "shipped":
        return "status-shipped";
      default:
        return "status-default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "delivered":
        return "✓";
      case "pending":
        return "⏳";
      case "processing":
        return "⚙";
      case "cancelled":
        return "✕";
      case "shipped":
        return "🚚";
      default:
        return "•";
    }
  };

  const calculateTotal = (items) => {
    return items?.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0) || 0;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  if (loading) {
    return (
      <div className="orders-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-header">
        <div className="header-content">
          <h1>My Orders</h1>
          <p className="subtitle">Track and manage your bookings</p>
        </div>
        <div className="orders-stats">
          <div className="stat-card">
            <span className="stat-number">{orders.length}</span>
            <span className="stat-label">Total Orders</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">
              {orders.filter(o => o.paymentStatus?.toLowerCase() === "completed").length}
            </span>
            <span className="stat-label">Completed</span>
          </div>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>No Orders Found</h3>
          <p>You haven't placed any orders yet.</p>
          <button 
            className="browse-btn"
            onClick={() => navigate("/")}
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="orders-grid">
          {orders.map(order => {
            const firstItem = order.items?.[0];
            const totalItems = order.items?.length || 0;
            const hasMultipleItems = totalItems > 1;

            return (
              <div className="order-card" key={order._id}>
                <div className="order-card-header">
                  <div className="order-id-section">
                    <span className="order-label">Order ID</span>
                    <span className="order-id">#{order._id.slice(-8).toUpperCase()}</span>
                  </div>
                  <div className={`status-badge ${getStatusColor(order.paymentStatus)}`}>
                    <span className="status-icon">{getStatusIcon(order.paymentStatus)}</span>
                    <span>{order.paymentStatus}</span>
                  </div>
                </div>

                <div className="order-card-body">
                  <div className="product-section">
                    <div className="product-image-container">
                      <img 
                        src={firstItem?.image || "/placeholder-product.jpg"} 
                        alt={firstItem?.name}
                        onError={(e) => {
                          e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23e8f5e9'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='%232c4f3d' font-size='12'%3EProduct%3C/text%3E%3C/svg%3E";
                        }}
                      />
                      {hasMultipleItems && (
                        <div className="more-items-badge">
                          +{totalItems - 1} more
                        </div>
                      )}
                    </div>

                    <div className="product-details">
                      <h3 className="product-name">{firstItem?.name}</h3>
                      {hasMultipleItems && (
                        <p className="additional-items">
                          and {totalItems - 1} other item{totalItems > 2 ? 's' : ''}
                        </p>
                      )}
                      <div className="product-meta">
                        <span className="order-date">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                          </svg>
                          {formatDate(order.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="price-section">
                    <span className="price-label">Total Amount</span>
                    <span className="price-value">₹{calculateTotal(order.items)}</span>
                  </div>
                </div>

                <div className="order-card-footer">
                  <button
                    className="view-details-btn"
                    onClick={() => navigate(`/order/${order._id}`)}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    View Details
                  </button>

                  {order.paymentStatus !== "Cancelled" && order.paymentStatus !== "Completed" && (
                    <button
                      className="cancel-order-btn"
                      onClick={() => openCancelModal(order._id)}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {cancelOrderId && (
        <div className="modal-overlay" onClick={() => setCancelOrderId(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-icon warning">⚠</div>
              <h3>Cancel Order</h3>
              <p>Are you sure you want to cancel this order?</p>
            </div>

            <div className="modal-body">
              <label htmlFor="cancel-reason">
                Reason for cancellation <span className="required">*</span>
              </label>
              <textarea
                id="cancel-reason"
                placeholder="Please tell us why you're cancelling this order..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows="4"
                autoFocus
              />
              <div className="char-count">
                {cancelReason.length} characters
              </div>
            </div>

            <div className="modal-actions">
              <button 
                className="btn-secondary" 
                onClick={() => setCancelOrderId(null)}
              >
                Keep Order
              </button>
              <button 
                className="btn-danger" 
                onClick={submitCancel}
                disabled={!cancelReason.trim()}
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}