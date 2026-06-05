// FILE: src/App.jsx

import AppRoutes from "./routes/AppRoutes";
import AuthProvider from "./context/AuthProvider";
import { NotificationProvider } from "./context/Notifications/NotificationProvider";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./context/Theme/ThemeProvider";
import PwaInstallButton from "./components/pwa/PwaInstallButton";
import { SettingsProvider } from "./context/Settings/SettingsProvider";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <SettingsProvider>
            <AppRoutes />

          </SettingsProvider>
          {/* GLOBAL TOASTER (notifications) */}
          <Toaster position="bottom-right" />
          <PwaInstallButton />
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}