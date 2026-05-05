// FILE: src/pages/pricing/PricingList.jsx

import { useState } from "react";
import { Plus, Edit2, Power, ArrowRight, ArrowLeft } from "lucide-react";
import { Pagination } from "../../components/Pagination";
import { usePaginatedFetch } from "../../hooks/usePaginatedFetch";
import { formatCommune } from "../../utils/formatter";
import { 
  fetchPricing, 
  createPricing, 
  updatePricing, 
  togglePricing 
} from "../../api/pricing.api";
import { notifySuccess, notifyError } from "../../utils/notify";
import PricingForm from "./PricingForm";
import PageLoader from "../../components/ui/PageLoader";

export default function PricingList() {
  const { 
    data: pricing = [], 
    meta, 
    loading, 
    setPage, 
    refresh 
  } = usePaginatedFetch(fetchPricing, 10);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState("ALL");

  // ======================
  // LOGIQUE BIDIRECTIONNELLE
  // ======================
  const handleSave = async (data) => {
    try {
      if (data._id) {
        await updatePricing(data._id, data);
        notifySuccess("Tarif mis à jour");
      } else {
        // 1. Création du trajet principal (A -> B)
        await createPricing(data);

        // 2. Création automatique du miroir (B -> A) si les communes sont différentes
        if (data.from !== data.to) {
          const mirrorData = { 
            ...data, 
            from: data.to, 
            to: data.from 
          };
          await createPricing(mirrorData);
          notifySuccess("Liaison bidirectionnelle créée");
        } else {
          notifySuccess("Tarif local créé");
        }
      }
      closeModal();
      refresh();
    } catch (err) {
      notifyError(err?.response?.data?.message || err.message);
    }
  };

  const handleToggle = async (item) => {
    try {
      await togglePricing(item._id);
      refresh();
      notifySuccess("Statut mis à jour");
    } catch (err) {
      notifyError(err.message);
    }
  };

  const closeModal = () => {
    setShowForm(false);
    setEditing(null);
  };

  if (loading) return <PageLoader />;

  const filtered = pricing.filter((p) => {
    if (filter === "ALL") return true;
    return filter === "ACTIVE" ? p.isActive : !p.isActive;
  });

  return (
    <div className="space-y-8 font-sans">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-primary font-display italic tracking-tighter">
            Tarification
          </h1>
          <p className="text-slate-400 text-sm font-medium mt-1 uppercase tracking-[0.1em]">
            Configuration des zones et prix de livraison
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-8 py-4 rounded-[1.5rem] bg-primary text-white hover:bg-secondary transition-all shadow-xl hover:shadow-secondary/20 text-xs font-black uppercase tracking-widest"
        >
          <Plus size={18} strokeWidth={3} />
          Nouveau Tarif
        </button>
      </div>

      {/* FILTERS */}
      <div className="flex gap-2">
        {["ALL", "ACTIVE", "INACTIVE"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all
              ${filter === f ? "bg-primary text-white border-primary shadow-lg" : "bg-white text-slate-400 border-slate-100"}`}
          >
            {f === "ALL" ? "Tous" : f}
          </button>
        ))}
      </div>

      {/* TABLE */}
      <div className="bg-white border border-slate-50 rounded-[2rem] shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-50">
              <tr>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Trajet (Corridor)</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Méthode</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tarifs (FCFA)</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Statut</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((p) => (
                <tr key={p._id} className={`hover:bg-slate-50/50 transition-colors group ${!p.isActive ? "opacity-40" : ""}`}>
                  <td className="p-6">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-3 font-display font-black text-primary italic text-lg tracking-tight">
                        <span>{formatCommune(p.from)}</span>
                        <div className="flex flex-col items-center opacity-30 group-hover:opacity-100 transition-opacity">
                          <ArrowRight size={10} className="text-secondary -mb-1" strokeWidth={4} />
                          <ArrowLeft size={10} className="text-secondary -mt-1" strokeWidth={4} />
                        </div>
                        <span>{formatCommune(p.to)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="h-1 w-1 rounded-full bg-secondary"></span>
                        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-300 italic">
                          Liaison bidirectionnelle
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-500 text-[9px] font-black uppercase tracking-widest border border-slate-200/50">
                      {p.pricingType}
                    </span>
                  </td>
                  <td className="p-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-700">{p.basePrice?.toLocaleString()} <small className="text-[9px] text-slate-400 font-black uppercase ml-1">Base</small></span>
                      <span className="text-[11px] font-black text-secondary italic">{p.pricePerKm?.toLocaleString()} <small className="uppercase ml-0.5">/ Km</small></span>
                    </div>
                  </td>
                  <td className="p-6 text-center">
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter border ${p.isActive ? "bg-emerald-500/10 text-emerald-600 border-emerald-100" : "bg-slate-100 text-slate-400 border-slate-200"}`}>
                      {p.isActive ? "Actif" : "Inactif"}
                    </span>
                  </td>
                  <td className="p-6 text-right space-x-1">
                    <button 
                      onClick={() => { setEditing(p); setShowForm(true); }} 
                      className="p-2 text-slate-300 hover:text-secondary transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleToggle(p)}
                      className={`p-2 transition-colors ${p.isActive ? "text-primary/20 hover:text-primary" : "text-emerald-500"}`}
                    >
                      <Power size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/20 backdrop-blur-md p-4 animate-fadeIn">
          <PricingForm 
            onSave={handleSave} 
            onCancel={closeModal} 
            pricing={editing} 
          />
        </div>
      )}

      <Pagination meta={meta} setPage={setPage} />
    </div>
  );
}