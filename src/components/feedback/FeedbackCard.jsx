import { Star, MessageSquare } from "lucide-react";

export default function FeedbackCard({ feedback }) {
  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-[2rem] border border-slate-50 dark:border-slate-800 shadow-soft">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-primary/5 dark:bg-secondary/10 flex items-center justify-center text-primary dark:text-secondary">
            <MessageSquare size={18} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic leading-none">
              {feedback.authorRole === 'CLIENT' ? 'Client' : 'Livreur'}
            </p>
            <p className="text-xs font-bold text-primary dark:text-white mt-0.5">
              {feedback.authorId.prenom} {feedback.authorId.nom}
            </p>
          </div>
        </div>
        <div className="flex items-center bg-amber-50 dark:bg-amber-500/10 px-3 py-1 rounded-lg">
          <Star size={12} className="text-amber-500 fill-amber-500 mr-1" />
          <span className="text-[10px] font-black text-amber-600 dark:text-amber-400">{feedback.rating}/5</span>
        </div>
      </div>
      
      <p className="text-[12px] text-slate-600 dark:text-slate-400 italic leading-relaxed">
        "{feedback.comment || "Aucun commentaire laissé."}"
      </p>

      {feedback.tags?.length > 0 && (
        <div className="flex gap-2 mt-4 flex-wrap">
          {feedback.tags.map((tag) => (
            <span key={tag} className="px-3 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 text-[9px] font-black uppercase text-slate-400 border border-slate-100 dark:border-slate-700">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}