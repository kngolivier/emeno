// FILE: src/hooks/usePaginatedFetch.js

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export const usePaginatedFetch = (fetchFn, initialLimit = 10) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? initialLimit);

  // récupération des filtres dynamiques
  const status = searchParams.get("status") || "ALL";

  const [data, setData] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);

    try {
      // passer un objet à la fonction
      const res = await fetchFn({
        page,
        limit,
        status
      });

      setData(res?.data?.data ?? res?.data ?? []);
      setMeta(res?.data?.meta ?? res?.meta ?? null);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, limit, status, fetchFn]);

  // ======================
  // PAGINATION
  // ======================
  const setPage = (newPage) => {
    setSearchParams((prev) => {
      const params = Object.fromEntries(prev.entries());

      return {
        ...params,
        page: newPage,
        limit
      };
    });
  };

  const setLimit = (newLimit) => {
    setSearchParams((prev) => {
      const params = Object.fromEntries(prev.entries());

      return {
        ...params,
        page: 1,
        limit: newLimit
      };
    });
  };

  // ======================
  // FILTER HANDLER
  // ======================
  const setStatus = (newStatus) => {
    setSearchParams((prev) => {
      const params = Object.fromEntries(prev.entries());

      return {
        ...params,
        page: 1, // reset pagination
        status: newStatus
      };
    });
  };

  return {
    data,
    meta,
    loading,
    page,
    limit,
    status,
    setPage,
    setLimit,
    setStatus,
    refresh: fetchData
  };
};