import Link from "next/link";
import { useCart } from "@/contexts/CartContext";

export default function Header() {
  const { cart } = useCart();

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-black/[.08] dark:border-white/[.145] sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* ロゴ・タイトル */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3">
              <div className="text-2xl">🛍️</div>
              <h1 className="text-xl font-bold text-foreground">
                新人研修のための注文サイト（仮）
              </h1>
            </Link>
          </div>

          {/* ナビゲーション */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-foreground/70 hover:text-foreground transition-colors"
            >
              ホーム
            </Link>
            <Link
              href="/categories"
              className="text-foreground/70 hover:text-foreground transition-colors"
            >
              カテゴリ
            </Link>
            <Link
              href="/products"
              className="text-foreground/70 hover:text-foreground transition-colors"
            >
              商品一覧
            </Link>
          </nav>

          {/* カートリンク */}
          <Link
            href="/cart"
            className="flex items-center gap-2 rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent px-4 py-2"
          >
            <span className="text-lg">🛒</span>
            <span className="font-medium">
              カート ({cart.totalItems})
            </span>
          </Link>
        </div>

        {/* モバイルナビゲーション */}
        <nav className="md:hidden pb-4 flex gap-4">
          <Link
            href="/"
            className="text-sm text-foreground/70 hover:text-foreground transition-colors"
          >
            ホーム
          </Link>
          <Link
            href="/categories"
            className="text-sm text-foreground/70 hover:text-foreground transition-colors"
          >
            カテゴリ
          </Link>
          <Link
            href="/products"
            className="text-sm text-foreground/70 hover:text-foreground transition-colors"
          >
            商品一覧
          </Link>
        </nav>
      </div>
    </header>
  );
}
