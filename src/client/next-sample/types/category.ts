export interface Category {
  id: number;
  slug: string;
  title: string;
  description: string;
  image: string;
  sortid: number;
  display: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CategoriesResponse {
  items: Category[];
  total: number;
}
