import type { Order, OrdersResponse, CreateOrderInput } from "@/types/order";
import type { Customer } from "@/types/customer";

const ORDER_SERVICE_URL =
  process.env.NEXT_PUBLIC_ORDER_SERVICE_URL || "http://localhost:3002";
const CUSTOMER_SERVICE_URL =
  process.env.NEXT_PUBLIC_CUSTOMER_SERVICE_URL || "http://localhost:3001";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.errors?.join(", ") || res.statusText);
  }
  return res.json();
}

export async function fetchOrders(
  customerId: number,
  page = 1,
  perPage = 20
): Promise<OrdersResponse> {
  const params = new URLSearchParams({
    customer_id: String(customerId),
    page: String(page),
    per_page: String(perPage),
  });
  const res = await fetch(`${ORDER_SERVICE_URL}/api/v1/orders?${params}`);
  return handleResponse<OrdersResponse>(res);
}

export async function fetchOrder(id: number): Promise<Order> {
  const res = await fetch(`${ORDER_SERVICE_URL}/api/v1/orders/${id}`);
  return handleResponse<Order>(res);
}

export async function createOrder(data: CreateOrderInput): Promise<Order> {
  const res = await fetch(`${ORDER_SERVICE_URL}/api/v1/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ order: { ...data, status: data.status || "pending" } }),
  });
  return handleResponse<Order>(res);
}

export async function fetchCustomers(): Promise<Customer[]> {
  const res = await fetch(`${CUSTOMER_SERVICE_URL}/api/v1/customers`);
  return handleResponse<Customer[]>(res);
}

export async function fetchCustomer(id: number): Promise<Customer> {
  const res = await fetch(`${CUSTOMER_SERVICE_URL}/api/v1/customers/${id}`);
  return handleResponse<Customer>(res);
}
