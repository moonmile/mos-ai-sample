package net.moonmile.aisample.mosapp.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import net.moonmile.aisample.mosapp.data.CartItem
import net.moonmile.aisample.mosapp.data.OrderResponse
import net.moonmile.aisample.mosapp.data.toOrderRequest
import net.moonmile.aisample.mosapp.network.ApiClient

sealed class OrderUiState {
    data object Idle : OrderUiState()
    data object Loading : OrderUiState()
    data class Success(val order: OrderResponse) : OrderUiState()
    data class Error(val message: String) : OrderUiState()
}

class OrderViewModel : ViewModel() {
    private val _uiState = MutableStateFlow<OrderUiState>(OrderUiState.Idle)
    val uiState: StateFlow<OrderUiState> = _uiState.asStateFlow()

    private val orderApiService = ApiClient.orderApiService

    fun createOrder(cartItems: List<CartItem>) {
        if (cartItems.isEmpty()) {
            _uiState.value = OrderUiState.Error("カートが空です")
            return
        }

        viewModelScope.launch {
            _uiState.value = OrderUiState.Loading
            
            try {
                val orderRequest = cartItems.toOrderRequest()
                val response = orderApiService.createOrder(orderRequest)
                
                if (response.isSuccessful) {
                    val orderResponse = response.body()
                    if (orderResponse != null) {
                        _uiState.value = OrderUiState.Success(orderResponse)
                    } else {
                        _uiState.value = OrderUiState.Error("注文データの取得に失敗しました")
                    }
                } else {
                    _uiState.value = OrderUiState.Error("注文に失敗しました: ${response.message()}")
                }
            } catch (e: Exception) {
                _uiState.value = OrderUiState.Error("ネットワークエラー: ${e.message}")
            }
        }
    }

    fun resetState() {
        _uiState.value = OrderUiState.Idle
    }
}
