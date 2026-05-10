// FILE: src/components/feedback/FeedbackModal.jsx

import { useState, useMemo } from "react";
import { Star, X, Check, MessageSquareText } from "lucide-react";
import { submitFeedback } from "../../api/feedback.api";
import toast from "react-hot-toast";

/**
 * MODAL DE FEEDBACK EMENO OPTIMISÉ
 * Design Minimaliste | Mobile-First | UX Renforcée
 */
export default function FeedbackModal({ deliveryId, isOpen, onClose, role }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(false);

  const tagsConfig = useMemo(() => {
    if (role === "CLIENT") {
      return [
        { label: "Très rapide", icon: "⚡️", type: "positive" },
        { label: "Très poli", icon: "🤝", type: "positive" },
        { label: "Colis soigné", icon: "📦", type: "positive" },
        { label: "Trajet optimisé", icon: "📍", type: "positive" },
        { label: "Retard important", icon: "⏳", type: "negative" },
        { label: "Manque de politesse", icon: "😒", type: "negative" },
        { label: "Conduite risquée", icon: "⚠️", type: "negative" },
        { label: "Colis endommagé", icon: "📦", type: "negative" },
        { label: "Difficile à joindre", icon: "📞", type: "negative" },
      ];
    }
    return [
      { label: "Client disponible", icon: "✅", type: "positive" },
      { label: "Localisation précise", icon: "📍", type: "positive" },
      { label: "Paiement rapide", icon: "💵", type: "positive" },
      { label: "Sympathique", icon: "😊", type: "positive" },
      { label: "Client en retard", icon: "⏳", type: "negative" },
      { label: "Absent au RDV", icon: "❌", type: "negative" },
      { label: "Ne répond pas", icon: "📞", type: "negative" },
      { label: "Adresse imprécise", icon: "📍", type: "negative" },
      { label: "Comportement difficile", icon: "💬", type: "negative" },
    ];
  }, [role]);

  const handleTagToggle = (tagLabel) => {
    setSelectedTags((prev) =>
      prev.includes(tagLabel)
        ? prev.filter((t) => t !== tagLabel)
        : [...prev, tagLabel]
    );
  };

  const handleSubmit = async () => {
    if (rating === 0) return toast.error("Veuillez sélectionner une note");
    setLoading(true);
    try {
      await submitFeedback({ deliveryId, rating, comment, tags: selectedTags });
      toast.success("Merci pour votre retour !");
      onClose();
    } catch (err) {
      toast.error(err.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center bg-primary/40 backdrop-blur-md p-0 sm:p-4 animate-in fade-in duration-300">
      
      {/* Container du Modal */}
      <div className="bg-white w-full max-w-lg rounded-t-[3rem] sm:rounded-[3rem] p-6 sm:p-10 shadow-2xl relative animate-in slide-in-from-bottom-10 sm:zoom-in duration-500 max-h-[95vh] overflow-y-auto">
        
        {/* Handle de fermeture pour mobile */}
        <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-6 sm:hidden" />

        {/* Bouton Fermer (Desktop) */}
        <button 
          onClick={onClose} 
          className="absolute right-6 top-6 sm:right-8 sm:top-8 p-2 text-slate-300 hover:text-primary hover:bg-slate-50 rounded-full transition-all"
        >
          <X size={24} strokeWidth={3} />
        </button>

        {/* Header avec identité visuelle EMENO */}
        <div className="mb-8 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
            <div className="h-2 w-10 bg-secondary rounded-full" />
            <h3 className="text-xl sm:text-2xl font-black text-primary italic uppercase tracking-tighter">
              Votre avis <span className="text-secondary">compte</span>
            </h3>
          </div>
          <p className="text-[10px] sm:text-xs text-slate-400 font-black uppercase tracking-[0.15em] leading-relaxed">
            Évaluez votre expérience avec {role === "CLIENT" ? "le livreur" : "le client"}
          </p>
        </div>

        {/* Système de notation (Stars) */}
        <div className="flex justify-center gap-2 sm:gap-4 mb-8 bg-slate-50/50 py-6 rounded-[2rem] border border-slate-50">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(star)}
              className="group transition-transform active:scale-75"
            >
              <Star
                size={window.innerWidth < 640 ? 36 : 44}
                fill={(hover || rating) >= star ? "#fcb045" : "transparent"}
                stroke={(hover || rating) >= star ? "#fcb045" : "#CBD5E1"}
                strokeWidth={2}
                className={`transition-all duration-300 ${
                  (hover || rating) >= star ? "drop-shadow-[0_0_10px_rgba(252,176,69,0.3)]" : ""
                }`}
              />
            </button>
          ))}
        </div>

        {/* Grille de Tags Responsive */}
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 sm:gap-3 mb-8">
          {tagsConfig.map((tag) => {
            const isSelected = selectedTags.includes(tag.label);
            return (
              <button
                key={tag.label}
                onClick={() => handleTagToggle(tag.label)}
                className={`flex items-center gap-2 px-3 py-3.5 rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-wider transition-all border-2 ${
                  isSelected
                    ? "bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-[0.98]"
                    : "bg-white border-slate-100 text-slate-400 hover:border-secondary/30 hover:text-primary"
                }`}
              >
                <span className={`text-sm transition-transform ${isSelected ? 'scale-110' : ''}`}>
                    {tag.icon}
                </span>
                <span className="flex-1 text-left truncate">{tag.label}</span>
                {isSelected && <Check size={12} strokeWidth={4} className="text-secondary" />}
              </button>
            );
          })}
        </div>

        {/* Zone de Commentaire */}
        <div className="relative mb-8 group">
          <div className="absolute left-5 top-5 text-slate-300 group-focus-within:text-secondary transition-colors">
            <MessageSquareText size={18} />
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Dites-nous en plus..."
            className="w-full bg-slate-50 rounded-[2rem] pl-14 pr-6 py-5 text-sm font-bold text-primary italic border-2 border-transparent focus:border-secondary/20 focus:bg-white outline-none transition-all resize-none min-h-[100px]"
          />
        </div>

        {/* Bouton de Validation */}
        <button
          onClick={handleSubmit}
          disabled={loading || rating === 0}
          className="w-full bg-primary py-5 rounded-[2rem] text-white font-black uppercase tracking-[0.25em] text-xs shadow-2xl shadow-primary/30 hover:bg-[#002D15] hover:translate-y-[-2px] active:translate-y-[1px] transition-all disabled:opacity-30 disabled:grayscale disabled:translate-y-0 relative overflow-hidden"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-3">
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <span>Transmission...</span>
            </div>
          ) : (
            <span className="flex items-center justify-center gap-2">
              Envoyer mon avis
            </span>
          )}
          {/* Effet brillant au survol */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:animate-[shimmer_2s_infinite]" />
        </button>

      </div>
    </div>
  );
}