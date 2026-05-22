import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Plus, Trash2, Package, AlertTriangle, X } from "lucide-react";
import { fetchPartnerProducts, deleteProduct } from "../../api/products.api";
import { notifySuccess, notifyError } from "../../utils/notify";
import AddProductModal from "./AddProductModal";
import PageLoader from "../../components/ui/PageLoader";

export default function PartnerCatalog() {
  const { currentPartner } = useOutletContext();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const loadCatalog = async () => {
    if (!currentPartner?._id) return;
    setLoading(true);
    try {
      const res = await fetchPartnerProducts(currentPartner._id);
      setProducts(res.data || []);
    } catch (err) {
      notifyError("Erreur lors du chargement du catalogue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCatalog();
  }, [currentPartner?._id]);

  const handleDelete = async () => {
    if (!productToDelete) return;
    try {
      await deleteProduct(productToDelete._id);
      notifySuccess("Produit supprimé avec succès");
      loadCatalog();
      setProductToDelete(null);
    } catch (err) {
      notifyError("Impossible de supprimer le produit");
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-8 pb-10 transition-colors duration-300">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-6 pt-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white italic tracking-tighter uppercase">
            Catalogue
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black mt-1 uppercase tracking-[0.2em]">
            Gestion de la vitrine EMENO
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-primary text-white hover:opacity-90 transition-all shadow-xl text-[10px] font-black uppercase tracking-widest"
        >
          <Plus size={16} strokeWidth={3} /> Ajouter Produit
        </button>
      </div>

      {/* EMPTY STATE */}
      {products.length === 0 ? (
        <div className="mx-6 flex flex-col items-center justify-center py-20 bg-white dark:bg-white/[0.02] border border-dashed border-slate-200 dark:border-white/10 rounded-[3rem] text-center space-y-4">
          <div className="w-20 h-20 bg-slate-50 dark:bg-white/5 rounded-[2rem] flex items-center justify-center text-slate-300 dark:text-slate-700">
             <Package size={40} strokeWidth={1.5} />
          </div>
          <h3 className="font-black text-xl italic text-slate-900 dark:text-white uppercase tracking-tight">Catalogue vide</h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-medium max-w-[250px] mx-auto mt-2">
            Commencez à construire votre vitrine en ajoutant votre premier article.
          </p>
        </div>
      ) : (
        <div className="px-6">
          {/* --- VUE MOBILE : CARDS --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
            {products.map((p) => (
              <div key={p._id} className="bg-white dark:bg-white/[0.03] p-6 rounded-[2.5rem] border border-slate-100 dark:border-white/5 flex gap-4">
                <img src={p.imageUrl} alt={p.name} className="w-16 h-16 rounded-2xl object-cover shadow-sm" />
                <div className="flex-1">
                  <h3 className="font-black text-slate-900 dark:text-white italic text-sm tracking-tight uppercase">{p.name}</h3>
                  <p className="text-[10px] font-bold text-secondary">{p.price.toLocaleString("fr-FR")} FCFA</p>
                </div>
                <button onClick={() => setProductToDelete(p)} className="text-slate-300 hover:text-rose-500 transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          {/* --- VUE DESKTOP : TABLEAU --- */}
          <div className="hidden lg:block bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-[2.5rem] shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 dark:bg-white/5 border-b border-slate-200 dark:border-white/5">
                <tr>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Produit</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Catégorie</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Prix</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/30 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="p-6 flex items-center gap-4">
                      <img src={p.imageUrl} alt={p.name} className="w-12 h-12 rounded-xl object-cover" />
                      <span className="font-black text-slate-900 dark:text-white italic uppercase">{p.name}</span>
                    </td>
                    <td className="p-6 text-sm text-slate-500 font-bold">{p.category || "-"}</td>
                    <td className="p-6 text-sm font-bold text-secondary">{p.price.toLocaleString("fr-FR")} FCFA</td>
                    <td className="p-6 text-right">
                      <button onClick={() => setProductToDelete(p)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL AJOUT */}
      {isModalOpen && (
        <AddProductModal 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={loadCatalog} 
          partnerId={currentPartner._id} 
        />
      )}

      {/* MODAL CONFIRMATION SUPPRESSION */}
      {productToDelete && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/40 backdrop-blur-xl p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-lg font-black text-center text-slate-900 dark:text-white uppercase tracking-tight mb-2">Supprimer ?</h3>
            <p className="text-xs text-slate-400 text-center mb-8">
              Êtes-vous sûr de vouloir supprimer <span className="font-bold text-slate-900 dark:text-white">"{productToDelete.name}"</span> ? Cette action est irréversible.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setProductToDelete(null)} className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-colors">
                Annuler
              </button>
              <button onClick={handleDelete} className="flex-1 py-3 rounded-xl bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-rose-700 transition-colors">
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}