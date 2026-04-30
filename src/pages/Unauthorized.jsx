// FILE: src/pages/Unauthorized.jsx

export default function Unauthorized() {
  return (
    <div className="h-screen flex items-center justify-center flex-col gap-4">
      <h1 className="text-2xl font-bold text-red-600">
        Accès refusé
      </h1>
      <p className="text-slate-500">
        Vous n'avez pas les permissions nécessaires.
      </p>
    </div>
  );
}