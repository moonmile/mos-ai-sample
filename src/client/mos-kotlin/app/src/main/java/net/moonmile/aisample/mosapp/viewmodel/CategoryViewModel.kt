package net.moonmile.aisample.mosapp.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import net.moonmile.aisample.mosapp.data.Category
import net.moonmile.aisample.mosapp.data.CategoryData
import net.moonmile.aisample.mosapp.network.ApiClient

sealed class CategoryUiState {
    object Loading : CategoryUiState()
    data class Success(val categories: List<Category>) : CategoryUiState()
    data class Error(val message: String) : CategoryUiState()
}

class CategoryViewModel : ViewModel() {
    private val _uiState = MutableStateFlow<CategoryUiState>(CategoryUiState.Loading)
    val uiState: StateFlow<CategoryUiState> = _uiState.asStateFlow()
    
    init {
        loadCategories()
    }
    
    fun loadCategories() {
        viewModelScope.launch {
            _uiState.value = CategoryUiState.Loading
            
            try {
                val response = ApiClient.categoryApiService.getCategories()
                
                if (response.isSuccessful) {
                    val categoryResponse = response.body()
                    if (categoryResponse != null) {
                        // displayがtrueのカテゴリのみを表示し、sortidでソート
                        val filteredCategories = categoryResponse.items
                            .filter { it.display }
                            .sortedBy { it.sortid }
                        
                        _uiState.value = CategoryUiState.Success(filteredCategories)
                    } else {
                        // レスポンスがnullの場合、オフラインデータを使用
                        _uiState.value = CategoryUiState.Success(CategoryData.categories)
                    }
                } else {
                    // APIエラーの場合、オフラインデータを使用
                    _uiState.value = CategoryUiState.Success(CategoryData.categories)
                }
            } catch (e: Exception) {
                // ネットワークエラーやその他の例外の場合、オフラインデータを使用
                _uiState.value = CategoryUiState.Success(CategoryData.categories)
            }
        }
    }
    
    fun retry() {
        loadCategories()
    }
}
