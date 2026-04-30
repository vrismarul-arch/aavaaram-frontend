import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  // ✅ FETCH WISHLIST
  const fetchWishlist = async () => {
    if (!token) {
      setWishlist([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/wishlist", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Handle different response structures
      const wishlistData = res.data?.wishlist || res.data;
      setWishlist(wishlistData?.products || wishlistData?.items || []);
    } catch (error) {
      console.error("FETCH WISHLIST ERROR:", error);
      setError(error.message);
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [token]);

  // ✅ TOGGLE WISHLIST (Add/Remove)
  const toggleWishlist = async (product) => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      setLoading(true);
      const res = await api.post(
        "/wishlist/toggle",
        { productId: product._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update local state based on response
      if (res.data?.wishlist) {
        setWishlist(res.data.wishlist.products || []);
      } else {
        await fetchWishlist();
      }
    } catch (error) {
      console.error("TOGGLE WISHLIST ERROR:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ ADD TO WISHLIST
  const addToWishlist = async (product) => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      setLoading(true);
      const res = await api.post(
        "/wishlist/add",
        { productId: product._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data?.wishlist) {
        setWishlist(res.data.wishlist.products || []);
      } else {
        await fetchWishlist();
      }
    } catch (error) {
      console.error("ADD TO WISHLIST ERROR:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ REMOVE FROM WISHLIST
  const removeFromWishlist = async (productId) => {
    if (!token) return;

    try {
      setLoading(true);
      const res = await api.delete(`/wishlist/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data?.wishlist) {
        setWishlist(res.data.wishlist.products || []);
      } else {
        await fetchWishlist();
      }
    } catch (error) {
      console.error("REMOVE FROM WISHLIST ERROR:", error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ✅ CLEAR WISHLIST
  const clearWishlist = async () => {
    if (!token) return;

    try {
      setLoading(true);
      await api.delete("/wishlist/clear/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setWishlist([]);
    } catch (error) {
      console.error("CLEAR WISHLIST ERROR:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ CHECK IF PRODUCT IS IN WISHLIST
  const isInWishlist = (id) => {
    return wishlist.some((item) => item._id === id);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        error,
        toggleWishlist,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        isInWishlist,
        fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);