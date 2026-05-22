// FILE: src/utils/dataMapper.js

export const normalizePartner = (p) => {
  if (!p) return null;

  return {
    ...p,
    // Gérer l'ID MongoDB ($oid ou string)
    _id: p._id?.$oid || p._id, 
    
    // Extraire l'image proprement
    image: p.logo?.url || p.coverImage?.url || "",
    
    // Extraire l'adresse
    address: typeof p.address === "object" ? p.address.text : (p.address || "Non renseigné"),
    
    // Normaliser le téléphone
    phone: p.telephone || p.phone || "",
    
    // S'assurer que les produits existent
    products: p.products || []
  };
};