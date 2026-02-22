import { useState } from "react";
import { useCart } from "../../context/CartContext";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";

export default function Checkout() {
  const { cart, total, clearCart } = useCart();
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("ONLINE");

  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "Tamil Nadu",
    pincode: "",
    phone: ""
  });

  const validate = () => {
    let newErrors = {};

    if (!form.email) newErrors.email = "Enter an email";
    if (!form.lastName) newErrors.lastName = "Enter a last name";
    if (!form.address) newErrors.address = "Enter an address";
    if (!form.city) newErrors.city = "Enter a city";
    if (!form.pincode) newErrors.pincode = "Enter a ZIP / postal code";
    if (!form.phone) newErrors.phone = "Enter a phone number";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    if (!validate()) return;

    const orderData = {
      items: cart.map(item => ({
        productId: item._id,
        name: item.name,
        price: item.price,
        quantity: item.qty,
        image: item.image
      })),
      totalAmount: total,
      customer: form
    };

    // ================= COD =================
    if (paymentMethod === "COD") {
      await API.post("/payment/cod", orderData);

      clearCart();
      navigate("/success");
      return;
    }

    // ================= RAZORPAY =================
    if (paymentMethod === "ONLINE") {
      const res = await API.post("/payment/razorpay", {
        amount: total
      });

      const options = {
        key: "YOUR_RAZORPAY_KEY",
        amount: res.data.amount,
        currency: "INR",
        order_id: res.data.id,

        handler: async function () {
          await API.post("/payment/verify", {
            orderData
          });

          clearCart();
          navigate("/success");
        },

        theme: {
          color: "#6b1d00"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    }
  };

  return (
    <div className="checkout-wrapper">

      {/* LEFT SIDE */}
      <div className="checkout-left">

        <h2>Contact</h2>
        <div className="row">
        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className={errors.email && "error-input"}
        />
        {errors.email && <p className="error-text">{errors.email}</p>}
         </div>
        <h2>Delivery</h2>

        <div className="row">
          <input
            name="firstName"
            placeholder="First name (optional)"
            onChange={handleChange}
          />

          <input
            name="lastName"
            placeholder="Last name"
            onChange={handleChange}
            className={errors.lastName && "error-input"}
          />
        {/* </div> */}
        {errors.lastName && <p className="error-text">{errors.lastName}</p>}

        <input
          name="address"
          placeholder="Address"
          onChange={handleChange}
          className={errors.address && "error-input"}
        />
        {errors.address && <p className="error-text">{errors.address}</p>}

        {/* <div className="row"> */}
          <input
            name="city"
            placeholder="City"
            onChange={handleChange}
            className={errors.city && "error-input"}
          />

          <input
            name="pincode"
            placeholder="PIN code"
            onChange={handleChange}
            className={errors.pincode && "error-input"}
          />
        {/* </div> */}

        {errors.city && <p className="error-text">{errors.city}</p>}
        {errors.pincode && <p className="error-text">{errors.pincode}</p>}

        <input
          name="phone"
          placeholder="Phone"
          onChange={handleChange}
          className={errors.phone && "error-input"}
        />
        {errors.phone && <p className="error-text">{errors.phone}</p>}
        </div>
       <h2>Payment</h2>

<div className="payment-container">

  <div className="payment-option">
    <span>Razorpay Secure (UPI, Cards)</span>
    <input
      type="radio"
      name="payment"
      checked={paymentMethod === "ONLINE"}
      onChange={() => setPaymentMethod("ONLINE")}
    />
  </div>

  <div className="payment-option">
    <span>Cash on Delivery</span>
    <input
      type="radio"
      name="payment"
      checked={paymentMethod === "COD"}
      onChange={() => setPaymentMethod("COD")}
    />
  </div>

</div>

        

      </div>

      {/* RIGHT SIDE SUMMARY */}
      <div className="checkout-right">

        {cart.map(item => (
          <div key={item._id} className="summary-item">
            <img src={item.image} alt="" />
            <div>
              <p>{item.name}</p>
              <small>Qty: {item.qty}</small>
            </div>
            <span>₹{item.price * item.qty}</span>
          </div>
        ))}

        <hr />

        <div className="summary-total">
          <h3>Total</h3>
          <h3>₹{total}</h3>
        </div>
          <button className="pay-btn" onClick={handlePlaceOrder}>
          Pay Now
        </button>
      </div>
    </div>
  );
}