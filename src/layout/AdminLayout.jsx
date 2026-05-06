// FILE: src/layout/AdminLayout.jsx

import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function AdminLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">
      {/* On passe isOpen et la fonction de fermeture */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-h-screen relative overflow-y-auto">
        {/* On passe la fonction d'ouverture au Header */}
        <Header toggleSidebar={() => setSidebarOpen(true)} />
        
        <main className="p-4 lg:p-8 max-w-[1600px] mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}