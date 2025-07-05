package net.moonmile.aisample.mosapp.navigation

import android.widget.Toast
import androidx.compose.runtime.Composable
import androidx.compose.ui.platform.LocalContext
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import net.moonmile.aisample.mosapp.ui.screens.CategoryListScreen
import net.moonmile.aisample.mosapp.ui.screens.ProductListScreen
import net.moonmile.aisample.mosapp.ui.screens.ProductDetailScreen
import net.moonmile.aisample.mosapp.ui.screens.CartScreen
import net.moonmile.aisample.mosapp.viewmodel.CartViewModel
import net.moonmile.aisample.mosapp.viewmodel.OrderViewModel
import net.moonmile.aisample.mosapp.data.formatPrice
import java.net.URLDecoder
import java.net.URLEncoder
import java.nio.charset.StandardCharsets

@Composable
fun MosNavigation(
    navController: NavHostController = rememberNavController()
) {
    val context = LocalContext.current
    val cartViewModel: CartViewModel = viewModel()
    val orderViewModel: OrderViewModel = viewModel()
    
    NavHost(
        navController = navController,
        startDestination = "categories"
    ) {
        composable("categories") {
            CategoryListScreen(
                onCategoryClick = { category ->
                    val encodedTitle = URLEncoder.encode(category.title, StandardCharsets.UTF_8.toString())
                    navController.navigate("products/${category.slug}/$encodedTitle")
                },
                onCartClick = {
                    navController.navigate("cart")
                },
                cartViewModel = cartViewModel
            )
        }
        
        composable("products/{categorySlug}/{categoryTitle}") { backStackEntry ->
            val categorySlug = backStackEntry.arguments?.getString("categorySlug") ?: ""
            val encodedTitle = backStackEntry.arguments?.getString("categoryTitle") ?: ""
            val categoryTitle = URLDecoder.decode(encodedTitle, StandardCharsets.UTF_8.toString())
            
            ProductListScreen(
                categorySlug = categorySlug,
                categoryTitle = categoryTitle,
                onBackClick = {
                    navController.popBackStack()
                },
                onProductClick = { product ->
                    val encodedProductName = URLEncoder.encode(product.name, StandardCharsets.UTF_8.toString())
                    navController.navigate("product_detail/${product.id}/$encodedProductName")
                },
                onCartClick = {
                    navController.navigate("cart")
                },
                cartViewModel = cartViewModel
            )
        }
        
        composable("product_detail/{productId}/{productName}") { backStackEntry ->
            val productId = backStackEntry.arguments?.getString("productId")?.toIntOrNull() ?: 0
            val encodedProductName = backStackEntry.arguments?.getString("productName") ?: ""
            val productName = URLDecoder.decode(encodedProductName, StandardCharsets.UTF_8.toString())
            
            ProductDetailScreen(
                productId = productId,
                productName = productName,
                cartViewModel = cartViewModel,
                onBackClick = {
                    navController.popBackStack()
                },
                onCartClick = {
                    navController.navigate("cart")
                }
            )
        }
        
        composable("cart") {
            CartScreen(
                onBackClick = {
                    navController.popBackStack()
                },
                cartViewModel = cartViewModel,
                orderViewModel = orderViewModel
            )
        }
    }
}
