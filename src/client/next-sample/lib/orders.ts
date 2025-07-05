import { OrderRequest, OrderResponse } from "@/types/order";

const API_BASE_URL = "http://localhost:8000";

export async function createOrder(orderData: OrderRequest): Promise<OrderResponse> {
  const response = await fetch(`${API_BASE_URL}/mos/api/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create order: ${response.status} ${response.statusText} - ${errorText}`);
  }

  return response.json();
}
