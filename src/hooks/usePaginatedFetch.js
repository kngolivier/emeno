// FILE: src/hooks/usePaginatedFetch.js

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";

export const usePaginatedFetch = (fetchFn, initialLimit = 10) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? initialLimit);
  const status = searchParams.get("status") || "ALL";
  const search = searchParams.get("search") || "";

  const [data, setData] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // On passe tous les paramètres au backend
      const res = await fetchFn({ page, limit, status, search });
      setData(res?.data?.data ?? res?.data ?? []);
      setMeta(res?.data?.meta ?? res?.meta ?? null);
    } catch (err) {
      console.error("Erreur fetch paginé:", err);
    } finally {
      setLoading(false);
    }
  }, [fetchFn, page, limit, status, search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handlers pour modifier l'URL (qui déclenchent le useEffect)
  const setPage = (newPage) => updateParams({ page: newPage });
  const setSearch = (newSearch) => updateParams({ search: newSearch, page: 1 });
  const setStatus = (newStatus) => updateParams({ status: newStatus, page: 1 });

  const updateParams = (newParams) => {
    setSearchParams((prev) => {
      const current = Object.fromEntries(prev.entries());
      return { ...current, ...newParams };
    });
  };

  return { data, meta, loading, page, limit, search, setPage, setSearch, setStatus, refresh: fetchData };
};