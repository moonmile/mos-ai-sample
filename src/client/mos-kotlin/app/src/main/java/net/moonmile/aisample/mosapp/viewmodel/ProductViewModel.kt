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

sealed class ProductUiState {
    object Loading : ProductUiState()
    data class Success(val products: List<Product>) : ProductUiState()
    data class Error(val message: String) : ProductUiState()
}

class ProductViewModel : ViewModel() {
    private val _uiState = MutableStateFlow<ProductUiState>(ProductUiState.Loading)
    val uiState: StateFlow<ProductUiState> = _uiState.asStateFlow()
    
    private val _categoryTitle = MutableStateFlow("")
    val categoryTitle: StateFlow<String> = _categoryTitle.asStateFlow()
    
    private var currentCategorySlug: String = ""
    
    fun loadProducts(categorySlug: String, categoryTitle: String) {
        currentCategorySlug = categorySlug
        _categoryTitle.value = categoryTitle
        
        viewModelScope.launch {
            _uiState.value = ProductUiState.Loading
            
            try {
                val response = ApiClient.categoryApiService.getProductsByCategory(categorySlug)
                
                if (response.isSuccessful) {
                    val productResponse = response.body()
                    if (productResponse != null) {
                        // displayがtrueの商品のみを表示し、sortidでソート
                        val filteredProducts = productResponse.items
                            .filter { it.display }
                            .sortedBy { it.sortid }
                        
                        _uiState.value = ProductUiState.Success(filteredProducts)
                    } else {
                        // レスポンスがnullの場合、カテゴリ別のサンプルデータを使用
                        val sampleProducts = ProductData.getSampleProductsByCategory(categorySlug)
                        _uiState.value = ProductUiState.Success(sampleProducts)
                    }
                } else {
                    // APIエラーの場合、カテゴリ別のサンプルデータを使用
                    val sampleProducts = ProductData.getSampleProductsByCategory(categorySlug)
                    _uiState.value = ProductUiState.Success(sampleProducts)
                }
            } catch (e: Exception) {
                // ネットワークエラーやその他の例外の場合、カテゴリ別のサンプルデータを使用
                val sampleProducts = ProductData.getSampleProductsByCategory(categorySlug)
                _uiState.value = ProductUiState.Success(sampleProducts)
            }
        }
    }
    
    fun retry() {
        if (currentCategorySlug.isNotEmpty()) {
            loadProducts(currentCategorySlug, _categoryTitle.value)
        }
    }
}
