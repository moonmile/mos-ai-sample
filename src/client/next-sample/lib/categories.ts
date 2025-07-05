import { Category, CategoriesResponse } from '@/types/category';

const API_BASE_URL = 'http://localhost:8000/mos/api';

export async function fetchCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      cache: 'no-store', // 常に最新データを取得
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: CategoriesResponse = await response.json();
    
    // displayがtrueのもののみをフィルタリングし、sortidでソート
    return data.items
      .filter(item => item.display)
      .sort((a, b) => a.sortid - b.sortid);
  } catch (error) {
    console.error('カテゴリの取得に失敗しました:', error);
    // エラー時はフォールバック用の空配列を返す
    return [];
  }
}

export async function fetchCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const categories = await fetchCategories();
    return categories.find(category => category.slug === slug) || null;
  } catch (error) {
    console.error('カテゴリの取得に失敗しました:', error);
    return null;
  }
}

// カテゴリに応じたアイコンを返すヘルパー関数
export function getCategoryIcon(slug: string): string {
  const iconMap: Record<string, string> = {
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
  
  return iconMap[slug] || '🍽️';
}
