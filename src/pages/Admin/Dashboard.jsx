// Admin/Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext";
import API from "../../services/api";
import {
  FiPackage,
  FiDollarSign,
  FiCheckCircle,
  FiClock,
  FiTruck,
  FiXCircle,
  FiEdit2,
  FiTrash2,
  FiChevronDown,
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiDownload,
  FiPrinter,
  FiCreditCard,
  FiMail,
  FiCalendar,
  FiUser,
  FiShoppingCart,
  FiEye,
  FiTrendingUp,
  FiTrendingDown,
  FiAlertCircle
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { message, Modal, Spin, Tag, Button, Select, Input, Drawer, Space, Descriptions, Table, Avatar, DatePicker, Statistic, Row, Col, Card, Progress, Tooltip } from "antd";
import dayjs from "dayjs";
import "./Dashboard.css";

const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

export default function AdminDashboard() {
  const { adminToken, logout, admin } = useAdmin();
  const navigate = useNavigate();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    paidOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    revenueChange: 0,
    ordersChange: 0
  });
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [statusDrawerVisible, setStatusDrawerVisible] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [sortBy, setSortBy] = useState("newest");
  const [previousPeriodStats, setPreviousPeriodStats] = useState(null);

  useEffect(() => {
    if (!adminToken) {
      navigate("/admin-login");
      return;
    }
    initializeDashboard();
  }, [adminToken, navigate]);

  const initializeDashboard = async () => {
    setInitialLoading(true);
    await fetchOrders();
    await fetchStats();
    setInitialLoading(false);
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await API.get("/orders");
      const ordersData = res.data || [];
      setOrders(ordersData);
      return ordersData;
    } catch (err) {
      console.error("Fetch error:", err);
      message.error("Failed to fetch orders");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await API.get("/orders/stats");
      if (res.data) {
        // Calculate percentage changes
        const currentTotal = res.data.totalRevenue || 0;
        const currentOrders = res.data.totalOrders || 0;
        
        // Calculate previous period stats (last 30 days vs previous 30 days)
        const now = new Date();
        const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
        const sixtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
        
        const previousOrders = orders.filter(o => new Date(o.createdAt) < thirtyDaysAgo && new Date(o.createdAt) >= sixtyDaysAgo);
        const previousRevenue = previousOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
        
        setStats({
          ...res.data,
          revenueChange: previousRevenue ? ((currentTotal - previousRevenue) / previousRevenue) * 100 : 0,
          ordersChange: previousOrders.length ? ((currentOrders - previousOrders.length) / previousOrders.length) * 100 : 0
        });
      } else if (orders.length > 0) {
        calculateLocalStats();
      }
    } catch (err) {
      console.error("Stats fetch error:", err);
      if (orders.length > 0) {
        calculateLocalStats();
      }
    }
  };

  const calculateLocalStats = () => {
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const pendingOrders = orders.filter(o => o.paymentStatus === "Pending").length;
    const confirmedOrders = orders.filter(o => o.paymentStatus === "Confirmed").length;
    const paidOrders = orders.filter(o => o.paymentStatus === "Paid").length;
    const shippedOrders = orders.filter(o => o.paymentStatus === "Shipped").length;
    const deliveredOrders = orders.filter(o => o.paymentStatus === "Delivered").length;
    const cancelledOrders = orders.filter(o => o.paymentStatus === "Cancelled").length;
    
    setStats({
      totalOrders: orders.length,
      totalRevenue,
      pendingOrders,
      confirmedOrders,
      paidOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      revenueChange: 0,
      ordersChange: 0
    });
  };

  const updateOrderStatus = async (orderId, status, reason = "") => {
    if (!orderId) {
      message.error("Invalid order ID");
      return;
    }
    
    setStatusUpdating(true);
    try {
      const updateData = { status };
      if (status === "Cancelled" && reason) {
        updateData.reason = reason;
      }
      
      const response = await API.put(`/orders/${orderId}/status`, updateData);
      
      if (response.data) {
        // Update orders list
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order._id === orderId 
              ? { 
                  ...order, 
                  paymentStatus: status, 
                  cancelReason: reason,
                  updatedAt: new Date().toISOString()
                } 
              : order
          )
        );
        
        // Update stats
        await fetchStats();
        
        message.success(`Order status updated to ${status} successfully`);
        
        // Close drawers
        setStatusDrawerVisible(false);
        if (detailsDrawerVisible && selectedOrder?._id === orderId) {
          setSelectedOrder({ ...selectedOrder, paymentStatus: status, cancelReason: reason });
        }
        
        setNewStatus("");
        setCancelReason("");
      }
    } catch (err) {
      console.error("Status update error:", err);
      message.error(err.response?.data?.message || "Failed to update order status");
    } finally {
      setStatusUpdating(false);
    }
  };

  const deleteOrder = async (orderId) => {
    Modal.confirm({
      title: "Delete Order",
      content: "Are you sure you want to delete this order? This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await API.delete(`/orders/${orderId}`);
          setOrders(prev => prev.filter(order => order._id !== orderId));
          await fetchStats();
          message.success("Order deleted successfully");
          if (detailsDrawerVisible) {
            setDetailsDrawerVisible(false);
          }
        } catch (err) {
          console.error("Delete error:", err);
          message.error("Failed to delete order");
        }
      }
    });
  };

  const openStatusDrawer = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.paymentStatus);
    setCancelReason(order.cancelReason || "");
    setStatusDrawerVisible(true);
  };

  const openOrderDrawer = (order) => {
    setSelectedOrder(order);
    setDetailsDrawerVisible(true);
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending: "orange",
      Confirmed: "gold",
      Paid: "cyan",
      Shipped: "blue",
      Delivered: "green",
      Cancelled: "red"
    };
    return colors[status] || "default";
  };

  const getStatusBadge = (status) => {
    const badges = {
      Pending: "warning",
      Confirmed: "processing", 
      Paid: "success",
      Shipped: "processing",
      Delivered: "success",
      Cancelled: "error"
    };
    return badges[status] || "default";
  };

  const getStatusConfig = (status) => {
    const configs = {
      Delivered: { color: "#10b981", bg: "#d1fae5", icon: <FiCheckCircle />, label: "Delivered" },
      Shipped: { color: "#3b82f6", bg: "#dbeafe", icon: <FiTruck />, label: "Shipped" },
      Paid: { color: "#8b5cf6", bg: "#ede9fe", icon: <FiCreditCard />, label: "Paid" },
      Confirmed: { color: "#f59e0b", bg: "#fed7aa", icon: <FiCheckCircle />, label: "Confirmed" },
      Pending: { color: "#f59e0b", bg: "#fed7aa", icon: <FiClock />, label: "Pending" },
      Cancelled: { color: "#ef4444", bg: "#fee2e2", icon: <FiXCircle />, label: "Cancelled" }
    };
    return configs[status] || configs.Pending;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const getFilteredOrders = () => {
    let filtered = [...orders];
    
    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter(order => order.paymentStatus === filterStatus);
    }
    
    // Filter by search
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(order => 
        order.customer?.name?.toLowerCase().includes(searchLower) ||
        order.customer?.email?.toLowerCase().includes(searchLower) ||
        order.customer?.phone?.toLowerCase().includes(searchLower) ||
        order._id?.toLowerCase().includes(searchLower)
      );
    }
    
    // Filter by date range
    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.createdAt);
        const start = new Date(dateRange.start);
        const end = new Date(dateRange.end);
        end.setHours(23, 59, 59);
        return orderDate >= start && orderDate <= end;
      });
    }
    
    // Sort orders
    filtered.sort((a, b) => {
      switch(sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "highest":
          return (b.totalAmount || 0) - (a.totalAmount || 0);
        case "lowest":
          return (a.totalAmount || 0) - (b.totalAmount || 0);
        default:
          return 0;
      }
    });
    
    return filtered;
  };

  const exportToCSV = () => {
    const filteredOrders = getFilteredOrders();
    if (filteredOrders.length === 0) {
      message.warning("No orders to export");
      return;
    }
    
    const data = filteredOrders.map(order => ({
      'Order ID': order._id,
      'Customer Name': order.customer?.firstName + " " + order.customer?.lastName || 'N/A',
      'Email': order.customer?.email || 'N/A',
      'Phone': order.customer?.phone || order.phone || 'N/A',
      'Total Amount': order.totalAmount || 0,
      'Status': order.paymentStatus,
      'Payment Method': order.paymentMethod || 'N/A',
      'Date': new Date(order.createdAt).toLocaleDateString(),
      'Items Count': order.items?.length || 0,
      'Address': order.customer?.address || order.address || 'N/A',
      'City': order.customer?.city || order.city || 'N/A',
      'State': order.customer?.state || order.state || 'N/A',
      'Pincode': order.customer?.pincode || order.pincode || 'N/A'
    }));
    
    const csv = convertToCSV(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `orders-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    message.success(`${filteredOrders.length} orders exported successfully`);
  };

  const convertToCSV = (data) => {
    if (data.length === 0) return "";
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row => headers.map(header => {
        const cell = row[header]?.toString() || '';
        return `"${cell.replace(/"/g, '""')}"`;
      }).join(','))
    ];
    return csvRows.join('\n');
  };

  const printOrders = () => {
    const printWindow = window.open('', '_blank');
    const filteredOrders = getFilteredOrders();
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Orders Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .header { text-align: center; margin-bottom: 20px; }
            .date { color: #666; margin-bottom: 20px; }
            .footer { margin-top: 20px; text-align: center; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Orders Report</h1>
            <div class="date">Generated: ${new Date().toLocaleString()}</div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${filteredOrders.map(order => `
                <tr>
                  <td>${order._id.slice(-8)}</td>
                  <td>${order.customer?.firstName || ''} ${order.customer?.lastName || ''}</td>
                  <td>${new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>${order.items?.length || 0}</td>
                  <td>${formatCurrency(order.totalAmount)}</td>
                  <td>${order.paymentStatus}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="footer">
            <p>Total Orders: ${filteredOrders.length} | Total Revenue: ${formatCurrency(filteredOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0))}</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // Calculate status distribution for chart
  const getStatusDistribution = () => {
    const distribution = {
      Pending: stats.pendingOrders,
      Confirmed: stats.confirmedOrders,
      Paid: stats.paidOrders,
      Shipped: stats.shippedOrders,
      Delivered: stats.deliveredOrders,
      Cancelled: stats.cancelledOrders
    };
    const total = Object.values(distribution).reduce((a, b) => a + b, 0);
    return Object.entries(distribution).map(([status, count]) => ({
      status,
      count,
      percentage: total > 0 ? (count / total) * 100 : 0
    }));
  };

  const statCards = [
    { 
      label: "Total Orders", 
      value: stats.totalOrders, 
      icon: <FiPackage />, 
      color: "#3b82f6", 
      bg: "#dbeafe",
      trend: stats.ordersChange,
      trendUp: stats.ordersChange >= 0
    },
    { 
      label: "Total Revenue", 
      value: formatCurrency(stats.totalRevenue), 
      icon: <FiDollarSign />, 
      color: "#10b981", 
      bg: "#d1fae5",
      trend: stats.revenueChange,
      trendUp: stats.revenueChange >= 0
    },
    { 
      label: "Pending", 
      value: stats.pendingOrders, 
      icon: <FiClock />, 
      color: "#f59e0b", 
      bg: "#fed7aa",
      trend: null
    },
    { 
      label: "Delivered", 
      value: stats.deliveredOrders, 
      icon: <FiCheckCircle />, 
      color: "#10b981", 
      bg: "#d1fae5",
      trend: null
    },
    { 
      label: "Cancelled", 
      value: stats.cancelledOrders, 
      icon: <FiXCircle />, 
      color: "#ef4444", 
      bg: "#fee2e2",
      trend: null
    }
  ];

  const filteredOrders = getFilteredOrders();

  if (initialLoading) {
    return (
      <div className="admin-loading">
        <Spin size="large" />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="admin-header">
        <div className="header-left">
          <div className="logo">
            <FiPackage />
            <h1>Admin Dashboard</h1>
          </div>
          <p className="welcome-text">Welcome back, {admin?.name || "Admin"}!</p>
        </div>
        <div className="header-right">
          <Tooltip title="Refresh Orders">
            <Button icon={<FiRefreshCw />} onClick={fetchOrders} loading={loading}>
              Refresh
            </Button>
          </Tooltip>
          <Tooltip title="Export to CSV">
            <Button icon={<FiDownload />} onClick={exportToCSV}>
              Export
            </Button>
          </Tooltip>
          <Tooltip title="Print Report">
            <Button icon={<FiPrinter />} onClick={printOrders}>
              Print
            </Button>
          </Tooltip>
          <Button danger onClick={logout}>
            Logout
          </Button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="stats-grid">
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="stat-icon" style={{ background: stat.bg, color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-content">
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
              {stat.trend !== null && stat.trend !== 0 && (
                <div className={`stat-trend ${stat.trendUp ? 'up' : 'down'}`}>
                  {stat.trendUp ? <FiTrendingUp /> : <FiTrendingDown />}
                  {Math.abs(stat.trend).toFixed(1)}%
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Status Distribution */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card title="Order Status Distribution" size="small">
            <div className="status-distribution">
              {getStatusDistribution().map((item, index) => (
                <div key={index} className="status-progress">
                  <div className="status-label">
                    <Tag color={getStatusColor(item.status)}>{item.status}</Tag>
                    <span>{item.count} orders</span>
                  </div>
                  <Progress 
                    percent={item.percentage} 
                    size="small" 
                    status="active"
                    strokeColor={getStatusColor(item.status) === "green" ? "#10b981" : 
                                getStatusColor(item.status) === "blue" ? "#3b82f6" :
                                getStatusColor(item.status) === "orange" ? "#f59e0b" : "#ef4444"}
                  />
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Filters Section */}
      <div className="filters-section">
        <div className="search-bar">
          <FiSearch />
          <Input
            placeholder="Search by order ID, customer name, email, or phone..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            size="large"
          />
        </div>

        <div className="filter-controls">
          <Button onClick={() => setShowFilters(!showFilters)}>
            <FiFilter /> Filters
            <FiChevronDown className={showFilters ? "rotated" : ""} />
          </Button>
          
          <div className="view-toggle">
            <Button 
              type={viewMode === "grid" ? "primary" : "default"}
              onClick={() => setViewMode("grid")}
              icon={<FiPackage />}
            />
            <Button 
              type={viewMode === "list" ? "primary" : "default"}
              onClick={() => setViewMode("list")}
              icon={<FiShoppingCart />}
            />
          </div>

          <Select
            value={filterStatus}
            onChange={setFilterStatus}
            style={{ width: 150 }}
            placeholder="Filter by status"
          >
            <Option value="all">All Status ({orders.length})</Option>
            <Option value="Pending">Pending ({stats.pendingOrders})</Option>
            <Option value="Confirmed">Confirmed ({stats.confirmedOrders})</Option>
            <Option value="Paid">Paid ({stats.paidOrders})</Option>
            <Option value="Shipped">Shipped ({stats.shippedOrders})</Option>
            <Option value="Delivered">Delivered ({stats.deliveredOrders})</Option>
            <Option value="Cancelled">Cancelled ({stats.cancelledOrders})</Option>
          </Select>

          <Select
            value={sortBy}
            onChange={setSortBy}
            style={{ width: 150 }}
            placeholder="Sort by"
          >
            <Option value="newest">Newest First</Option>
            <Option value="oldest">Oldest First</Option>
            <Option value="highest">Highest Amount</Option>
            <Option value="lowest">Lowest Amount</Option>
          </Select>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              className="filters-panel"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <div className="filter-group">
                <label>Date Range</label>
                <div className="date-range">
                  <Input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                    placeholder="Start date"
                  />
                  <span>to</span>
                  <Input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                    placeholder="End date"
                  />
                  {(dateRange.start || dateRange.end) && (
                    <Button onClick={() => setDateRange({ start: "", end: "" })}>
                      Clear
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Orders Summary */}
      <div className="stats-summary">
        <div className="summary-item">
          <span>Showing {filteredOrders.length} of {orders.length} orders</span>
          {filterStatus !== "all" && (
            <Tag closable onClose={() => setFilterStatus("all")} color="blue">
              Status: {filterStatus}
            </Tag>
          )}
          {searchText && (
            <Tag closable onClose={() => setSearchText("")} color="green">
              Search: {searchText}
            </Tag>
          )}
        </div>
      </div>

      {/* Orders Display */}
      <div className={`orders-list ${viewMode}`}>
        {filteredOrders.length === 0 ? (
          <div className="empty-state">
            <FiPackage size={48} />
            <h3>No orders found</h3>
            <p>Try adjusting your filters or search criteria</p>
            <Button onClick={() => {
              setFilterStatus("all");
              setSearchText("");
              setDateRange({ start: "", end: "" });
            }}>
              Clear all filters
            </Button>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const statusConfig = getStatusConfig(order.paymentStatus);
            const customerName = order.customer?.firstName && order.customer?.lastName 
              ? `${order.customer.firstName} ${order.customer.lastName}`
              : order.customer?.name || "Guest";
            
            return (
              <motion.div
                key={order._id}
                className="order-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                layout
              >
                <div className="order-card-header">
                  <div className="order-info">
                    <div className="order-id">
                      <span className="label">Order ID</span>
                      <span className="value">#{order._id.slice(-8).toUpperCase()}</span>
                    </div>
                    <div className="order-date">
                      <FiCalendar />
                      <span>{formatDate(order.createdAt)}</span>
                    </div>
                  </div>

                  <div className="order-customer">
                    <div className="customer-name">
                      <FiUser />
                      <span>{customerName}</span>
                    </div>
                    <div className="customer-email">
                      <FiMail />
                      <span>{order.customer?.email || "N/A"}</span>
                    </div>
                  </div>

                  <div className="order-amount">
                    <span className="label">Total</span>
                    <span className="value">{formatCurrency(order.totalAmount)}</span>
                  </div>

                  <div className="order-status">
                    <div className="status-badge" style={{ background: statusConfig.bg, color: statusConfig.color }}>
                      {statusConfig.icon}
                      <span>{statusConfig.label}</span>
                    </div>
                  </div>

                  <div className="order-actions">
                    <Tooltip title="View Details">
                      <Button 
                        icon={<FiEye />}
                        onClick={() => openOrderDrawer(order)}
                      />
                    </Tooltip>
                    <Tooltip title="Update Status">
                      <Button 
                        icon={<FiEdit2 />}
                        onClick={() => openStatusDrawer(order)}
                      />
                    </Tooltip>
                    <Tooltip title="Delete Order">
                      <Button 
                        danger
                        icon={<FiTrash2 />}
                        onClick={() => deleteOrder(order._id)}
                      />
                    </Tooltip>
                  </div>
                </div>

                <div className="order-card-footer">
                  <div className="order-items-count">
                    <FiShoppingCart />
                    <span>{order.items?.length || 0} item(s)</span>
                  </div>
                  <div className="order-payment-method">
                    <FiCreditCard />
                    <span>{order.paymentMethod || "N/A"}</span>
                  </div>
                  {order.cancelReason && (
                    <div className="order-cancel-reason">
                      <FiAlertCircle />
                      <span>Cancelled: {order.cancelReason}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Order Details Drawer */}
      <Drawer
        title="Order Details"
        placement="right"
        width={600}
        onClose={() => setDetailsDrawerVisible(false)}
        open={detailsDrawerVisible}
        extra={
          <Space>
            <Button 
              type="primary" 
              onClick={() => {
                setDetailsDrawerVisible(false);
                setTimeout(() => openStatusDrawer(selectedOrder), 100);
              }}
            >
              Update Status
            </Button>
          </Space>
        }
      >
        {selectedOrder && (
          <div className="order-drawer-content">
            <Descriptions title="Order Information" bordered column={1} size="small">
              <Descriptions.Item label="Order ID">
                #{selectedOrder._id}
              </Descriptions.Item>
              <Descriptions.Item label="Order Date">
                {formatDate(selectedOrder.createdAt)}
              </Descriptions.Item>
              <Descriptions.Item label="Last Updated">
                {formatDate(selectedOrder.updatedAt)}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={getStatusColor(selectedOrder.paymentStatus)}>
                  {selectedOrder.paymentStatus}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Payment Method">
                {selectedOrder.paymentMethod || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Total Amount">
                {formatCurrency(selectedOrder.totalAmount)}
              </Descriptions.Item>
            </Descriptions>

            <Descriptions title="Customer Information" bordered column={1} size="small" style={{ marginTop: 20 }}>
              <Descriptions.Item label="Name">
                {selectedOrder.customer?.firstName || ""} {selectedOrder.customer?.lastName || selectedOrder.customer?.name || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {selectedOrder.customer?.email || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Phone">
                {selectedOrder.customer?.phone || selectedOrder.phone || "N/A"}
              </Descriptions.Item>
            </Descriptions>

            <Descriptions title="Shipping Address" bordered column={1} size="small" style={{ marginTop: 20 }}>
              <Descriptions.Item label="Address">
                {selectedOrder.customer?.address || selectedOrder.address || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="City">
                {selectedOrder.customer?.city || selectedOrder.city || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="State">
                {selectedOrder.customer?.state || selectedOrder.state || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Pincode">
                {selectedOrder.customer?.pincode || selectedOrder.pincode || "N/A"}
              </Descriptions.Item>
            </Descriptions>

            <div style={{ marginTop: 20 }}>
              <h4>Order Items ({selectedOrder.items?.length || 0})</h4>
              <Table
                dataSource={selectedOrder.items || []}
                rowKey="_id"
                pagination={false}
                size="small"
                columns={[
                  {
                    title: "Product",
                    dataIndex: "name",
                    key: "name",
                    render: (text, record) => (
                      <Space>
                        {record.image && (
                          <Avatar src={record.image} size={40} shape="square" />
                        )}
                        <span>{text}</span>
                      </Space>
                    )
                  },
                  {
                    title: "Qty",
                    dataIndex: "quantity",
                    key: "quantity",
                    align: "center",
                    width: 60
                  },
                  {
                    title: "Price",
                    dataIndex: "price",
                    key: "price",
                    render: (price) => formatCurrency(price),
                    align: "right",
                    width: 100
                  },
                  {
                    title: "Total",
                    key: "total",
                    render: (_, record) => formatCurrency((record.price || 0) * (record.quantity || 0)),
                    align: "right",
                    width: 100
                  }
                ]}
              />
              <div className="order-total-summary">
                <div>Subtotal: {formatCurrency(selectedOrder.subtotal || selectedOrder.totalAmount)}</div>
                {selectedOrder.shippingCost > 0 && (
                  <div>Shipping: {formatCurrency(selectedOrder.shippingCost)}</div>
                )}
                <div className="grand-total">Grand Total: {formatCurrency(selectedOrder.totalAmount)}</div>
              </div>
            </div>

            {selectedOrder.cancelReason && (
              <div style={{ marginTop: 20 }}>
                <h4>Cancellation Reason</h4>
                <p style={{ color: "#ff4d4f", background: "#fff2f0", padding: 12, borderRadius: 8 }}>
                  {selectedOrder.cancelReason}
                </p>
                {selectedOrder.cancelledAt && (
                  <p style={{ color: "#666", fontSize: 12 }}>
                    Cancelled on: {formatDate(selectedOrder.cancelledAt)}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </Drawer>

      {/* Update Status Drawer */}
      <Drawer
        title="Update Order Status"
        placement="right"
        width={400}
        onClose={() => {
          setStatusDrawerVisible(false);
          setCancelReason("");
          setNewStatus("");
        }}
        open={statusDrawerVisible}
        footer={
          <div style={{ textAlign: "right" }}>
            <Button onClick={() => {
              setStatusDrawerVisible(false);
              setCancelReason("");
              setNewStatus("");
            }} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button 
              type="primary" 
              loading={statusUpdating}
              onClick={() => updateOrderStatus(selectedOrder?._id, newStatus, cancelReason)}
              disabled={newStatus === selectedOrder?.paymentStatus}
            >
              Update Status
            </Button>
          </div>
        }
      >
        {selectedOrder && (
          <div>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Order ID">
                #{selectedOrder._id.slice(-8).toUpperCase()}
              </Descriptions.Item>
              <Descriptions.Item label="Customer">
                {selectedOrder.customer?.firstName || ""} {selectedOrder.customer?.lastName || selectedOrder.customer?.name || "Guest"}
              </Descriptions.Item>
              <Descriptions.Item label="Current Status">
                <Tag color={getStatusColor(selectedOrder.paymentStatus)}>
                  {selectedOrder.paymentStatus}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Total Amount">
                {formatCurrency(selectedOrder.totalAmount)}
              </Descriptions.Item>
            </Descriptions>

            <div style={{ marginTop: 20 }}>
              <label>Select New Status</label>
              <Select
                value={newStatus}
                onChange={setNewStatus}
                style={{ width: "100%", marginTop: 8 }}
                placeholder="Choose status"
              >
                {["Pending", "Confirmed", "Paid", "Shipped", "Delivered", "Cancelled"].map(status => (
                  <Option key={status} value={status}>
                    <Tag color={getStatusColor(status)}>{status}</Tag>
                  </Option>
                ))}
              </Select>
            </div>

            {newStatus === "Cancelled" && (
              <div style={{ marginTop: 20 }}>
                <label>Cancellation Reason <span style={{ color: "red" }}>*</span></label>
                <TextArea
                  rows={4}
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Please provide a reason for cancellation..."
                  style={{ marginTop: 8 }}
                  maxLength={200}
                  showCount
                />
              </div>
            )}

            {newStatus === "Delivered" && (
              <div style={{ marginTop: 20, padding: 12, background: "#f6ffed", border: "1px solid #b7eb8f", borderRadius: 8 }}>
                <FiCheckCircle style={{ color: "#52c41a", marginRight: 8 }} />
                <span>Marking as delivered will complete this order.</span>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
}