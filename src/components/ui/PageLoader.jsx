// FILE: src/components/ui/PageLoader.jsx

import Loader from "./Loader";

export default function PageLoader() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-slate-50">
      <Loader size={55} text="Chargement..." />
    </div>
  );
}