import Link from "next/link";
import { Metadata } from "next";
import { fetchCategories, getCategoryIcon } from "@/lib/categories";

export const metadata: Metadata = {
  title: "カテゴリ一覧 | MOS Burger",
  description: "モスバーガーの商品カテゴリ一覧ページです",
};

export default async function CategoriesPage() {
  const categories = await fetchCategories();

  if (categories.length === 0) {
    return (
      <div className="p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4 text-foreground">
            カテゴリ一覧
          </h1>
          <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-8">
            <p className="text-lg text-foreground/70">
              現在カテゴリを読み込めません。しばらく時間をおいて再度お試しください。
            </p>
            <p className="text-sm text-foreground/50 mt-2">
              API接続エラー: localhost:8000/mos/api/categories
            </p>
          </div>
          <div className="mt-8">
            <Link
              href="/"
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
              ホームに戻る
            </Link>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="max-w-6xl mx-auto">
        {/* ヘッダーセクション */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 text-foreground">
            カテゴリ一覧
          </h1>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            お探しの商品カテゴリを選択してください。モスバーガーの美味しい商品をカテゴリ別にご紹介しています。
          </p>
        </div>

        {/* カテゴリグリッド */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group block"
            >
              <div className="bg-white dark:bg-white/5 border border-black/[.08] dark:border-white/[.145] rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:border-black/[.15] dark:hover:border-white/[.25] hover:scale-105">
                {/* アイコンとタイトル */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-3xl">{getCategoryIcon(category.slug)}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-sm text-foreground/50 font-[family-name:var(--font-geist-mono)]">
                      作成: {new Date(category.created_at).toLocaleDateString('ja-JP')}
                    </p>
                  </div>
                </div>

                {/* 説明 */}
                {category.description && (
                  <p className="text-sm text-foreground/70 overflow-hidden mb-4" style={{
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 2,
                  }}>
                    {category.description}
                  </p>
                )}

                {/* カテゴリスラッグ */}
                <div className="text-xs text-foreground/40 font-[family-name:var(--font-geist-mono)] mb-4">
                  #{category.slug}
                </div>

                {/* 矢印アイコン */}
                <div className="flex justify-end">
                  <svg
                    className="w-5 h-5 text-foreground/30 group-hover:text-red-600 dark:group-hover:text-red-400 group-hover:translate-x-1 transition-all"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 統計情報 */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 border border-black/[.08] dark:border-white/[.145] rounded-xl p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4 text-foreground">
            カテゴリ統計
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">
                {categories.length}
              </div>
              <div className="text-sm text-foreground/70">カテゴリ数</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                {categories.filter(cat => cat.slug.startsWith('special')).length}
              </div>
              <div className="text-sm text-foreground/70">特別メニュー</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">
                {categories.filter(cat => cat.slug.startsWith('main')).length}
              </div>
              <div className="text-sm text-foreground/70">メインメニュー</div>
            </div>
          </div>
        </div>

        {/* ナビゲーション */}
        <div className="mt-16 text-center">
          <Link
            href="/"
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
            ホームに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
