"use client";

import { useState, useEffect, useRef } from "react";
import { fetchCustomers } from "@/lib/api";
import type { Customer } from "@/types/customer";

const CACHE_TTL_MS = 60_000;

let cached: Customer[] | null = null;
let cacheTime = 0;

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    if (cached && Date.now() - cacheTime < CACHE_TTL_MS) {
      setCustomers(cached);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    fetchCustomers()
      .then((data) => {
        if (mounted.current) {
          cached = data;
          cacheTime = Date.now();
          setCustomers(data);
        }
      })
      .catch((e) => {
        if (mounted.current) setError(e.message);
      })
      .finally(() => {
        if (mounted.current) setLoading(false);
      });
    return () => {
      mounted.current = false;
    };
  }, []);

  return { customers, loading, error };
}
