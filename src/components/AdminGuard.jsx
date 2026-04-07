import { Navigate } from "react-router-dom";
import { isAdminAuthenticated } from "@/pages/AdminLogin";

export default function AdminGuard({ children }) {
  if (!isAdminAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}
