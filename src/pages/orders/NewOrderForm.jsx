import { useState } from "react";
import { Plus, User, Truck, MapPin, Package, Phone, Banknote, X } from "lucide-react";

export default function NewOrderForm({ onAdd, onClose }) {
  const [formData, setFormData] = useState({
    customer: "",
    driver: "",
    total: "",
    pickupLocation: "",
    deliveryLocation: "",
    packageType: "",
    recipientPhone: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { customer, driver, total, pickupLocation, deliveryLocation, packageType, recipientPhone } = formData;
    
    if (!customer || !driver || !total) return;

    const newOrder = {
      ...formData,
      id: Date.now(),
      total: parseFloat(total),
      status: "En attente",
      date: new Date().toLocaleDateString("fr-FR"),
      livreurPosition: [6.5244, 3.3792],
      clientPosition: [6.5250, 3.3800],
    };

    onAdd(newOrder);
    onClose?.(); // Ferme le formulaire si une fonction est passée
  };

  const inputStyle = "w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-blue-50 focus:border-blue-400 focus:bg-white transition-all outline-none";
  const labelStyle = "text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1 block";

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl overflow-hidden max-w-2xl mx-auto">
      {/* Header du Formulaire */}
      <div className="px-8 py-6 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Nouvelle Expédition</h2>
          <p className="text-sm text-slate-500">Remplissez les détails pour créer une course.</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
            <X size={20} />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        
        {/* Section 1 : Acteurs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelStyle}>Client </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input name="customer" type="text" placeholder="Ex: Jean Dupont" value={formData.customer} onChange={handleChange} className={inputStyle} required />
            </div>
          </div>
          <div>
            <label className={labelStyle}>Livreur assigné</label>
            <div className="relative">
              <Truck className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input name="driver" type="text" placeholder="Sélectionner un livreur" value={formData.driver} onChange={handleChange} className={inputStyle} required />
            </div>
          </div>
        </div>

        {/* Section 2 : Logistique */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelStyle}>Point de départ</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
                <input name="pickupLocation" type="text" placeholder="Lieu de ramassage" value={formData.pickupLocation} onChange={handleChange} className={inputStyle} required />
              </div>
            </div>
            <div>
              <label className={labelStyle}>Point d'arrivée</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500" size={18} />
                <input name="deliveryLocation" type="text" placeholder="Destination finale" value={formData.deliveryLocation} onChange={handleChange} className={inputStyle} required />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelStyle}>Type de colis</label>
              <div className="relative">
                <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input name="packageType" type="text" placeholder="Ex: Électronique, Repas..." value={formData.packageType} onChange={handleChange} className={inputStyle} required />
              </div>
            </div>
            <div>
              <label className={labelStyle}>Contact destinataire</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input name="recipientPhone" type="tel" placeholder="+241 6xx xxx xxx" value={formData.recipientPhone} onChange={handleChange} className={inputStyle} required />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3 : Paiement */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-6">
          <div className="flex-1">
            <label className={labelStyle}>Montant Total (FCFA)</label>
            <div className="relative">
              <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600" size={18} />
              <input name="total" type="number" placeholder="0" value={formData.total} onChange={handleChange} className={`${inputStyle} font-bold text-lg`} required />
            </div>
          </div>
          <div className="flex items-end pt-5">
            <button type="submit" className="w-full md:w-auto bg-[#002E1B]  text-white px-10 py-3 rounded-2xl hover:bg-[#B08D3E]   transition-all shadow-lg shadow-blue-200 font-bold flex items-center gap-2">
              <Plus size={20} />
              Créer la commande
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
