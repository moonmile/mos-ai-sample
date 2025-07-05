package net.moonmile.aisample.mosapp.data

import com.google.gson.annotations.SerializedName

data class Product(
    val id: Int,
    @SerializedName("category_id")
    val categoryId: Int,
    val slug: String,
    val name: String,
    val description: String,
    val image: String,
    val price: Int,
    val sortid: Int,
    val display: Boolean,
    @SerializedName("created_at")
    val createdAt: String,
    @SerializedName("updated_at")
    val updatedAt: String,
    @SerializedName("deleted_at")
    val deletedAt: String?
)

data class ProductResponse(
    val items: List<Product>,
    val total: Int
)

// 商品価格のフォーマット
fun Product.formatPrice(): String {
    return "¥${price}"
}

// 価格のフォーマット（独立関数）
fun formatPrice(price: Int): String {
    return "¥${price}"
}

// 商品画像URLの生成
fun Product.getImageUrl(): String {
    return if (image.isNotEmpty()) {
        "http://10.0.2.2:8000/images/${image}.jpeg"
    } else {
        ""
    }
}

// 商品画像のプレースホルダー絵文字
fun Product.getProductEmoji(): String {
    return when {
        name.contains("バーガー") -> "🍔"
        name.contains("ホットドッグ") || name.contains("ドッグ") -> "🌭"
        name.contains("ポテト") -> "🍟"
        name.contains("ドリンク") || name.contains("コーラ") || name.contains("ジュース") -> "🥤"
        name.contains("コーヒー") -> "☕"
        name.contains("スープ") -> "🍜"
        name.contains("サラダ") -> "🥗"
        name.contains("デザート") || name.contains("ケーキ") || name.contains("アイス") -> "🍰"
        name.contains("チキン") -> "🍗"
        name.contains("フィッシュ") -> "🐟"
        name.contains("ソイ") -> "🌱"
        name.contains("スパイシー") || name.contains("チリ") -> "🌶️"
        else -> "🍴"
    }
}

// サンプル商品データ（オフライン用）
object ProductData {
    val sampleProducts = listOf(
        Product(
            id = 1,
            categoryId = 6,
            slug = "burger1",
            name = "モスバーガー",
            description = "定番のモスバーガーです。新鮮な野菜とジューシーなパティが絶妙にマッチした逸品です。モスバーガーの原点ともいえる味をお楽しみください。",
            image = "m001",
            price = 440,
            sortid = 1,
            display = true,
            createdAt = "2024-06-19T02:49:19+09:00",
            updatedAt = "2024-06-19T02:49:19+09:00",
            deletedAt = null
        ),
        Product(
            id = 2,
            categoryId = 6,
            slug = "cheeseburger",
            name = "チーズバーガー",
            description = "モスバーガーにチーズをトッピングした濃厚な味わいのバーガーです。",
            image = "m002",
            price = 520,
            sortid = 2,
            display = true,
            createdAt = "2024-06-19T02:49:19+09:00",
            updatedAt = "2024-06-19T02:49:19+09:00",
            deletedAt = null
        ),
        Product(
            id = 3,
            categoryId = 6,
            slug = "fishburger",
            name = "フィッシュバーガー",
            description = "新鮮な魚フライを使用したヘルシーなバーガーです。",
            image = "m003",
            price = 380,
            sortid = 3,
            display = true,
            createdAt = "2024-06-19T02:49:19+09:00",
            updatedAt = "2024-06-19T02:49:19+09:00",
            deletedAt = null
        ),
        Product(
            id = 4,
            categoryId = 6,
            slug = "chickenburger",
            name = "チキンバーガー",
            description = "ジューシーなチキンパティを使用したバーガーです。",
            image = "m004",
            price = 450,
            sortid = 4,
            display = true,
            createdAt = "2024-06-19T02:49:19+09:00",
            updatedAt = "2024-06-19T02:49:19+09:00",
            deletedAt = null
        ),
        Product(
            id = 5,
            categoryId = 7,
            slug = "hotdog1",
            name = "ホットドッグ",
            description = "定番のホットドッグです。特製ソースとマスタードでお楽しみください。",
            image = "m005",
            price = 350,
            sortid = 5,
            display = true,
            createdAt = "2024-06-19T02:49:19+09:00",
            updatedAt = "2024-06-19T02:49:19+09:00",
            deletedAt = null
        ),
        Product(
            id = 6,
            categoryId = 7,
            slug = "chilidog",
            name = "チリドッグ",
            description = "スパイシーなチリソースをトッピングしたホットドッグです。",
            image = "m006",
            price = 420,
            sortid = 6,
            display = true,
            createdAt = "2024-06-19T02:49:19+09:00",
            updatedAt = "2024-06-19T02:49:19+09:00",
            deletedAt = null
        ),
        Product(
            id = 7,
            categoryId = 8,
            slug = "frenchfries",
            name = "フレンチフライ",
            description = "外はサクサク、中はホクホクの定番フライドポテトです。",
            image = "m007",
            price = 290,
            sortid = 7,
            display = true,
            createdAt = "2024-06-19T02:49:19+09:00",
            updatedAt = "2024-06-19T02:49:19+09:00",
            deletedAt = null
        ),
        Product(
            id = 8,
            categoryId = 8,
            slug = "onionrings",
            name = "オニオンリング",
            description = "サクサクの衣と甘いタマネギの組み合わせが絶妙です。",
            image = "m008",
            price = 320,
            sortid = 8,
            display = true,
            createdAt = "2024-06-19T02:49:19+09:00",
            updatedAt = "2024-06-19T02:49:19+09:00",
            deletedAt = null
        ),
        Product(
            id = 9,
            categoryId = 9,
            slug = "cola",
            name = "コーラ",
            description = "氷たっぷりの爽やかなコーラです。",
            image = "m009",
            price = 150,
            sortid = 9,
            display = true,
            createdAt = "2024-06-19T02:49:19+09:00",
            updatedAt = "2024-06-19T02:49:19+09:00",
            deletedAt = null
        ),
        Product(
            id = 10,
            categoryId = 9,
            slug = "coffee",
            name = "コーヒー",
            description = "香り高い厳選豆を使用したコーヒーです。",
            image = "m010",
            price = 200,
            sortid = 10,
            display = true,
            createdAt = "2024-06-19T02:49:19+09:00",
            updatedAt = "2024-06-19T02:49:19+09:00",
            deletedAt = null
        ),
        Product(
            id = 13,
            categoryId = 1,
            slug = "hotdog3",
            name = "スパイシーチリドッグ",
            description = "辛さがクセになるチリソース付きホットドッグ。厳選されたスパイスとチリソースが絶妙にマッチした大人の味わいです。",
            image = "m011",
            price = 470,
            sortid = 13,
            display = true,
            createdAt = "2024-06-19T02:49:19+09:00",
            updatedAt = "2024-06-19T02:49:19+09:00",
            deletedAt = null
        ),
        Product(
            id = 15,
            categoryId = 1,
            slug = "soiburger2",
            name = "ソイバーガー",
            description = "ヘルシーな大豆パティを使用したバーガー。植物性タンパク質で作られた、環境にも優しいバーガーです。",
            image = "m013",
            price = 260,
            sortid = 15,
            display = true,
            createdAt = "2024-06-19T02:49:19+09:00",
            updatedAt = "2024-06-19T02:49:19+09:00",
            deletedAt = null
        )
    )
    
    // カテゴリスラッグ別のサンプルデータを取得
    fun getSampleProductsByCategory(categorySlug: String): List<Product> {
        return when (categorySlug) {
            "special1" -> sampleProducts.filter { it.categoryId == 1 } // 今月のお薦め
            "burger" -> sampleProducts.filter { it.categoryId == 6 } // バーガー
            "hotdog" -> sampleProducts.filter { it.categoryId == 7 } // ホットドッグ
            "side" -> sampleProducts.filter { it.categoryId == 8 } // サイド
            "drink" -> sampleProducts.filter { it.categoryId == 9 } // ドリンク
            else -> sampleProducts // デフォルトは全商品
        }
    }
}
