import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";
import Dashboard from "../pages/Dashboard";
import OrdersList from "../pages/orders/OrdersList";
import OrderTracking from "../pages/orders/OrderTracking";
import Drivers from "../pages/drivers/DriversList";
import Customers from "../pages/Customers";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="orders" element={<OrdersList />} />
          <Route path="orders/:id" element={<OrderTracking />} />
          <Route path="/drivers" element={<Drivers />} />
          <Route path="customers" element={<Customers />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}