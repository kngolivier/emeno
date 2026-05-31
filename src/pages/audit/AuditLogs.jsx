// FILE: src/pages/audit/AuditLogs.jsx

import { useState } from "react";
import { Shield, Clock, User, X, Info, AlertCircle } from "lucide-react";
import { fetchAuditLogs } from "../../api/audit.api";
import { usePaginatedFetch } from "../../hooks/usePaginatedFetch";
import { Pagination } from "../../components/Pagination";
import PageLoader from "../../components/ui/PageLoader";

const ACTIONS = ["ALL", "CREATE", "UPDATE", "DELETE"];

const ACTION_LABELS = {
  ALL: "Tous les mouvements",
  CREATE: "Créations",
  UPDATE: "Modifications",
  DELETE: "Suppressions"
};

export default function AuditLogs() {
  // On utilise le hook de pagination. 
  // 'status' dans le hook sera utilisé pour filtrer l'action (ALL, CREATE, etc.)
  const { data: logs = [], meta, loading, status, setStatus, setPage } = usePaginatedFetch(fetchAuditLogs, 10);
  const [selectedLog, setSelectedLog] = useState(null);

  if (loading && logs.length === 0) return <PageLoader />;

  return (
    <div className="space-y-8 font-sans pb-10 transition-colors duration-300">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white font-display italic tracking-tighter">
          Journal d'Audit
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black mt-1 uppercase tracking-[0.2em]">
          Historique des mouvements de gestion
        </p>
      </div>

      {/* FILTERS */}
      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
        {ACTIONS.map((a) => (
          <button
            key={a}
            onClick={() => setStatus(a)}
            className={`whitespace-nowrap px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all
              ${status === a 
                ? "bg-primary dark:bg-secondary text-white border-primary dark:border-secondary shadow-md" 
                : "bg-white dark:bg-white/5 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10"}`}
          >
            {ACTION_LABELS[a]}
          </button>
        ))}
      </div>

      {/* EMPTY STATE */}
      {logs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 bg-white dark:bg-white/[0.02] border border-dashed border-slate-200 dark:border-white/10 rounded-[3rem] text-center space-y-4">
          <div className="w-20 h-20 bg-slate-50 dark:bg-white/5 rounded-[2rem] flex items-center justify-center text-slate-300 dark:text-slate-700">
             <Shield size={40} strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="font-display font-black text-xl italic text-slate-900 dark:text-white uppercase tracking-tight">Aucun mouvement</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium max-w-[250px] mx-auto mt-2">
              Aucune activité trouvée pour ce filtre.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* --- VUE MOBILE : CARDS --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
            {logs.map((log) => (
              <div 
                key={log._id} 
                onClick={() => setSelectedLog(log)}
                className="bg-white dark:bg-white/[0.03] p-6 rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-sm cursor-pointer hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-primary dark:text-secondary">
                    <User size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white uppercase text-xs tracking-wider">{log.userId?.name || "Système"}</h3>
                    <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{log.targetModel}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center bg-slate-50 dark:bg-white/5 p-3 rounded-xl border border-slate-100 dark:border-white/5">
                  <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-lg ${log.action === 'CREATE' ? 'text-emerald-500' : log.action === 'UPDATE' ? 'text-blue-500' : 'text-rose-500'}`}>
                    {log.action}
                  </span>
                  <span className="text-[9px] text-slate-400 flex items-center gap-1">
                    <Clock size={10} /> {new Date(log.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* --- VUE DESKTOP : TABLEAU --- */}
          <div className="hidden lg:block bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-[2.5rem] shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 dark:bg-white/5 border-b border-slate-200 dark:border-white/5">
                <tr>
                  <th className="p-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Utilisateur</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Action</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Cible</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {logs.map((log) => (
                  <tr 
                    key={log._id} 
                    onClick={() => setSelectedLog(log)}
                    className="hover:bg-slate-50/30 dark:hover:bg-white/[0.02] transition-colors cursor-pointer"
                  >
                    <td className="p-6 font-bold text-slate-700 dark:text-slate-300">
                      {log.userId?.name || "Système"}
                    </td>
                    <td className="p-6">
                      <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${log.action === 'CREATE' ? 'bg-emerald-100 text-emerald-600' : log.action === 'UPDATE' ? 'bg-blue-100 text-blue-600' : 'bg-rose-100 text-rose-600'}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="p-6 text-[10px] text-slate-500 font-bold uppercase">{log.targetModel}</td>
                    <td className="p-6 text-right text-[10px] text-slate-400 font-medium">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <Pagination meta={meta} setPage={setPage} />
        </>
      )}

      {/* MODAL DÉTAILS AMÉLIORÉ */}
      {selectedLog && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/40 dark:bg-primary/40 backdrop-blur-xl p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl transform animate-in slide-in-from-bottom-8 duration-500 border border-slate-100 dark:border-white/10">
            
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="font-display font-black text-2xl italic text-slate-900 dark:text-white uppercase tracking-tight">
                  Détails de l'Audit
                </h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                  Mouvement : {selectedLog.action}
                </p>
              </div>
              <button 
                onClick={() => setSelectedLog(null)} 
                className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-2xl transition-colors"
              >
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            {/* Grid d'informations */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/5">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Cible</p>
                <p className="font-bold text-slate-900 dark:text-white">{selectedLog.targetModel}</p>
              </div>
              <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/5">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Auteur</p>
                <p className="font-bold text-slate-900 dark:text-white truncate">{selectedLog.userId?.name || "Système"}</p>
              </div>
              <div className="col-span-2 bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/5">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Identifiant Unique (ID)</p>
                <p className="font-mono text-xs text-slate-600 dark:text-slate-300 break-all">{selectedLog.targetId}</p>
              </div>
            </div>

            {/* Bloc de données (Changes) */}
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 px-2">Changements détectés</p>
              <div className="bg-slate-900 dark:bg-black/40 p-6 rounded-3xl border border-slate-800 text-emerald-400 font-mono text-xs overflow-auto max-h-64 shadow-inner">
                <div className="space-y-2">
                  {Object.entries(selectedLog.changes || {}).map(([field, diff]) => (
                    <div key={field} className="bg-white/50 dark:bg-black/20 p-3 rounded-xl border border-slate-200 dark:border-white/10 flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase text-slate-500">{field}</span>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-rose-500 line-through">{String(diff.from)}</span>
                        <span className="text-slate-400">→</span>
                        <span className="text-emerald-500 font-bold">{String(diff.to)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <span className="text-[10px] text-slate-400 flex items-center justify-center gap-2">
                  <Clock size={12} /> {new Date(selectedLog.timestamp).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}