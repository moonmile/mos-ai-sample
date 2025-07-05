import Link from "next/link";

export default function Home() {
  return (
    <div className="p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-6 text-foreground">
            新人研修のための注文サイト（仮）
          </h1>
          <p className="text-lg text-foreground/70 mb-8">
            カテゴリから商品を選んで、カートに追加して注文してみましょう！
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {/* カテゴリカード */}
          <Link
            href="/categories"
            className="group bg-white dark:bg-white/5 border border-black/[.08] dark:border-white/[.145] rounded-xl p-8 hover:shadow-lg transition-all hover:scale-105"
          >
            <div className="text-center">
              <div className="text-4xl mb-4">📂</div>
              <h2 className="text-xl font-semibold mb-2 text-foreground group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                カテゴリ一覧
              </h2>
              <p className="text-sm text-foreground/60">
                商品のカテゴリを確認できます
              </p>
            </div>
          </Link>

          {/* 商品一覧カード */}
          <Link
            href="/products"
            className="group bg-white dark:bg-white/5 border border-black/[.08] dark:border-white/[.145] rounded-xl p-8 hover:shadow-lg transition-all hover:scale-105"
          >
            <div className="text-center">
              <div className="text-4xl mb-4">📦</div>
              <h2 className="text-xl font-semibold mb-2 text-foreground group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                商品一覧
              </h2>
              <p className="text-sm text-foreground/60">
                すべての商品を確認できます
              </p>
            </div>
          </Link>

          {/* カートカード */}
          <Link
            href="/cart"
            className="group bg-white dark:bg-white/5 border border-black/[.08] dark:border-white/[.145] rounded-xl p-8 hover:shadow-lg transition-all hover:scale-105"
          >
            <div className="text-center">
              <div className="text-4xl mb-4">🛒</div>
              <h2 className="text-xl font-semibold mb-2 text-foreground group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                ショッピングカート
              </h2>
              <p className="text-sm text-foreground/60">
                選んだ商品を注文できます
              </p>
            </div>
          </Link>
        </div>

        {/* 使い方説明 */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 border border-black/[.08] dark:border-white/[.145] rounded-xl p-8">
          <h3 className="text-2xl font-semibold mb-6 text-foreground text-center">
            使い方
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl mb-3">1️⃣</div>
              <h4 className="font-semibold mb-2 text-foreground">カテゴリを選ぶ</h4>
              <p className="text-sm text-foreground/70">
                まずはカテゴリ一覧から興味のあるカテゴリを選びます
              </p>
            </div>
            <div>
              <div className="text-3xl mb-3">2️⃣</div>
              <h4 className="font-semibold mb-2 text-foreground">商品をカートに追加</h4>
              <p className="text-sm text-foreground/70">
                商品詳細ページで「カートに追加」ボタンを押します
              </p>
            </div>
            <div>
              <div className="text-3xl mb-3">3️⃣</div>
              <h4 className="font-semibold mb-2 text-foreground">注文する</h4>
              <p className="text-sm text-foreground/70">
                カートページで内容を確認して「注文に進む」ボタンを押します
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
