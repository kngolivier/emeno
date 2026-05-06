// //  FILE: src/pages/driver-portal/DeliveryDetail.jsx

// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { MapPin, Phone, ShieldCheck, ArrowLeft } from "lucide-react";
// import api from "../api/axios";

// export default function DeliveryDetail() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [delivery, setDelivery] = useState(null);
//   const [code, setCode] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     api.get(`/deliveries/${id}`).then(res => setDelivery(res.data));
//   }, [id]);

//   const handleValidate = async () => {
//     setLoading(true);
//     try {
//       await api.post(`/deliveries/${id}/validate`, { code });
//       alert("Livraison validée !");
//       navigate("/driver/deliveries");
//     } catch (err) {
//       alert("Code invalide");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!delivery) return null;

//   return (
//     <div className="space-y-6">
//       <button onClick={() => navigate(-1)} className="p-2 bg-muted/10 rounded-full"><ArrowLeft size={18}/></button>
      
//       <div className="bg-primary text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
//         <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/20 rounded-full -mr-16 -mt-16 blur-3xl" />
//         <p className="text-[10px] font-black uppercase opacity-60 tracking-[0.2em] mb-2">Détails de la course</p>
//         <h2 className="text-3xl font-black italic">#{delivery.orderNumber}</h2>
//       </div>

//       {/* Points de trajet */}
//       <div className="bg-card dark:bg-primary-light p-6 rounded-[2rem] border border-muted/10 space-y-6">
//         <div className="flex gap-4">
//           <div className="flex flex-col items-center gap-1">
//             <div className="w-3 h-3 rounded-full bg-secondary" />
//             <div className="w-0.5 h-full bg-muted/20" />
//           </div>
//           <div>
//             <p className="text-[8px] font-black uppercase text-muted">Ramassage</p>
//             <p className="text-xs font-bold">{delivery.pickupLocation}</p>
//           </div>
//         </div>
//         <div className="flex gap-4">
//           <div className="w-3 h-3 rounded-full border-2 border-secondary bg-transparent" />
//           <div>
//             <p className="text-[8px] font-black uppercase text-muted">Destination</p>
//             <p className="text-xs font-bold">{delivery.dropoffLocation}</p>
//           </div>
//         </div>
//       </div>

//       {/* Action Validation */}
//       {delivery.status === 'IN_PROGRESS' && (
//         <div className="bg-white dark:bg-primary-light p-6 rounded-[2rem] shadow-inner border border-secondary/20">
//           <label className="block text-[10px] font-black uppercase text-center mb-4 italic">Code de validation</label>
//           <input 
//             type="text" 
//             value={code}
//             onChange={(e) => setCode(e.target.value)}
//             placeholder="000000"
//             className="w-full bg-muted/5 border-2 border-dashed border-muted/20 rounded-2xl p-4 text-center text-2xl font-black tracking-[0.5em] focus:border-secondary outline-none transition-all"
//           />
//           <button 
//             disabled={code.length < 6 || loading}
//             onClick={handleValidate}
//             className="w-full mt-4 bg-secondary text-primary font-black py-4 rounded-2xl uppercase italic flex items-center justify-center gap-2 disabled:opacity-50"
//           >
//             <ShieldCheck size={20} />
//             {loading ? "Validation..." : "Confirmer la remise"}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }