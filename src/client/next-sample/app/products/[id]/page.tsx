"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { fetchProductById, getProductFallbackImage, formatPrice } from "@/lib/products";
import { fetchCategoryBySlug, getCategoryIcon } from "@/lib/categories";
import { useCart } from "@/contexts/CartContext";
import { Product } from "@/types/product";
import { Category } from "@/types/category";

type Props = {
  params: Promise<{ id: string }>;
};

export default function ProductDetailPage({ params }: Props) {
  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, isInCart, getCartItemQuantity } = useCart();

  useEffect(() => {
    async function loadData() {
      const resolvedParams = await params;
      const { id } = resolvedParams;
      
      const productData = await fetchProductById(id);
      if (!productData) {
        notFound();
        return;
      }
      
      setProduct(productData);
      
      const categoryData = await fetchCategoryBySlug(productData.category_slug);
      setCategory(categoryData);
      setLoading(false);
    }
    
    loadData();
  }, [params]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      // 成功メッセージを表示（オプション）
      alert(`${product.name} を ${quantity}個 カートに追加しました！`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-lg text-foreground/70">読み込み中...</div>
          </div>
        </main>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const cartQuantity = getCartItemQuantity(product.id);

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
          {category && (
            <>
              <span className="mx-2">/</span>
              <Link
                href={`/categories/${category.slug}`}
                className="hover:text-foreground transition-colors"
              >
                {category.title}
              </Link>
            </>
          )}
          <span className="mx-2">/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        {/* 商品詳細セクション */}
        <div className="bg-white dark:bg-white/5 border border-black/[.08] dark:border-white/[.145] rounded-xl p-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 商品画像 */}
            <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center overflow-hidden">
              {product.image ? (
                <img
                  src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/images/${product.image}`}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-8xl">{getProductFallbackImage(product.category_slug)}</span>
              )}
            </div>

            {/* 商品情報 */}
            <div className="flex flex-col justify-center">
              <div className="mb-4">
                {category && (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{getCategoryIcon(category.slug)}</span>
                    <span className="text-sm text-foreground/60 font-[family-name:var(--font-geist-mono)]">
                      {category.title}
                    </span>
                  </div>
                )}
                <h1 className="text-4xl font-bold mb-4 text-foreground">
                  {product.name}
                </h1>
                <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-6">
                  {formatPrice(product.price)}
                </div>
              </div>

              {product.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2 text-foreground">商品説明</h3>
                  <p className="text-foreground/80 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {/* 商品メタ情報 */}
              <div className="space-y-2 text-sm text-foreground/60 mb-6">
                <div>
                  <span className="font-medium">商品ID:</span> #{product.id}
                </div>
                <div>
                  <span className="font-medium">商品コード:</span> {product.slug}
                </div>
                <div>
                  <span className="font-medium">在庫状況:</span> 
                  <span className={product.display ? "text-green-600 dark:text-green-400 ml-1" : "text-red-600 dark:text-red-400 ml-1"}>
                    {product.display ? "在庫あり" : "品切れ"}
                  </span>
                </div>
                {cartQuantity > 0 && (
                  <div>
                    <span className="font-medium">カート内数量:</span> 
                    <span className="text-blue-600 dark:text-blue-400 ml-1">{cartQuantity}個</span>
                  </div>
                )}
              </div>

              {/* 数量選択と注文ボタン */}
              <div className="space-y-4">
                {/* 数量選択 */}
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-foreground">数量:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="w-16 text-center font-medium text-lg">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* ボタンエリア */}
                <div className="flex gap-4">
                  <button 
                    onClick={handleAddToCart}
                    className={`flex-1 rounded-full border border-solid transition-colors font-medium text-sm sm:text-base h-12 px-6 ${
                      product.display 
                        ? "border-transparent bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
                        : "border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400"
                    }`}
                    disabled={!product.display}
                  >
                    {product.display ? `カートに追加 (${formatPrice(product.price * quantity)})` : "品切れ"}
                  </button>
                  <Link
                    href="/cart"
                    className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-12 px-6 flex items-center justify-center"
                  >
                    🛒
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 商品詳細情報 */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 border border-black/[.08] dark:border-white/[.145] rounded-xl p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4 text-foreground">
            商品詳細情報
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-foreground mb-2">基本情報</h4>
              <div className="space-y-2 text-sm text-foreground/70">
                <div>
                  <span className="font-medium">商品ID:</span> {product.id}
                </div>
                <div>
                  <span className="font-medium">商品コード:</span> {product.slug}
                </div>
                <div>
                  <span className="font-medium">表示順:</span> {product.sortid}
                </div>
                <div>
                  <span className="font-medium">登録日:</span> {new Date(product.created_at).toLocaleDateString('ja-JP')}
                </div>
                <div>
                  <span className="font-medium">更新日:</span> {new Date(product.updated_at).toLocaleDateString('ja-JP')}
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-2">カテゴリ情報</h4>
              <div className="space-y-2 text-sm text-foreground/70">
                {category && (
                  <>
                    <div>
                      <span className="font-medium">カテゴリ:</span> {category.title}
                    </div>
                    <div>
                      <span className="font-medium">カテゴリコード:</span> {product.category_slug}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ナビゲーション */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          {category ? (
            <Link
              href={`/categories/${category.slug}`}
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
              {category.title}に戻る
            </Link>
          ) : (
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
          )}

          <Link
            href="/cart"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-solid border-transparent transition-colors bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
          >
            🛒 カートを見る {cartQuantity > 0 && `(${cartQuantity})`}
          </Link>
        </div>
      </div>
    </div>
  );
}
