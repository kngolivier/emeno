// FILE: src/api/products.api.js

import API from "./apiClient";
import { ENDPOINTS } from "./endpoints";

/**
 * Récupère le catalogue d'un partenaire spécifique
 */
export const fetchPartnerProducts = async (partnerId) => {
  return API.get(ENDPOINTS.GET_PRODUCTS_BY_PARTNER(partnerId));
};

/**
 * Ajoute un produit au catalogue
 * @param {FormData} productData - Doit contenir les champs (name, price, description, category, image)
 */
export const createProduct = async (productData) => {
  return API.post(ENDPOINTS.PRODUCTS, productData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/**
 * Supprime un produit du catalogue
 */
export const deleteProduct = async (productId) => {
  return API.delete(ENDPOINTS.DELETE_PRODUCT(productId));
};