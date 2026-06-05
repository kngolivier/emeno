// FILE: src/pages/partner-portal/AddProductModal.jsx

import React, { useState, useEffect } from "react";
import { X, Upload, Package, DollarSign, Tag, AlignLeft, Loader2 } from "lucide-react";
import { createProduct } from "../../api/products.api";
import { notifySuccess, notifyError } from "../../utils/notify";

export default function AddProductModal({ onClose, onSuccess, partnerId }) {
  const [formData, setFormData] = useState({ 
    name: "", price: "", description: "", category: "", image: null 
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Nettoyage de la mémoire pour l'URL de l'image
  useEffect(() => {
    return () => preview && URL.revokeObjectURL(preview);
  }, [preview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const data = new FormData();
    Object.entries({ ...formData, partner: partnerId }).forEach(([key, val]) => data.append(key, val));

    try {
      await createProduct(data);
      notifySuccess("Produit ajouté avec succès");
      onSuccess();
      onClose();
    } catch (err) {
      notifyError(err?.response?.data?.message || "Erreur lors de l'ajout");
    } finally {
      setLoading(false);
    }
  };

const inputStyles = "w-full p-4 pl-11 bg-slate-50 dark:bg-slate-800 rounded-2xl text-xs font-bold uppercase border border-transparent focus:border-secondary outline-none dark:text-white transition-all";
const iconStyles = "absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none";
  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-lg shadow-2xl border dark:border-slate-800 overflow-hidden">
        
        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center border-b dark:border-slate-800">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
            <Package size={16} /> Nouveau Produit
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Image Upload */}
          <div className="flex items-center gap-4">
            <label className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center cursor-pointer border-2 border-dashed border-slate-200 hover:border-secondary transition-all overflow-hidden shrink-0">
              {preview ? <img src={preview} className="w-full h-full object-cover" alt="preview" /> : <Upload size={20} />}
              <input type="file" name="image" className="hidden" accept="image/*" onChange={handleImageChange} required />
            </label>
            <div className="text-[9px] font-bold text-slate-400">
              Photo du produit<br/>JPG/PNG, Max 2MB
            </div>
          </div>

          {/* Champs */}
          <div className="space-y-4">
            {/* Nom */}
            <div className="relative">
              <input name="name" placeholder="Nom du produit" className={inputStyles} onChange={handleChange} required />
              <Package size={14} className={iconStyles} />
            </div>

            {/* Prix & Catégorie */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <input type="number" name="price" placeholder="Prix" min="0" className={inputStyles} onChange={handleChange} required />
                <DollarSign size={14} className={iconStyles} />
              </div>
              <div className="relative">
                <input name="category" placeholder="Catégorie" className={inputStyles} onChange={handleChange} />
                <Tag size={14} className={iconStyles} />
              </div>
            </div>

            {/* Description */}
            <div className="relative">
              <textarea name="description" placeholder="Description..." className={`${inputStyles} min-h-[100px] resize-none`} onChange={handleChange} />
              {/* Pour le textarea, on peut garder top-5 si on veut que l'icône soit alignée avec le début du texte */}
              <AlignLeft size={14} className="absolute left-4 top-5 text-slate-400" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full py-4 bg-primary text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2">
            {loading ? <Loader2 size={16} className="animate-spin" /> : "Valider l'ajout"}
          </button>
        </form>
      </div>
    </div>
  );
}