package net.moonmile.aisample.mosapp.network

import net.moonmile.aisample.mosapp.data.OrderRequest
import net.moonmile.aisample.mosapp.data.OrderResponse
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

interface OrderApiService {
    @POST("/mos/api/orders")
    suspend fun createOrder(@Body orderRequest: OrderRequest): Response<OrderResponse>
}
