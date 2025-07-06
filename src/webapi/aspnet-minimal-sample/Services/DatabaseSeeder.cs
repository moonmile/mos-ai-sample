using aspnet_minimal_sample.Data;
using aspnet_minimal_sample.Models;
using Microsoft.EntityFrameworkCore;

namespace aspnet_minimal_sample.Services;

public class DatabaseSeeder
{
    private readonly AppDbContext _context;

    public DatabaseSeeder(AppDbContext context)
    {
        _context = context;
    }

    public async Task SeedAsync()
    {
        // 既存のデータがある場合はスキップ
        if (await _context.Categories.AnyAsync())
        {
            Console.WriteLine("データベースには既にデータが存在します。初期データの投入をスキップします。");
            return;
        }

        Console.WriteLine("初期データを投入中...");

        // カテゴリの初期データ
        var categories = new List<Category>
        {
            new Category
            {
                Slug = "special1",
                Title = "今月のお薦め",
                Description = "今月のお薦め商品を紹介します。",
                Image = "special1.jpg",
                SortId = 1,
                Display = 1
            },
            new Category
            {
                Slug = "special2",
                Title = "ネット注文特別価格メニュー",
                Description = "",
                Image = "special2.jpg",
                SortId = 2,
                Display = 1
            },
            new Category
            {
                Slug = "special3",
                Title = "限定メニュー",
                Description = "",
                Image = "special3.jpg",
                SortId = 3,
                Display = 1
            },
            new Category
            {
                Slug = "main1",
                Title = "メインメニュー",
                Description = "メインメニューのハンバーガーを紹介します。",
                Image = "main1.jpg",
                SortId = 10,
                Display = 1
            },
            new Category
            {
                Slug = "main2",
                Title = "ハンバーガー",
                Description = "",
                Image = "main2.jpg",
                SortId = 11,
                Display = 1
            },
            new Category
            {
                Slug = "main3",
                Title = "ホットドック",
                Description = "",
                Image = "main3.jpg",
                SortId = 12,
                Display = 1
            },
            new Category
            {
                Slug = "main4",
                Title = "ソイパティ",
                Description = "",
                Image = "main4.jpg",
                SortId = 13,
                Display = 1
            },
            new Category
            {
                Slug = "sidemenu1",
                Title = "サイドメニュー",
                Description = "サイドメニューのポテトやドリンクを紹介します。",
                Image = "sidemenu1.jpg",
                SortId = 20,
                Display = 1
            },
            new Category
            {
                Slug = "sidemenu2",
                Title = "ドリンク・スープ",
                Description = "",
                Image = "sidemenu2.jpg",
                SortId = 21,
                Display = 1
            },
            new Category
            {
                Slug = "sidemenu3",
                Title = "デザート",
                Description = "",
                Image = "sidemenu3.jpg",
                SortId = 22,
                Display = 1
            }
        };

        await _context.Categories.AddRangeAsync(categories);
        await _context.SaveChangesAsync();


        // カテゴリの最大値からランダムidを取得
        int fake_category_id()
        {
            var maxId = _context.Categories.Max(c => c.Id);
            return Random.Shared.Next(maxId) + 1; // 1からmaxIdまでのランダムな値を生成
        }


        // 商品の初期データ
        var products = new List<Product>
        {
            // ハンバーガー
            new Product
            {
                CategoryId = fake_category_id(),
                Slug = "burger1",
                Name = "モスバーガー",
                Description = "",
                Image = "burger1.jpg",
                Price = 440,
                SortId = 1,
                Display = 1
            },
            new Product
            {
                CategoryId = fake_category_id(),
                Slug = "burger2",
                Name = "モスチーズバーガー",
                Description = "",
                Image = "burger2.jpg",
                Price = 480,
                SortId = 2,
                Display = 1
            },
            new Product
            {
                CategoryId = fake_category_id(),
                Slug = "burger3",
                Name = "ダブルモスバーガー",
                Description = "",
                Image = "burger3.jpg",
                Price = 600,
                SortId = 3,
                Display = 1
            },
            new Product
            {
                CategoryId = fake_category_id(),
                Slug = "burger4",
                Name = "ダブルモスチーズバーガー",
                Description = "",
                Image = "burger4.jpg",
                Price = 640,
                SortId = 4,
                Display = 1
            },
            new Product
            {
                CategoryId = fake_category_id(),
                Slug = "burger5",
                Name = "スパイシーモスバーガー",
                Description = "",
                Image = "burger5.jpg",
                Price = 480,
                SortId = 5,
                Display = 1
            },
            new Product
            {
                CategoryId = fake_category_id(),
                Slug = "burger6",
                Name = "スパイシーモスチーズバーガー",
                Description = "",
                Image = "burger6.jpg",
                Price = 520,
                SortId = 6,
                Display = 1
            },
            new Product
            {
                CategoryId = fake_category_id(),
                Slug = "burger7",
                Name = "スパイシーダブルモスバーガー",
                Description = "",
                Image = "burger7.jpg",
                Price = 640,
                SortId = 7,
                Display = 1
            },
            new Product
            {
                CategoryId = fake_category_id(),
                Slug = "burger8",
                Name = "スパイシーダブルモスチーズバーガー",
                Description = "",
                Image = "burger8.jpg",
                Price = 680,
                SortId = 8,
                Display = 1
            },
            new Product
            {
                CategoryId = fake_category_id(),
                Slug = "burger9",
                Name = "テリヤキバーガー",
                Description = "",
                Image = "burger9.jpg",
                Price = 430,
                SortId = 9,
                Display = 1
            },
            new Product
            {
                CategoryId = fake_category_id(),
                Slug = "burger10",
                Name = "モス野菜バーガー",
                Description = "",
                Image = "burger10.jpg",
                Price = 440,
                SortId = 10,
                Display = 1
            },

            // ホットドック
            new Product
            {
                CategoryId = fake_category_id(),
                Slug = "hotdog1",
                Name = "ホットドッグ",
                Description = "",
                Image = "hotdog1.jpg",
                Price = 400,
                SortId = 11,
                Display = 1
            },
            new Product
            {
                CategoryId = fake_category_id(),
                Slug = "hotdog2",
                Name = "チリドッグ",
                Description = "",
                Image = "hotdog2.jpg",
                Price = 430,
                SortId = 12,
                Display = 1
            },
            new Product
            {
                CategoryId = fake_category_id(),
                Slug = "hotdog3",
                Name = "スパイシーチリドッグ",
                Description = "",
                Image = "hotdog3.jpg",
                Price = 470,
                SortId = 13,
                Display = 1
            },

            // ソイパティ
            new Product
            {
                CategoryId = fake_category_id(),
                Slug = "soiburger1",
                Name = "ソイモスバーガー",
                Description = "",
                Image = "soiburger1.jpg",
                Price = 460,
                SortId = 14,
                Display = 1
            },
            new Product
            {
                CategoryId = fake_category_id(),
                Slug = "soiburger2",
                Name = "ソイバーガー",
                Description = "",
                Image = "soiburger2.jpg",
                Price = 260,
                SortId = 15,
                Display = 1
            },
            new Product
            {
                CategoryId = fake_category_id(),
                Slug = "soiburger3",
                Name = "ソイチーズバーガー",
                Description = "",
                Image = "soiburger3.jpg",
                Price = 300,
                SortId = 16,
                Display = 1
            },

            // サイドメニュー
            new Product
            {
                CategoryId = fake_category_id(),
                Slug = "side1",
                Name = "フレンチフライポテト",
                Description = "",
                Image = "side1.jpg",
                Price = 240,
                SortId = 17,
                Display = 1
            },
            new Product
            {
                CategoryId = fake_category_id(),
                Slug = "side2",
                Name = "オニポテ（フレンチフライポテト＆オニオンフライ）",
                Description = "",
                Image = "side2.jpg",
                Price = 300,
                SortId = 18,
                Display = 1
            },
            new Product
            {
                CategoryId = fake_category_id(),
                Slug = "side3",
                Name = "モスチキン",
                Description = "",
                Image = "side3.jpg",
                Price = 320,
                SortId = 19,
                Display = 1
            },
            new Product
            {
                CategoryId = fake_category_id(),
                Slug = "side4",
                Name = "チキンナゲット",
                Description = "",
                Image = "side4.jpg",
                Price = 360,
                SortId = 20,
                Display = 1
            },

            // ドリンク・スープ
            new Product
            {
                CategoryId = fake_category_id(),
                Slug = "drink1",
                Name = "アイスコーヒー",
                Description = "",
                Image = "drink1.jpg",
                Price = 260,
                SortId = 21,
                Display = 1
            },
            new Product
            {
                CategoryId = fake_category_id(),
                Slug = "drink2",
                Name = "アイスティ",
                Description = "",
                Image = "drink2.jpg",
                Price = 260,
                SortId = 22,
                Display = 1
            },
            new Product
            {
                CategoryId = fake_category_id(),
                Slug = "drink3",
                Name = "ブレンドコーヒー",
                Description = "",
                Image = "drink3.jpg",
                Price = 290,
                SortId = 23,
                Display = 1
            },

            // デザート
            new Product
            {
                CategoryId = fake_category_id(),
                Slug = "dessert1",
                Name = "ひんやりドルチェ 葛 ベリー",
                Description = "",
                Image = "dessert1.jpg",
                Price = 260,
                SortId = 24,
                Display = 1
            },
            new Product
            {
                CategoryId = fake_category_id(),
                Slug = "dessert2",
                Name = "ひんやりドルチェ 葛 トロピカル",
                Description = "",
                Image = "dessert2.jpg",
                Price = 260,
                SortId = 25,
                Display = 1
            },
        };

        await _context.Products.AddRangeAsync(products);
        await _context.SaveChangesAsync();

        // サンプル注文データ
        var orders = new List<Order>
        {
            new Order
            {
                OrderNumber = "ORD0001",
                TotalPrice = 1180,
                TotalQuantity = 3,
                Status = 1,
                OrderProducts = new List<OrderProduct>
                {
                    new OrderProduct
                    {
                        ProductId = products[0].Id, // モスバーガー
                        Price = 440,
                        Quantity = 1
                    },
                    new OrderProduct
                    {
                        ProductId = products[16].Id, // フレンチフライポテト
                        Price = 240,
                        Quantity = 1
                    },
                    new OrderProduct
                    {
                        ProductId = products[20].Id, // アイスコーヒー
                        Price = 260,
                        Quantity = 1
                    }
                }
            },
            new Order
            {
                OrderNumber = "ORD0002",
                TotalPrice = 1100,
                TotalQuantity = 3,
                Status = 2,
                OrderProducts = new List<OrderProduct>
                {
                    new OrderProduct
                    {
                        ProductId = products[10].Id, // ホットドッグ
                        Price = 400,
                        Quantity = 1
                    },
                    new OrderProduct
                    {
                        ProductId = products[18].Id, // モスチキン
                        Price = 320,
                        Quantity = 1
                    },
                    new OrderProduct
                    {
                        ProductId = products[22].Id, // ブレンドコーヒー
                        Price = 290,
                        Quantity = 1
                    }
                }
            },
            new Order
            {
                OrderNumber = "ORD0003",
                TotalPrice = 1000,
                TotalQuantity = 3,
                Status = 1,
                OrderProducts = new List<OrderProduct>
                {
                    new OrderProduct
                    {
                        ProductId = products[1].Id, // モスチーズバーガー
                        Price = 480,
                        Quantity = 1
                    },
                    new OrderProduct
                    {
                        ProductId = products[17].Id, // オニポテ
                        Price = 300,
                        Quantity = 1
                    },
                    new OrderProduct
                    {
                        ProductId = products[21].Id, // アイスティ
                        Price = 260,
                        Quantity = 1
                    }
                }
            }
        };

        await _context.Orders.AddRangeAsync(orders);
        await _context.SaveChangesAsync();

        Console.WriteLine($"初期データの投入が完了しました:");
        Console.WriteLine($"- カテゴリ: {categories.Count}件");
        Console.WriteLine($"- 商品: {products.Count}件");
        Console.WriteLine($"- 注文: {orders.Count}件");
        Console.WriteLine($"- 注文商品: {orders.SelectMany(o => o.OrderProducts).Count()}件");
        Console.WriteLine("");
        Console.WriteLine("カテゴリ別商品数:");
        foreach (var category in categories)
        {
            var productCount = products.Count(p => p.CategoryId == category.Id);
            Console.WriteLine($"  {category.Title}: {productCount}件");
        }
    }
}
