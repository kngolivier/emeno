// FILE: src/components/ui/ConfirmModal.jsx
import { AlertTriangle, X } from "lucide-react";

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, loading }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-primary/40 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl p-8 animate-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-300 hover:text-primary transition-colors">
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="h-16 w-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mb-6 border border-rose-100">
            <AlertTriangle size={32} />
          </div>

          <h3 className="text-xl font-black text-primary uppercase tracking-tighter italic mb-2">
            {title}
          </h3>
          <p className="text-slate-400 text-xs font-bold leading-relaxed mb-8 uppercase tracking-widest px-4">
            {message}
          </p>

          <div className="flex flex-col w-full gap-3">
            <button
              onClick={onConfirm}
              disabled={loading}
              className="w-full py-4 bg-rose-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-rose-600 transition-all shadow-lg shadow-rose-200 disabled:opacity-50"
            >
              {loading ? "Suppression..." : "Confirmer la suppression"}
            </button>
            <button
              onClick={onClose}
              className="w-full py-4 bg-slate-50 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-100 transition-all"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}