import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../services/api";
import { useCart } from "../../context/CartContext";
import { message, Spin, Button, Card, Radio, Modal, Typography, Space, Divider, Tag, Alert } from "antd";
import { ArrowLeftOutlined, CreditCardOutlined, WalletOutlined, BankOutlined, SafetyOutlined } from "@ant-design/icons";
import "./PaymentPage.css";
import bank from './icon/bank.png';  
import cash from './icon/afterpay.png';  

const { Title, Text } = Typography;

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart, fetchCart } = useCart();

  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  /* ================= LOAD ORDER DATA ================= */
  useEffect(() => {
    const stateData = location.state?.orderData;
    const storedData = localStorage.getItem("pendingOrder");
    
    if (stateData) {
      setOrderData(stateData);
    } else if (storedData) {
      const parsedData = JSON.parse(storedData);
      setOrderData(parsedData);
    } else {
      message.error("No order data found");
      navigate("/checkout");
      return;
    }
    
    loadRazorpayScript();
  }, [navigate, location]);

  /* ================= LOAD RAZORPAY SCRIPT ================= */
  const loadRazorpayScript = () => {
    // Check if already loaded
    if (window.Razorpay) {
      setRazorpayLoaded(true);
      console.log("Razorpay already loaded");
      return;
    }
    
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      setRazorpayLoaded(true);
      console.log("Razorpay script loaded successfully");
    };
    script.onerror = () => {
      console.error("Failed to load Razorpay script");
      message.error("Failed to load payment gateway. Please check your internet connection.");
    };
    document.body.appendChild(script);
  };

  /* ================= CLEAR CART AFTER SUCCESSFUL ORDER ================= */
  const clearCartAfterOrder = async () => {
    try {
      // Clear cart using CartContext
      await clearCart();
      
      // Also call backend to ensure cart is cleared
      const token = localStorage.getItem("token");
      if (token) {
        await api.delete("/cart/clear/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      
      console.log("Cart cleared successfully");
      
      // Refresh cart state
      await fetchCart();
    } catch (err) {
      console.error("Failed to clear cart:", err);
      // Don't throw error - cart clear failure shouldn't stop order completion
    }
  };

  /* ================= ONLINE PAYMENT ================= */
  const handleOnlinePayment = async () => {
    if (!orderData) {
      message.error("Order data not found");
      return;
    }
    
    if (!razorpayLoaded) {
      message.error("Payment gateway is loading. Please wait or refresh the page.");
      return;
    }
    
    setLoading(true);

    try {
      // ✅ Step 1: Create order on your backend
      console.log("Creating Razorpay order for amount:", orderData.totalAmount);
      
      const { data } = await api.post("/payment/razorpay", {
        amount: orderData.totalAmount,
      });

      console.log("Razorpay order response:", data);

      if (!data.success) {
        throw new Error(data.message || "Failed to create order");
      }

      // ✅ Step 2: Configure Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount, // Amount in paise
        currency: data.currency,
        name: "SRG Super Foods",
        description: `Order Payment`,
        order_id: data.id, // This is the Razorpay order ID
        image: "https://your-logo-url.com/logo.png", // Optional: Add your logo
        
        prefill: {
          name: `${orderData.customer.firstName} ${orderData.customer.lastName}`.trim(),
          email: orderData.customer.email,
          contact: orderData.customer.phone,
        },
        
        notes: {
          address: orderData.customer.address,
          city: orderData.customer.city,
          pincode: orderData.customer.pincode,
        },
        
        theme: {
          color: "#224030",
        },
        
        modal: {
          ondismiss: () => {
            setLoading(false);
            message.info("Payment cancelled");
          },
        },
        
        // ✅ Step 3: Handle payment success
        handler: async (response) => {
          console.log("Payment success response:", response);
          
          try {
            // Verify payment on your backend
            const verifyRes = await api.post("/payment/verify", {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              orderData: orderData,
            });

            console.log("Verification response:", verifyRes.data);

            if (verifyRes.data.success) {
              message.success("Payment successful! Order confirmed.");
              
              // Clear cart after successful payment
              await clearCartAfterOrder();
              
              // Clear pending order from localStorage
              localStorage.removeItem("pendingOrder");
              
              // Navigate to success page
              navigate("/success", { 
                state: { 
                  orderId: verifyRes.data.order?._id,
                  message: "Payment successful! Your order has been confirmed."
                }
              });
            } else {
              throw new Error(verifyRes.data.message || "Payment verification failed");
            }
          } catch (error) {
            console.error("Verification error:", error);
            message.error(error.response?.data?.message || "Payment verification failed. Please contact support.");
            navigate("/failure");
          }
        },
      };

      // ✅ Step 4: Initialize and open Razorpay
      const rzp = new window.Razorpay(options);
      
      // Handle payment failure
      rzp.on('payment.failed', function (response) {
        console.error("Payment failed:", response.error);
        message.error(`Payment failed: ${response.error.description}`);
        setLoading(false);
      });
      
      rzp.open();
      
      // Reset loading when Razorpay modal is closed
      rzp.on('modal.closed', () => {
        setLoading(false);
      });
      
    } catch (error) {
      console.error("Payment order error:", error);
      message.error(error.response?.data?.message || error.message || "Failed to create payment order");
      setLoading(false);
    }
  };

  /* ================= CASH ON DELIVERY ================= */
  const handleCOD = async () => {
    if (!orderData) return;
    setLoading(true);

    try {
      const payload = {
        items: orderData.items,
        totalAmount: orderData.totalAmount,
        paymentMethod: "COD",
        customer: orderData.customer,
      };

      const res = await api.post("/payment/cod", payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.data.success) {
        message.success("Order placed successfully!");
        
        // Clear cart after successful COD order
        await clearCartAfterOrder();
        
        // Clear pending order from localStorage
        localStorage.removeItem("pendingOrder");
        
        navigate("/success", { 
          state: { 
            orderId: res.data.order?._id,
            message: "Order confirmed! Pay at the time of delivery."
          }
        });
      } else {
        throw new Error(res.data.message || "COD order failed");
      }
    } catch (err) {
      console.error("COD order error:", err);
      message.error(err.response?.data?.message || "Failed to place order");
      navigate("/failure");
    } finally {
      setLoading(false);
    }
  };

  const handleProceed = () => {
    if (paymentMethod === "online") {
      handleOnlinePayment();
    } else {
      handleCOD();
    }
  };

  const handleBack = () => {
    navigate("/checkout");
  };

  const confirmCancel = async () => {
    setCancelLoading(true);
    try {
      // Clear pending order from localStorage
      localStorage.removeItem("pendingOrder");
      
      message.info("Order cancelled");
      navigate("/cart");
    } catch (error) {
      console.error("Cancel error:", error);
      message.error("Failed to cancel order");
    } finally {
      setCancelLoading(false);
      setShowCancelModal(false);
    }
  };

  if (!orderData) {
    return (
      <div className="payment-page-loader">
        <Spin size="large" />
        <Text style={{ marginTop: 16 }}>Loading order details...</Text>
      </div>
    );
  }

  return (
    <>
      <div className="payment-page-container">
        <div className="payment-header">
          <Button 
            type="text" 
            icon={<ArrowLeftOutlined />} 
            onClick={handleBack}
            className="back-button"
          >
            Back to Checkout
          </Button>
          <Title level={3} className="page-title">Confirm & Pay</Title>
        </div>

        <div className="payment-page-wrapper">
          {/* Left Section - Order Details */}
          <div className="payment-left">
            <Card className="section-card" bordered={false}>
              <div className="card-header">
                <Title level={4}>Customer Details</Title>
              </div>
              <div className="details-grid">
                <div className="detail-item">
                  <Text type="secondary">Full Name</Text>
                  <Text strong>{orderData.customer.firstName} {orderData.customer.lastName}</Text>
                </div>
                <div className="detail-item">
                  <Text type="secondary">Email Address</Text>
                  <Text strong>{orderData.customer.email}</Text>
                </div>
                <div className="detail-item">
                  <Text type="secondary">Phone Number</Text>
                  <Text strong>{orderData.customer.phone}</Text>
                </div>
                <div className="detail-item">
                  <Text type="secondary">Delivery Address</Text>
                  <Text strong>
                    {orderData.customer.address}, {orderData.customer.city}, 
                    {orderData.customer.state} - {orderData.customer.pincode}
                  </Text>
                </div>
              </div>
            </Card>

            <Card className="section-card" bordered={false}>
              <div className="card-header">
                <Title level={4}>Order Summary</Title>
              </div>
              <div className="order-items">
                {orderData.items.map((item, idx) => (
                  <div key={idx} className="order-item">
                    <div className="item-image">
                      {item.image ? (
                        <img src={item.image} alt={item.name} />
                      ) : (
                        <div className="image-placeholder">🛍️</div>
                      )}
                    </div>
                    <div className="item-details">
                      <Text strong>{item.name}</Text>
                      <Text type="secondary">Quantity: {item.quantity}</Text>
                    </div>
                    <div className="item-price">
                      <Text strong>₹{item.price * item.quantity}</Text>
                    </div>
                  </div>
                ))}
              </div>
              <Divider />
              <div className="total-amount">
                <Title level={4}>Total Amount</Title>
                <Title level={3} style={{ color: "#224030", margin: 0 }}>
                  ₹{orderData.totalAmount}
                </Title>
              </div>
            </Card>
          </div>

          {/* Right Section - Payment */}
          <div className="payment-right">
            <Card className="payment-card" bordered={false}>
              <div className="card-header">
                <Title level={4}>Select Payment Method</Title>
              </div>

              <Radio.Group
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="payment-methods-group"
              >
                <Space direction="vertical" className="payment-methods-space">
                  <div
                    className={`payment-method-card ${paymentMethod === "online" ? "selected" : ""}`}
                    onClick={() => setPaymentMethod("online")}
                  >
                    <Radio value="online" className="payment-radio">
                      <div className="payment-method-content">
                        <div className="payment-method-icon online">
                         <img src={bank} alt="Bank Transfer" className="upi"/>
                        </div>
                        <div className="payment-method-info">
                          <Text strong className="method-name">Online Payment</Text>
                          <Text type="secondary" className="method-description">
                            Pay securely via Credit/Debit Card, UPI, NetBanking, or Wallet
                          </Text>
                          <div className="payment-options-badges">
                            <Tag icon={<CreditCardOutlined />}>Cards</Tag>
                            <Tag icon={<WalletOutlined />}>UPI</Tag>
                            <Tag icon={<BankOutlined />}>NetBanking</Tag>
                          </div>
                        </div>
                      </div>
                    </Radio>
                  </div>

                  <div
                    className={`payment-method-card ${paymentMethod === "cod" ? "selected" : ""}`}
                    onClick={() => setPaymentMethod("cod")}
                  >
                    <Radio value="cod" className="payment-radio">
                      <div className="payment-method-content">
                        <div className="payment-method-icon cod">
                            <img src={cash} alt="Cash on Delivery" className="upi" />
                        </div>
                        <div className="payment-method-info">
                          <Text strong className="method-name">Cash on Delivery</Text>
                          <Text type="secondary" className="method-description">
                            Pay at the time of delivery
                          </Text>
                          <Alert
                            message="No advance payment required"
                            type="info"
                            showIcon
                            className="cod-info"
                          />
                        </div>
                      </div>
                    </Radio>
                  </div>
                </Space>
              </Radio.Group>

              <Divider />

              <div className="payment-summary">
                <div className="summary-row">
                  <Text>Subtotal</Text>
                  <Text>₹{orderData.totalAmount}</Text>
                </div>
                <div className="summary-row">
                  <Text>Taxes & Fees</Text>
                  <Text>₹0</Text>
                </div>
                <Divider style={{ margin: "12px 0" }} />
                <div className="summary-row total">
                  <Text strong>Total to Pay</Text>
                  <Text strong style={{ color: "#224030", fontSize: "1.25rem" }}>
                    ₹{orderData.totalAmount}
                  </Text>
                </div>
              </div>

              <div className="security-notice">
                <SafetyOutlined style={{ color: "#10b981", marginRight: 8 }} />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {paymentMethod === "online" 
                    ? "Your payment is secure and encrypted. We never store your card details."
                    : "No payment required now. Pay when you receive the order."}
                </Text>
              </div>

              <div className="action-buttons">
                <Button
                  type="primary"
                  block
                  size="large"
                  loading={loading}
                  onClick={handleProceed}
                  className="pay-button"
                  icon={paymentMethod === "online" ? <CreditCardOutlined /> : null}
                  style={{ backgroundColor: "#224030", borderColor: "#224030" }}
                >
                  {loading 
                    ? "Processing..." 
                    : paymentMethod === "online" 
                      ? `Pay ₹${orderData.totalAmount}` 
                      : "Confirm Order"}
                </Button>

                <Button
                  block
                  size="large"
                  onClick={() => setShowCancelModal(true)}
                  className="cancel-button"
                  danger
                  ghost
                >
                  Cancel Order
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Modal
        title="Cancel Order?"
        open={showCancelModal}
        onCancel={() => setShowCancelModal(false)}
        centered
        footer={[
          <Button key="no" onClick={() => setShowCancelModal(false)}>
            No, Keep Order
          </Button>,
          <Button
            key="yes"
            danger
            loading={cancelLoading}
            onClick={confirmCancel}
          >
            Yes, Cancel Order
          </Button>,
        ]}
      >
        <p>Are you sure you want to cancel this order?</p>
        <Text type="secondary">This action cannot be undone.</Text>
      </Modal>
    </>
  );
}