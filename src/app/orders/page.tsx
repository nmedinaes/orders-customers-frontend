"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchOrders } from "@/lib/api";
import { fetchCustomers } from "@/lib/api";
import type { Order } from "@/types/order";
import type { Customer } from "@/types/customer";

const PER_PAGE = 20;

export default function OrdersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(
    null
  );
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCustomers()
      .then(setCustomers)
      .catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    if (!selectedCustomerId) {
      setOrders([]);
      setTotal(0);
      return;
    }
    setLoading(true);
    setError(null);
    fetchOrders(selectedCustomerId, page, PER_PAGE)
      .then(({ orders: o, total: t }) => {
        setOrders(o);
        setTotal(t);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [selectedCustomerId, page]);

  const totalPages = Math.ceil(total / PER_PAGE);
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return (
    <div className="min-h-screen bg-zinc-50 p-6">
      <div className="mx-auto max-w-4xl">
        <nav className="mb-6 flex items-center gap-4">
          <Link
            href="/"
            className="text-zinc-600 hover:text-zinc-900 underline"
          >
            Inicio
          </Link>
          <span className="text-zinc-400">/</span>
          <span className="font-medium">Listado de pedidos</span>
        </nav>

        <div className="mb-6 flex flex-wrap items-center gap-4">
          <h1 className="text-2xl font-semibold text-zinc-900">
            Listado de pedidos
          </h1>
          <Link
            href="/orders/new"
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Crear pedido
          </Link>
        </div>

        <div className="mb-4">
          <label
            htmlFor="customer"
            className="mb-1 block text-sm font-medium text-zinc-700"
          >
            Cliente
          </label>
          <select
            id="customer"
            value={selectedCustomerId ?? ""}
            onChange={(e) => {
              setSelectedCustomerId(
                e.target.value ? Number(e.target.value) : null
              );
              setPage(1);
            }}
            className="w-full max-w-xs rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
          >
            <option value="">Selecciona un cliente</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.customer_name} (ID: {c.id})
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-zinc-600">Cargando...</p>
        ) : !selectedCustomerId ? (
          <p className="text-zinc-600">
            Selecciona un cliente para ver sus pedidos.
          </p>
        ) : orders.length === 0 ? (
          <p className="text-zinc-600">No hay pedidos para este cliente.</p>
        ) : (
          <>
            <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow">
              <table className="min-w-full divide-y divide-zinc-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                      ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                      Producto
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                      Cantidad
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                      Precio
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {orders.map((o) => (
                    <tr key={o.id}>
                      <td className="whitespace-nowrap px-4 py-3 text-zinc-900">
                        {o.id}
                      </td>
                      <td className="px-4 py-3 text-zinc-900">
                        {o.product_name}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-zinc-900">
                        {o.quantity}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-zinc-900">
                        {o.price}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-700">
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-zinc-600">
                  Mostrando {(page - 1) * PER_PAGE + 1} -{" "}
                  {Math.min(page * PER_PAGE, total)} de {total} resultados
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={!hasPrev}
                    className="rounded-md border border-zinc-300 px-3 py-1 text-sm disabled:opacity-50"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={!hasNext}
                    className="rounded-md border border-zinc-300 px-3 py-1 text-sm disabled:opacity-50"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
