// FILE: src/components/feedback/FeedbackModal.jsx

import { useState, useMemo } from "react";
import { Star, X, Check, MessageSquareText, Send, Heart } from "lucide-react";
import { submitFeedback } from "../../api/feedback.api";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

/**
 * MODAL DE FEEDBACK EMENO - DESIGN "PREMIUM GLASS"
 * Chic | Interactif | Focus Utilisateur
 */
export default function FeedbackModal({ deliveryId, isOpen, onClose, role }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(false);

  const tagsConfig = useMemo(() => {
    const isClient = role === "CLIENT";
    return isClient 
      ? [
          { label: "Très rapide", icon: "⚡️" },
          { label: "Très poli", icon: "🤝" },
          { label: "Colis soigné", icon: "📦" },
          { label: "Trajet optimisé", icon: "📍" },
          { label: "Retard important", icon: "⏳", isNegative: true },
          { label: "Conduite risquée", icon: "⚠️", isNegative: true },
        ]
      : [
          { label: "Client disponible", icon: "✅" },
          { label: "Localisation précise", icon: "📍" },
          { label: "Sympathique", icon: "😊" },
          { label: "Client en retard", icon: "⏳", isNegative: true },
          { label: "Adresse imprécise", icon: "📍", isNegative: true },
        ];
  }, [role]);

  const handleTagToggle = (tagLabel) => {
    setSelectedTags(prev => prev.includes(tagLabel) 
      ? prev.filter(t => t !== tagLabel) 
      : [...prev, tagLabel]
    );
  };

  const handleSubmit = async () => {
    if (rating === 0) return toast.error("Quelle note donnez-vous ?");
    setLoading(true);
    try {
      await submitFeedback({ deliveryId, rating, comment, tags: selectedTags });
      toast.success("Merci de nous aider à grandir !");
      onClose();
    } catch (err) {
      toast.error("Erreur lors de l'envoi du commentaire");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-primary/60 backdrop-blur-xl p-0 sm:p-4">
      
      <div className="bg-slate-50 dark:bg-primary-dark w-full max-w-md rounded-t-[3.5rem] sm:rounded-[3.5rem] shadow-[0_-20px_50px_-12px_rgba(0,0,0,0.5)] relative flex flex-col max-h-[90vh] overflow-hidden border-t border-white/10">
        
        {/* Progress bar discrète */}
        <div className="absolute top-0 left-0 h-1.5 bg-secondary transition-all duration-500" 
             style={{ width: `${(rating / 5) * 100}%` }} />

        {/* Header Section */}
        <div className="p-8 pb-4 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
                <Heart size={14} className="text-secondary fill-secondary" />
                <span className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">Expérience EMENO</span>
            </div>
            <h3 className="text-2xl font-black text-primary dark:text-white italic">
              Alors, <span className="text-secondary">verdict ?</span>
            </h3>
          </div>
          <button onClick={onClose} className="p-3 bg-white dark:bg-white/5 rounded-2xl text-slate-400 hover:rotate-90 transition-transform">
            <X size={20} />
          </button>
        </div>

        {/* Content Scrollable */}
        <div className="px-8 pb-8 space-y-8 overflow-y-auto custom-scrollbar">
          
          {/* 1. Rating Card */}
          <section className="bg-white dark:bg-white/5 p-6 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-white/5 text-center">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">Votre note globale</p>
            <div className="flex justify-center gap-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  className="relative active:scale-75 transition-transform"
                >
                  <Star
                    size={38}
                    fill={(hover || rating) >= star ? "#fcb045" : "transparent"}
                    stroke={(hover || rating) >= star ? "#fcb045" : "#E2E8F0"}
                    className={`transition-all duration-300 ${ (hover || rating) >= star ? "drop-shadow-[0_0_8px_rgba(252,176,69,0.5)]" : "" }`}
                  />
                </button>
              ))}
            </div>
          </section>

          {/* 2. Tags Chips */}
          <section>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 px-2">Qu'est-ce qui a marqué ce trajet ?</p>
            <div className="flex flex-wrap gap-2">
              {tagsConfig.map((tag) => {
                const isSelected = selectedTags.includes(tag.label);
                return (
                  <button
                    key={tag.label}
                    onClick={() => handleTagToggle(tag.label)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-full text-[10px] font-bold transition-all border-2 ${
                      isSelected
                        ? "bg-secondary border-secondary text-white shadow-lg shadow-secondary/20"
                        : "bg-white dark:bg-white/5 border-slate-100 dark:border-white/5 text-slate-500"
                    }`}
                  >
                    <span>{tag.icon}</span>
                    {tag.label}
                  </button>
                );
              })}
            </div>
          </section>

          {/* 3. Comment Area */}
          <section>
             <div className="bg-white dark:bg-white/5 rounded-[2.5rem] border border-slate-100 dark:border-white/5 p-2 focus-within:border-secondary/30 transition-colors">
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Un détail à ajouter ? (Optionnel)"
                    className="w-full bg-transparent p-4 text-sm font-medium text-primary dark:text-white outline-none resize-none min-h-[100px] italic"
                />
             </div>
          </section>

          {/* 4. Final Action */}
          <button
            onClick={handleSubmit}
            disabled={loading || rating === 0}
            className="w-full group relative overflow-hidden bg-primary dark:bg-slate-900 py-6 rounded-[2.5rem] shadow-xl shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-40"
          >
            <div className="relative z-10 flex items-center justify-center gap-3 text-white font-black uppercase tracking-[0.2em] text-[11px]">
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <span>Confirmer mon avis</span>
                  <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </>
              )}
            </div>
            {/* Gradient animation de fond */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary/20 to-primary translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          </button>

        </div>
      </div>
    </div>
  );
}

// Petit composant loader simple si nécessaire
const Loader2 = ({ className }) => (
  <div className={`w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin ${className}`} />
);