"use client";

import { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faChevronLeft, faChevronRight, faClipboardList } from "@fortawesome/free-solid-svg-icons";
import { useCustomers } from "@/hooks/useCustomers";
import { useOrders } from "@/hooks/useOrders";
import { getStatusLabel } from "@/lib/constants";
import { Navbar, AppCard, AlertError, LoadingSpinner } from "@/components";

const PER_PAGE = 20;

export default function OrdersPage() {
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [page, setPage] = useState(1);

  const { customers, loading: customersLoading, error: customersError } = useCustomers();
  const { orders, total, loading: ordersLoading, error: ordersError } = useOrders(
    selectedCustomerId,
    page,
    PER_PAGE
  );

  const error = customersError ?? ordersError;
  const totalPages = Math.ceil(total / PER_PAGE);
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return (
    <div className="min-vh-100">
      <Navbar active="orders" />

      <main className="container page-main">
        <h1 className="page-title">
          <FontAwesomeIcon icon={faClipboardList} className="me-2" /> Listado de pedidos
        </h1>

        <AppCard className="mb-4">
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
        </AppCard>

        {error && <AlertError message={error} />}

        {ordersLoading ? (
          <LoadingSpinner message="Cargando pedidos..." />
        ) : !selectedCustomerId ? (
          <AppCard>
            <div className="empty-state">Selecciona un cliente para ver sus pedidos.</div>
          </AppCard>
        ) : orders.length === 0 ? (
          <AppCard>
            <div className="empty-state">No hay pedidos para este cliente.</div>
          </AppCard>
        ) : (
          <>
            <AppCard className="overflow-hidden">
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
                            ? Number(o.price).toLocaleString("es-CO", {
                                style: "currency",
                                currency: "COP",
                              })
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
            </AppCard>

            {totalPages > 1 && (
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mt-4">
                <p className="text-muted small mb-0">
                  Mostrando {(page - 1) * PER_PAGE + 1}–
                  {Math.min(page * PER_PAGE, total)} de {total} resultados
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
