export interface OrderItem {
  id: number;
  price: number;
  quantity: number;
}

export interface OrderRequest {
  total_price: number;
  total_quantity: number;
  items: OrderItem[];
}

export interface OrderResponse {
  order_number: string;
  id?: number;
  total_price?: number;
  total_quantity?: number;
  status?: string;
  created_at?: string;
  items?: OrderItem[];
}
