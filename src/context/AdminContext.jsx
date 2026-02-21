import { createContext, useContext, useState, useEffect } from "react";

const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [adminToken, setAdminToken] = useState(
    localStorage.getItem("adminToken") || null
  );

  useEffect(() => {
    if (adminToken) {
      localStorage.setItem("adminToken", adminToken);
    } else {
      localStorage.removeItem("adminToken");
    }
  }, [adminToken]);

  const login = (token) => {
    setAdminToken(token);
  };

  const logout = () => {
    setAdminToken(null);
  };

  const isLoggedIn = !!adminToken;

  return (
    <AdminContext.Provider
      value={{
        adminToken,
        login,
        logout,
        isLoggedIn
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);