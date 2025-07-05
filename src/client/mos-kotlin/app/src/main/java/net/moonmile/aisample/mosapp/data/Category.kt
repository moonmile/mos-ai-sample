package net.moonmile.aisample.mosapp.data

import com.google.gson.annotations.SerializedName

data class Category(
    val id: Int,
    val slug: String,
    val title: String,
    val description: String,
    val image: String,
    val sortid: Int,
    val display: Boolean,
    @SerializedName("created_at")
    val createdAt: String,
    @SerializedName("updated_at")
    val updatedAt: String,
    @SerializedName("deleted_at")
    val deletedAt: String?
)

data class CategoryResponse(
    val items: List<Category>,
    val total: Int
)

// デフォルト画像のアイコンマッピング
fun Category.getIconEmoji(): String {
    return when {
        title.contains("お薦め") || title.contains("おすすめ") -> "⭐"
        title.contains("特別") || title.contains("限定") -> "🎯"
        title.contains("ハンバーガー") -> "�"
        title.contains("ホットドッグ") -> "🌭"
        title.contains("ソイパティ") -> "🌱"
        title.contains("サイドメニュー") -> "🍟"
        title.contains("ドリンク") || title.contains("スープ") -> "🥤"
        title.contains("デザート") -> "🍰"
        title.contains("メイン") -> "🍽️"
        else -> "📁"
    }
}

// サンプルカテゴリデータ（オフライン用）
object CategoryData {
    val categories = listOf(
        Category(
            id = 1,
            slug = "special1",
            title = "今月のお薦め",
            description = "今月のお薦め商品を紹介します。",
            image = "",
            sortid = 1,
            display = true,
            createdAt = "2025-06-05T11:57:01+09:00",
            updatedAt = "2025-06-05T11:57:01+09:00",
            deletedAt = null
        ),
        Category(
            id = 2,
            slug = "main1",
            title = "メインメニュー",
            description = "メインメニューのハンバーガーを紹介します。",
            image = "",
            sortid = 10,
            display = true,
            createdAt = "2024-06-19T02:49:19+09:00",
            updatedAt = "2024-06-19T02:49:19+09:00",
            deletedAt = null
        ),
        Category(
            id = 3,
            slug = "sidemenu1",
            title = "サイドメニュー",
            description = "サイドメニューのポテトやドリンクを紹介します。",
            image = "",
            sortid = 20,
            display = true,
            createdAt = "2024-06-19T02:49:19+09:00",
            updatedAt = "2024-06-19T02:49:19+09:00",
            deletedAt = null
        )
    )
}
