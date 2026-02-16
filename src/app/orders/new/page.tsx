"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faUser,
  faBox,
  faHashtag,
  faDollarSign,
  faListCheck,
  faCheck,
  faXmark,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { createOrder } from "@/lib/api";
import { STATUS_OPTIONS, getStatusLabel } from "@/lib/constants";
import { useCustomers } from "@/hooks/useCustomers";
import { usePriceFormat, MAX_PRICE } from "@/hooks/usePriceFormat";
import { Navbar, AppCard, AlertError } from "@/components";

const MAX_PRODUCT_LENGTH = 200;
const MAX_QUANTITY = 999999;

export default function NewOrderPage() {
  const router = useRouter();
  const { customers, error: customersError } = useCustomers();
  const {
    priceDisplay,
    formatPrice,
    parsePrice,
    handlePriceChange,
    handlePriceBlur,
  } = usePriceFormat(MAX_PRICE);

  const [customerId, setCustomerId] = useState("");
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [status, setStatus] = useState("pending");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setError(
        `La cantidad debe estar entre 1 y ${MAX_QUANTITY.toLocaleString("es-CO")}.`
      );
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
      const message =
        err instanceof Error ? err.message : "Error al crear el pedido";
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

  const displayError = customersError ?? error;

  return (
    <div className="min-vh-100">
      <Navbar active="new" />

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

        <h1 className="page-title">
          <FontAwesomeIcon icon={faPlus} className="me-2" /> Crear pedido
        </h1>

        {displayError && <AlertError message={displayError} className="mb-4" />}

        <AppCard className="mx-auto" style={{ maxWidth: "28rem" }}>
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
                <small className="text-muted d-block mt-1">
                  {productName.length}/{MAX_PRODUCT_LENGTH}
                </small>
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
                    <span className="input-group-text bg-light border-end-0">
                      <FontAwesomeIcon icon={faDollarSign} className="opacity-75" />
                    </span>
                    <input
                      id="price"
                      type="text"
                      inputMode="decimal"
                      autoComplete="off"
                      value={priceDisplay}
                      onChange={handlePriceChange}
                      onBlur={handlePriceBlur}
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
                  {loading ? (
                    <FontAwesomeIcon icon={faSpinner} spin className="me-1" />
                  ) : (
                    <FontAwesomeIcon icon={faCheck} className="me-1" />
                  )}{" "}
                  {loading ? "Creando..." : "Crear pedido"}
                </button>
                <Link href="/orders" className="btn btn-app btn-app-ghost">
                  <FontAwesomeIcon icon={faXmark} className="me-1" /> Cancelar
                </Link>
              </div>
            </form>
          </div>
        </AppCard>
      </main>
    </div>
  );
}
