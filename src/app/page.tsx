import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList, faPlus } from "@fortawesome/free-solid-svg-icons";

export default function HomePage() {
  return (
    <div className="hero-bg d-flex flex-column align-items-center justify-content-center p-4">
      <div className="hero-content text-center">
        <h1 className="hero-title mb-3">
          Pedidos &amp; Clientes
        </h1>
        <p className="hero-subtitle mb-5">
          Gestiona Pedidos &amp; Clientes con una interfaz clara y sencilla.
        </p>
        <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
          <Link
            href="/orders"
            className="hero-btn hero-btn-primary text-decoration-none"
          >
            <FontAwesomeIcon icon={faList} className="me-2" />
            Ver listado de pedidos
          </Link>
          <Link
            href="/orders/new"
            className="hero-btn hero-btn-outline text-decoration-none"
          >
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            Crear pedido
          </Link>
        </div>
      </div>
    </div>
  );
}
