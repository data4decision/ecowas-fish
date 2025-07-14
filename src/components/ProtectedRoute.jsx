// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ user, expectedRole, children, redirectPath = "/" }) {
  if (!user) return <Navigate to={redirectPath} />;
  if (expectedRole && user.role !== expectedRole) return <Navigate to={redirectPath} />;

  return children;
}
