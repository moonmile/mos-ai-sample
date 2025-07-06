"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { fetchCategoryBySlug, getCategoryIcon } from "@/lib/categories";
import { fetchProductsByCategory, getProductFallbackImage, formatPrice } from "@/lib/products";
import { useCart } from "@/contexts/CartContext";
import { Category } from "@/types/category";
import { Product } from "@/types/product";

type Props = {
  params: Promise<{ id: string }>;
};

export default function CategoryDetailPage({ params }: Props) {
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    async function loadData() {
      const resolvedParams = await params;
      const { id } = resolvedParams;
      
      const categoryData = await fetchCategoryBySlug(id);
      if (!categoryData) {
        notFound();
        return;
      }
      
      setCategory(categoryData);
      
      const productsData = await fetchProductsByCategory(categoryData.slug);
      setProducts(productsData);
      setLoading(false);
    }
    
    loadData();
  }, [params]);

  const handleQuickAdd = (product: Product, event: React.MouseEvent) => {
    event.preventDefault(); // リンクナビゲーションを防ぐ
    addToCart(product, 1);
    alert(`${product.name} をカートに追加しました！`);
  };

  if (loading) {
    return (
      <div className="p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-lg text-foreground/70">読み込み中...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!category) {
    notFound();
  }

  return (
    <div className="p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="max-w-4xl mx-auto">
        {/* パンくずナビ */}
        <nav className="mb-8 text-sm text-foreground/60">
          <Link href="/" className="hover:text-foreground transition-colors">
            ホーム
          </Link>
          <span className="mx-2">/</span>
          <Link
            href="/categories"
            className="hover:text-foreground transition-colors"
          >
            カテゴリ一覧
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{category.title}</span>
        </nav>

        {/* ヘッダーセクション */}
        <div className="bg-white dark:bg-white/5 border border-black/[.08] dark:border-white/[.145] rounded-xl p-8 mb-8">
          <div className="flex items-center gap-6 mb-6">
            <div className="text-6xl">{getCategoryIcon(category.slug)}</div>
            <div>
              <h1 className="text-4xl font-bold mb-2 text-foreground">
                {category.title}
              </h1>
              <p className="text-lg text-foreground/70 font-[family-name:var(--font-geist-mono)]">
                #{category.slug}
              </p>
            </div>
          </div>
          
          {category.description && (
            <p className="text-lg text-foreground/80 leading-relaxed">
              {category.description}
            </p>
          )}
        </div>

        {/* 商品一覧セクション */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-foreground">
            このカテゴリの商品
          </h2>
          
          {products.length === 0 ? (
            <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-8 text-center">
              <p className="text-lg text-foreground/70">
                このカテゴリには現在商品がありません。
              </p>
              <p className="text-sm text-foreground/50 mt-2">
                API: /products/slug/{category.slug}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="group block"
                >
                  <div className="bg-white dark:bg-white/5 border border-black/[.08] dark:border-white/[.145] rounded-lg p-4 hover:shadow-md transition-all hover:scale-105 relative">
                    <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                      {product.image ? (
                        <img
                            src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/images/${product.image}`}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl">{getProductFallbackImage(category.slug)}</span>
                      )}
                    </div>
                    <h3 className="font-medium text-foreground mb-1 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-foreground/60 mb-2">
                      {formatPrice(product.price)}
                    </p>
                    {product.description && (
                      <p className="text-xs text-foreground/50 overflow-hidden mb-3" style={{
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 2,
                      }}>
                        {product.description}
                      </p>
                    )}
                    
                    {/* クイック追加ボタン */}
                    <button
                      onClick={(e) => handleQuickAdd(product, e)}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100"
                      title="カートに追加"
                    >
                      +
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* カテゴリ情報 */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 border border-black/[.08] dark:border-white/[.145] rounded-xl p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4 text-foreground">
            カテゴリ情報
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">
                {products.length}
              </div>
              <div className="text-sm text-foreground/70">商品数</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                {category.sortid}
              </div>
              <div className="text-sm text-foreground/70">表示順</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">
                {category.display ? '✓' : '✗'}
              </div>
              <div className="text-sm text-foreground/70">表示状態</div>
            </div>
          </div>
          
          {/* 詳細情報 */}
          <div className="mt-6 text-sm text-foreground/60 space-y-2">
            <div>
              <span className="font-medium">作成日:</span> {new Date(category.created_at).toLocaleDateString('ja-JP')}
            </div>
            <div>
              <span className="font-medium">更新日:</span> {new Date(category.updated_at).toLocaleDateString('ja-JP')}
            </div>
          </div>
        </div>

        {/* ナビゲーション */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <Link
            href="/categories"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            カテゴリ一覧に戻る
          </Link>

          <button className="rounded-full border border-solid border-transparent transition-colors bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5">
            商品を注文する
          </button>
        </div>
      </div>
    </div>
  );
}
