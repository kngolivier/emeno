import { Truck, MapPin } from "lucide-react";
import TrackingItem from "./TrackingItem";
import { STATUS_LABELS } from "../../constants/constants"

export default function HeroTrackingWidget({ activeDelivery }) {
  return (
    <div className="w-[360px] rounded-[2.5rem] border border-white/10 bg-black/20 backdrop-blur-2xl p-4 shadow-2xl">
      <div className="relative overflow-hidden rounded-[2rem] h-[430px] bg-gradient-to-br from-[#071120] via-[#0b1729] to-black">
        <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] bg-[length:24px_24px]" />
        <div className="absolute top-1/2 left-10 w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center">
          <Truck className="text-white" />
        </div>
        <div className="absolute left-4 right-4 bottom-4 rounded-[2rem] bg-white/5 backdrop-blur-xl p-5">
          <div className="flex justify-between">
            <div>
              <p className="text-[10px] uppercase text-white/40 font-black">Livraison active</p>
              <h4 className="text-white font-black text-xl mt-2">{STATUS_LABELS[activeDelivery?.status] || "En attente"}</h4>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex justify-center items-center">
              <MapPin className="text-secondary" />
            </div>
          </div>
          <div className="space-y-4 mt-5">
            <TrackingItem active label="Livreur assigné" />
            <TrackingItem active={["PICKED_UP", "IN_PROGRESS", "DELIVERED"].includes(activeDelivery?.status)} label="Colis récupéré" />
            <TrackingItem active={["IN_PROGRESS", "DELIVERED"].includes(activeDelivery?.status)} label="Livraison imminente" />
          </div>
        </div>
      </div>
    </div>
  );
}