"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faList, faPlus, faUser, faBox, faHashtag, faDollarSign, faListCheck, faCircleExclamation, faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { createOrder, fetchCustomers } from "@/lib/api";
import { STATUS_OPTIONS, getStatusLabel } from "@/lib/constants";
import type { Customer } from "@/types/customer";

export default function NewOrderPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerId, setCustomerId] = useState("");
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [priceDisplay, setPriceDisplay] = useState("");
  const [status, setStatus] = useState("pending");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const MAX_PRODUCT_LENGTH = 200;
  const MAX_QUANTITY = 999999;
  const MAX_PRICE = 999999999.99;

  function formatPrice(value: number): string {
    if (Number.isNaN(value) || value < 0) return "";
    if (value === 0) return "";
    const clamped = Math.min(value, MAX_PRICE);
    return clamped.toLocaleString("es-CO", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  }

  function parsePrice(str: string): number {
    const cleaned = str.replace(/\s/g, "").replace(/\./g, "").replace(",", ".");
    const n = parseFloat(cleaned);
    return Number.isNaN(n) ? 0 : Math.min(Math.max(n, 0), MAX_PRICE);
  }

  function handlePriceChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^\d,]/g, "").replace(/,/g, (m, i, s) => s.indexOf(",") === i ? m : "");
    const commaIndex = raw.indexOf(",");
    const hasComma = commaIndex >= 0;
    const intPart = hasComma ? raw.slice(0, commaIndex) : raw;
    const decPart = hasComma ? raw.slice(commaIndex + 1).slice(0, 2) : "";
    const combined = decPart ? `${intPart}.${decPart}` : intPart || "0";
    const num = parseFloat(combined);
    if (Number.isNaN(num)) {
      setPriceDisplay("");
      return;
    }
    const clamped = Math.min(Math.max(num, 0), MAX_PRICE);
    const intVal = Math.floor(clamped);
    const base = (intVal > 0 || hasComma) ? intVal.toLocaleString("es-CO") : "";
    const display = base + (hasComma ? "," + decPart : "");
    setPriceDisplay(display);
  }

  useEffect(() => {
    fetchCustomers()
      .then(setCustomers)
      .catch((e) => setError(e.message));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const q = Number(quantity);
    const p = parsePrice(priceDisplay);
    if (productName.length > MAX_PRODUCT_LENGTH) {
      setError(`El producto no puede superar ${MAX_PRODUCT_LENGTH} caracteres.`);
      return;
    }
    if (q < 1 || q > MAX_QUANTITY) {
      setError(`La cantidad debe estar entre 1 y ${MAX_QUANTITY.toLocaleString("es-CO")}.`);
      return;
    }
    if (p <= 0 && priceDisplay.trim() !== "") {
      setError("El precio debe ser mayor que 0.");
      return;
    }
    if (p > MAX_PRICE) {
      setError(`El precio no puede superar ${formatPrice(MAX_PRICE)}.`);
      return;
    }
    if (priceDisplay.trim() === "" || p === 0) {
      setError("El precio es obligatorio.");
      return;
    }
    setLoading(true);
    try {
      await createOrder({
        customer_id: Number(customerId),
        product_name: productName.trim(),
        quantity: q,
        price: p,
        status,
      });
      await Swal.fire({
        icon: "success",
        title: "Pedido creado",
        text: "El pedido se ha registrado correctamente.",
        confirmButtonColor: "#4f46e5",
      });
      router.push("/orders");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al crear el pedido";
      setError(message);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: message,
        confirmButtonColor: "#4f46e5",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-vh-100">
      <nav className="navbar navbar-expand-lg navbar-app">
        <div className="container">
          <Link href="/" className="navbar-brand">
            Pedidos &amp; Clientes
          </Link>
          <div className="navbar-nav ms-auto gap-1">
            <Link href="/" className="nav-link me-2"><FontAwesomeIcon icon={faHouse} className="me-1" /> Inicio</Link>
            <Link href="/orders" className="nav-link me-2"><FontAwesomeIcon icon={faList} className="me-1" /> Pedidos</Link>
            <Link href="/orders/new" className="nav-link active"><FontAwesomeIcon icon={faPlus} className="me-1" /> Crear pedido</Link>
          </div>
        </div>
      </nav>

      <main className="container page-main">
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb breadcrumb-app mb-0">
            <li className="breadcrumb-item">
              <Link href="/">Inicio</Link>
            </li>
            <li className="breadcrumb-item">
              <Link href="/orders">Pedidos</Link>
            </li>
            <li className="breadcrumb-item active">Crear pedido</li>
          </ol>
        </nav>

        <h1 className="page-title"><FontAwesomeIcon icon={faPlus} className="me-2" /> Crear pedido</h1>

        {error && (
          <div className="alert alert-danger d-flex align-items-center rounded-3 mb-4" role="alert">
            <FontAwesomeIcon icon={faCircleExclamation} className="me-2" />
            {error}
          </div>
        )}

        <div className="card card-app mx-auto" style={{ maxWidth: "28rem" }}>
          <div className="card-body p-4">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="customer" className="form-label form-label-app">
                  <FontAwesomeIcon icon={faUser} className="me-1" /> Cliente
                </label>
                <select
                  id="customer"
                  required
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  className="form-select form-select-app"
                >
                  <option value="">Selecciona un cliente</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.customer_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="product" className="form-label form-label-app">
                  <FontAwesomeIcon icon={faBox} className="me-1" /> Producto
                </label>
                <input
                  id="product"
                  type="text"
                  required
                  maxLength={MAX_PRODUCT_LENGTH}
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="form-control form-control-app"
                  placeholder="Nombre del producto"
                />
                <small className="text-muted d-block mt-1">{productName.length}/{MAX_PRODUCT_LENGTH}</small>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-6">
                  <label htmlFor="quantity" className="form-label form-label-app">
                    <FontAwesomeIcon icon={faHashtag} className="me-1" /> Cantidad
                  </label>
                  <input
                    id="quantity"
                    type="number"
                    required
                    min={1}
                    max={MAX_QUANTITY}
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="form-control form-control-app"
                  />
                </div>
                <div className="col-6">
                  <label htmlFor="price" className="form-label form-label-app">
                    <FontAwesomeIcon icon={faDollarSign} className="me-1" /> Precio
                  </label>
                  <div className="input-group rounded-3">
                    <span className="input-group-text bg-light border-end-0"><FontAwesomeIcon icon={faDollarSign} className="opacity-75" /></span>
                    <input
                      id="price"
                      type="text"
                      inputMode="decimal"
                      autoComplete="off"
                      value={priceDisplay}
                      onChange={handlePriceChange}
                      onBlur={() => setPriceDisplay(formatPrice(parsePrice(priceDisplay)))}
                      className="form-control form-control-app border-start-0"
                      placeholder="0,00"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="status" className="form-label form-label-app">
                  <FontAwesomeIcon icon={faListCheck} className="me-1" /> Estado
                </label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="form-select form-select-app"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {getStatusLabel(s)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="d-flex gap-2 pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-app btn-app-primary flex-grow-1"
                >
                  <FontAwesomeIcon icon={faCheck} className="me-1" /> {loading ? "Creando..." : "Crear pedido"}
                </button>
                <Link
                  href="/orders"
                  className="btn btn-app btn-app-ghost"
                >
                  <FontAwesomeIcon icon={faXmark} className="me-1" /> Cancelar
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
