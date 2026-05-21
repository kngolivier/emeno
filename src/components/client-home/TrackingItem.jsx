export default function TrackingItem({ label, active }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-3 h-3 rounded-full ${active ? "bg-secondary" : "bg-white/20"}`} />
      <span className="text-white/70 text-sm">{label}</span>
    </div>
  );
}