package net.moonmile.aisample.mosapp.data

data class CartItem(
    val product: Product,
    val quantity: Int = 1
) {
    val totalPrice: Int
        get() = product.price * quantity
}

// カートアイテムの価格フォーマット
fun CartItem.formatTotalPrice(): String {
    return "¥${totalPrice}"
}
