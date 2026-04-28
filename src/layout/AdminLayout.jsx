import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* SIDEBAR FIXE */}
      <div className="fixed top-0 left-0 h-screen w-72 z-50">
        <Sidebar />
      </div>

      {/* CONTENU AVEC MARGE POUR LA SIDEBAR */}
      <div className="flex flex-col min-h-screen ml-72">
        <Header />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}