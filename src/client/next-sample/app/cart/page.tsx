"use client";

import Link from "next/link";
import { Metadata } from "next";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { formatPrice, getProductFallbackImage } from "@/lib/products";
import { createOrder } from "@/lib/orders";
import { OrderRequest } from "@/types/order";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [isOrderProcessing, setIsOrderProcessing] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  const handleOrder = async () => {
    if (cart.items.length === 0) return;

    setIsOrderProcessing(true);
    setOrderError(null);

    try {
      const orderData: OrderRequest = {
        total_price: cart.totalPrice,
        total_quantity: cart.totalItems,
        items: cart.items.map(item => ({
          id: item.product.id,
          price: item.product.price,
          quantity: item.quantity,
        })),
      };

      const result = await createOrder(orderData);
      console.log("注文が完了しました:", result);
      
      // 注文成功
      setOrderSuccess(true);
      setOrderNumber(result.order_number);
      clearCart(); // カートをクリア
      
      // 3秒後にカテゴリページにリダイレクト
      setTimeout(() => {
        window.location.href = "/categories";
      }, 3000);
      
    } catch (error) {
      console.error("注文エラー:", error);
      setOrderError(error instanceof Error ? error.message : "注文の処理中にエラーが発生しました");
    } finally {
      setIsOrderProcessing(false);
    }
  };

  // 注文成功画面
  if (orderSuccess) {
    return (
      <div className="p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-white/5 border border-black/[.08] dark:border-white/[.145] rounded-xl p-16 text-center">
            <div className="text-6xl mb-6">✅</div>
            <h1 className="text-3xl font-bold mb-4 text-green-600 dark:text-green-400">
              注文が完了しました！
            </h1>
            {orderNumber && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
                <p className="text-lg font-semibold text-green-800 dark:text-green-300 mb-2">
                  注文番号
                </p>
                <p className="text-2xl font-mono font-bold text-green-600 dark:text-green-400">
                  {orderNumber}
                </p>
              </div>
            )}
            <p className="text-foreground/70 mb-8">
              ご注文ありがとうございます。注文の詳細はメールでお送りいたします。
            </p>
            <p className="text-sm text-foreground/50 mb-8">
              3秒後に商品ページに戻ります...
            </p>
            <Link
              href="/categories"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-solid border-transparent transition-colors bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 font-medium text-sm sm:text-base h-12 px-6"
            >
              商品ページに戻る
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <div className="max-w-4xl mx-auto">
          {/* ヘッダー */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4 text-foreground">
              ショッピングカート
            </h1>
          </div>

          {/* 空のカート */}
          <div className="bg-white dark:bg-white/5 border border-black/[.08] dark:border-white/[.145] rounded-xl p-16 text-center">
            <div className="text-6xl mb-6">🛒</div>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              カートは空です
            </h2>
            <p className="text-foreground/70 mb-8">
              まだ商品が追加されていません。商品を選んでカートに追加してください。
            </p>
            <Link
              href="/categories"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-solid border-transparent transition-colors bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 font-medium text-sm sm:text-base h-12 px-6"
            >
              商品を探す
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-foreground">
            ショッピングカート
          </h1>
          <button
            onClick={clearCart}
            className="text-sm text-red-600 dark:text-red-400 hover:underline"
          >
            カートを空にする
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* カート商品一覧 */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div
                  key={item.product.id}
                  className="bg-white dark:bg-white/5 border border-black/[.08] dark:border-white/[.145] rounded-xl p-6"
                >
                  <div className="flex items-center gap-4">
                    {/* 商品画像 */}
                    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                      {item.product.image ? (
                        <img
                          src={"/images/" + item.product.image + ".jpeg"}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl">{getProductFallbackImage(item.product.category_slug)}</span>
                      )}
                    </div>

                    {/* 商品情報 */}
                    <div className="flex-1">
                      <Link
                        href={`/products/${item.product.id}`}
                        className="font-medium text-foreground hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-foreground/60 mt-1">
                        {formatPrice(item.product.price)} × {item.quantity}
                      </p>
                      <p className="text-xs text-foreground/40 mt-1">
                        追加日: {item.addedAt.toLocaleDateString('ja-JP')}
                      </p>
                    </div>

                    {/* 数量コントロール */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>

                    {/* 小計と削除ボタン */}
                    <div className="text-right">
                      <div className="font-semibold text-red-600 dark:text-red-400 mb-2">
                        {formatPrice(item.product.price * item.quantity)}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-xs text-foreground/60 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      >
                        削除
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 注文サマリー */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 border border-black/[.08] dark:border-white/[.145] rounded-xl p-6 sticky top-8">
              <h2 className="text-xl font-semibold mb-4 text-foreground">
                注文サマリー
              </h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/70">商品数</span>
                  <span className="font-medium">{cart.totalItems}個</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/70">小計</span>
                  <span className="font-medium">{formatPrice(cart.totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/70">配送料</span>
                  <span className="font-medium">無料</span>
                </div>
                <hr className="border-black/[.08] dark:border-white/[.145]" />
                <div className="flex justify-between text-lg font-semibold">
                  <span>合計</span>
                  <span className="text-red-600 dark:text-red-400">{formatPrice(cart.totalPrice)}</span>
                </div>
              </div>

              <button 
                onClick={handleOrder}
                disabled={isOrderProcessing || cart.items.length === 0}
                className="w-full rounded-full border border-solid border-transparent transition-colors bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 font-medium text-sm sm:text-base h-12 px-6 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isOrderProcessing ? "注文処理中..." : "注文に進む"}
              </button>

              {/* エラー表示 */}
              {orderError && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
                  <p className="text-sm text-red-700 dark:text-red-300">
                    <span className="font-medium">エラー:</span> {orderError}
                  </p>
                </div>
              )}

              <Link
                href="/categories"
                className="block w-full text-center rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-12 leading-[3rem]"
              >
                買い物を続ける
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
