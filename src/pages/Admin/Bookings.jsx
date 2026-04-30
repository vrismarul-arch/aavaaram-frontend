import { useEffect, useState } from "react";
import { 
  Table, 
  Card, 
  Button, 
  Space, 
  Tag, 
  Modal, 
  Select, 
  message, 
  Statistic, 
  Row, 
  Col, 
  Tooltip,
  Descriptions,
  Badge,
  Typography,
  Divider,
  Empty,
  Spin,
  Drawer,
  Dropdown,
  Menu,
  Avatar,
  Form,
  Input
} from "antd";
import { 
  EditOutlined,
  EyeOutlined,
  DownloadOutlined,
  UnorderedListOutlined,
  AppstoreOutlined,
  MoreOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  ShoppingOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  ReloadOutlined,
  InfoCircleOutlined
} from "@ant-design/icons";
import API from "../../services/api";
import "./Bookings.css";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

export default function Bookings() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("table");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false);
  const [statusDrawerVisible, setStatusDrawerVisible] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await API.get("/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
      message.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      "Paid": "success",
      "Pending": "warning",
      "Cancelled": "error",
      "Confirmed": "processing",
      "Shipped": "processing",
      "Delivered": "success"
    };
    return colors[status] || "default";
  };

  const getStatusBadge = (status) => {
    const colors = {
      "Paid": "green",
      "Pending": "orange",
      "Cancelled": "red",
      "Confirmed": "blue",
      "Shipped": "cyan",
      "Delivered": "purple"
    };
    return colors[status] || "default";
  };

  const getStatusIcon = (status) => {
    const icons = {
      "Paid": <CheckCircleOutlined style={{ color: "#52c41a" }} />,
      "Pending": <ClockCircleOutlined style={{ color: "#faad14" }} />,
      "Cancelled": <CloseCircleOutlined style={{ color: "#ff4d4f" }} />,
      "Confirmed": <CheckCircleOutlined style={{ color: "#1890ff" }} />,
      "Shipped": <CheckCircleOutlined style={{ color: "#13c2c2" }} />,
      "Delivered": <CheckCircleOutlined style={{ color: "#52c41a" }} />
    };
    return icons[status] || <ClockCircleOutlined />;
  };

  const getStatusOptions = () => {
    return ["Pending", "Confirmed", "Paid", "Shipped", "Delivered", "Cancelled"];
  };

  const handleUpdateStatus = async (orderId) => {
    setStatusUpdating(true);
    try {
      const updateData = { status: newStatus };
      if (newStatus === "Cancelled" && cancelReason) {
        updateData.reason = cancelReason;
      }
      
      const response = await API.put(`/orders/${orderId}/status`, updateData);
      if (response.data) {
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, paymentStatus: newStatus, cancelReason: cancelReason } : order
        ));
        message.success(`Order status updated to ${newStatus} successfully`);
        setStatusDrawerVisible(false);
        if (detailsDrawerVisible && selectedOrder?._id === orderId) {
          setSelectedOrder({ ...selectedOrder, paymentStatus: newStatus, cancelReason: cancelReason });
        }
        setSelectedOrder(null);
        setNewStatus("");
        setCancelReason("");
      }
    } catch (err) {
      console.error("Status update error:", err);
      message.error("Failed to update order status");
    } finally {
      setStatusUpdating(false);
    }
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatDateShort = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  const calculateTotalItems = (items) => {
    return items?.reduce((total, item) => total + item.quantity, 0) || 0;
  };

  const calculateTotalRevenue = () => {
    return orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  };

  const calculatePendingOrders = () => {
    return orders.filter(o => o.paymentStatus === "Pending").length;
  };

  const calculateDeliveredOrders = () => {
    return orders.filter(o => o.paymentStatus === "Delivered").length;
  };

  const exportToExcel = () => {
    message.info("Export functionality coming soon");
  };

  const getFilteredOrders = () => {
    let filtered = orders;
    if (filterStatus !== "all") {
      filtered = filtered.filter(order => order.paymentStatus === filterStatus);
    }
    if (searchText) {
      filtered = filtered.filter(order => 
        order.customer?.firstName?.toLowerCase().includes(searchText.toLowerCase()) ||
        order.customer?.lastName?.toLowerCase().includes(searchText.toLowerCase()) ||
        order.customer?.email?.toLowerCase().includes(searchText.toLowerCase()) ||
        order._id?.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    return filtered;
  };

  const filteredOrders = getFilteredOrders();

  // Table columns definition
  const columns = [
    {
      title: "Order ID",
      dataIndex: "_id",
      key: "_id",
      render: (id) => (
        <Text strong style={{ color: "#17422f", fontSize: "13px" }}>
          #{id.slice(-8)}
        </Text>
      ),
      width: 100,
    },
    {
      title: "Customer",
      key: "customer",
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{record.customer?.firstName} {record.customer?.lastName}</Text>
          <Text type="secondary" style={{ fontSize: "12px" }}>{record.customer?.email}</Text>
        </Space>
      ),
      width: 200,
    },
    {
      title: "Products",
      key: "products",
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text>{record.items?.length} item(s)</Text>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            {record.items?.slice(0, 2).map(item => `${item.name} x${item.quantity}`).join(", ")}
            {record.items?.length > 2 && ` +${record.items.length - 2} more`}
          </Text>
        </Space>
      ),
      width: 200,
    },
    {
      title: "Total",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount) => (
        <Text strong style={{ color: "#10b981", fontSize: "14px" }}>
          ₹{amount?.toLocaleString()}
        </Text>
      ),
      width: 120,
    },
    {
      title: "Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (status, record) => (
        <Badge 
          color={getStatusBadge(status)} 
          text={status}
          style={{ cursor: "pointer" }}
          onClick={() => openStatusDrawer(record)}
        />
      ),
      width: 120,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (
        <Tooltip title={formatDate(date)}>
          <Text type="secondary">{formatDateShort(date)}</Text>
        </Tooltip>
      ),
      width: 110,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button 
              type="link" 
              icon={<EyeOutlined />} 
              onClick={() => openOrderDrawer(record)}
              style={{ color: "#17422f" }}
            />
          </Tooltip>
          <Tooltip title="Edit Status">
            <Button 
              type="link" 
              icon={<EditOutlined />} 
              onClick={() => openStatusDrawer(record)}
            />
          </Tooltip>
        </Space>
      ),
      width: 100,
    },
  ];

  return (
    <div className="admin-container">
      {/* Header */}
      <div className="admin-header">
        <div>
          <Title level={2} style={{ margin: 0 }}>Bookings Management</Title>
          <Text type="secondary">Manage and track all customer orders</Text>
        </div>
        <Space size="middle">
          <Select
            defaultValue="all"
            style={{ width: 150 }}
            onChange={setFilterStatus}
            placeholder="Filter by status"
          >
            <Option value="all">All Orders</Option>
            <Option value="Pending">Pending</Option>
            <Option value="Confirmed">Confirmed</Option>
            <Option value="Paid">Paid</Option>
            <Option value="Shipped">Shipped</Option>
            <Option value="Delivered">Delivered</Option>
            <Option value="Cancelled">Cancelled</Option>
          </Select>
          <Button.Group>
            <Tooltip title="Table View">
              <Button 
                type={viewMode === "table" ? "primary" : "default"}
                icon={<UnorderedListOutlined />}
                onClick={() => setViewMode("table")}
              />
            </Tooltip>
            <Tooltip title="Card View">
              <Button 
                type={viewMode === "card" ? "primary" : "default"}
                icon={<AppstoreOutlined />}
                onClick={() => setViewMode("card")}
              />
            </Tooltip>
          </Button.Group>
          <Button 
            type="primary" 
            icon={<DownloadOutlined />}
            onClick={exportToExcel}
          >
            Export
          </Button>
        </Space>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className="stats-row">
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="Total Orders"
              value={orders.length}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="Total Revenue"
              value={calculateTotalRevenue()}
              prefix={<DollarOutlined />}
              precision={2}
              valueStyle={{ color: "#cf1322" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="Pending Orders"
              value={calculatePendingOrders()}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="Delivered Orders"
              value={calculateDeliveredOrders()}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Content */}
      <Spin spinning={loading}>
        {filteredOrders.length === 0 && !loading ? (
          <Empty 
            description="No orders found" 
            style={{ marginTop: 60 }}
          />
        ) : viewMode === "table" ? (
          <Table
            columns={columns}
            dataSource={filteredOrders}
            rowKey="_id"
            pagination={{ 
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} orders`
            }}
            className="orders-table"
            scroll={{ x: 1100 }}
          />
        ) : (
          <Row gutter={[16, 16]} className="cards-container">
            {filteredOrders.map(order => (
              <Col xs={24} sm={12} lg={8} xl={6} key={order._id}>
                <Card
                  className="order-card"
                  hoverable
                  actions={[
                    <Tooltip title="View Details">
                      <EyeOutlined key="view" onClick={() => openOrderDrawer(order)} />
                    </Tooltip>,
                    <Tooltip title="Edit Status">
                      <EditOutlined key="edit" onClick={() => openStatusDrawer(order)} />
                    </Tooltip>
                  ]}
                >
                  <div className="card-header">
                    <div className="order-status-badge">
                      {getStatusIcon(order.paymentStatus)}
                      <Text style={{ marginLeft: 8 }}>{order.paymentStatus}</Text>
                    </div>
                    <Text strong className="order-id-text">
                      #{order._id.slice(-8)}
                    </Text>
                  </div>
                  
                  <Divider style={{ margin: "12px 0" }} />
                  
                  <div className="customer-info">
                    <Avatar icon={<UserOutlined />} size="small" />
                    <div className="customer-details">
                      <Text strong>{order.customer?.firstName} {order.customer?.lastName}</Text>
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        <MailOutlined /> {order.customer?.email}
                      </Text>
                    </div>
                  </div>
                  
                  <Divider style={{ margin: "12px 0" }} />
                  
                  <div className="order-summary">
                    <Row gutter={[8, 8]}>
                      <Col span={12}>
                        <Text type="secondary">Payment:</Text>
                        <div>
                          <Tag color="blue" style={{ marginTop: 4 }}>
                            {order.paymentMethod}
                          </Tag>
                        </div>
                      </Col>
                      <Col span={12}>
                        <Text type="secondary">Items:</Text>
                        <div>
                          <Text strong>{calculateTotalItems(order.items)}</Text>
                        </div>
                      </Col>
                      <Col span={24}>
                        <Text type="secondary">Total:</Text>
                        <div>
                          <Text strong style={{ color: "#10b981", fontSize: "18px" }}>
                            ₹{order.totalAmount?.toLocaleString()}
                          </Text>
                        </div>
                      </Col>
                    </Row>
                  </div>
                  
                  <Divider style={{ margin: "12px 0" }} />
                  
                  <div className="products-preview">
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      Products ({order.items?.length})
                    </Text>
                    <div className="product-list">
                      {order.items?.slice(0, 2).map((item, idx) => (
                        <Text key={idx} style={{ fontSize: "11px" }} ellipsis>
                          • {item.name} x{item.quantity}
                        </Text>
                      ))}
                      {order.items?.length > 2 && (
                        <Text type="secondary" style={{ fontSize: "11px" }}>
                          +{order.items.length - 2} more items
                        </Text>
                      )}
                    </div>
                  </div>
                  
                  <div className="order-date">
                    <CalendarOutlined style={{ marginRight: 4 }} />
                    <Text type="secondary" style={{ fontSize: "11px" }}>
                      {formatDateShort(order.createdAt)}
                    </Text>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Spin>

      {/* Status Update Drawer */}
      <Drawer
        title={
          <div className="drawer-header">
            <Space>
              <EditOutlined />
              <span>Update Order Status</span>
            </Space>
          </div>
        }
        placement="right"
        width={500}
        open={statusDrawerVisible}
        onClose={() => {
          setStatusDrawerVisible(false);
          setSelectedOrder(null);
          setNewStatus("");
          setCancelReason("");
        }}
        extra={
          <Space>
            <Button 
              onClick={() => {
                setStatusDrawerVisible(false);
                setSelectedOrder(null);
                setNewStatus("");
                setCancelReason("");
              }}
            >
              Cancel
            </Button>
            <Button 
              type="primary" 
              icon={<ReloadOutlined />}
              loading={statusUpdating}
              onClick={() => handleUpdateStatus(selectedOrder?._id)}
            >
              Update Status
            </Button>
          </Space>
        }
      >
        {selectedOrder && (
          <>
            {/* Order Information */}
            <div className="status-drawer-section">
              <Title level={5}>Order Information</Title>
              <Card className="info-card compact-card">
                <div className="info-row">
                  <Text type="secondary">Order ID</Text>
                  <Text strong>#{selectedOrder._id.slice(-8)}</Text>
                </div>
                <div className="info-row">
                  <Text type="secondary">Customer</Text>
                  <Text strong>{selectedOrder.customer?.firstName} {selectedOrder.customer?.lastName}</Text>
                </div>
                <div className="info-row">
                  <Text type="secondary">Email</Text>
                  <Text>{selectedOrder.customer?.email}</Text>
                </div>
                <div className="info-row">
                  <Text type="secondary">Total Amount</Text>
                  <Text strong style={{ color: "#10b981" }}>
                    ₹{selectedOrder.totalAmount?.toLocaleString()}
                  </Text>
                </div>
              </Card>
            </div>

            {/* Current Status */}
            <div className="status-drawer-section">
              <Title level={5}>Current Status</Title>
              <Card className="info-card compact-card">
                <div className="current-status">
                  {getStatusIcon(selectedOrder.paymentStatus)}
                  <Tag color={getStatusColor(selectedOrder.paymentStatus)} style={{ marginLeft: 8 }}>
                    {selectedOrder.paymentStatus}
                  </Tag>
                </div>
              </Card>
            </div>

            {/* Update Status */}
            <div className="status-drawer-section">
              <Title level={5}>Update to New Status</Title>
              <Card className="info-card compact-card">
                <Form layout="vertical">
                  <Form.Item label="Select New Status">
                    <Select
                      value={newStatus}
                      onChange={setNewStatus}
                      size="large"
                      style={{ width: "100%" }}
                    >
                      {getStatusOptions().map(status => (
                        <Option key={status} value={status}>
                          <Space>
                            {getStatusIcon(status)}
                            <Badge color={getStatusBadge(status)} text={status} />
                          </Space>
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  
                  {newStatus === "Cancelled" && (
                    <Form.Item label="Cancellation Reason">
                      <TextArea 
                        rows={3} 
                        placeholder="Please provide a reason for cancellation..."
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                        style={{ marginTop: 8 }}
                      />
                    </Form.Item>
                  )}
                </Form>
              </Card>
            </div>

            {/* Status History */}
            <div className="status-drawer-section">
              <Title level={5}>Status History</Title>
              <Card className="info-card compact-card">
                <div className="timeline">
                  <div className="timeline-item">
                    <div className="timeline-icon">⏳</div>
                    <div className="timeline-content">
                      <Text strong>Order Placed</Text>
                      <Text type="secondary">{formatDate(selectedOrder.createdAt)}</Text>
                    </div>
                  </div>
                  {selectedOrder.paymentStatus !== "Pending" && (
                    <div className="timeline-item">
                      <div className="timeline-icon">✅</div>
                      <div className="timeline-content">
                        <Text strong>Status: {selectedOrder.paymentStatus}</Text>
                        <Text type="secondary">{formatDate(selectedOrder.updatedAt)}</Text>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Note */}
            <div className="status-drawer-section">
              <Card className="info-card info-note">
                <Space>
                  <InfoCircleOutlined />
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    Changing the order status will notify the customer via email.
                  </Text>
                </Space>
              </Card>
            </div>
          </>
        )}
      </Drawer>

      {/* Order Details Drawer */}
      <Drawer
        title={
          <div className="drawer-header">
            <Space>
              <ShoppingOutlined />
              <span>Order Details</span>
            </Space>
          </div>
        }
        placement="right"
        width={700}
        open={detailsDrawerVisible}
        onClose={() => {
          setDetailsDrawerVisible(false);
          setSelectedOrder(null);
        }}
        extra={
          <Space>
            <Button 
              type="primary" 
              icon={<EditOutlined />}
              onClick={() => {
                setDetailsDrawerVisible(false);
                openStatusDrawer(selectedOrder);
              }}
            >
              Edit Status
            </Button>
          </Space>
        }
      >
        {selectedOrder && (
          <>
            {/* Order Header */}
            <div className="order-header-section">
              <Row gutter={16}>
                <Col span={16}>
                  <div className="order-id-section">
                    <Text type="secondary">Order ID</Text>
                    <Title level={4} style={{ margin: 0 }}>
                      #{selectedOrder._id}
                    </Title>
                  </div>
                </Col>
                <Col span={8}>
                  <div className="order-status-section">
                    <Text type="secondary">Order Status</Text>
                    <div className="status-badge-large">
                      {getStatusIcon(selectedOrder.paymentStatus)}
                      <Tag color={getStatusColor(selectedOrder.paymentStatus)} style={{ marginLeft: 8 }}>
                        {selectedOrder.paymentStatus}
                      </Tag>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>

            <Divider />

            {/* Customer Information */}
            <div className="section">
              <Title level={5}>
                <UserOutlined /> Customer Information
              </Title>
              <Card className="info-card">
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <div className="info-item">
                      <Text type="secondary">Full Name</Text>
                      <Text strong>
                        {selectedOrder.customer?.firstName} {selectedOrder.customer?.lastName}
                      </Text>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className="info-item">
                      <Text type="secondary">Email</Text>
                      <Text strong>{selectedOrder.customer?.email}</Text>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className="info-item">
                      <Text type="secondary">Phone</Text>
                      <Text strong>{selectedOrder.customer?.phone || "N/A"}</Text>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className="info-item">
                      <Text type="secondary">Order Date</Text>
                      <Text strong>{formatDate(selectedOrder.createdAt)}</Text>
                    </div>
                  </Col>
                  <Col span={24}>
                    <div className="info-item">
                      <Text type="secondary">Address</Text>
                      <Text strong>
                        <EnvironmentOutlined /> {selectedOrder.customer?.address}, {selectedOrder.customer?.city}
                      </Text>
                    </div>
                  </Col>
                </Row>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="section">
              <Title level={5}>Order Summary</Title>
              <Card className="info-card">
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <div className="info-item">
                      <Text type="secondary">Payment Method</Text>
                      <Tag color="blue" style={{ marginTop: 4 }}>
                        {selectedOrder.paymentMethod}
                      </Tag>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className="info-item">
                      <Text type="secondary">Total Items</Text>
                      <Text strong>{calculateTotalItems(selectedOrder.items)}</Text>
                    </div>
                  </Col>
                  <Col span={24}>
                    <div className="info-item">
                      <Text type="secondary">Total Amount</Text>
                      <Title level={3} style={{ color: "#10b981", margin: 0 }}>
                        ₹{selectedOrder.totalAmount?.toLocaleString()}
                      </Title>
                    </div>
                  </Col>
                </Row>
              </Card>
            </div>

            {/* Products List */}
            <div className="section">
              <Title level={5}>Products</Title>
              <Table
                dataSource={selectedOrder.items}
                columns={[
                  {
                    title: "Product",
                    dataIndex: "name",
                    key: "name",
                  },
                  {
                    title: "Quantity",
                    dataIndex: "quantity",
                    key: "quantity",
                    width: 100,
                    align: "center",
                  },
                  {
                    title: "Price",
                    dataIndex: "price",
                    key: "price",
                    render: (price) => `₹${price}`,
                    width: 100,
                    align: "right",
                  },
                  {
                    title: "Total",
                    key: "total",
                    render: (_, record) => `₹${record.price * record.quantity}`,
                    width: 100,
                    align: "right",
                  },
                ]}
                pagination={false}
                size="small"
                rowKey="_id"
              />
            </div>

            {/* Cancellation Reason */}
            {selectedOrder.paymentStatus === "Cancelled" && selectedOrder.cancelReason && (
              <div className="section">
                <Title level={5}>Cancellation Reason</Title>
                <Card className="info-card danger-card">
                  <Paragraph type="danger">
                    {selectedOrder.cancelReason}
                  </Paragraph>
                  {selectedOrder.cancelledAt && (
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      Cancelled on: {formatDate(selectedOrder.cancelledAt)}
                    </Text>
                  )}
                </Card>
              </div>
            )}

            {/* Timeline */}
            <div className="section">
              <Title level={5}>Order Timeline</Title>
              <Card className="info-card">
                <div className="timeline-item">
                  <CheckCircleOutlined style={{ color: "#52c41a" }} />
                  <div className="timeline-content">
                    <Text strong>Order Placed</Text>
                    <Text type="secondary">{formatDate(selectedOrder.createdAt)}</Text>
                  </div>
                </div>
                {selectedOrder.paymentStatus !== "Pending" && (
                  <div className="timeline-item">
                    <CheckCircleOutlined style={{ color: "#52c41a" }} />
                    <div className="timeline-content">
                      <Text strong>Order {selectedOrder.paymentStatus}</Text>
                      <Text type="secondary">{formatDate(selectedOrder.updatedAt)}</Text>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </>
        )}
      </Drawer>
    </div>
  );
}