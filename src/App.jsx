import AppRoutes from "./routes/AppRoutes";
import AuthProvider from "./context/AuthProvider";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />

      {/* GLOBAL TOASTER (notifications) */}
      <Toaster position="top-right" />
    </AuthProvider>
  );
}