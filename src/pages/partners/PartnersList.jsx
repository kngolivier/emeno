// FILE: src/pages/partners/PartnersList.jsx

import React, { useState, useEffect } from "react";
import { fetchPartners, updatePartnerStatus, createPartner, updatePartner } from "../../api/partners.api";
import { Search, ShieldAlert, ShieldCheck, Edit3, Eye, Plus, Layers, ArrowLeft } from "lucide-react";
import { useTheme } from "../../context/Theme/ThemeContext";

// On importe les deux autres formulaires qui sont dans le même dossier
import NewPartnerForm from "./NewPartnerForm";
import PartnerDetails from "./PartnerDetails";
import PageLoader from "../../components/ui/PageLoader";

const DEFAULT_PARTNER_LOGO_LIGHT = "https://res.cloudinary.com/dzzokuvat/image/upload/f_auto,q_auto/logo-dark_rq7yhr";
const DEFAULT_PARTNER_LOGO_DARK = "https://res.cloudinary.com/dzzokuvat/image/upload/q_auto/f_auto/v1778897582/logo_nutvod.png";

export default function PartnersList() {
  const { isDarkMode } = useTheme();
  
  // Détermination du logo de secours selon le thème
  const currentDefaultLogo = isDarkMode ? DEFAULT_PARTNER_LOGO_LIGHT : DEFAULT_PARTNER_LOGO_DARK;

  // --- LOGIQUE D'ORCHESTRATION DES VUES ---
  const [view, setView] = useState("LIST");
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [error, setError] = useState(null);

  // --- ÉTATS DE LA LISTE ---
  const [partners, setPartners] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });
  const [filters, setFilters] = useState({ search: "", status: "ALL", page: 1, limit: 8 });
  const [loading, setLoading] = useState(false);

  const loadPartners = async () => {
    setLoading(true);
    try {
      const res = await fetchPartners(filters);
      setPartners(res.data.data || res.data);
      if(res.meta || res.data.meta) {
        setMeta(res.meta || res.data.meta);
      }
    } catch (err) {
      console.error("Erreur lors du chargement des partenaires :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (view === "LIST") {
      loadPartners();
    }
  }, [filters.page, filters.status, view]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, page: 1 }));
    loadPartners();
  };

  const toggleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    if (!window.confirm(`Voulez-vous vraiment passer ce partenaire à l'état ${nextStatus} ?`)) return;
    
    try {
      await updatePartnerStatus(id, nextStatus);
      loadPartners();
    } catch (err) {
      alert("Erreur lors de la modification du statut.");
    }
  };

  // --- HANDLERS DU FORMULAIRE ---
  const handleCreateSuccess = async (partnerData) => {
    try {
      setError(null);
      await createPartner(partnerData);
      setView("LIST");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Erreur lors de la création");
    }
  };

  const handleUpdateSuccess = async (partnerData) => {
    try {
      setError(null);
      await updatePartner(selectedPartner._id, partnerData);
      setSelectedPartner(null);
      setView("LIST");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Erreur lors de la modification");
    }
  };

  // --- INTERCEPTION DU LOADER EMENO ---
  if (loading) return <PageLoader />;

  // --- RENDU CONDITIONNEL DES FORMULAIRES ---
  if (view === "CREATE") {
    return (
      <div className="p-6 space-y-4">
        {error && <div className="p-4 bg-rose-500/10 text-rose-500 rounded-2xl text-xs font-black uppercase">⚠️ {error}</div>}
        <button onClick={() => setView("LIST")} className="flex items-center gap-2 text-slate-400 hover:text-primary dark:hover:text-white font-black text-[10px] uppercase tracking-widest transition-all mb-4">
          <ArrowLeft size={16} /> Retour à la liste
        </button>
        <NewPartnerForm onSave={handleCreateSuccess} onCancel={() => setView("LIST")} />
      </div>
    );
  }

  if (view === "EDIT") {
    return (
      <div className="p-6 space-y-4">
        {error && <div className="p-4 bg-rose-500/10 text-rose-500 rounded-2xl text-xs font-black uppercase">⚠️ {error}</div>}
        <button onClick={() => { setView("LIST"); setSelectedPartner(null); }} className="flex items-center gap-2 text-slate-400 hover:text-primary dark:hover:text-white font-black text-[10px] uppercase tracking-widest transition-all mb-4">
          <ArrowLeft size={16} /> Retour à la liste
        </button>
        <NewPartnerForm partnerData={selectedPartner} onSave={handleUpdateSuccess} onCancel={() => { setView("LIST"); setSelectedPartner(null); }} />
      </div>
    );
  }

  if (view === "DETAILS") {
    return (
      <div className="p-6">
        <button onClick={() => { setView("LIST"); setSelectedPartner(null); }} className="flex items-center gap-2 text-slate-400 hover:text-primary dark:hover:text-white font-black text-[10px] uppercase tracking-widest transition-all mb-4">
          <ArrowLeft size={16} /> Retour à la liste
        </button>
        <PartnerDetails partner={selectedPartner} onClose={() => { setView("LIST"); setSelectedPartner(null); }} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 p-4 md:p-6">
      
      {/* ACTION BAR UPPER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-50 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-primary dark:text-white italic font-display uppercase tracking-tight">
            Partenaires Établis
          </h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">
            Gestion des commerces, restaurants et enseignes inscrits.
          </p>
        </div>
        <button
          onClick={() => setView("CREATE")}
          className="flex items-center justify-center gap-2 bg-primary dark:bg-secondary text-white font-black text-xs uppercase tracking-widest px-6 py-4 rounded-2xl shadow-lg shadow-primary/20 dark:shadow-none hover:scale-[1.02] active:scale-95 transition-all self-start md:self-auto"
        >
          <Plus size={16} strokeWidth={3} /> Ajouter un commerce
        </button>
      </div>

      {/* FILTRES & BARRE DE RECHERCHE RÉTABLIE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* <form onSubmit={handleSearchSubmit} className="lg:col-span-2 relative flex items-center">
          <input
            type="text"
            className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-sm font-bold p-4 pl-12 rounded-2xl outline-none text-primary dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:ring-4 focus:ring-primary/5 dark:focus:ring-white/5 transition-all"
            placeholder="Rechercher par enseigne, numéro de téléphone..."
            value={filters.search}
            onChange={e => setFilters({ ...filters, search: e.target.value })}
          />
          <Search size={18} className="absolute left-4 text-slate-300 dark:text-slate-600" />
          <button type="submit" className="absolute right-3 bg-slate-50 dark:bg-slate-800 text-primary dark:text-white font-black text-[10px] uppercase tracking-wider px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-700">
            Filtrer
          </button>
        </form> */}

        <div className="bg-slate-100/60 dark:bg-slate-800/40 p-1.5 rounded-2xl flex items-center justify-between gap-1 border border-slate-100 dark:border-slate-800">
          {["ALL", "ACTIVE", "SUSPENDED"].map((st) => (
            <button
              key={st}
              onClick={() => setFilters({ ...filters, status: st, page: 1 })}
              className={`flex-1 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all ${
                filters.status === st 
                  ? "bg-white dark:bg-slate-900 text-primary dark:text-white shadow-sm" 
                  : "text-slate-400 hover:text-primary dark:hover:text-white"
              }`}
            >
              {st === "ALL" ? "Tous" : st === "ACTIVE" ? "Actifs" : "Suspendus"}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENEUR DATA */}
      {partners.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] text-center p-16">
          <Layers className="mx-auto text-slate-200 dark:text-slate-800 mb-4" size={48} />
          <p className="font-display italic font-black uppercase text-xl text-primary dark:text-white">Aucun partenaire référencé</p>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">Ajustez vos filtres ou créez une nouvelle fiche</p>
        </div>
      ) : (
        <>
          {/* 1. AFFICHAGE CARTES : UNIQUEMENT SUR MOBILE ET TABLETTE (< lg) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:hidden">
            {partners.map((p) => (
              <div 
                key={p._id}
                className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/70 rounded-[2rem] p-6 flex flex-col justify-between hover:shadow-xl dark:hover:shadow-none transition-all group relative overflow-hidden"
              >
                <span className={`absolute top-4 right-4 text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                  p.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                }`}>
                  {p.status === 'ACTIVE' ? 'Actif' : 'Suspendu'}
                </span>

                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <img 
                      src={p.logo?.url || currentDefaultLogo} 
                      alt={p.name} 
                      onError={(e) => { e.target.src = currentDefaultLogo; }}
                      className="w-12 h-12 rounded-2xl object-cover bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700"
                    />
                    <div className="max-w-[60%]">
                      <h3 className="font-display font-black text-lg text-primary dark:text-white truncate uppercase italic group-hover:text-secondary transition-colors">
                        {p.name}
                      </h3>
                      <p className="text-[10px] font-bold text-slate-400 truncate">{p.address?.commune?.name || "Gabon"}</p>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 border-t border-slate-50 dark:border-slate-800/60 pt-3">
                    <p className="truncate"><span className="text-[9px] font-black uppercase tracking-wider text-slate-300 block">Téléphone</span><span className="font-bold text-primary dark:text-white">{p.telephone}</span></p>
                    <p className="truncate"><span className="text-[9px] font-black uppercase tracking-wider text-slate-300 block">Quartier</span>{p.address?.text}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-6 pt-3 border-t border-slate-50 dark:border-slate-800/40">
                  <button 
                    onClick={() => { setSelectedPartner(p); setView("DETAILS"); }}
                    className="flex items-center justify-center p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-primary dark:hover:text-white rounded-xl transition-all"
                  >
                    <Eye size={16} />
                  </button>
                  <button 
                    onClick={() => { setSelectedPartner(p); setView("EDIT"); }}
                    className="flex items-center justify-center p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-secondary rounded-xl transition-all"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button 
                    onClick={() => toggleStatus(p._id, p.status)}
                    className={`flex items-center justify-center p-3 rounded-xl transition-all ${
                      p.status === "ACTIVE" ? "bg-rose-500/10 text-rose-500" : "bg-emerald-500/10 text-emerald-500"
                    }`}
                  >
                    {p.status === "ACTIVE" ? <ShieldAlert size={16} /> : <ShieldCheck size={16} />}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 2. AFFICHAGE TABLEAU : UNIQUEMENT SUR GRAND ÉCRAN (>= lg) */}
          <div className="hidden lg:block bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/70 rounded-[2rem] overflow-hidden shadow-sm">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                  <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Enseigne</th>
                  <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Téléphone</th>
                  <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Localisation</th>
                  <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Statut</th>
                  <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                {partners.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/30 dark:hover:bg-white/[0.01] transition-all group">
                    {/* ENSEIGNE / LOGO */}
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        <img 
                          src={p.logo?.url || currentDefaultLogo} 
                          alt={p.name} 
                          onError={(e) => { e.target.src = currentDefaultLogo; }}
                          className="w-11 h-11 rounded-xl object-cover bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm"
                        />
                        <div>
                          <p className="font-display font-black text-base text-primary dark:text-white uppercase italic group-hover:text-secondary transition-colors">
                            {p.name}
                          </p>
                          <p className="text-[11px] font-semibold text-slate-400 lowercase">{p.email || "pas d'email pro"}</p>
                        </div>
                      </div>
                    </td>

                    {/* TÉLÉPHONE */}
                    <td className="p-5">
                      <span className="font-bold text-sm text-primary dark:text-white">{p.telephone}</span>
                    </td>

                    {/* ADRESSE / COMMUNE */}
                    <td className="p-5">
                      <div>
                        <p className="font-bold text-sm text-primary dark:text-white">{p.address?.text}</p>
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">{p.address?.commune?.name || "Gabon"}</p>
                      </div>
                    </td>

                    {/* STATUT */}
                    <td className="p-5">
                      <span className={`inline-flex items-center text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${
                        p.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                      }`}>
                        {p.status === 'ACTIVE' ? 'Actif' : 'Suspendu'}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="p-5 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button 
                          onClick={() => { setSelectedPartner(p); setView("DETAILS"); }}
                          className="p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-primary dark:hover:text-white rounded-xl transition-all"
                          title="Fiche détaillée"
                        >
                          <Eye size={15} />
                        </button>
                        <button 
                          onClick={() => { setSelectedPartner(p); setView("EDIT"); }}
                          className="p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-secondary rounded-xl transition-all"
                          title="Éditer"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button 
                          onClick={() => toggleStatus(p._id, p.status)}
                          className={`p-2.5 rounded-xl transition-all ${
                            p.status === "ACTIVE" 
                              ? "bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white" 
                              : "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white"
                          }`}
                          title={p.status === "ACTIVE" ? "Suspendre" : "Activer"}
                        >
                          {p.status === "ACTIVE" ? <ShieldAlert size={15} /> : <ShieldCheck size={15} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* COMPOSANT DE PAGINATION */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            disabled={filters.page === 1}
            onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
            className="px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-xs font-black uppercase text-primary dark:text-white disabled:opacity-40 transition-all"
          >
            Précédent
          </button>
          <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 mx-4">
            Page {filters.page} sur {meta.totalPages}
          </span>
          <button
            disabled={filters.page === meta.totalPages}
            onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
            className="px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-xs font-black uppercase text-primary dark:text-white disabled:opacity-40 transition-all"
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  );
}