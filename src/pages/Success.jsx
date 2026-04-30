import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Card, Result, Typography, Space, Divider, Tag, Timeline, Statistic, Row, Col, Modal } from "antd";
import { 
  CheckCircleOutlined, 
  ShoppingOutlined, 
  DownloadOutlined, 
  HomeOutlined,
  OrderedListOutlined,
  ClockCircleOutlined,
  MailOutlined,
  PrinterOutlined,
  ShareAltOutlined
} from "@ant-design/icons";
import "./Success.css";

const { Title, Text, Paragraph } = Typography;

export default function Success() {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderDetails, setOrderDetails] = useState(null);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Get order details from location state or localStorage
    const stateData = location.state;
    const storedOrder = localStorage.getItem("lastOrder");
    
    if (stateData) {
      setOrderDetails(stateData);
    } else if (storedOrder) {
      setOrderDetails(JSON.parse(storedOrder));
    } else {
      // Default order details if none found
      setOrderDetails({
        orderId: "ORD" + Math.floor(Math.random() * 1000000),
        message: "Your order has been confirmed!",
        timestamp: new Date().toISOString()
      });
    }

    // Auto redirect countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [location.state]);

  useEffect(() => {
    if (countdown === 0) {
      // Auto redirect to home after 5 seconds
      // navigate("/");
    }
  }, [countdown, navigate]);

  const handleContinueShopping = () => {
    navigate("/");
  };

  const handleViewOrders = () => {
    navigate("/user-history");
  };

  const handleDownloadInvoice = () => {
    // Implement invoice download logic
    Modal.success({
      title: "Invoice Download",
      content: "Invoice will be sent to your email shortly.",
      okText: "OK",
      okButtonProps: { style: { backgroundColor: "#224030" } }
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    // Implement share logic
    Modal.info({
      title: "Share Order",
      content: "Order link copied to clipboard!",
      okButtonProps: { style: { backgroundColor: "#224030" } }
    });
  };

  return (
    <div className="success-page">
      <div className="success-container">
        {/* Success Animation */}
        <div className="success-animation">
          <div className="circle">
            <CheckCircleOutlined className="success-icon" />
          </div>
          <div className="ripple"></div>
          <div className="ripple delay-1"></div>
          <div className="ripple delay-2"></div>
        </div>

        {/* Success Message */}
        <div className="success-message">
          <Title level={2} className="success-title">
            Order Placed Successfully! 🎉
          </Title>
          <Paragraph className="success-subtitle">
            Thank you for your purchase! Your order has been received and is being processed.
          </Paragraph>
        </div>

        {/* Order Info Cards */}
        <Row gutter={[24, 24]} className="order-stats">
          <Col xs={24} sm={12} md={6}>
            <Card className="stat-card" bordered={false}>
              <Statistic
                title="Order Number"
                value={orderDetails?.orderId || "ORD123456"}
               
                valueStyle={{ color: "#224030", fontSize: "18px" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="stat-card" bordered={false}>
              <Statistic
                title="Order Date"
                value={new Date(orderDetails?.timestamp || Date.now()).toLocaleDateString()}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: "#224030", fontSize: "18px" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="stat-card" bordered={false}>
              <Statistic
                title="Estimated Delivery"
                value="3-5 Business Days"
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: "#224030", fontSize: "16px" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="stat-card" bordered={false}>
              <Statistic
                title="Payment Method"
                value={orderDetails?.paymentMethod || "Online"}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: "#224030", fontSize: "18px" }}
              />
            </Card>
          </Col>
        </Row>

        {/* Order Timeline */}
        <Card className="timeline-card" bordered={false}>
          <Title level={4} className="timeline-title">
            Order Status Timeline
          </Title>
          <Timeline
            items={[
              {
                dot: <CheckCircleOutlined style={{ fontSize: '16px', color: '#224030' }} />,
                children: (
                  <>
                    <Text strong>Order Confirmed</Text>
                    <br />
                    <Text type="secondary">Your order has been confirmed</Text>
                    <Tag color="success" style={{ marginLeft: 12 }}>Completed</Tag>
                  </>
                ),
                color: '#224030'
              },
              {
                dot: <ClockCircleOutlined style={{ fontSize: '16px' }} />,
                children: (
                  <>
                    <Text strong>Processing</Text>
                    <br />
                    <Text type="secondary">Order is being processed</Text>
                    <Tag color="processing" style={{ marginLeft: 12 }}>In Progress</Tag>
                  </>
                ),
              },
              {
                dot: <ClockCircleOutlined style={{ fontSize: '16px' }} />,
                children: (
                  <>
                    <Text strong>Shipped</Text>
                    <br />
                    <Text type="secondary">Order will be shipped soon</Text>
                  </>
                ),
              },
              {
                dot: <ClockCircleOutlined style={{ fontSize: '16px' }} />,
                children: (
                  <>
                    <Text strong>Delivered</Text>
                    <br />
                    <Text type="secondary">Estimated in 3-5 days</Text>
                  </>
                ),
              },
            ]}
            className="order-timeline"
          />
        </Card>

        {/* Action Buttons */}
        <div className="action-buttons">
          <Space size="large" wrap>
            <Button
              type="primary"
              size="large"
              icon={<HomeOutlined />}
              onClick={handleContinueShopping}
              className="primary-btn"
            >
              Continue Shopping
            </Button>
            
            <Button
              size="large"
              icon={<OrderedListOutlined />}
              onClick={handleViewOrders}
              className="secondary-btn"
            >
              View My Orders
            </Button>
            
            <Button
              size="large"
              icon={<DownloadOutlined />}
              onClick={handleDownloadInvoice}
              className="secondary-btn"
            >
              Download Invoice
            </Button>
            
            <Button
              size="large"
              icon={<PrinterOutlined />}
              onClick={handlePrint}
              className="secondary-btn"
            >
              Print
            </Button>
            
            
          </Space>
        </div>

        {/* Auto Redirect Message */}
        <div className="redirect-message">
          <Text type="secondary">
            You will be redirected to home page in {countdown} seconds...
          </Text>
          <Button 
            type="link" 
            onClick={() => navigate("/")}
            style={{ color: "#224030" }}
          >
            Click here to go now
          </Button>
        </div>

        {/* Email Confirmation Notice */}
        <div className="email-notice">
          <MailOutlined style={{ fontSize: 20, color: "#224030" }} />
          <Text type="secondary">
            A confirmation email has been sent to your registered email address
          </Text>
        </div>
      </div>
    </div>
  );
}