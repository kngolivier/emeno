// src/layout/ClientLayout.jsx

import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/client-home/Footer";

export default function ClientLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-h-screen relative overflow-y-auto ml-72">
        {/* Header */}
        <Header toggleSidebar={() => setSidebarOpen(true)} />
        
        {/* Contenu principal : flex-grow permet de pousser le footer vers le bas */}
        <main className="flex-grow p-4 lg:p-8 max-w-[1600px] mx-auto w-full text-slate-900 dark:text-slate-100 transition-colors">
          <Outlet />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}