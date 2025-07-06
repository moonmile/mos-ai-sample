import Link from "next/link";
import { Metadata } from "next";
import { fetchCategories } from "@/lib/categories";
import { fetchProductsByCategory, getProductFallbackImage, formatPrice } from "@/lib/products";

export const metadata: Metadata = {
  title: "全商品一覧 | MOS Burger",
  description: "モスバーガーの全商品を一覧で表示します",
};

export default async function ProductsPage() {
  const categories = await fetchCategories();
  
  // 全カテゴリの商品を取得
  const allProductsPromises = categories.map(async (category) => {
    const products = await fetchProductsByCategory(category.slug);
    return { category, products };
  });
  
  const categoryProducts = await Promise.all(allProductsPromises);

  return (
    <div className="p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="max-w-6xl mx-auto">
        {/* ヘッダーセクション */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 text-foreground">
            全商品一覧
          </h1>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            モスバーガーの全商品をカテゴリ別に表示しています。お気に入りの商品を見つけてください。
          </p>
        </div>

        {/* カテゴリ別商品一覧 */}
        {categoryProducts.map(({ category, products }) => (
          <div key={category.id} className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-3xl font-bold text-foreground">{category.title}</h2>
              <Link
                href={`/categories/${category.slug}`}
                className="text-sm text-red-600 dark:text-red-400 hover:underline"
              >
                すべて見る →
              </Link>
            </div>
            
            {products.length === 0 ? (
              <div className="bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-700 rounded-xl p-8 text-center">
                <p className="text-foreground/60">このカテゴリには商品がありません</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    className="group block"
                  >
                    <div className="bg-white dark:bg-white/5 border border-black/[.08] dark:border-white/[.145] rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:border-black/[.15] dark:hover:border-white/[.25] hover:scale-105">
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
                      <p className="text-sm font-bold text-red-600 dark:text-red-400 mb-2">
                        {formatPrice(product.price)}
                      </p>
                      {product.description && (
                        <p className="text-xs text-foreground/50 overflow-hidden" style={{
                          display: '-webkit-box',
                          WebkitBoxOrient: 'vertical',
                          WebkitLineClamp: 2,
                        }}>
                          {product.description}
                        </p>
                      )}
                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-xs text-foreground/40">#{product.slug}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          product.available 
                            ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                            : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                        }`}>
                          {product.available ? "在庫あり" : "品切れ"}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* ナビゲーション */}
        <div className="mt-16 text-center">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
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
        </div>
      </div>
    </div>
  );
}
