package net.moonmile.aisample.mosapp.viewmodel

import androidx.lifecycle.ViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import net.moonmile.aisample.mosapp.data.CartItem
import net.moonmile.aisample.mosapp.data.Product

class CartViewModel : ViewModel() {
    private val _cartItems = MutableStateFlow<List<CartItem>>(emptyList())
    val cartItems: StateFlow<List<CartItem>> = _cartItems.asStateFlow()
    
    private val _totalPrice = MutableStateFlow(0)
    val totalPrice: StateFlow<Int> = _totalPrice.asStateFlow()
    
    private val _itemCount = MutableStateFlow(0)
    val itemCount: StateFlow<Int> = _itemCount.asStateFlow()
    
    fun addToCart(product: Product, quantity: Int = 1) {
        val currentItems = _cartItems.value.toMutableList()
        
        // 既に同じ商品がカートにある場合は数量を増やす
        val existingItemIndex = currentItems.indexOfFirst { it.product.id == product.id }
        
        if (existingItemIndex >= 0) {
            val existingItem = currentItems[existingItemIndex]
            currentItems[existingItemIndex] = existingItem.copy(quantity = existingItem.quantity + quantity)
        } else {
            currentItems.add(CartItem(product, quantity))
        }
        
        _cartItems.value = currentItems
        updateTotals()
    }
    
    fun removeFromCart(productId: Int) {
        val currentItems = _cartItems.value.toMutableList()
        currentItems.removeAll { it.product.id == productId }
        _cartItems.value = currentItems
        updateTotals()
    }
    
    fun updateQuantity(productId: Int, newQuantity: Int) {
        if (newQuantity <= 0) {
            removeFromCart(productId)
            return
        }
        
        val currentItems = _cartItems.value.toMutableList()
        val itemIndex = currentItems.indexOfFirst { it.product.id == productId }
        
        if (itemIndex >= 0) {
            currentItems[itemIndex] = currentItems[itemIndex].copy(quantity = newQuantity)
            _cartItems.value = currentItems
            updateTotals()
        }
    }
    
    fun clearCart() {
        _cartItems.value = emptyList()
        updateTotals()
    }
    
    private fun updateTotals() {
        val items = _cartItems.value
        _totalPrice.value = items.sumOf { it.totalPrice }
        _itemCount.value = items.sumOf { it.quantity }
    }
    
    fun formatTotalPrice(): String {
        return "¥${_totalPrice.value}"
    }
}
