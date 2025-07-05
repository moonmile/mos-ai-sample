package net.moonmile.aisample.mosapp.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.runtime.rememberCoroutineScope
import kotlinx.coroutines.launch
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
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
import net.moonmile.aisample.mosapp.data.formatPrice
import net.moonmile.aisample.mosapp.data.getProductEmoji
import net.moonmile.aisample.mosapp.data.getImageUrl
import net.moonmile.aisample.mosapp.ui.theme.MosSampleTheme
import net.moonmile.aisample.mosapp.viewmodel.ProductDetailViewModel
import net.moonmile.aisample.mosapp.viewmodel.ProductDetailUiState
import net.moonmile.aisample.mosapp.viewmodel.CartViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProductDetailScreen(
    productId: Int,
    productName: String,
    onBackClick: () -> Unit,
    onCartClick: () -> Unit = {},
    viewModel: ProductDetailViewModel = viewModel(),
    cartViewModel: CartViewModel = viewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    val cartItems by cartViewModel.cartItems.collectAsState()
    val totalQuantity = cartItems.sumOf { it.quantity }
    
    // 初回読み込み
    LaunchedEffect(productId) {
        viewModel.loadProduct(productId)
    }
    
    Column(
        modifier = Modifier.fillMaxSize()
    ) {
        // トップバー
        TopAppBar(
            title = {
                Text(
                    text = "商品詳細",
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
                            contentDescription = "カート"
                        )
                    }
                    if (totalQuantity > 0) {
                        Badge(
                            modifier = Modifier.offset(x = 4.dp, y = 8.dp)
                        ) {
                            Text(
                                text = totalQuantity.toString(),
                                fontSize = 10.sp
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
            is ProductDetailUiState.Loading -> {
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    CircularProgressIndicator()
                }
            }
            
            is ProductDetailUiState.Success -> {
                ProductDetailContent(
                    product = currentState.product,
                    cartViewModel = cartViewModel,
                    modifier = Modifier.fillMaxSize()
                )
            }
            
            is ProductDetailUiState.Error -> {
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
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = currentState.message,
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            textAlign = TextAlign.Center
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
fun ProductDetailContent(
    product: Product,
    cartViewModel: CartViewModel,
    modifier: Modifier = Modifier
) {
    val snackbarHostState = remember { SnackbarHostState() }
    val coroutineScope = rememberCoroutineScope()
    
    Box(modifier = modifier) {
        Column(
            modifier = Modifier
                .verticalScroll(rememberScrollState())
                .padding(16.dp)
        ) {
        // 商品画像エリア
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .height(200.dp),
            elevation = CardDefaults.cardElevation(defaultElevation = 4.dp),
            shape = RoundedCornerShape(16.dp)
        ) {
            Box(
                modifier = Modifier.fillMaxSize(),
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
                            fontSize = 80.sp,
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
                            .clip(RoundedCornerShape(16.dp)),
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
                            fontSize = 80.sp,
                            textAlign = TextAlign.Center
                        )
                    }
                }
            }
        }
        
        Spacer(modifier = Modifier.height(24.dp))
        
        // 商品名
        Text(
            text = product.name,
            style = MaterialTheme.typography.headlineMedium,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.fillMaxWidth()
        )
        
        Spacer(modifier = Modifier.height(8.dp))
        
        // 価格
        Text(
            text = product.formatPrice(),
            style = MaterialTheme.typography.headlineSmall,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.primary,
            modifier = Modifier.fillMaxWidth()
        )
        
        Spacer(modifier = Modifier.height(16.dp))
        
        // 商品情報カード
        Card(
            modifier = Modifier.fillMaxWidth(),
            elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
            shape = RoundedCornerShape(12.dp)
        ) {
            Column(
                modifier = Modifier.padding(16.dp)
            ) {
                Text(
                    text = "商品情報",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.primary
                )
                
                Spacer(modifier = Modifier.height(12.dp))
                
                // 商品ID
                ProductInfoRow(label = "商品ID", value = product.id.toString())
                
                // 商品コード
                ProductInfoRow(label = "商品コード", value = product.slug)
                
                // 商品説明
                if (product.description.isNotEmpty()) {
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "商品説明",
                        style = MaterialTheme.typography.labelMedium,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = product.description,
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
        }
        
        Spacer(modifier = Modifier.height(24.dp))
        
        // カート追加ボタン
        Button(
            onClick = { 
                cartViewModel.addToCart(product)
                // Snackbarでメッセージを表示
                coroutineScope.launch {
                    snackbarHostState.showSnackbar(
                        message = "${product.name}をカートに追加しました",
                        duration = SnackbarDuration.Short
                    )
                }
            },
            modifier = Modifier
                .fillMaxWidth()
                .height(56.dp),
            shape = RoundedCornerShape(28.dp)
        ) {
            Text(
                text = "カートに追加 ${product.formatPrice()}",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold
            )
        }
        
        Spacer(modifier = Modifier.height(16.dp))
        }
        
        // Snackbar
        SnackbarHost(
            hostState = snackbarHostState,
            modifier = Modifier.align(Alignment.BottomCenter)
        )
    }
}

@Composable
fun ProductInfoRow(
    label: String,
    value: String
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 2.dp),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(
            text = label,
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            modifier = Modifier.weight(1f)
        )
        Text(
            text = value,
            style = MaterialTheme.typography.bodyMedium,
            fontWeight = FontWeight.Medium,
            modifier = Modifier.weight(1f),
            textAlign = TextAlign.End
        )
    }
}

@Preview(showBackground = true)
@Composable
fun ProductDetailScreenPreview() {
    MosSampleTheme {
        ProductDetailScreen(
            productId = 1,
            productName = "モスバーガー",
            onBackClick = {}
        )
    }
}

@Preview(showBackground = true)
@Composable
fun ProductDetailContentPreview() {
    MosSampleTheme {
        ProductDetailContent(
            product = Product(
                id = 1,
                categoryId = 6,
                slug = "burger1",
                name = "モスバーガー",
                description = "定番のモスバーガーです。新鮮な野菜とジューシーなパティが絶妙にマッチした逸品です。",
                image = "m001",
                price = 440,
                sortid = 1,
                display = true,
                createdAt = "2024-06-19T02:49:19+09:00",
                updatedAt = "2024-06-19T02:49:19+09:00",
                deletedAt = null
            ),
            cartViewModel = viewModel()
        )
    }
}
