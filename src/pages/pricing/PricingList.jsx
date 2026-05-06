// FILE: src/pages/pricing/PricingList.jsx

import { useState } from "react";
import { Plus, Edit2, Power, ArrowRight, ArrowLeft, MapPin, Navigation, Banknote } from "lucide-react";
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
  const { data: pricing = [], meta, loading, setPage, refresh } = usePaginatedFetch(fetchPricing, 10);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState("ALL");

  const handleSave = async (data) => {
    try {
      if (data._id) {
        await updatePricing(data._id, data);
        notifySuccess("Tarif mis à jour");
      } else {
        await createPricing(data);
        if (data.from !== data.to) {
          const mirrorData = { ...data, from: data.to, to: data.from };
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
    <div className="space-y-8 font-sans pb-10">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-black text-primary font-display italic tracking-tighter">
            Tarification
          </h1>
          <p className="text-slate-400 text-[10px] font-bold mt-1 uppercase tracking-[0.2em]">
            Configuration des zones et prix de livraison
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-primary text-white hover:bg-secondary transition-all shadow-xl hover:shadow-secondary/20 text-[10px] font-black uppercase tracking-widest"
        >
          <Plus size={16} strokeWidth={3} />
          Nouveau Tarif
        </button>
      </div>

      {/* FILTERS */}
      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
        {["ALL", "ACTIVE", "INACTIVE"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`whitespace-nowrap px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all
              ${filter === f ? "bg-primary text-white border-primary shadow-md" : "bg-white text-slate-400 border-slate-100 hover:border-slate-200"}`}
          >
            {f === "ALL" ? "Tous les tarifs" : f}
          </button>
        ))}
      </div>

      {/* --- VUE MOBILE : CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
        {filtered.map((p) => (
          <div key={p._id} className={`bg-white p-6 rounded-[2.5rem] border border-slate-50 shadow-sm transition-all ${!p.isActive ? "opacity-40 grayscale" : ""}`}>
            <div className="flex justify-between items-start mb-6">
              <div className="space-y-1">
                <span className="px-2 py-1 rounded-lg bg-slate-50 text-slate-400 text-[8px] font-black uppercase tracking-widest border border-slate-100">
                  {p.pricingType}
                </span>
                <div className="flex items-center gap-2 text-primary font-display font-black italic text-lg tracking-tighter leading-none pt-2">
                  <span>{formatCommune(p.from)}</span>
                  <ArrowRight size={14} className="text-secondary" strokeWidth={3} />
                  <span>{formatCommune(p.to)}</span>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-tighter border ${p.isActive ? "bg-emerald-500/10 text-emerald-600 border-emerald-100" : "bg-slate-100 text-slate-400 border-slate-200"}`}>
                {p.isActive ? "Actif" : "Inactif"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
               <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50">
                  <div className="flex items-center gap-2 text-slate-400 mb-1">
                    <Banknote size={12} />
                    <span className="text-[8px] font-black uppercase tracking-widest">Base</span>
                  </div>
                  <p className="text-sm font-black text-primary">{p.basePrice?.toLocaleString()} <small className="text-[10px]">FCFA</small></p>
               </div>
               <div className="p-4 bg-secondary/5 rounded-2xl border border-secondary/10">
                  <div className="flex items-center gap-2 text-secondary/60 mb-1">
                    <Navigation size={12} />
                    <span className="text-[8px] font-black uppercase tracking-widest">KM</span>
                  </div>
                  <p className="text-sm font-black text-secondary">{p.pricePerKm?.toLocaleString()} <small className="text-[10px]">FCFA</small></p>
               </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => { setEditing(p); setShowForm(true); }}
                className="flex-1 py-3 rounded-xl bg-slate-50 text-primary text-[9px] font-black uppercase tracking-widest border border-slate-100 flex items-center justify-center gap-2"
              >
                <Edit2 size={14} /> Modifier
              </button>
              <button 
                onClick={() => handleToggle(p)}
                className={`px-5 py-3 rounded-xl border transition-all ${p.isActive ? "border-rose-100 text-rose-500 bg-rose-50/30" : "border-emerald-100 text-emerald-600 bg-emerald-50/30"}`}
              >
                <Power size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* --- VUE DESKTOP : TABLEAU --- */}
      <div className="hidden lg:block bg-white border border-slate-50 rounded-[2.5rem] shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-50">
            <tr>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Corridor</th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Méthode</th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tarifs (FCFA)</th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Statut</th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map((p) => (
              <tr key={p._id} className={`hover:bg-slate-50/30 transition-colors group ${!p.isActive ? "opacity-40" : ""}`}>
                <td className="p-6">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3 font-display font-black text-primary italic text-xl tracking-tighter">
                      <span className="uppercase">{formatCommune(p.from)}</span>
                      <div className="flex flex-col items-center opacity-20 group-hover:opacity-100 transition-opacity">
                        <ArrowRight size={10} className="text-secondary -mb-1" strokeWidth={4} />
                        <ArrowLeft size={10} className="text-secondary -mt-1" strokeWidth={4} />
                      </div>
                      <span className="uppercase">{formatCommune(p.to)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary/40"></div>
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-300 italic">Liaison bidirectionnelle</span>
                    </div>
                  </div>
                </td>
                <td className="p-6 text-center">
                  <span className="px-4 py-1.5 rounded-xl bg-slate-50 text-slate-500 text-[9px] font-black uppercase tracking-widest border border-slate-100">
                    {p.pricingType}
                  </span>
                </td>
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-0.5">Base</p>
                      <p className="text-sm font-black text-primary italic leading-none">{p.basePrice?.toLocaleString()}</p>
                    </div>
                    <div className="h-8 w-[1px] bg-slate-100"></div>
                    <div>
                      <p className="text-[8px] font-black text-secondary/50 uppercase tracking-widest mb-0.5">Par KM</p>
                      <p className="text-sm font-black text-secondary italic leading-none">{p.pricePerKm?.toLocaleString()}</p>
                    </div>
                  </div>
                </td>
                <td className="p-6 text-center">
                  <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${p.isActive ? "bg-emerald-500/10 text-emerald-600 border-emerald-100" : "bg-slate-100 text-slate-400 border-slate-200"}`}>
                    {p.isActive ? "Actif" : "Inactif"}
                  </span>
                </td>
                <td className="p-6 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                    <button 
                      onClick={() => { setEditing(p); setShowForm(true); }} 
                      className="p-2.5 text-slate-300 hover:text-secondary hover:bg-secondary/5 rounded-xl transition-all"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleToggle(p)}
                      className={`p-2.5 rounded-xl transition-all ${p.isActive ? "text-rose-300 hover:text-rose-500 hover:bg-rose-50" : "text-emerald-400 hover:text-emerald-600 hover:bg-emerald-50"}`}
                    >
                      <Power size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination meta={meta} setPage={setPage} />

      {/* MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-primary/40 backdrop-blur-xl p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-xl transform animate-in slide-in-from-bottom-8 duration-500">
            <PricingForm onSave={handleSave} onCancel={closeModal} pricing={editing} />
          </div>
        </div>
      )}
    </div>
  );
}