import { Product, ProductsResponse } from '@/types/product';

const API_BASE_URL = 'http://localhost:8000/mos/api';

export async function fetchProductsByCategory(categorySlug: string): Promise<Product[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/products/slug/${categorySlug}`, {
      cache: 'no-store', // 常に最新データを取得
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ProductsResponse = await response.json();
    
    // availableがtrueのもののみをフィルタリングし、sortidでソート
    return data.items
      .filter(item => item.display)
      .sort((a, b) => a.sortid - b.sortid);
  } catch (error) {
    console.error('商品の取得に失敗しました:', error);
    // エラー時はフォールバック用の空配列を返す
    return [];
  }
}

export async function fetchProductBySlug(productSlug: string): Promise<Product | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${productSlug}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const product: Product = await response.json();
    return product;
  } catch (error) {
    console.error('商品詳細の取得に失敗しました:', error);
    return null;
  }
}

export async function fetchProductById(productId: string | number): Promise<Product | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const product: Product = await response.json();
    return product;
  } catch (error) {
    console.error('商品詳細の取得に失敗しました:', error);
    return null;
  }
}

// 商品に応じたフォールバック画像を返すヘルパー関数
export function getProductFallbackImage(categorySlug: string): string {
  const imageMap: Record<string, string> = {
    'special1': '⭐',
    'special2': '💰',
    'special3': '🎯',
    'main1': '🍔',
    'main2': '🍔',
    'main3': '🌭',
    'main4': '🌱',
    'sidemenu1': '🍟',
    'sidemenu2': '🥤',
    'sidemenu3': '🍰',
  };
  
  return imageMap[categorySlug] || '🍽️';
}

// 価格をフォーマットするヘルパー関数
export function formatPrice(price: number): string {
  return `¥${price.toLocaleString()}`;
}
