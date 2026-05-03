// FILE: src/routes/AppRoutes.jsx

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "../layout/AdminLayout";
import AdminDashboard from "../pages/dashbaord/AdminDashboard";
import OrdersList from "../pages/orders/OrdersList";
import OrderTracking from "../pages/orders/OrderTracking";
import Drivers from "../pages/drivers/DriversList";
import ClientsList from "../pages/clients/ClientsList";
import Login from "../pages/auth/Login";
import ChangePassword from "../pages/auth/ChangePassword";
import ClientDetails from "../pages/clients/ClientDetails";


import ProtectedRoute from "./ProtectedRoutes";
import DriverDetails from "../pages/drivers/DriverDetails";
import PricingList from "../pages/pricing/PricingList";
import AdminList from "../pages/admins/AdminList";
import AdminDetails from "../pages/admins/AdminDetails";
import Unauthorized from "../pages/Unauthorized";
import ClientLayout from "../layout/ClientLayout";
import ClientDashboard from "../pages/client-portal/ClientDashboard";
import ClientOrders from "../pages/client-portal/ClientOrders";
import ClientOrderDetails from "../pages/client-portal/ClientOrderDetails";
import ClientProfile from "../pages/client-portal/ClientProfile";
import ClientCreateOrder from "../pages/client-portal/ClientCreateOrder";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ===================== */}
        {/* PUBLIC ROUTES */}
        {/* ===================== */}
        <Route path="/login" element={<Login />} />
        <Route path="/change-password" element={<ChangePassword />} />

        {/* ===================== */}
        {/* PROTECTED ROUTES ADMIN*/}
        {/* ===================== */}
        <Route
          path="/"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="deliveries" element={<OrdersList />} />
          <Route path="deliveries/:id" element={<OrderTracking />} />
          <Route path="drivers" element={<Drivers />} />
          <Route path="clients" element={<ClientsList />} />
          <Route path="clients/client-details/:id" element={<ClientDetails />} />
          <Route path="/drivers/:id" element={<DriverDetails />} />
          <Route path="pricing" element={<PricingList />} />
          <Route path="admins" element={<AdminList />} />
          <Route path="admins/:id" element={<AdminDetails />} />
        </Route>

        {/* ===================== */}
        {/* PROTECTED ROUTES CLIENT */}
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

        {/* fallback */}
        <Route path="*" element={<Navigate to="/login" />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/driver" element={<div>Driver Dashboard</div>} />
      </Routes>
    </BrowserRouter>
  );
}