// FILE: src/layout/PartnerLayout.jsx

import React, { useState, useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import API from "../api/apiClient";
import { ENDPOINTS } from "../api/endpoints";

export default function PartnerLayout() {
  const { user } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [partnerData, setPartnerData] = useState(null);
  const [loadingPartner, setLoadingPartner] = useState(true);

  // Guard de sécurité d'entrée immédiat
  if (!user || user.role !== "PARTNER_MANAGER") {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    const bootstrapPartnerContext = async () => {
      if (!user?.partnerId) {
        setLoadingPartner(false);
        return;
      }
      try {
        // Hydratation de l'arborescence à l'aide de l'identifiant de la table partenaire
        const res = await API.get(`${ENDPOINTS.PARTNERS}/${user.partnerId}`);
        setPartnerData(res.data?.data || res.data);
      } catch (err) {
        console.error("Impossible de récupérer le contexte de l'établissement", err);
      } finally {
        setLoadingPartner(false);
      }
    };
    bootstrapPartnerContext();
  }, [user?.partnerId]);

  if (loadingPartner) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Initialisation de l'espace commerce...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-h-screen relative overflow-y-auto ml-72">
        <Header toggleSidebar={() => setSidebarOpen(true)} />
        
        <main className="p-4 lg:p-8 max-w-[1600px] mx-auto w-full text-slate-900 dark:text-slate-100 transition-colors">
          {/* On passe le profil utilisateur et la fiche partenaire hydratée à travers le contexte de l'outlet */}
          <Outlet context={{ currentUser: user, currentPartner: partnerData }} />
        </main>
      </div>
    </div>
  );
}