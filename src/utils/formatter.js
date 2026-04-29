// FILE: src/utils/formatters.js

export const formatCommune = (value) => {
  if (!value) return "";
  return value
    .toLowerCase()
    .split("_")
    .join(" ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
};