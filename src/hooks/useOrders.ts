"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchOrders } from "@/lib/api";
import type { Order } from "@/types/order";

export function useOrders(customerId: number | null, page: number, perPage: number) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    if (!customerId) {
      setOrders([]);
      setTotal(0);
      return;
    }
    setLoading(true);
    setError(null);
    fetchOrders(customerId, page, perPage)
      .then(({ orders: o, total: t }) => {
        setOrders(o);
        setTotal(t);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [customerId, page, perPage]);

  useEffect(() => {
    load();
  }, [load]);

  return { orders, total, loading, error, refetch: load };
}
