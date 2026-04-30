import { useEffect, useState, useRef } from "react";
import {
  FiSearch,
  FiUser,
  FiHeart,
  FiShoppingCart,
  FiMenu,
  FiX,
  FiChevronDown,
  FiLogOut,
  FiShoppingBag,
  FiSettings,
  FiHelpCircle,
  FiUserCheck,
  FiLogIn
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAdmin } from "../../context/AdminContext";

import "./Header.css";

export default function Header() {
  const navigate = useNavigate();
  const dropdownRef = useRef();
  const searchRef = useRef();

  const { cart, openCart } = useCart();
  const { wishlist } = useWishlist();
  const { adminToken, logout } = useAdmin();

  const [userToken, setUserToken] = useState(localStorage.getItem("token"));
  const [userData, setUserData] = useState(null);

  const texts = [
    "🎉 Welcome Offer Coupon Code : WELCOME10",
    "🚚 Free Shipping on Orders Above ₹999",
    "✨ New Arrivals Every Week!",
    "💳 Easy Returns & Exchanges"
  ];

  const [textIndex, setTextIndex] = useState(0);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [mobileMenu, setMobileMenu] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const [cartAnimation, setCartAnimation] = useState(false);

  const API = import.meta.env.VITE_API_URL;

  // Load user data
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    setUserToken(token);
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        setUserData(parsedUser);
      } catch (e) {
        console.error("Error parsing user data", e);
      }
    }
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch categories + products
  useEffect(() => {
    fetch(`${API}/api/categories`)
      .then(res => res.json())
      .then(setCategories)
      .catch(err => console.error(err));

    fetch(`${API}/api/products`)
      .then(res => res.json())
      .then(setProducts)
      .catch(err => console.error(err));

    const timer = setInterval(() => {
      setTextIndex(i => (i + 1) % texts.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  // Search filter
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFiltered([]);
      return;
    }
    const result = products.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFiltered(result.slice(0, 6));
  }, [searchQuery, products]);

  // Cart animation
  useEffect(() => {
    if (cart.length > 0) {
      setCartAnimation(true);
      setTimeout(() => setCartAnimation(false), 300);
    }
  }, [cart.length]);

  // Outside click close (only for profile + search)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfile(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/search?q=${searchQuery}`);
      setShowSearch(false);
      setSearchQuery("");
      setFiltered([]);
    }
  };

  const handleUserLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    setUserToken(null);
    setUserData(null);
    navigate("/");
  };

  const getAvatarUrl = () => {
    if (userData?.avatar) return userData.avatar;
    if (userData?.picture) return userData.picture;
    return null;
  };

  const avatarUrl = getAvatarUrl();

  return (
    <>
      <div className={`top-bar ${scrolled ? "hidden" : ""}`}>
        <div className="top-bar-content">
          {texts[textIndex]}
        </div>
      </div>

      <header className={`main-header ${scrolled ? "scrolled" : ""}`}>
        {/* LOGO */}
        <div className="logo" onClick={() => navigate("/")}>
          <img src="/logo/logo.png" alt="Aavaram" />
        </div>

        {/* DESKTOP MENU */}
        <nav className="menu desktop-menu">
          <span onClick={() => navigate("/")}>Home</span>
          <span onClick={() => navigate("/about")}>About Us</span>

          {/* Pure CSS hover — no JS state needed */}
          <div className="shop-menu">
            <span>
              Shop <FiChevronDown className="dropdown-icon" />
            </span>

            {/* Always rendered — CSS drives visibility */}
            <div className="shop-dropdown">
              <div className="dropdown-grid">
                {categories.map(cat => (
                  <div
                    key={cat._id}
                    className="dropdown-item"
                    onClick={() => navigate(`/category/${cat._id}`)}
                  >
                    <img src={cat.image} alt={cat.name} />
                    <span>{cat.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <span onClick={() => navigate("/contact")}>Contact</span>
        </nav>

        {/* ICONS */}
        <div className="icons">
          {/* SEARCH */}
          <div className="search-wrapper" ref={searchRef}>
            <FiSearch
              className="icon"
              onClick={() => setShowSearch(!showSearch)}
            />
            {showSearch && (
              <div className="search-box">
                <form onSubmit={handleSearch}>
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                  <button type="submit">
                    <FiSearch />
                  </button>
                </form>
                {filtered.length > 0 && (
                  <div className="search-results">
                    {filtered.map(product => (
                      <div
                        key={product._id}
                        className="search-item"
                        onClick={() => {
                          navigate(`/product/${product._id}`);
                          setShowSearch(false);
                          setSearchQuery("");
                          setFiltered([]);
                        }}
                      >
                        <img src={product.image} alt={product.name} />
                        <div>
                          <p>{product.name}</p>
                          <span>₹{product.price?.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* PROFILE */}
          <div className="profile-wrapper" ref={dropdownRef}>
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Avatar"
                className="avatar-icon"
                onClick={() => setShowProfile(!showProfile)}
              />
            ) : (
              <FiUser
                className="icon"
                onClick={() => setShowProfile(!showProfile)}
              />
            )}

            {showProfile && (
              <div className="profile-dropdown">
                {!userToken ? (
                  <>
                    <div className="dropdown-header">
                      <div className="header-icon-wrapper">
                        <FiUserCheck className="header-icon" />
                      </div>
                      <div>
                        <h4>Welcome Guest</h4>
                        <p>Sign in to access your account</p>
                      </div>
                    </div>
                    <button
                      className="login-btn"
                      onClick={() => {
                        navigate("/login");
                        setShowProfile(false);
                      }}
                    >
                      <FiLogIn />
                      Sign In
                    </button>
                    <button
                      className="register-btn"
                      onClick={() => {
                        navigate("/register");
                        setShowProfile(false);
                      }}
                    >
                      Create Account
                    </button>
                  </>
                ) : (
                  <>
                    <div className="dropdown-header">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt={userData?.name}
                          className="dropdown-avatar"
                        />
                      ) : (
                        <div className="user-avatar">
                          {userData?.name?.charAt(0) || "U"}
                        </div>
                      )}
                      <div>
                        <h4>{userData?.name || "User"}</h4>
                        <p>{userData?.email}</p>
                      </div>
                    </div>

                    <div className="dropdown-divider"></div>

                    <div
                      className="dropdown-item-profile"
                      onClick={() => {
                        navigate("/profile");
                        setShowProfile(false);
                      }}
                    >
                      <FiUser />
                      <span>My Profile</span>
                    </div>

                    <div
                      className="dropdown-item-profile"
                      onClick={() => {
                        navigate("/user-history");
                        setShowProfile(false);
                      }}
                    >
                      <FiShoppingBag />
                      <span>My Orders</span>
                    </div>

                    <div className="dropdown-divider"></div>

                    <div
                      className="dropdown-item-profile logout"
                      onClick={handleUserLogout}
                    >
                      <FiLogOut />
                      <span>Logout</span>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* CART */}
          <div className={`icon-badge ${cartAnimation ? "bounce" : ""}`} onClick={openCart}>
            <FiShoppingCart />
            {cart.length > 0 && <span>{cart.length}</span>}
          </div>

          {/* MOBILE MENU TOGGLE */}
          <span className="menu-icon" onClick={() => setMobileMenu(!mobileMenu)}>
            {mobileMenu ? <FiX /> : <FiMenu />}
          </span>
        </div>
      </header>

      {/* MOBILE MENU */}
      {mobileMenu && (
        <div className="mobile-menu-overlay">
          <div className="mobile-menu">
            <div className="mobile-menu-header">
              <img src="/logo/logo.png" alt="logo" />
              <FiX onClick={() => {
                setMobileMenu(false);
                setMobileShopOpen(false);
              }} />
            </div>

            {!mobileShopOpen ? (
              <div className="mobile-menu-items">
                <div onClick={() => { navigate("/"); setMobileMenu(false); }}>
                  <FiUser />
                  <span>Home</span>
                </div>
                <div onClick={() => { navigate("/about"); setMobileMenu(false); }}>
                  <FiHelpCircle />
                  <span>About Us</span>
                </div>
                <div onClick={() => setMobileShopOpen(true)}>
                  <FiShoppingBag />
                  <span>Shop ▸</span>
                </div>
                <div onClick={() => { navigate("/contact"); setMobileMenu(false); }}>
                  <FiSettings />
                  <span>Contact</span>
                </div>
              </div>
            ) : (
              <div className="mobile-menu-items">
                <div onClick={() => setMobileShopOpen(false)}>
                  <FiChevronDown />
                  <span>◂ Back</span>
                </div>
                {categories.map(cat => (
                  <div
                    key={cat._id}
                    onClick={() => {
                      navigate(`/category/${cat._id}`);
                      setMobileMenu(false);
                      setMobileShopOpen(false);
                    }}
                  >
                    <img src={cat.image} alt={cat.name} />
                    <span>{cat.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}