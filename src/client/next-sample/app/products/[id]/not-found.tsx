import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="max-w-4xl mx-auto text-center">
        <div className="mt-16">
          <h1 className="text-6xl font-bold text-foreground/20 mb-4">404</h1>
          <h2 className="text-3xl font-bold text-foreground mb-4">
            商品が見つかりません
          </h2>
          <p className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto">
            お探しの商品は存在しないか、削除された可能性があります。
            カテゴリ一覧ページから他の商品をお探しください。
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/categories"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-solid border-transparent transition-colors bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            >
              商品を探す
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            >
              ホームに戻る
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
