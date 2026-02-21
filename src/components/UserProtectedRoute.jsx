import { Navigate } from "react-router-dom";
import { useUser } from "../context/AuthContext";

export default function UserProtectedRoute({ children }) {

  const { userToken } = useUser();

  if (!userToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
}