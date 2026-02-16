"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faList, faPlus, faUser, faCircleExclamation, faSpinner, faChevronLeft, faChevronRight, faClipboardList } from "@fortawesome/free-solid-svg-icons";
import { fetchOrders, fetchCustomers } from "@/lib/api";
import { getStatusLabel } from "@/lib/constants";
import type { Order } from "@/types/order";
import type { Customer } from "@/types/customer";

const PER_PAGE = 20;

export default function OrdersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
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
    <div className="min-vh-100">
      <nav className="navbar navbar-expand-lg navbar-app">
        <div className="container">
          <Link href="/" className="navbar-brand">
            Pedidos &amp; Clientes
          </Link>
          <div className="navbar-nav ms-auto align-items-center gap-1">
            <Link href="/" className="nav-link me-2"><FontAwesomeIcon icon={faHouse} className="me-1" /> Inicio</Link>
            <Link href="/orders" className="nav-link active me-2"><FontAwesomeIcon icon={faList} className="me-1" /> Pedidos</Link>
            <Link href="/orders/new" className="nav-link btn btn-light btn-sm" style={{ color: "var(--app-primary)" }}>
              <FontAwesomeIcon icon={faPlus} className="me-1" /> Crear pedido
            </Link>
          </div>
        </div>
      </nav>

      <main className="container page-main">
        <h1 className="page-title"><FontAwesomeIcon icon={faClipboardList} className="me-2" /> Listado de pedidos</h1>

        <div className="card card-app mb-4">
          <div className="card-body">
            <label htmlFor="customer" className="form-label form-label-app">
              <FontAwesomeIcon icon={faUser} className="me-1" /> Cliente
            </label>
            <select
              id="customer"
              value={selectedCustomerId ?? ""}
              onChange={(e) => {
                setSelectedCustomerId(e.target.value ? Number(e.target.value) : null);
                setPage(1);
              }}
              className="form-select form-select-app w-100"
              style={{ maxWidth: "320px" }}
            >
              <option value="">Selecciona un cliente</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.customer_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger d-flex align-items-center rounded-3" role="alert">
            <FontAwesomeIcon icon={faCircleExclamation} className="me-2" />
            {error}
          </div>
        )}

        {loading ? (
          <div className="card card-app">
            <div className="card-body text-center py-5">
              <FontAwesomeIcon icon={faSpinner} spin className="fs-1" style={{ color: "var(--app-primary)" }} />
              <p className="text-muted mt-3 mb-0">Cargando pedidos...</p>
            </div>
          </div>
        ) : !selectedCustomerId ? (
          <div className="card card-app">
            <div className="empty-state">
              Selecciona un cliente para ver sus pedidos.
            </div>
          </div>
        ) : orders.length === 0 ? (
          <div className="card card-app">
            <div className="empty-state">
              No hay pedidos para este cliente.
            </div>
          </div>
        ) : (
          <>
            <div className="card card-app overflow-hidden">
              <div className="table-responsive">
                <table className="table table-app align-middle mb-0">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Producto</th>
                      <th>Cantidad</th>
                      <th>Precio</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o.id}>
                        <td className="fw-medium">{o.id}</td>
                        <td>{o.product_name}</td>
                        <td>{o.quantity}</td>
                        <td>
                          {typeof o.price === "string"
                            ? Number(o.price).toLocaleString("es-CO", { style: "currency", currency: "COP" })
                            : o.price}
                        </td>
                        <td>
                          <span className={`badge rounded-pill px-2 py-1 badge-status-${o.status}`}>
                            {getStatusLabel(o.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {totalPages > 1 && (
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mt-4">
                <p className="text-muted small mb-0">
                  Mostrando {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, total)} de {total} resultados
                </p>
                <div className="btn-group pagination-app">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={!hasPrev}
                    className="btn btn-app btn-app-ghost btn-sm"
                  >
                    <FontAwesomeIcon icon={faChevronLeft} className="me-1" /> Anterior
                  </button>
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={!hasNext}
                    className="btn btn-app btn-app-ghost btn-sm"
                  >
                    Siguiente <FontAwesomeIcon icon={faChevronRight} className="ms-1" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
