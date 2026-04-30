import { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import "./Checkout.css";

export default function Checkout() {
  const { cart, total, clearCart } = useCart();
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    state: "Tamil Nadu",
    pincode: "",
    phone: ""
  });

  // LOGIN PROTECTION
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user) {
      message.warning("Please login to continue");
      navigate("/login");
    } else {
      setForm(prev => ({
        ...prev,
        email: user.email
      }));
    }
  }, [navigate]);

  // Process cart items
  useEffect(() => {
    if (cart && cart.length > 0) {
      const processedItems = cart.map(item => ({
        _id: item.product?._id || item._id,
        name: item.product?.name || item.name,
        price: item.product?.price || item.price,
        qty: item.qty,
        image: item.product?.image || item.image
      }));
      setCartItems(processedItems);
    }
  }, [cart]);

  const validate = () => {
    let newErrors = {};

    if (!form.firstName.trim()) newErrors.firstName = "Enter a first name";
    if (!form.lastName.trim()) newErrors.lastName = "Enter a last name";
    if (!form.address.trim()) newErrors.address = "Enter an address";
    if (!form.city.trim()) newErrors.city = "Enter a city";
    if (!form.pincode.trim()) newErrors.pincode = "Enter a ZIP / postal code";
    if (!form.phone.trim()) newErrors.phone = "Enter a phone number";
    
    const phoneRegex = /^[6-9]\d{9}$/;
    if (form.phone && !phoneRegex.test(form.phone)) {
      newErrors.phone = "Enter a valid 10-digit phone number";
    }
    
    const pincodeRegex = /^\d{6}$/;
    if (form.pincode && !pincodeRegex.test(form.pincode)) {
      newErrors.pincode = "Enter a valid 6-digit PIN code";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleProceedToPayment = async () => {
    if (!validate()) return;
    
    if (cartItems.length === 0) {
      message.warning("Your cart is empty!");
      return;
    }

    setLoading(true);

    const loggedUser = JSON.parse(localStorage.getItem("user"));

    // Create order data to pass to payment page
    const orderData = {
      items: cartItems.map(item => ({
        productId: item._id,
        name: item.name,
        price: item.price,
        quantity: item.qty,
        image: item.image
      })),
      totalAmount: total,
      customer: {
        firstName: form.firstName,
        lastName: form.lastName,
        email: loggedUser.email,
        phone: form.phone,
        address: form.address,
        apartment: form.apartment,
        city: form.city,
        state: form.state,
        pincode: form.pincode
      },
      orderDate: new Date().toISOString()
    };

    // Store order data in localStorage for payment page
    localStorage.setItem("pendingOrder", JSON.stringify(orderData));
    
    // Navigate to payment page
    navigate("/payment", { 
      state: { 
        orderData: orderData,
        totalAmount: total
      }
    });
    
    setLoading(false);
  };

  // Show empty cart state
  if (!cart || cart.length === 0) {
    return (
      <div className="checkout-empty">
        <h2>Your cart is empty</h2>
        <button onClick={() => navigate("/")} className="continue-shopping-btn">
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-wrapper">
      <div className="checkout-left">
        <h2>Contact</h2>
        <div className="row">
          <input
            name="email"
            value={form.email}
            readOnly
            className="readonly-input"
          />
        </div>

        <h2>Delivery</h2>
        <div className="row">
          <div className="name-row">
            <div className="input-group">
              <input
                name="firstName"
                placeholder="First name *"
                onChange={handleChange}
                value={form.firstName}
                className={errors.firstName ? "error-input" : ""}
              />
              {errors.firstName && <p className="error-text">{errors.firstName}</p>}
            </div>

            <div className="input-group">
              <input
                name="lastName"
                placeholder="Last name *"
                onChange={handleChange}
                value={form.lastName}
                className={errors.lastName ? "error-input" : ""}
              />
              {errors.lastName && <p className="error-text">{errors.lastName}</p>}
            </div>
          </div>

          <input
            name="address"
            placeholder="Address (House No, Building, Street) *"
            onChange={handleChange}
            value={form.address}
            className={errors.address ? "error-input" : ""}
          />
          {errors.address && <p className="error-text">{errors.address}</p>}

          <input
            name="apartment"
            placeholder="Apartment, Suite, etc. (Optional)"
            onChange={handleChange}
            value={form.apartment}
          />

          <div className="city-row">
            <div className="input-group">
              <input
                name="city"
                placeholder="City *"
                onChange={handleChange}
                value={form.city}
                className={errors.city ? "error-input" : ""}
              />
              {errors.city && <p className="error-text">{errors.city}</p>}
            </div>

            <div className="input-group">
              <input
                name="state"
                placeholder="State"
                value={form.state}
                readOnly
                className="readonly-input"
              />
            </div>
          </div>

          <div className="pin-phone-row">
            <div className="input-group">
              <input
                name="pincode"
                placeholder="PIN code *"
                onChange={handleChange}
                value={form.pincode}
                className={errors.pincode ? "error-input" : ""}
              />
              {errors.pincode && <p className="error-text">{errors.pincode}</p>}
            </div>

            <div className="input-group">
              <input
                name="phone"
                placeholder="Phone Number *"
                onChange={handleChange}
                value={form.phone}
                className={errors.phone ? "error-input" : ""}
              />
              {errors.phone && <p className="error-text">{errors.phone}</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="checkout-right">
        <h3>Order Summary ({cartItems.length} items)</h3>
        <div className="summary-items">
          {cartItems.map(item => (
            <div key={item._id} className="summary-item">
              <img src={item.image} alt={item.name} />
              <div className="summary-details">
                <p className="item-name">{item.name}</p>
                <small className="item-qty">Qty: {item.qty}</small>
              </div>
              <span className="item-price">₹{item.price * item.qty}</span>
            </div>
          ))}
        </div>

        <hr />

        <div className="summary-total">
          <h3>Total</h3>
          <h3>₹{total}</h3>
        </div>

        <button 
          className="pay-btn" 
          onClick={handleProceedToPayment}
          disabled={loading}
        >
          {loading ? "Processing..." : "Proceed to Payment"}
        </button>
      </div>
    </div>
  );
}