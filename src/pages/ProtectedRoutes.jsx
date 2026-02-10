import { Navigate } from "react-router-dom";

export default function ProtectedRoutes({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/" />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />; //replace means User cannot go back to login/register page using back button.
  }

  return children;
}
