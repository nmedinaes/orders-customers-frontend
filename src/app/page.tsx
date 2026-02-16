import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-6">
      <h1 className="mb-8 text-3xl font-semibold text-zinc-900">
        Orders & Customers
      </h1>
      <div className="flex flex-col gap-4 sm:flex-row">
        <Link
          href="/orders"
          className="rounded-md bg-zinc-900 px-6 py-3 font-medium text-white hover:bg-zinc-800"
        >
          Ver listado de pedidos
        </Link>
        <Link
          href="/orders/new"
          className="rounded-md border border-zinc-300 px-6 py-3 font-medium text-zinc-900 hover:bg-zinc-100"
        >
          Crear pedido
        </Link>
      </div>
    </div>
  );
}
