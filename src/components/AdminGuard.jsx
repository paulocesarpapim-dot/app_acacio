import { Navigate } from "react-router-dom";
import { isAdminAuthenticated } from "@/lib/admin-session";

export default function AdminGuard({ children }) {
  if (!isAdminAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
}
