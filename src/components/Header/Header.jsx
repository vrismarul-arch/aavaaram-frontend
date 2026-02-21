import { useEffect, useState, useRef } from "react";
import {
  FiSearch,
  FiUser,
  FiHeart,
  FiShoppingCart,
  FiMenu,
  FiX
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAdmin } from "../../context/AdminContext";

import "./Header.css";

export default function Header() {

  const navigate = useNavigate();
  const dropdownRef = useRef();

  const { cart, openCart } = useCart();
  const { wishlist } = useWishlist();
  const { adminToken, logout } = useAdmin();

  const API = import.meta.env.VITE_API_URL;

  const texts = [
    "🎉 Welcome Offer Coupon Code : WELCOME10",
    "🚚 Free Shipping on Orders Above ₹999",
  ];

  const [textIndex, setTextIndex] = useState(0);
  const [categories, setCategories] = useState([]);
  const [showShop, setShowShop] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  /* 🔥 Fetch categories */
  useEffect(() => {
    fetch(`${API}/api/categories`)
      .then(res => res.json())
      .then(setCategories)
      .catch(err => console.error(err));

    const timer = setInterval(() => {
      setTextIndex(i => (i + 1) % texts.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  /* 🔥 Close dropdown on outside click */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* TOP BAR */}
      <div className="top-bar">{texts[textIndex]}</div>

      <header className="main-header">

        {/* LOGO */}
        <div className="logo" onClick={() => navigate("/")}>
          <img src="/logo/logo.png" alt="logo" />
        </div>

        {/* DESKTOP MENU */}
        <nav className="menu desktop-menu">
          <span onClick={() => navigate("/")}>Home</span>
          <span onClick={() => navigate("/about")}>About Us</span>

          <div
            className="shop-menu"
            onMouseEnter={() => setShowShop(true)}
            onMouseLeave={() => setShowShop(false)}
          >
            <span>Shop ▾</span>

            {showShop && (
              <div className="shop-dropdown">
                {categories.map(cat => (
                  <p
                    key={cat._id}
                    onClick={() => navigate(`/category/${cat._id}`)}
                  >
                    {cat.name}
                  </p>
                ))}
              </div>
            )}
          </div>

          <span>B2B</span>
          <span>Blog</span>
          <span>Contact</span>
        </nav>

        {/* ICONS */}
        <div className="icons">

          {/* SEARCH */}
          <FiSearch
            className="icon"
            onClick={() => navigate("/search")}
          />

          {/* ADMIN PROFILE */}
          <div
            className="profile-wrapper"
            ref={dropdownRef}
          >
            <FiUser
              className="icon"
              onClick={() => {
                if (!adminToken) {
                  navigate("/admin-login");
                } else {
                  setShowProfile(!showProfile);
                }
              }}
            />

            {adminToken && showProfile && (
              <div className="profile-dropdown">
                <p
                  onClick={() => {
                    navigate("/admin/dashboard");
                    setShowProfile(false);
                  }}
                >
                  Dashboard
                </p>

                <p
                  className="logout"
                  onClick={() => {
                    logout();
                    setShowProfile(false);
                    navigate("/");
                  }}
                >
                  Logout
                </p>
              </div>
            )}
          </div>

          {/* WISHLIST */}
          <div
            className="icon-badge"
            onClick={() => navigate("/wishlist")}
          >
            <FiHeart />
            {wishlist.length > 0 && (
              <span>{wishlist.length}</span>
            )}
          </div>

          {/* CART */}
          <div
            className="icon-badge"
            onClick={openCart}
          >
            <FiShoppingCart />
            {cart.length > 0 && (
              <span>{cart.length}</span>
            )}
          </div>

          {/* MOBILE MENU */}
          <span
            className="menu-icon"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            {mobileMenu ? <FiX /> : <FiMenu />}
          </span>
        </div>
      </header>

      {/* MOBILE MENU */}
      {mobileMenu && (
        <div className="mobile-menu">
          <p onClick={() => navigate("/")}>Home</p>
          <p onClick={() => navigate("/about")}>About Us</p>
          <p onClick={() => navigate("/shop")}>Shop</p>
          <p>B2B</p>
          <p>Blog</p>
          <p>Contact</p>
        </div>
      )}
    </>
  );
}