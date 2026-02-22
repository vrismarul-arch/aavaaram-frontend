import { createContext, useContext, useState, useEffect } from "react";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem("wishlist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // 🔥 Toggle Add / Remove
  const toggleWishlist = (product) => {
    if (!product || !product._id) return;

    setWishlist((prev) => {
      const exists = prev.some(item => item._id === product._id);

      if (exists) {
        return prev.filter(item => item._id !== product._id);
      } else {
        return [...prev, product];
      }
    });
  };

  // Remove explicitly
  const removeFromWishlist = (id) => {
    setWishlist((prev) =>
      prev.filter(item => item._id !== id)
    );
  };

  // Check if exists
  const isInWishlist = (id) => {
    return wishlist.some(item => item._id === id);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        toggleWishlist,
        removeFromWishlist,
        isInWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);