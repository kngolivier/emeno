import { useState } from "react";
import { orders as mockOrders } from "../../data/mockOrders";
import { Link } from "react-router-dom";
import { Plus, MapPin, Calendar, Search, X, Eye } from "lucide-react";
import NewOrderForm from "./NewOrderForm";

export default function OrdersList() {
  const [orders, setOrders] = useState(mockOrders); // ← état dynamique
  const [filter, setFilter] = useState("Tous");
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false); // ← contrôle du formulaire

  const statusStyles = {
    "En attente": "bg-amber-50 text-amber-700 border-amber-100",
    "En cours": "bg-blue-50 text-blue-700 border-blue-100",
    "Livrée": "bg-emerald-50 text-emerald-700 border-emerald-100",
    "Annulée": "bg-red-50 text-red-600 border-red-100",
  };

  // Filtrage et recherche
  const filteredOrders = orders.filter(order => {
    const matchesStatus = filter === "Tous" || order.status === filter;
    const matchesSearch =
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(order.id).includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  // Ajout d'une nouvelle commande
  const handleAddOrder = (newOrder) => {
    setOrders([newOrder, ...orders]); // ajout en haut du tableau
    setShowForm(false); // ferme le formulaire après ajout
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Recherche */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Commandes</h1>
          <p className="text-slate-500 text-sm">Suivi des livraisons en temps réel.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          {/* Recherche */}
          <div className="relative flex-1 sm:w-80 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Client, livreur ou ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-10 text-sm focus:ring-4 focus:ring-blue-50 focus:border-blue-400 transition-all outline-none shadow-sm"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            )}
          </div>

          {/* Bouton Nouvelle commande */}
          <button 
            onClick={() => setShowForm(!showForm)}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-md font-medium shrink-0"
          >
            <Plus size={18} />
            Nouvelle commande
          </button>
        </div>
      </div>

      {/* 2. Formulaire */}
      {showForm && <NewOrderForm onAdd={handleAddOrder} />}

      {/* 3. Filtres */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {["Tous", "En attente", "En cours", "Livrée", "Annulée"].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
              filter === s
                ? "bg-slate-800 text-white border-slate-800 shadow-sm"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* 4. Tableau */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Client / ID</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Livreur</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Total</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider text-center">Statut</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredOrders.map(order => (
                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-800">{order.customer}</div>
                    <div className="text-[11px] text-slate-400 font-mono">#{String(order.id).slice(0, 8)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-[10px] font-bold">
                        {order.driver.charAt(0)}
                      </div>
                      <span className="text-sm text-slate-600 font-medium">{order.driver}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800">{(order.total * 655).toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">FCFA</span></div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Calendar size={12} /> {order.date}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold border ${statusStyles[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/orders/${order.id}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-xs font-bold"
                      >
                        <MapPin size={14} />
                        Suivre
                      </Link>
                      <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                        <Eye size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="py-20 text-center flex flex-col items-center">
            <Search size={40} className="text-slate-200 mb-3" />
            <p className="text-slate-500 font-medium italic">Aucun résultat trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
}