import React, { useState } from "react";
import { X, Upload, Package, DollarSign, Tag, Image as ImageIcon, AlignLeft, Loader2 } from "lucide-react";
import { createProduct } from "../../api/products.api";
import { notifySuccess, notifyError } from "../../utils/notify";

export default function AddProductModal({ onClose, onSuccess, partnerId }) {
  const [formData, setFormData] = useState({ 
    name: "", 
    price: "", 
    description: "", 
    category: "", 
    image: null 
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const data = new FormData();
    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("description", formData.description);
    data.append("category", formData.category);
    data.append("image", formData.image);
    data.append("partner", partnerId);

    try {
      await createProduct(data);
      notifySuccess("Produit ajouté au catalogue avec succès");
      onSuccess();
      onClose();
    } catch (err) {
      notifyError(err?.response?.data?.message || "Impossible d'ajouter le produit.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-300">
        
        {/* HEADER */}
        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white flex items-center gap-2">
            <Package size={16} /> Ajouter au catalogue
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-400">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* IMAGE UPLOAD */}
          <div className="flex items-center gap-4">
            <label className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-2xl flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-secondary transition-all overflow-hidden group">
              {preview ? (
                <img src={preview} className="w-full h-full object-cover" alt="preview" />
              ) : (
                <Upload size={20} className="text-slate-400 group-hover:text-secondary transition-colors" />
              )}
              <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} required />
            </label>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Photo du produit</p>
              <p className="text-[9px] text-slate-400">Format recommandé: JPG/PNG</p>
            </div>
          </div>

          {/* INPUTS */}
          <div className="space-y-4">
            <div className="relative">
              <input 
                placeholder="Nom du produit" 
                className="w-full p-4 pl-10 bg-slate-50 dark:bg-slate-800 rounded-2xl text-xs font-bold uppercase tracking-wide border border-transparent focus:border-secondary outline-none dark:text-white" 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                required 
              />
              <Package size={14} className="absolute left-4 top-4.5 text-slate-400" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <input 
                  type="number"
                  placeholder="Prix" 
                  className="w-full p-4 pl-10 bg-slate-50 dark:bg-slate-800 rounded-2xl text-xs font-bold uppercase tracking-wide border border-transparent focus:border-secondary outline-none dark:text-white" 
                  onChange={(e) => setFormData({...formData, price: e.target.value})} 
                  required 
                />
                <DollarSign size={14} className="absolute left-4 top-4.5 text-slate-400" />
              </div>
              <div className="relative">
                <input 
                  placeholder="Catégorie" 
                  className="w-full p-4 pl-10 bg-slate-50 dark:bg-slate-800 rounded-2xl text-xs font-bold uppercase tracking-wide border border-transparent focus:border-secondary outline-none dark:text-white" 
                  onChange={(e) => setFormData({...formData, category: e.target.value})} 
                />
                <Tag size={14} className="absolute left-4 top-4.5 text-slate-400" />
              </div>
            </div>

            <div className="relative">
              <textarea 
                placeholder="Description du produit..." 
                className="w-full p-4 pl-10 bg-slate-50 dark:bg-slate-800 rounded-2xl text-xs font-bold tracking-wide border border-transparent focus:border-secondary outline-none min-h-[100px] dark:text-white resize-none"
                onChange={(e) => setFormData({...formData, description: e.target.value})} 
              />
              <AlignLeft size={14} className="absolute left-4 top-4.5 text-slate-400" />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full py-4 bg-primary text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : "Valider l'ajout"}
          </button>
        </form>
      </div>
    </div>
  );
}