// FILE: src/routes/PublicRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return null; // Ou un spinner de chargement élégant

  // Si l'utilisateur est connecté, on le redirige selon son rôle
  if (user) {
    if (user.status === "PENDING") return <Navigate to="/verify-otp" replace/>
    if(user.mustChangePassword) return <Navigate to="/change-password" replace />

    if (["ADMIN", "SUPER_ADMIN"].includes(user.role)) return <Navigate to="/admin" replace />;
    if (user.role === "CLIENT") return <Navigate to="/client" replace />;
    if (user.role === "DRIVER") return <Navigate to="/driver" replace />
    if (user.role === "PARTNER_MANAGER") return <Navigate to="/partner/dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  // Si non connecté, on affiche la page demandée (Login/Register)
  return <Outlet />;
};

export default PublicRoute;