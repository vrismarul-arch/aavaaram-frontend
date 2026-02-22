import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import "./CartDrawer.css";

export default function CartDrawer() {
  const {
    cart,
    increase,
    decrease,
    removeItem,
    total,
    isOpen,
    closeCart,
  } = useCart();

  const navigate = useNavigate();

  if (!isOpen) return null;

  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);

  return (
    <div className="drawer-overlay" onClick={closeCart}>
      <div
        className="drawer"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
       <div className="drawer-header">
  <h3>Cart ({cart.length})</h3>
  <button className="close-btn" onClick={closeCart}>✕</button>
</div>

        {cart.length === 0 ? (
          <p className="empty">Cart is empty</p>
        ) : (
          <>
            {/* ITEMS */}
            <div className="drawer-items">
              {cart.map((item) => (
                <div key={item._id} className="drawer-item">

                  <img src={item.image} alt={item.name} />

                  <div className="item-info">
                    <h4>{item.name}</h4>

                    <p className="item-price">
                      ₹ {item.price} x {item.qty}
                    </p>

                    <div className="qty">
                      <button onClick={() => decrease(item._id)}>-</button>
                      <span>{item.qty}</span>
                      <button onClick={() => increase(item._id)}>+</button>
                    </div>
                  </div>

                  <button
                    className="remove"
                    onClick={() => removeItem(item._id)}
                  >
                    Remove
                  </button>

                </div>
              ))}
            </div>

            {/* FOOTER */}
            <div className="drawer-footer">
              <div className="total-row">
                <span>Total:</span>
                <span className="total-amount">
                  Rs. {total}
                </span>
              </div>

              <button
                className="checkout"
                onClick={() => {
                  closeCart();
                  navigate("/checkout");
                }}
              >
                Check Out
              </button>

              <button
                className="view-cart-btn"
                onClick={() => {
                  closeCart();
                  navigate("/cart");
                }}
              >
                View Cart
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}