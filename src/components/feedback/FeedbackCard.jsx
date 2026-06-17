// FILE: src/components/feedback/FeedbackCard.jsx

export default function FeedbackCard({ feedback, onResolve }) {
  const isResolved = feedback.status === 'RESOLVED';
  
  return (
    <div className={`relative overflow-hidden bg-white dark:bg-slate-900 p-6 rounded-[2rem] border transition-all duration-300 hover:shadow-xl ${
      isResolved ? 'border-emerald-500/20' : 'border-slate-100 dark:border-slate-800'
    }`}>
      {/* Indicateur de status coloré sur le côté */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${isResolved ? 'bg-emerald-500' : 'bg-amber-500'}`} />

      <div className="flex justify-between items-start mb-5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-primary dark:text-white font-black">
            {feedback.authorId?.prenom?.[0]}
          </div>
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{feedback.authorRole}</p>
            <p className="text-xs font-bold text-slate-900 dark:text-white">{feedback.authorId?.prenom} {feedback.authorId?.nom}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-amber-500 bg-amber-50 dark:bg-amber-500/10 px-3 py-1 rounded-full font-black text-[10px]">
          <Star size={10} fill="currentColor" /> {feedback.rating}.0
        </div>
      </div>
      
      <p className="text-xs text-slate-600 dark:text-slate-400 italic mb-4 line-clamp-3">"{feedback.comment}"</p>

      {/* Action Button si non résolu */}
      {!isResolved && (
        <button 
          onClick={() => onResolve(feedback._id)}
          className="w-full py-2.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-[10px] font-black uppercase tracking-widest hover:border-emerald-500 hover:text-emerald-600 transition-colors"
        >
          Marquer comme résolu
        </button>
      )}
    </div>
  );
}