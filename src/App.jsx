// FILE: src/App.jsx

import AppRoutes from "./routes/AppRoutes";
import AuthProvider from "./context/AuthProvider";
import { NotificationProvider } from "./context/Notifications/NotificationProvider";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppRoutes />

        {/* GLOBAL TOASTER (notifications) */}
        <Toaster position="top-right" />
      </NotificationProvider>
    </AuthProvider>
  );
}