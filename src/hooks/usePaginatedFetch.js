// FILE: src/hooks/usePaginatedFetch.js

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";

export const usePaginatedFetch = (fetchFn, initialLimit = 10, filters = {}, isInfinite = false) => {
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
      const res = await fetchFn({ page, limit, status, search, ...filters });
      const newData = res?.data?.data ?? res?.data ?? [];
      const newMeta = res?.data?.meta ?? res?.meta ?? null;

      setData((prevData) => {
        // Si isInfinite est true ET qu'on est pas sur la page 1, on ajoute
        if (isInfinite && page > 1) {
          return [...prevData, ...newData];
        }
        // Sinon, on remplace (comportement par défaut)
        return newData;
      });
      
      setMeta(newMeta);
    } catch (err) {
      console.error("Erreur fetch paginé:", err);
    } finally {
      setLoading(false);
    }
  }, [fetchFn, page, limit, status, search, JSON.stringify(filters), isInfinite]);

  useEffect(() => {
    // Si la page est 1 (qu'on vient de lancer une recherche ou de charger la page), 
    // on peut vider les données pour éviter un effet de "flash" ou de concaténation erronée
    if (page === 1) {
        setData([]); 
    }
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
      }, 250); // 500ms d'attente avant de lancer la recherche
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