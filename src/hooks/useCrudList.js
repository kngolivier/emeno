// FILE: src/hooks/useCrudList.js

import { useEffect, useState } from "react";

export function useCrudList(fetchFn, { normalize = (d) => d } = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchFn();
      setData(normalize(res));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const refresh = () => load();

  return {
    data,
    setData,
    loading,
    refresh,
  };
}