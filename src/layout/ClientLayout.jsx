// src/layout/ClientLayout.jsx

import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function ClientLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
      {/* Sidebar avec gestion de l'état mobile */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-h-screen relative overflow-y-auto">
        {/* Barre de navigation supérieure */}
        <Header toggleSidebar={() => setSidebarOpen(true)} />
        
        {/* Zone de contenu principal */}
        <main className="p-4 lg:p-8 max-w-[1600px] mx-auto w-full text-slate-900 dark:text-slate-100 transition-colors">
          <Outlet />
        </main>
      </div>
    </div>
  );
}