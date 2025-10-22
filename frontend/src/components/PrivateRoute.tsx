import { Navigate } from "react-router-dom";
import { useAuth } from "@context/AuthContext";

interface PrivateRouteProps {
  children: JSX.Element;
  adminOnly?: boolean;
}

export default function PrivateRoute({ children, adminOnly = false }: PrivateRouteProps) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && !user.is_admin) return <Navigate to="/" replace />;

  return children;
}
