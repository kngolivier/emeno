// FILE: src/layout/AdminLayout.jsx

import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function AdminLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    // bg-main-app applique les gradients radiaux définis dans index.css
    <div className="min-h-screen bg-main-app flex transition-colors duration-300">
      
      {/* Sidebar : Adaptée au thème via ses propres classes dark: */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-h-screen relative overflow-y-auto ml-72">
        {/* Header : Contient le toggle de thème */}
        <Header toggleSidebar={() => setSidebarOpen(true)} />
        
        {/* Main Content : Max-width pour le confort visuel sur grand écran */}
        <main className="p-4 lg:p-8 max-w-[1600px] mx-auto w-full relative z-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}