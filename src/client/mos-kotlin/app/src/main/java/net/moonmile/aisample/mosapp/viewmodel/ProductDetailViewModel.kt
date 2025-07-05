package net.moonmile.aisample.mosapp.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import net.moonmile.aisample.mosapp.data.Product
import net.moonmile.aisample.mosapp.data.ProductData
import net.moonmile.aisample.mosapp.network.ApiClient

sealed class ProductDetailUiState {
    object Loading : ProductDetailUiState()
    data class Success(val product: Product) : ProductDetailUiState()
    data class Error(val message: String) : ProductDetailUiState()
}

class ProductDetailViewModel : ViewModel() {
    private val _uiState = MutableStateFlow<ProductDetailUiState>(ProductDetailUiState.Loading)
    val uiState: StateFlow<ProductDetailUiState> = _uiState.asStateFlow()
    
    private var currentProductId: Int = 0
    
    fun loadProduct(productId: Int) {
        currentProductId = productId
        
        viewModelScope.launch {
            _uiState.value = ProductDetailUiState.Loading
            
            try {
                val response = ApiClient.categoryApiService.getProductById(productId)
                
                if (response.isSuccessful) {
                    val product = response.body()
                    if (product != null) {
                        _uiState.value = ProductDetailUiState.Success(product)
                    } else {
                        // レスポンスがnullの場合、サンプルデータから該当商品を検索
                        val sampleProduct = ProductData.sampleProducts.find { it.id == productId }
                            ?: ProductData.sampleProducts.firstOrNull()
                        if (sampleProduct != null) {
                            _uiState.value = ProductDetailUiState.Success(sampleProduct)
                        } else {
                            _uiState.value = ProductDetailUiState.Error("商品が見つかりませんでした")
                        }
                    }
                } else {
                    // APIエラーの場合、サンプルデータから該当商品を検索
                    val sampleProduct = ProductData.sampleProducts.find { it.id == productId }
                        ?: ProductData.sampleProducts.firstOrNull()
                    if (sampleProduct != null) {
                        _uiState.value = ProductDetailUiState.Success(sampleProduct)
                    } else {
                        _uiState.value = ProductDetailUiState.Error("商品の取得に失敗しました")
                    }
                }
            } catch (e: Exception) {
                // ネットワークエラーやその他の例外の場合、サンプルデータから該当商品を検索
                val sampleProduct = ProductData.sampleProducts.find { it.id == productId }
                    ?: ProductData.sampleProducts.firstOrNull()
                if (sampleProduct != null) {
                    _uiState.value = ProductDetailUiState.Success(sampleProduct)
                } else {
                    _uiState.value = ProductDetailUiState.Error("ネットワークエラーが発生しました: ${e.message}")
                }
            }
        }
    }
    
    fun retry() {
        if (currentProductId > 0) {
            loadProduct(currentProductId)
        }
    }
}
