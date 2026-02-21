import { Navigate } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";

export default function ProtectedRoute({ children }) {
  const { adminToken } = useAdmin();

  if (!adminToken) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
}