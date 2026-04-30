import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiShoppingBag,
  FiHeart,
  FiLogOut,
  FiEdit2,
  FiCheck,
  FiX,
  FiCalendar,
  FiDollarSign,
  FiTruck,
  FiPackage,
  FiCamera,
  FiChevronDown,
  FiChevronUp,
  FiRefreshCw,
  FiClock,
  FiCreditCard,
  FiMap,
  FiBox,
  FiLoader,
  FiSave,
  FiHome,
  FiStar,
  FiTrendingUp
} from "react-icons/fi";
import api from "../../services/api";
import "./Profile.css";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    address: ""
  });
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("profile");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState({});
  const [loadingOrderDetails, setLoadingOrderDetails] = useState({});
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    wishlistCount: 0,
    pendingOrders: 0,
    deliveredOrders: 0
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetchUserData();
    fetchOrders();
    fetchWishlistCount();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/auth/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Handle both response formats
      const userData = res.data.user || res.data;
      setUser(userData);
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        contact: userData.contact || "",
        address: userData.address || ""
      });
      
      // Store user data for orders
      localStorage.setItem("userEmail", userData.email);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      console.error("Error fetching user:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const userEmail = localStorage.getItem("userEmail");
      
      if (!userEmail) {
        console.error("No user email found");
        return;
      }

      const res = await api.get(`/orders/user/${userEmail}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const ordersData = res.data.orders || res.data || [];
      setOrders(ordersData);
      
      const total = ordersData.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      const pending = ordersData.filter(o => o.status === 'Pending' || o.status === 'Processing').length;
      const delivered = ordersData.filter(o => o.status === 'Delivered').length;
      
      setStats(prev => ({
        ...prev,
        totalOrders: ordersData.length,
        totalSpent: total,
        pendingOrders: pending,
        deliveredOrders: delivered
      }));
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchOrderDetails = async (orderId) => {
    if (orderDetails[orderId]) {
      setExpandedOrder(expandedOrder === orderId ? null : orderId);
      return;
    }

    setLoadingOrderDetails(prev => ({ ...prev, [orderId]: true }));
    
    try {
      const token = localStorage.getItem("token");
      const res = await api.get(`/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setOrderDetails(prev => ({ ...prev, [orderId]: res.data.order || res.data }));
      setExpandedOrder(orderId);
    } catch (error) {
      console.error("Error fetching order details:", error);
    } finally {
      setLoadingOrderDetails(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const fetchWishlistCount = () => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setStats(prev => ({
      ...prev,
      wishlistCount: wishlist.length
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await api.put("/auth/profile", {
        name: formData.name,
        contact: formData.contact,
        address: formData.address
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const updatedUser = res.data.user || res.data;
      setUser(updatedUser);
      setEditing(false);
      
      // Update localStorage
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({ ...storedUser, ...updatedUser }));
      
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(error.response?.data?.error || "Failed to update profile. Please try again.");
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File size should be less than 5MB");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const token = localStorage.getItem("token");
      const res = await api.post("/auth/upload-avatar", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });
      
      const avatarUrl = res.data.avatar || res.data.url;
      setUser(prev => ({ ...prev, avatar: avatarUrl }));
      
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({ ...storedUser, avatar: avatarUrl }));
      
      alert("Avatar updated successfully!");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      alert("Failed to upload avatar. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    
    try {
      const token = localStorage.getItem("token");
      await api.put(`/orders/${orderId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert("Order cancelled successfully!");
      fetchOrders();
      
      // Clear cached order details
      setOrderDetails(prev => {
        const newDetails = { ...prev };
        delete newDetails[orderId];
        return newDetails;
      });
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert(error.response?.data?.error || "Failed to cancel order. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("cart");
    localStorage.removeItem("wishlist");
    navigate("/login");
  };

  const getAvatarUrl = () => {
    if (user?.avatar) return user.avatar;
    if (user?.picture) return user.picture;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=17422f&color=fff&bold=true&length=2`;
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'status-delivered';
      case 'shipped': return 'status-shipped';
      case 'processing': return 'status-processing';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-pending';
    }
  };

  const getPaymentStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid': return 'payment-paid';
      case 'failed': return 'payment-failed';
      default: return 'payment-pending';
    }
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="spinner"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-background">
        <div className="bg-pattern"></div>
      </div>

      <div className="profile-content">
        {/* Sidebar */}
        <div className="profile-sidebar">
          <div className="user-card">
            <div className="avatar-container">
              <img 
                src={getAvatarUrl()} 
                alt={user?.name}
                className="user-avatar-large"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=17422f&color=fff&bold=true&length=2`;
                }}
              />
              <label className="avatar-upload-btn">
                <FiCamera />
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  disabled={uploading}
                  style={{ display: 'none' }}
                />
              </label>
              {uploading && <div className="avatar-uploading"><FiLoader className="spinning" /> Uploading...</div>}
            </div>
            <h3>{user?.name}</h3>
            <p>{user?.email}</p>
            <button className="edit-profile-btn" onClick={() => setEditing(true)}>
              <FiEdit2 />
              Edit Profile
            </button>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <FiShoppingBag />
              <div>
                <h4>{stats.totalOrders}</h4>
                <p>Total Orders</p>
              </div>
            </div>
            <div className="stat-card">
              
              <div>
                <h4>₹{stats.totalSpent.toLocaleString()}</h4>
                <p>Total Spent</p>
              </div>
            </div>
            
          </div>

          <div className="sidebar-menu">
            <div 
              className={`sidebar-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <FiUser />
              <span>Profile Information</span>
            </div>
            <div 
              className={`sidebar-item ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <FiPackage />
              <span>My Orders</span>
              {stats.pendingOrders > 0 && (
                <span className="badge">{stats.pendingOrders}</span>
              )}
            </div>
            
           
            <div 
              className="sidebar-item logout"
              onClick={handleLogout}
            >
              <FiLogOut />
              <span>Logout</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="profile-main">
          {activeTab === 'profile' && (
            <div className="profile-info-section">
              <div className="section-header">
                <h2>Profile Information</h2>
                <p>Manage your personal details</p>
              </div>

              {!editing ? (
                <div className="info-display">
                  <div className="info-row">
                    <div className="info-label">
                      <FiUser />
                      <span>Full Name</span>
                    </div>
                    <div className="info-value">{user?.name}</div>
                  </div>
                  <div className="info-row">
                    <div className="info-label">
                      <FiMail />
                      <span>Email Address</span>
                    </div>
                    <div className="info-value">{user?.email}</div>
                  </div>
                  <div className="info-row">
                    <div className="info-label">
                      <FiPhone />
                      <span>Phone Number</span>
                    </div>
                    <div className="info-value">{user?.contact || "Not provided"}</div>
                  </div>
                  <div className="info-row">
                    <div className="info-label">
                      <FiMapPin />
                      <span>Address</span>
                    </div>
                    <div className="info-value">{user?.address || "Not provided"}</div>
                  </div>
                  <div className="info-row">
                    <div className="info-label">
                      <FiStar />
                      <span>Member Since</span>
                    </div>
                    <div className="info-value">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'N/A'}
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleUpdate} className="edit-form">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className="disabled-input"
                    />
                    <small>Email cannot be changed</small>
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      value={formData.contact}
                      onChange={(e) => setFormData({...formData, contact: e.target.value})}
                      placeholder="Enter your phone number"
                      pattern="[0-9]{10}"
                      title="Please enter a valid 10-digit phone number"
                    />
                  </div>
                  <div className="form-group">
                    <label>Address</label>
                    <textarea
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      rows="3"
                      placeholder="Enter your full address"
                    />
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="save-btn">
                      <FiSave />
                      Save Changes
                    </button>
                    <button type="button" className="cancel-btn" onClick={() => setEditing(false)}>
                      <FiX />
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="orders-section">
              <div className="section-header">
                <div>
                  <h2>My Orders</h2>
                  <p>Track and manage your orders</p>
                </div>
                <button className="refresh-btn" onClick={fetchOrders}>
                  <FiRefreshCw />
                  Refresh
                </button>
              </div>

              {orders.length === 0 ? (
                <div className="no-orders">
                  <FiPackage />
                  <h3>No orders yet</h3>
                  <p>Start shopping to see your orders here</p>
                  <button onClick={() => navigate("/shop")}>Start Shopping</button>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.map(order => (
                    <div key={order._id} className="order-card">
                      <div className="order-header">
                        <div className="order-header-left">
                          <span className="order-id">Order #{order._id?.slice(-8).toUpperCase()}</span>
                          <span className="order-date">
                            <FiCalendar />
                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                          <span className={`order-status ${getStatusClass(order.status)}`}>
                            {order.status || 'Pending'}
                          </span>
                        </div>
                        <button 
                          className="expand-btn"
                          onClick={() => fetchOrderDetails(order._id)}
                        >
                          {expandedOrder === order._id ? <FiChevronUp /> : <FiChevronDown />}
                          {expandedOrder === order._id ? 'Hide Details' : 'View Details'}
                        </button>
                      </div>
                      
                      <div className="order-items-preview">
                        {order.items?.slice(0, 2).map((item, idx) => (
                          <div key={idx} className="order-item-preview">
                            <img 
                              src={item.product?.image || item.image || 'https://via.placeholder.com/80x80?text=Product'} 
                              alt={item.product?.name || item.name}
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/80x80?text=Product';
                              }}
                            />
                            <div className="item-info">
                              <p className="item-name">{item.product?.name || item.name}</p>
                              <span className="item-quantity">Qty: {item.quantity}</span>
                            </div>
                            <div className="item-price">
                              ₹{(item.price * item.quantity).toLocaleString()}
                            </div>
                          </div>
                        ))}
                        {order.items?.length > 2 && (
                          <div className="more-items">
                            +{order.items.length - 2} more items
                          </div>
                        )}
                      </div>
                      
                      <div className="order-footer">
                        <div className="order-total">
                          <span>Total Amount:</span>
                          <strong>₹{order.totalAmount?.toLocaleString()}</strong>
                        </div>
                        <div className="order-actions">
                          {order.status !== 'Cancelled' && order.status !== 'Delivered' && (
                            <button 
                              className="cancel-order-btn"
                              onClick={() => handleCancelOrder(order._id)}
                            >
                              Cancel Order
                            </button>
                          )}
                          <button 
                            className="track-order-btn"
                            onClick={() => navigate(`/track-order/${order._id}`)}
                          >
                            <FiTruck />
                            Track Order
                          </button>
                        </div>
                      </div>

                      {/* Expanded Order Details */}
                      {expandedOrder === order._id && (
                        <div className="order-details-expanded">
                          {loadingOrderDetails[order._id] ? (
                            <div className="details-loading">
                              <div className="spinner-small"></div>
                              <p>Loading order details...</p>
                            </div>
                          ) : orderDetails[order._id] && (
                            <>
                              <div className="details-section">
                                <h4><FiBox /> Order Information</h4>
                                <div className="details-grid">
                                  <div className="detail-item">
                                    <label>Order ID:</label>
                                    <span>{orderDetails[order._id]._id}</span>
                                  </div>
                                  <div className="detail-item">
                                    <label><FiCalendar /> Order Date:</label>
                                    <span>{new Date(orderDetails[order._id].createdAt).toLocaleString()}</span>
                                  </div>
                                  <div className="detail-item">
                                    <label><FiCreditCard /> Payment Status:</label>
                                    <span className={`payment-status ${getPaymentStatusClass(orderDetails[order._id].paymentStatus)}`}>
                                      {orderDetails[order._id].paymentStatus || 'Pending'}
                                    </span>
                                  </div>
                                  <div className="detail-item">
                                    <label>Payment Method:</label>
                                    <span>{orderDetails[order._id].paymentMethod || 'Not specified'}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="details-section">
                                <h4><FiMap /> Shipping Address</h4>
                                <div className="shipping-address">
                                  <p><strong>{orderDetails[order._id].shippingAddress?.name || orderDetails[order._id].name}</strong></p>
                                  <p>{orderDetails[order._id].shippingAddress?.address || orderDetails[order._id].address}</p>
                                  <p>{orderDetails[order._id].shippingAddress?.city || orderDetails[order._id].city}, {orderDetails[order._id].shippingAddress?.state || orderDetails[order._id].state} - {orderDetails[order._id].shippingAddress?.pincode || orderDetails[order._id].pincode}</p>
                                  <p><FiPhone /> {orderDetails[order._id].shippingAddress?.phone || orderDetails[order._id].phone}</p>
                                </div>
                              </div>

                              <div className="details-section">
                                <h4><FiShoppingBag /> All Items</h4>
                                <div className="all-items-list">
                                  <table className="items-table">
                                    <thead>
                                      <tr>
                                        <th>Product</th>
                                        <th>Quantity</th>
                                        <th>Price</th>
                                        <th>Total</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {orderDetails[order._id].items?.map((item, idx) => (
                                        <tr key={idx}>
                                          <td>
                                            <div className="product-cell">
                                              <img 
                                                src={item.product?.image || item.image || 'https://via.placeholder.com/40x40?text=Product'} 
                                                alt={item.product?.name || item.name}
                                                onError={(e) => {
                                                  e.target.src = 'https://via.placeholder.com/40x40?text=Product';
                                                }}
                                              />
                                              <span>{item.product?.name || item.name}</span>
                                            </div>
                                          </td>
                                          <td>{item.quantity}</td>
                                          <td>₹{item.price?.toLocaleString()}</td>
                                          <td>₹{(item.price * item.quantity).toLocaleString()}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                    <tfoot>
                                      <tr className="subtotal-row">
                                        <td colSpan="3" className="total-label">Subtotal:</td>
                                        <td>₹{orderDetails[order._id].subtotal?.toLocaleString() || orderDetails[order._id].totalAmount?.toLocaleString()}</td>
                                      </tr>
                                      <tr className="shipping-row">
                                        <td colSpan="3" className="total-label">Shipping:</td>
                                        <td>₹{orderDetails[order._id].shippingCost?.toLocaleString() || 0}</td>
                                      </tr>
                                      <tr className="tax-row">
                                        <td colSpan="3" className="total-label">Tax:</td>
                                        <td>₹{orderDetails[order._id].tax?.toLocaleString() || 0}</td>
                                      </tr>
                                      <tr className="grand-total">
                                        <td colSpan="3" className="total-label">Grand Total:</td>
                                        <td>₹{orderDetails[order._id].totalAmount?.toLocaleString()}</td>
                                      </tr>
                                    </tfoot>
                                  </table>
                                </div>
                              </div>

                              {orderDetails[order._id].trackingNumber && (
                                <div className="details-section">
                                  <h4><FiTruck /> Tracking Information</h4>
                                  <div className="tracking-info">
                                    <p><strong>Tracking Number:</strong> {orderDetails[order._id].trackingNumber}</p>
                                    <p><strong>Carrier:</strong> {orderDetails[order._id].carrier || 'Standard Shipping'}</p>
                                    <button className="track-package-btn" onClick={() => window.open(`https://tracking.example.com/${orderDetails[order._id].trackingNumber}`, '_blank')}>
                                      <FiTruck />
                                      Track Package
                                    </button>
                                  </div>
                                </div>
                              )}

                              <div className="details-section">
                                <h4><FiClock /> Order Timeline</h4>
                                <div className="timeline">
                                  <div className="timeline-item">
                                    <div className="timeline-dot completed"></div>
                                    <div className="timeline-content">
                                      <div className="timeline-date">{new Date(orderDetails[order._id].createdAt).toLocaleString()}</div>
                                      <div className="timeline-title">Order Placed</div>
                                      <div className="timeline-description">Your order has been successfully placed</div>
                                    </div>
                                  </div>
                                  
                                  {orderDetails[order._id].status === 'Processing' && (
                                    <div className="timeline-item">
                                      <div className="timeline-dot active"></div>
                                      <div className="timeline-content">
                                        <div className="timeline-title">Processing</div>
                                        <div className="timeline-description">Your order is being processed</div>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {orderDetails[order._id].status === 'Shipped' && (
                                    <>
                                      <div className="timeline-item">
                                        <div className="timeline-dot completed"></div>
                                        <div className="timeline-content">
                                          <div className="timeline-title">Processing</div>
                                          <div className="timeline-description">Your order has been processed</div>
                                        </div>
                                      </div>
                                      <div className="timeline-item">
                                        <div className="timeline-dot active"></div>
                                        <div className="timeline-content">
                                          <div className="timeline-title">Shipped</div>
                                          <div className="timeline-description">Your order is on the way</div>
                                        </div>
                                      </div>
                                    </>
                                  )}
                                  
                                  {orderDetails[order._id].status === 'Delivered' && (
                                    <>
                                      <div className="timeline-item">
                                        <div className="timeline-dot completed"></div>
                                        <div className="timeline-content">
                                          <div className="timeline-title">Processing</div>
                                        </div>
                                      </div>
                                      <div className="timeline-item">
                                        <div className="timeline-dot completed"></div>
                                        <div className="timeline-content">
                                          <div className="timeline-title">Shipped</div>
                                        </div>
                                      </div>
                                      <div className="timeline-item">
                                        <div className="timeline-dot completed"></div>
                                        <div className="timeline-content">
                                          <div className="timeline-date">{new Date(orderDetails[order._id].deliveredAt || orderDetails[order._id].updatedAt).toLocaleString()}</div>
                                          <div className="timeline-title">Delivered</div>
                                          <div className="timeline-description">Your order has been delivered successfully</div>
                                        </div>
                                      </div>
                                    </>
                                  )}
                                  
                                  {orderDetails[order._id].status === 'Cancelled' && (
                                    <div className="timeline-item">
                                      <div className="timeline-dot cancelled"></div>
                                      <div className="timeline-content">
                                        <div className="timeline-title">Cancelled</div>
                                        <div className="timeline-description">Your order has been cancelled</div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}