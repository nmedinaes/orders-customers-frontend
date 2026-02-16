"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createOrder, fetchCustomers } from "@/lib/api";
import type { Customer } from "@/types/customer";

const STATUS_OPTIONS = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export default function NewOrderPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerId, setCustomerId] = useState("");
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("pending");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCustomers()
      .then(setCustomers)
      .catch((e) => setError(e.message));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await createOrder({
        customer_id: Number(customerId),
        product_name: productName,
        quantity: Number(quantity),
        price: Number(price),
        status,
      });
      router.push("/orders");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear el pedido");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-6">
      <div className="mx-auto max-w-md">
        <nav className="mb-6 flex items-center gap-4">
          <Link
            href="/"
            className="text-zinc-600 hover:text-zinc-900 underline"
          >
            Inicio
          </Link>
          <span className="text-zinc-400">/</span>
          <Link
            href="/orders"
            className="text-zinc-600 hover:text-zinc-900 underline"
          >
            Pedidos
          </Link>
          <span className="text-zinc-400">/</span>
          <span className="font-medium">Crear pedido</span>
        </nav>

        <h1 className="mb-6 text-2xl font-semibold text-zinc-900">
          Crear pedido
        </h1>

        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-zinc-200 bg-white p-6 shadow"
        >
          <div className="mb-4">
            <label
              htmlFor="customer"
              className="mb-1 block text-sm font-medium text-zinc-700"
            >
              Cliente
            </label>
            <select
              id="customer"
              required
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            >
              <option value="">Selecciona un cliente</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.customer_name} (ID: {c.id})
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label
              htmlFor="product"
              className="mb-1 block text-sm font-medium text-zinc-700"
            >
              Producto
            </label>
            <input
              id="product"
              type="text"
              required
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              placeholder="Nombre del producto"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="quantity"
              className="mb-1 block text-sm font-medium text-zinc-700"
            >
              Cantidad
            </label>
            <input
              id="quantity"
              type="number"
              required
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="price"
              className="mb-1 block text-sm font-medium text-zinc-700"
            >
              Precio
            </label>
            <input
              id="price"
              type="number"
              required
              min={0}
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              placeholder="0.00"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="status"
              className="mb-1 block text-sm font-medium text-zinc-700"
            >
              Estado
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-md bg-zinc-900 px-4 py-2 font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
            >
              {loading ? "Creando..." : "Crear pedido"}
            </button>
            <Link
              href="/orders"
              className="rounded-md border border-zinc-300 px-4 py-2 text-center font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
