import { useState } from "react";
import { orders as mockOrders } from "../data/mockOrders";
import { drivers as mockDrivers } from "../data/mockDrivers";
import { customers as mockCustomers } from "../data/mockCustomers";
import { Truck, User, CreditCard, PackageCheck, Activity, Users, CheckCircle, AlertCircle } from "lucide-react";

export default function Dashboard() {
  const [orders] = useState(mockOrders);
  const [drivers] = useState(mockDrivers);
  const [customers] = useState(mockCustomers);

  const orderStats = {
    total: orders.length,
    enAttente: orders.filter(o => o.status === "En attente").length,
    enCours: orders.filter(o => o.status === "En cours").length,
    livree: orders.filter(o => o.status === "Livrée").length,
    annulee: orders.filter(o => o.status === "Annulée").length,
  };

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${color}`}>
          <Icon size={24} />
        </div>
        {trend && (
          <span className="text-[10px] font-bold px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg">
            +{trend}%
          </span>
        )}
      </div>
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</p>
        <p className="text-3xl font-black text-slate-800">{value}</p>
      </div>
    </div>
  );

  const ProgressRow = ({ label, value, total, colorClass }) => (
    <div className="space-y-2">
      <div className="flex justify-between text-sm font-medium">
        <span className="text-slate-600">{label}</span>
        <span className="text-slate-800">{value}</span>
      </div>
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full ${colorClass} transition-all duration-1000`} 
          style={{ width: `${(value / total) * 100}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Bonjour, Admin 👋</h1>
        <p className="text-slate-500">Voici ce qui se passe sur Emeno aujourd'hui.</p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="En attente" value={orderStats.enAttente} icon={PackageCheck} color="bg-amber-50 text-amber-600" trend="12" />
        <StatCard title="En cours" value={orderStats.enCours} icon={Activity} color="bg-blue-50 text-blue-600" trend="5" />
        <StatCard title="Livreurs Live" value={drivers.filter(d => d.status === "actif").length} icon={Truck} color="bg-emerald-50 text-emerald-600" />
        <StatCard title="Total Revenus" value="1.2M" icon={CreditCard} color="bg-slate-900 text-white" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Performance des Commandes */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-800">Flux des commandes</h3>
              <span className="text-xs font-bold text-white bg-[#B08D3E] px-3 py-1 rounded-full">Total: {orderStats.total}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            <ProgressRow label="Livrées avec succès" value={orderStats.livree} total={orderStats.total} colorClass="bg-emerald-500" />
            <ProgressRow label="En cours de route" value={orderStats.enCours} total={orderStats.total} colorClass="bg-blue-500" />
            <ProgressRow label="En attente de prise en charge" value={orderStats.enAttente} total={orderStats.total} colorClass="bg-amber-400" />
            <ProgressRow label="Annulées / Retours" value={orderStats.annulee} total={orderStats.total} colorClass="bg-rose-500" />
          </div>
        </div>
        {/* État de la flotte (Version EMENC Dark) */}
        <div className="bg-[#002D15] p-8 rounded-3xl text-white shadow-xl shadow-emerald-950/20">
          <h3 className="text-lg font-bold mb-6 text-[#B08D3E]">Communauté</h3>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                <Users size={20} className="text-[#B08D3E]" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-slate-300">Clients Actifs</span>
                  <span className="text-sm font-bold">{customers.filter(c => c.status === "actif").length}</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#B08D3E]" style={{ width: '85%' }} />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                <Truck size={20} className="text-emerald-400" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-slate-300">Livreurs en ligne</span>
                  <span className="text-sm font-bold">{drivers.filter(d => d.status === "actif").length}</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400" style={{ width: '60%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#B08D3E] mb-2">Alerte Système</p>
            <div className="flex items-center gap-2 text-xs text-white font-medium">
              <AlertCircle size={14} className="text-[#B08D3E]" />
              3 livreurs sont inactifs depuis 1h
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
