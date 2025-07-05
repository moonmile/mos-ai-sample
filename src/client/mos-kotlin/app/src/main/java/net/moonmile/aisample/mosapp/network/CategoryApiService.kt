package net.moonmile.aisample.mosapp.network

import net.moonmile.aisample.mosapp.data.CategoryResponse
import net.moonmile.aisample.mosapp.data.ProductResponse
import net.moonmile.aisample.mosapp.data.Product
import retrofit2.Response
import retrofit2.http.GET
import retrofit2.http.Path

interface CategoryApiService {
    @GET("mos/api/categories")
    suspend fun getCategories(): Response<CategoryResponse>
    
    @GET("mos/api/products/slug/{category_slug}")
    suspend fun getProductsByCategory(@Path("category_slug") categorySlug: String): Response<ProductResponse>
    
    @GET("mos/api/products/{id}")
    suspend fun getProductById(@Path("id") productId: Int): Response<Product>
}
