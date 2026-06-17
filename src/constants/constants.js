// FILE: src/constants/constants.js

export const STATUS_LABELS = {
  PENDING: "En attente",
  ASSIGNED: "Assigné",
  PICKED_UP: "Récupéré",
  IN_PROGRESS: "En cours",
  DELIVERED: "Livré",
  CANCELLED: "Annulé"
};

export const STATUS_COLORS = {
  PENDING: "bg-amber-100 text-amber-600 border-amber-200",
  ASSIGNED: "bg-blue-100 text-blue-600 border-blue-200",
  PICKED_UP: "bg-indigo-100 text-indigo-600 border-indigo-200",
  IN_PROGRESS: "bg-secondary/10 text-secondary border-secondary/20",
  DELIVERED: "bg-success/10 text-success border-success/20",
  CANCELLED: "bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-800 dark:border-slate-700"
};

export const CATEGORY_LABELS = {
  FOOD: "Nourriture",
  MEDICINE: "Médicaments",
  JEWELRY: "Bijoux & Luxe",
  DOCUMENT: "Documents",
  ELECTRONICS: "Électronique",
  OTHER: "Autre"
};

export const ROLE_LABELS = {
  ADMIN: "Admin",
  SUPER_ADMIN: "Super Admin",
  DRIVER: "Livreur",
  CLIENT: "Client",
  PARTNER_MANAGER: "Partenaire"
};

export const STATUS_USER_LABELS = {
  ALL: "Tous les comptes",
  ACTIVE: "Actif",
  INACTIVE: "Inactif",
  BLOCKED:  "Bloqué",
  PENDING: "En attente",
  DELETED: "Supprimé"
};

export const MODE_LABELS = {
  BASE_PRICING: "Tarification de base",
  WHATSAPP_ONLY: "WhatsApp uniquement"
};

export const FEEDBACK_STATUS_LABELS = {
  PENDING: "En attente",
  RESOLVED: "Résolu",
  HIDDEN: "Masqué",
  READ: "Lu"
};