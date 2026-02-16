export interface Order {
  id: number;
  customer_id: number;
  product_name: string;
  quantity: number;
  price: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface OrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  per_page: number;
}

export interface CreateOrderInput {
  customer_id: number;
  product_name: string;
  quantity: number;
  price: number;
  status?: string;
}
