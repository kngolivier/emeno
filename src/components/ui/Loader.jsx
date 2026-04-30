// FILE: src/components/ui/Loader.jsx

export default function Loader({ size = 40, text = "Chargement..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      
      {/* Spinner */}
      <div
        className="animate-spin rounded-full border-4 border-slate-200 border-t-[#002E1B]"
        style={{
          width: size,
          height: size,
        }}
      />

      {/* Text */}
      {text && (
        <p className="mt-4 text-sm text-slate-500">
          {text}
        </p>
      )}
    </div>
  );
}