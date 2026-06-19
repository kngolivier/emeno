// FILE: src/hooks/usePaginatedFetch.js

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";

export const usePaginatedFetch = (fetchFn, initialLimit = 10, filters = {}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? initialLimit);
  const status = searchParams.get("status") || "ALL";
  const search = searchParams.get("search") || "";

  // Utilisation de useRef pour le debounce afin d'éviter les re-renders inutiles
  const debounceTimer = useRef(null);

  const [data, setData] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Fusion des paramètres URL et des filtres complexes
      const res = await fetchFn({ page, limit, status, search, ...filters });
      setData(res?.data?.data ?? res?.data ?? []);
      setMeta(res?.data?.meta ?? res?.meta ?? null);
    } catch (err) {
      console.error("Erreur fetch paginé:", err);
    } finally {
      setLoading(false);
    }
  // Dépendance sur JSON.stringify(filters) pour détecter les changements d'objet
  }, [fetchFn, page, limit, status, search, JSON.stringify(filters)]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const setPage = (newPage) => updateParams({ page: newPage });
  const setStatus = (newStatus) => updateParams({ status: newStatus, page: 1 });

  // Fonction de mise à jour avec debounce pour la recherche
  const updateParams = (newParams, useDebounce = false) => {
    if (useDebounce && newParams.search !== undefined) {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        applyParams(newParams);
      }, 500); // 500ms d'attente avant de lancer la recherche
    } else {
      applyParams(newParams);
    }
  };
  const applyParams = (newParams) => {
    setSearchParams((prev) => {
      const current = Object.fromEntries(prev.entries());
      return { ...current, ...newParams };
    });
  };

  return { data, meta, loading, page, limit, setPage, setStatus, search, updateParams, refresh: fetchData };
};