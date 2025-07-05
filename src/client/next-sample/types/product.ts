export interface Product {
  id: number;
  slug: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category_slug: string;
  display: boolean;
  sortid: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface ProductsResponse {
  items: Product[];
  total: number;
}
