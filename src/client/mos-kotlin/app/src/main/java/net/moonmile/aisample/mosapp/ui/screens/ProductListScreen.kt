package net.moonmile.aisample.mosapp.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import coil.compose.AsyncImage
import coil.request.ImageRequest
import net.moonmile.aisample.mosapp.data.Product
import net.moonmile.aisample.mosapp.data.ProductData
import net.moonmile.aisample.mosapp.data.formatPrice
import net.moonmile.aisample.mosapp.data.getProductEmoji
import net.moonmile.aisample.mosapp.data.getImageUrl
import net.moonmile.aisample.mosapp.ui.theme.MosSampleTheme
import net.moonmile.aisample.mosapp.viewmodel.ProductViewModel
import net.moonmile.aisample.mosapp.viewmodel.ProductUiState
import net.moonmile.aisample.mosapp.viewmodel.CartViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProductListScreen(
    categorySlug: String,
    categoryTitle: String,
    onBackClick: () -> Unit,
    onCartClick: () -> Unit = {},
    onProductClick: (Product) -> Unit = {},
    cartViewModel: CartViewModel = viewModel(),
    viewModel: ProductViewModel = viewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    val title by viewModel.categoryTitle.collectAsState()
    val cartItemCount by cartViewModel.itemCount.collectAsState()
    
    // 初回読み込み
    LaunchedEffect(categorySlug) {
        viewModel.loadProducts(categorySlug, categoryTitle)
    }
    
    Column(
        modifier = Modifier.fillMaxSize()
    ) {
        // トップバー
        TopAppBar(
            title = {
                Text(
                    text = title.ifEmpty { categoryTitle },
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold
                )
            },
            navigationIcon = {
                IconButton(onClick = onBackClick) {
                    Icon(
                        imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                        contentDescription = "戻る"
                    )
                }
            },
            actions = {
                // カートアイコン
                Box {
                    IconButton(onClick = onCartClick) {
                        Icon(
                            imageVector = Icons.Default.ShoppingCart,
                            contentDescription = "カート",
                            tint = MaterialTheme.colorScheme.primary
                        )
                    }
                    
                    // カートアイテム数のバッジ
                    if (cartItemCount > 0) {
                        Box(
                            modifier = Modifier
                                .size(20.dp)
                                .background(
                                    color = MaterialTheme.colorScheme.error,
                                    shape = CircleShape
                                )
                                .align(Alignment.TopEnd),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = if (cartItemCount > 99) "99+" else cartItemCount.toString(),
                                color = Color.White,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                }
                
                // リフレッシュボタン
                IconButton(onClick = { viewModel.retry() }) {
                    Text("🔄")
                }
            }
        )
        
        // コンテンツ
        when (val currentState = uiState) {
            is ProductUiState.Loading -> {
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    CircularProgressIndicator()
                }
            }
            
            is ProductUiState.Success -> {
                if (currentState.products.isEmpty()) {
                    // 商品が空の場合
                    Box(
                        modifier = Modifier.fillMaxSize(),
                        contentAlignment = Alignment.Center
                    ) {
                        Column(
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            Text(
                                text = "🛒",
                                fontSize = 48.sp
                            )
                            Spacer(modifier = Modifier.height(16.dp))
                            Text(
                                text = "商品がありません",
                                style = MaterialTheme.typography.titleMedium,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }
                } else {
                    LazyColumn(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(16.dp),
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        items(currentState.products) { product ->
                            ProductCard(
                                product = product,
                                onClick = { onProductClick(product) }
                            )
                        }
                    }
                }
            }
            
            is ProductUiState.Error -> {
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text(
                            text = "エラーが発生しました",
                            style = MaterialTheme.typography.titleMedium,
                            color = MaterialTheme.colorScheme.error
                        )
                        Text(
                            text = currentState.message,
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        Spacer(modifier = Modifier.height(16.dp))
                        Button(onClick = { viewModel.retry() }) {
                            Text("再試行")
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun ProductCard(
    product: Product,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() },
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp),
        shape = RoundedCornerShape(12.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // 商品画像プレースホルダー
            Box(
                modifier = Modifier
                    .size(60.dp)
                    .clip(RoundedCornerShape(8.dp)),
                contentAlignment = Alignment.Center
            ) {
                if (product.image.isNotEmpty()) {
                    // 背景として絵文字を表示（フォールバック用）
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .background(MaterialTheme.colorScheme.primaryContainer),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = product.getProductEmoji(),
                            fontSize = 24.sp,
                            textAlign = TextAlign.Center
                        )
                    }
                    
                    // 実際の画像を上に重ねて表示
                    AsyncImage(
                        model = ImageRequest.Builder(LocalContext.current)
                            .data(product.getImageUrl())
                            .crossfade(true)
                            .build(),
                        contentDescription = product.name,
                        modifier = Modifier
                            .fillMaxSize()
                            .clip(RoundedCornerShape(8.dp)),
                        contentScale = ContentScale.Crop
                    )
                } else {
                    // 画像がない場合は絵文字アイコンを表示
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .background(MaterialTheme.colorScheme.primaryContainer),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = product.getProductEmoji(),
                            fontSize = 24.sp,
                            textAlign = TextAlign.Center
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.width(16.dp))

            // 商品情報
            Column(
                modifier = Modifier.weight(1f)
            ) {
                Text(
                    text = product.name,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )
                if (product.description.isNotEmpty()) {
                    Text(
                        text = product.description,
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
                // デバッグ用：画像コード表示
                if (product.image.isNotEmpty()) {
                    Text(
                        text = "画像: ${product.image}",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
            
            Spacer(modifier = Modifier.width(8.dp))
            
            // 価格
            Text(
                text = product.formatPrice(),
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.primary
            )
        }
    }
}

@Preview(showBackground = true)
@Composable
fun ProductListScreenPreview() {
    MosSampleTheme {
        ProductListScreen(
            categorySlug = "special1",
            categoryTitle = "今月のお薦め",
            onBackClick = {}
        )
    }
}

@Preview(showBackground = true)
@Composable
fun ProductCardPreview() {
    MosSampleTheme {
        ProductCard(
            product = Product(
                id = 13,
                categoryId = 1,
                slug = "hotdog3",
                name = "スパイシーチリドッグ",
                description = "辛さがクセになるチリソース付きホットドッグ",
                image = "m011",
                price = 470,
                sortid = 13,
                display = true,
                createdAt = "2024-06-19T02:49:19+09:00",
                updatedAt = "2024-06-19T02:49:19+09:00",
                deletedAt = null
            ),
            onClick = {}
        )
    }
}
