// FILE: src/api/communes.api.js

import API from "./apiClient";
import { ENDPOINTS } from "./endpoints";

/**
 * Récupère toutes les communes (Actives pour clients, toutes pour Admin)
 */
export const fetchCommunes = () => {
  return API.get(ENDPOINTS.COMMUNES);
};

/**
 * Crée une nouvelle commune (Admin uniquement)
 */
export const createCommune = (payload) => {
  return API.post(ENDPOINTS.COMMUNES, payload);
};

/**
 * Met à jour une commune existante
 */
export const updateCommune = (id, payload) => {
  return API.put(ENDPOINTS.COMMUNE_BY_ID(id), payload);
};

/**
 * Supprime une commune
 */
export const deleteCommune = (id) => {
  return API.delete(ENDPOINTS.COMMUNE_BY_ID(id));
};