// FILE: src/utils/imageUtils.js

/**
 * Optimise une URL Cloudinary en injectant des paramètres de transformation.
 * @param {string} url - L'URL originale de l'image.
 * @param {string} options - Les transformations Cloudinary (défaut: fill, auto-format, auto-qualité).
 */
export const getCloudinaryUrl = (url, options = "c_fill,f_auto,q_auto") => {
  if (!url || typeof url !== "string") return null;
  
  // Si l'URL contient déjà des transformations, on ne modifie rien
  if (url.includes(`/upload/${options}/`)) return url;

  // On injecte les options après /upload/
  return url.replace("/upload/", `/upload/${options}/`);
};