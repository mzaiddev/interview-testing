import { useState, useRef, useCallback } from "react";
import useApi from "./useApi";

export default function useUsers() {
  const [users, setUsers] = useState([]);
  const [localError, setLocalError] = useState(null);
  const timerRef = useRef(null);
  const { request } = useApi();
  const [loading, setLoading] = useState(false);

  const fetchAll = useCallback(async () => {
    setLocalError(null);
    setLoading(true);
    try {
      const { ok, status, data } = await request("/user");
      if (ok) {
        setUsers(Array.isArray(data) ? data : []);
      } else {
        setUsers([]);
        setLocalError(`Failed to fetch users (status ${status})`);
      }
    } finally {
      setLoading(false);
    }
  }, [request]);

  const fetchById = useCallback(
    async (id) => {
      if (!id) return fetchAll();
      setLocalError(null);
      setLoading(true);
      try {
        const { ok, status, data } = await request(`/user/${id}`);
        if (status === 404) {
          setUsers([]);
          setLocalError("User not found");
          return;
        }
        if (ok) {
          setUsers(data ? [data] : []);
        } else {
          setUsers([]);
          setLocalError(`Failed to fetch user (status ${status})`);
        }
      } finally {
        setLoading(false);
      }
    },
    [fetchAll, request],
  );
  const debouncedSearch = useCallback(
    (id, delay = 500) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        fetchById(id);
      }, delay);
    },
    [fetchById],
  );

  return {
    users,
    loading,
    error: localError,
    fetchAll,
    fetchById,
    debouncedSearch,
  };
}
