import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const token = localStorage.getItem("token");

  // ✅ FETCH CART FROM DATABASE
  const fetchCart = async () => {
    try {
      setLoading(true);
      if (!token) {
        setCart([]);
        return;
      }

      const res = await api.get("/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Handle both possible response structures
      const cartData = res.data?.items || res.data || [];
      setCart(cartData);

    } catch (error) {
      console.error("FETCH CART ERROR:", error);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch cart when token changes or on mount
  useEffect(() => {
    fetchCart();
  }, [token]);

  // ✅ ADD TO CART (DB)
  const addToCart = async (product) => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      setLoading(true);
      await api.post(
        "/cart/add",
        { productId: product._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchCart();
      setIsOpen(true);

    } catch (error) {
      console.error("ADD CART ERROR:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ✅ INCREASE QUANTITY
  const increaseQuantity = async (productId) => {
    try {
      setLoading(true);
      await api.post(
        "/cart/increase",
        { productId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      await fetchCart();
    } catch (error) {
      console.error("INCREASE ERROR:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ✅ DECREASE QUANTITY
  const decreaseQuantity = async (productId) => {
    try {
      setLoading(true);
      await api.post(
        "/cart/decrease",
        { productId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      await fetchCart();
    } catch (error) {
      console.error("DECREASE ERROR:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ✅ REMOVE ITEM
  const removeItem = async (productId) => {
    try {
      setLoading(true);
      await api.delete(`/cart/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchCart();
    } catch (error) {
      console.error("REMOVE CART ERROR:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ✅ CLEAR CART - UPDATED VERSION
  const clearCart = async () => {
    try {
      setLoading(true);
      
      // Use the dedicated clear cart endpoint
      await api.delete("/cart/clear/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Clear local cart state immediately
      setCart([]);
      
      // Optional: Show success message
      // message.success("Cart cleared successfully");
      
    } catch (error) {
      console.error("CLEAR CART ERROR:", error);
      
      // Fallback: If clear endpoint fails, try removing items one by one
      if (cart.length > 0) {
        try {
          for (const item of cart) {
            const productId = item.product?._id || item.product || item._id;
            if (productId) {
              await api.delete(`/cart/${productId}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
            }
          }
          setCart([]);
        } catch (fallbackError) {
          console.error("FALLBACK CLEAR ERROR:", fallbackError);
          throw fallbackError;
        }
      } else {
        throw error;
      }
    } finally {
      setLoading(false);
    }
  };

  // Calculate total with proper structure handling
  const total = cart.reduce(
    (acc, item) => {
      const price = item.product?.price || item.price || 0;
      const quantity = item.qty || 1;
      return acc + (price * quantity);
    },
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        total,
        loading,
        fetchCart,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeItem,
        clearCart,  // ✅ EXPORT UPDATED clearCart
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};