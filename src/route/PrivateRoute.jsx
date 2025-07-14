// src/routes/PrivateRoute.jsx
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children, user, allowedRoles }) {
  if (!user) return <Navigate to="/admin/login" />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/unauthorized" />;
  return children;
}
