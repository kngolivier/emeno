import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { orders as mockOrders } from "../../data/mockOrders";
import { ChevronLeft, User, Truck, CreditCard, Clock, PackageCheck } from "lucide-react";

export default function OrderTracking() {
  const { id } = useParams();
  const order = mockOrders.find(o => o.id === Number(id));
  const [userPosition, setUserPosition] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => setUserPosition([pos.coords.latitude, pos.coords.longitude]),
        err => console.error("Erreur géolocalisation:", err)
      );
    }
  }, []);

  if (!order) return (
    <div className="text-center py-20">
      <p className="text-slate-500">Commande introuvable</p>
      <Link to="/orders" className="text-blue-600 font-medium mt-4 inline-block">Retour aux commandes</Link>
    </div>
  );

  const livreurPosition = order.livreurPosition || [6.5244, 3.3792];
  const clientPosition = order.clientPosition || [6.5250, 3.3800];

  const steps = [
    { label: "Commande confirmée", time: "10:30", done: true },
    { label: "En préparation", time: "10:45", done: true },
    { label: "En cours de livraison", time: "11:15", done: order.status !== "En attente" },
    { label: "Livrée", time: "--:--", done: order.status === "Livrée" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/orders" className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
          <ChevronLeft size={20} className="text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Suivi Commande #{String(order.id).slice(0, 8)}
          </h1>
          <p className="text-sm text-slate-500 flex items-center gap-1">
            <Clock size={14} /> Passée le {order.date}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Infos & Timeline */}
        <div className="lg:col-span-1 space-y-6">
          {/* Cartes infos */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center shadow-md">
                <User size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Client</p>
                <p className="font-semibold text-slate-800">{order.customer}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
              <div className="w-10 h-10 bg-emerald-600 text-white rounded-lg flex items-center justify-center shadow-md">
                <Truck size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Livreur</p>
                <p className="font-semibold text-slate-800">{order.driver}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
              <div className="w-10 h-10 bg-amber-500 text-white rounded-lg flex items-center justify-center shadow-md">
                <CreditCard size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total</p>
                <p className="font-bold text-slate-800">{(order.total * 655).toLocaleString()} FCFA</p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
              <PackageCheck size={18} className="text-blue-600" /> État de l'expédition
            </h3>
            <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
              {steps.map((step, index) => (
                <div key={index} className="relative pl-8 group">
                  <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-white shadow-sm transition-colors ${step.done ? 'bg-blue-600 ring-2 ring-blue-50' : 'bg-slate-200'}`}></div>
                  <div className="flex justify-between items-start">
                    <p className={`text-sm font-semibold ${step.done ? 'text-slate-800' : 'text-slate-400'}`}>{step.label}</p>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{step.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Carte avec position utilisateur */}
        <div className="lg:col-span-2 flex justify-center">
          <div className="w-full max-w-xl h-[350px] rounded-2xl overflow-hidden border-2 border-slate-200 shadow-lg">
            <MapContainer center={livreurPosition} zoom={13} className="w-full h-full">
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {/* Marqueur livreur */}
              <Marker position={livreurPosition}>
                <Popup>{order.driver} est en route !</Popup>
              </Marker>
              {/* Marqueur client */}
              <Marker position={clientPosition}>
                <Popup>{order.customer} - Adresse</Popup>
              </Marker>
              {/* Marqueur utilisateur (position actuelle) */}
              {userPosition && (
                <Marker position={userPosition}>
                  <Popup>Vous êtes ici</Popup>
                </Marker>
              )}
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
}