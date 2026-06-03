// FILE: src/App.jsx

import AppRoutes from "./routes/AppRoutes";
import AuthProvider from "./context/AuthProvider";
import { NotificationProvider } from "./context/Notifications/NotificationProvider";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./context/Theme/ThemeProvider";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <AppRoutes />

          {/* GLOBAL TOASTER (notifications) */}
          <Toaster position="bottom-right" />
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}