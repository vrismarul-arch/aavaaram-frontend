import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import AppRoutes from "./routes/routes";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { AdminProvider } from "./context/AdminContext";
import { UserProvider } from "./context/UserContext";

export default function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <CartProvider>
        <WishlistProvider>
          
          <UserProvider>
            <AdminProvider>
              <BrowserRouter>
                <AppRoutes />
              </BrowserRouter>
            </AdminProvider>
          </UserProvider>
        </WishlistProvider>
      </CartProvider>
    </GoogleOAuthProvider>
  );
}
