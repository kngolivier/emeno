// FILE: src/routes/AppRoutes.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// Composant PWA Updater
import PwaUpdater from "../components/pwa/PwaUpdater"; // Assure-toi de créer ce composant (code fourni précédemment)

// Layouts et Pages
import LandingPage from "../pages/LandingPage";
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
import ClientHome from "../pages/client-portal/ClientHome";
import NotificationsPage from "../pages/Notifications";
import PartnersList from "../pages/partners/PartnersList";
import PartnerDetails from "../pages/partners/PartnerDetails";
import PartnerDashboard from "../pages/partner-portal/PartnerDashboard";
import PartnerLayout from "../layout/PartnerLayout";
import PartnerOrdersList from "../pages/partner-portal/PartnerOrdersList";
import PartnerSettings from "../pages/partner-portal/PartnerSettings";
import PartnerCreateOrder from "../pages/partner-portal/PartnerCreateOrder";
import PartnersPage from "../pages/PartnersPage";
import PartnerHome from "../pages/partner-portal/PartnerHome";
import PartnerCatalog from "../pages/partner-portal/PartnerCatalog";
import AuditLogs from "../pages/audit/AuditLogs";
import PromotionsList from "../pages/promotions/PromotionsList";
import PromotionDetails from "../pages/promotions/PromotionDetails";
import ClientPromotionDetails from "../pages/client-promo/ClientPromotionDetails";
import ServicePublicDetails from "../pages/ServicePublicDetails";
import ServicesList from "../pages/services/ServicesList";
import ServiceDetails from "../pages/services/ServiceDetails";
import CGUPage from "../pages/CGUPage";
import PrivacyPage from "../pages/PrivacyPage";
import SupportPage from "../pages/SupportPage";
import TrackingPage from "../pages/TrackingPage";
import FAQPage from "../pages/FAQPage";
import SettingsPage from "../pages/companySettings/SettingsPage";

export default function AppRoutes() {
  // const { user } = useAuth();

  return (
    <BrowserRouter>
      {/* 💡 Placé ici pour écouter l'état du Service Worker globalement sur l'ensemble du cycle de vie du site */}
      <PwaUpdater />
      
      <Routes>
        {/* ===================== */}
        {/* ZONE PUBLIQUE (SITE) */}
        {/* ===================== */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/tarifs" element={<PricingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/partenaires" element={<PartnersPage />} />
        <Route path="/services/details/:id" element={<ServicePublicDetails />} />
        <Route path="/legal/cgu" element={<CGUPage />} />
        <Route path="/legal/confidentialite" element={<PrivacyPage />} />
        <Route path="/help" element={<SupportPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/tracking" element={<TrackingPage />} />

        {/* ===================== */}
        {/* AUTH (PUBLIC ONLY)  */}
        {/* ===================== */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
        </Route>
        
        {/* Route accessible pour changer le mot de passe */}
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />

        {/* ===================== */}
        {/* ESPACE ADMIN (/admin) */}
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
          <Route path="communes" element={<CommuneList />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="partners" element={<PartnersList />} />
          <Route path="partners/:id" element={<PartnerDetails />} />
          <Route path="promotions" element={<PromotionsList />} />
          <Route path="promotions/:id" element={<PromotionDetails />} />
          <Route path="services" element={<ServicesList />} />
          <Route path="services/:id" element={<ServiceDetails />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* ===================== */}
        {/* ESPACE SUPER ADMIN (/admin) */}
        {/* ===================== */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="admins" element={<AdminList />} />
          <Route path="admins/:id" element={<AdminDetails />} />
          <Route path="audit-logs" element={<AuditLogs />} /> 
        </Route>
        {/* ===================== */}
        {/* ESPACE CLIENT (/client) */}
        {/* ===================== */}
        <Route
          path="/client"
          element={
            <ProtectedRoute allowedRoles={["CLIENT"]}>
              <ClientLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ClientHome />} />
          {/* <Route path="dashboard" element={<ClientDashboard />} /> */}
          <Route path="orders" element={<ClientOrders />} />
          <Route path="orders/:id" element={<ClientOrderDetails />} />
          <Route path="profile" element={<ClientProfile />} />
          <Route path="new-order" element={<ClientCreateOrder />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="promotions/detail/:id" element={<ClientPromotionDetails />} />
        </Route>

        {/* ===================== */}
        {/* ESPACE PARTENAIRE (/partner) */}
        {/* ===================== */}
        <Route
          path="/partner"
          element={
            <ProtectedRoute allowedRoles={["PARTNER_MANAGER"]}>
              <PartnerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<PartnerHome />} />
          <Route path="dashboard" element={<PartnerDashboard />} />
          <Route path="orders" element={<PartnerOrdersList />} />
          <Route path="settings" element={<PartnerSettings />} />
          <Route path="orders/new" element={<PartnerCreateOrder />} />
          <Route path="catalog" element={<PartnerCatalog />} />
          <Route path="notifications" element={<NotificationsPage />} />
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
            <Route path="profile" element={<DriverProfile />} />
            <Route path="map" element={<DriverMap />} />
            <Route path="notifications" element={<NotificationsPage />} />
        </Route>

        {/* ===================== */}
        {/* AUTRES / FALLBACKS  */}
        {/* ===================== */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        
        {/* Redirection intelligente : si user tape n'importe quoi */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}