package net.moonmile.aisample.mosapp.data

import com.google.gson.annotations.SerializedName

data class OrderItem(
    val id: Int,
    val price: Int,
    val quantity: Int
)

data class OrderRequest(
    @SerializedName("total_price")
    val totalPrice: Int,
    @SerializedName("total_quantity")
    val totalQuantity: Int,
    val items: List<OrderItem>
)

data class OrderResponse(
    @SerializedName("order_number")
    val orderNumber: String
)

// CartItemからOrderItemへの変換
fun CartItem.toOrderItem(): OrderItem {
    return OrderItem(
        id = product.id,
        price = product.price,
        quantity = quantity
    )
}

// カートアイテムリストからオーダーリクエストへの変換
fun List<CartItem>.toOrderRequest(): OrderRequest {
    val orderItems = this.map { it.toOrderItem() }
    val totalPrice = this.sumOf { it.product.price * it.quantity }
    val totalQuantity = this.sumOf { it.quantity }
    
    return OrderRequest(
        totalPrice = totalPrice,
        totalQuantity = totalQuantity,
        items = orderItems
    )
}
