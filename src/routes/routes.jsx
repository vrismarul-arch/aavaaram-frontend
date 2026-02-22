import { Routes, Route } from "react-router-dom";

/* USER */
import Home from "../pages/Home/Home";
import CategoryPage from "../pages/CategoryPage/CategoryPage";
import BestSellersPage from "../pages/BestSellers/BestSellersPage";
import CollectionPage from "../pages/Collection/CollectionPage";
import WishlistPage from "../pages/Wishlist/WishlistPage";
import ProductDetails from "../pages/ProductDetails/ProductDetails";
import CartPage from "../pages/Cart/Cart";
import Checkout from "../pages/Checkout/Checkout";
import PaymentPage from "../pages/PaymentPage";       // ✅ ADD
import Success from "../pages/Success";               // ✅ ADD
import MyOrders from "../pages/MyOrders/MyOrders";

/* ADMIN */
import AdminLayout from "../admin/AdminLayout";
import AdminDashboard from "../pages/Admin/Dashboard";
import CategoryUpload from "../pages/Admin/CategoryUpload";
import ProductUpload from "../pages/Admin/ProductUpload";
import BannerUpload from "../pages/Admin/BannerUpload";
import CollectionUpload from "../pages/Admin/CollectionUpload";
import Bookings from "../pages/Admin/Bookings";
import Profile from "../pages/Admin/Profile";
import AdminLogin from "../pages/Admin/AdminLogin";
import AdminOrders from "../admin/AdminOrders";       // ✅ ADD

/* AUTH */
import Register from "../pages/User/Register";
import Login from "../pages/User/Login";

/* PROTECTED */
import ProtectedRoute from "../components/ProtectedRoute";

/* LAYOUT */
import UserLayout from "../layouts/UserLayout";
import AboutUs from "../components/AboutUs/AboutUs";

export default function AppRoutes() {
  return (
    <Routes>

      {/* ================= USER LAYOUT ================= */}
      <Route element={<UserLayout />}>

        <Route path="/" element={<Home />} />
        <Route path="/category/:id" element={<CategoryPage />} />
        <Route path="/best-sellers" element={<BestSellersPage />} />
        <Route path="/collection/:id" element={<CollectionPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment" element={<PaymentPage />} />     {/* ✅ ADD */}
        <Route path="/success" element={<Success />} />         {/* ✅ ADD */}
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/about" element={<AboutUs />} />

      </Route>

      {/* ================= ADMIN LOGIN ================= */}
      <Route path="/admin-login" element={<AdminLogin />} />

      {/* ================= AUTH ================= */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ================= ADMIN PROTECTED ================= */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="banner" element={<BannerUpload />} />
        <Route path="categories" element={<CategoryUpload />} />
        <Route path="products" element={<ProductUpload />} />
        <Route path="shop" element={<CollectionUpload />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="profile" element={<Profile />} />
        <Route path="orders" element={<AdminOrders />} /> {/* ✅ ADD */}
      </Route>

    </Routes>
  );
}