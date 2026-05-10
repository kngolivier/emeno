// FILE: src/routes/AppRoutes.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// Layouts et Pages
import LandingPage from "../pages/LandingPage"; // À créer
import AdminLayout from "../layout/AdminLayout";
import ClientLayout from "../layout/ClientLayout";
import Login from "../pages/auth/Login";
import ChangePassword from "../pages/auth/ChangePassword";
import Unauthorized from "../pages/Unauthorized";

// Admin Pages
import AdminDashboard from "../pages/dashbaord/AdminDashboard";
import OrdersList from "../pages/orders/OrdersList";
import OrderTracking from "../pages/orders/OrderTracking";
import Drivers from "../pages/drivers/DriversList";
import ClientsList from "../pages/clients/ClientsList";
import ClientDetails from "../pages/clients/ClientDetails";
import DriverDetails from "../pages/drivers/DriverDetails";
import PricingList from "../pages/pricing/PricingList";
import AdminList from "../pages/admins/AdminList";
import AdminDetails from "../pages/admins/AdminDetails";

// Client Pages
import ClientDashboard from "../pages/client-portal/ClientDashboard";
import ClientOrders from "../pages/client-portal/ClientOrders";
import ClientOrderDetails from "../pages/client-portal/ClientOrderDetails";
import ClientProfile from "../pages/client-portal/ClientProfile";
import ClientCreateOrder from "../pages/client-portal/ClientCreateOrder";

// Guards
import ProtectedRoute from "./ProtectedRoutes";
import PublicRoute from "./PublicRoute";
import PricingPage from "../pages/PricingPages";
import RegisterPage from "../pages/auth/RegisterPage";
import DriverLayout from "../layout/DriverLayout";
import DriverDashboard from "../pages/driver-portal/DriverDashboard";
import DriverDeliveries from "../pages/driver-portal/DriverDeliveries";
// import DeliveryDetail from "../pages/driver-portal/DeliveryDetail";
import DriverProfile from "../pages/driver-portal/DriverProfile";
import DriverMap from "../pages/driver-portal/DriverMap";
import CommuneList from "../pages/communes/CommuneList";
import VerifyOTP from "../pages/auth/VerifyOtp";

export default function AppRoutes() {
  // const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* ===================== */}
        {/*   ZONE PUBLIQUE (SITE) */}
        {/* ===================== */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/tarifs" element={<PricingPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* ===================== */}
        {/*   AUTH (PUBLIC ONLY)  */}
        {/* ===================== */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
        </Route>
        
        {/* Route accessible pour changer le mot de passe (souvent via lien mail) */}
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />

        {/* ===================== */}
        {/*   ESPACE ADMIN (/admin) */}
        {/* ===================== */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="deliveries" element={<OrdersList />} />
          <Route path="deliveries/:id" element={<OrderTracking />} />
          <Route path="drivers" element={<Drivers />} />
          <Route path="drivers/:id" element={<DriverDetails />} />
          <Route path="clients" element={<ClientsList />} />
          <Route path="clients/client-details/:id" element={<ClientDetails />} />
          <Route path="pricing" element={<PricingList />} />
          <Route path="admins" element={<AdminList />} />
          <Route path="admins/:id" element={<AdminDetails />} />
          <Route path="communes" element={<CommuneList />} />
        </Route>

        {/* ===================== */}
        {/*   ESPACE CLIENT (/client) */}
        {/* ===================== */}
        <Route
          path="/client"
          element={
            <ProtectedRoute allowedRoles={["CLIENT"]}>
              <ClientLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ClientDashboard />} />
          <Route path="orders" element={<ClientOrders />} />
          <Route path="orders/:id" element={<ClientOrderDetails />} />
          <Route path="profile" element={<ClientProfile />} />
          <Route path="new-order" element={<ClientCreateOrder />} />
        </Route>

        {/* ESPACE LIVREUR (/driver) */}
        <Route path="/driver" element={
            <ProtectedRoute allowedRoles={["DRIVER"]}>
              <DriverLayout />
            </ProtectedRoute>
            }
          >
            <Route index element={<DriverDashboard />} />
            <Route path="deliveries" element={<DriverDeliveries />} />
            {/* <Route path="deliveries/:id" element={<DeliveryDetail />} /> */}
            <Route path="profile" element={<DriverProfile />} />
            <Route path="map" element={<DriverMap />} />
          </Route>

        {/* ===================== */}
        {/*   AUTRES / FALLBACKS  */}
        {/* ===================== */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        
        {/* Redirection intelligente : si user tape n'importe quoi */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}