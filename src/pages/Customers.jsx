import { useState } from "react";
import { customers as mockCustomers} from "../data/mockCustomers";
// Importer des icônes si possible, sinon j'utilise des emojis/symboles simples ici
import { User, Mail, Phone, Power, Ban, CheckCircle2 } from "lucide-react"; // Exemple avec lucide-react

export default function Customers() {
  const [customersList, setCustomersList] = useState(mockCustomers);

  const toggleCustomerStatus = (id) => {
    setCustomersList(prev =>
      prev.map(c =>
        c.id === id
          ? { ...c, status: c.status === "actif" ? "suspendu" : "actif" }
          : c
      )
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8 bg-slate-50/50 min-h-screen">
      {/* Header avec un look plus "Dashboard" */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Annuaire Clients</h1>
          <p className="mt-1 text-slate-500 font-medium">Gérez les accès et surveillez le statut de vos membres.</p>
        </div>
        <div className="flex gap-3">
            <span className="inline-flex items-center px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 shadow-sm">
                Total : {customersList.length}
            </span>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-slate-50/80">
                <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">Client</th>
                <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">Coordonnées</th>
                <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 text-center">Statut</th>
                <th className="px-6 py-5 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 text-right">Gestion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {customersList.map(customer => (
                <tr key={customer.id} className="group hover:bg-blue-50/30 transition-all duration-200">
                  {/* Nom avec Avatar simple */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-500 font-bold border border-white shadow-sm">
                        {customer.name.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-700 group-hover:text-blue-600 transition-colors">{customer.name}</span>
                    </div>
                  </td>

                  {/* Coordonnées groupées */}
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center text-sm text-slate-600">
                        <span className="mr-2 opacity-40"></span> {customer.email}
                      </div>
                      <div className="flex items-center text-xs text-slate-400 font-medium">
                         {customer.phone}
                      </div>
                    </div>
                  </td>

                  {/* Statut avec pastille moderne */}
                  <td className="px-6 py-5 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wide border-2 ${
                      customer.status === "actif"
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100/50"
                        : "bg-rose-50 text-rose-600 border-rose-100/50"
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${customer.status === "actif" ? "bg-emerald-500" : "bg-rose-500"}`}></span>
                      {customer.status}
                    </span>
                  </td>

                  {/* Actions avec bouton épuré */}
                  <td className="px-6 py-5 text-right">
                    <button
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 shadow-sm border ${
                        customer.status === "actif" 
                        ? "text-rose-600 border-rose-100 hover:bg-rose-600 hover:text-white hover:border-rose-600" 
                        : "text-emerald-600 border-emerald-100 hover:bg-emerald-600 hover:text-white hover:border-emerald-100"
                      }`}
                      onClick={() => toggleCustomerStatus(customer.id)}
                    >
                      {customer.status === "actif" ? "Suspendre" : "Réactiver"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
