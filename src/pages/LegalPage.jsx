// src/pages/LegalPage.jsx
import { useParams } from "react-router-dom";

export default function LegalPage() {
  const { type } = useParams(); // 'cgu' ou 'confidentialite'
  const fileMap = {
    cgu: "/docs/cgu.pdf",
    confidentialite: "/docs/confidentialite.pdf"
  };

  return (
    <div className="h-screen w-full p-4 md:p-10">
      <iframe 
        src={fileMap[type]} 
        className="w-full h-full rounded-2xl border border-slate-200"
        title="Document légal"
      />
    </div>
  );
}