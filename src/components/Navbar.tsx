"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faList, faPlus } from "@fortawesome/free-solid-svg-icons";

type NavLink = "home" | "orders" | "new";

interface NavbarProps {
  active?: NavLink;
}

export function Navbar({ active }: NavbarProps) {
  return (
    <nav className="navbar navbar-expand-lg navbar-app">
      <div className="container">
        <Link href="/" className="navbar-brand">
          Pedidos &amp; Clientes
        </Link>
        <div className="navbar-nav ms-auto align-items-center gap-1">
          <Link
            href="/"
            className={`nav-link me-2 ${active === "home" ? "active" : ""}`}
          >
            <FontAwesomeIcon icon={faHouse} className="me-1" /> Inicio
          </Link>
          <Link
            href="/orders"
            className={`nav-link me-2 ${active === "orders" ? "active" : ""}`}
          >
            <FontAwesomeIcon icon={faList} className="me-1" /> Pedidos
          </Link>
          <Link
            href="/orders/new"
            className={`nav-link ${active === "new" ? "active" : ""} ${
              active === "orders" ? "btn btn-light btn-sm" : ""
            }`}
            style={active === "orders" ? { color: "var(--app-primary)" } : undefined}
          >
            <FontAwesomeIcon icon={faPlus} className="me-1" /> Crear pedido
          </Link>
        </div>
      </div>
    </nav>
  );
}
