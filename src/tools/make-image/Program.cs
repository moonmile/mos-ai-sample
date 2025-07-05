using OpenAI;
using OpenAI.Images;
using System.ClientModel;

class Program
{
    // カテゴリ情報の定義
    private static readonly Dictionary<string, string> CategoryInfo = new()
    {
        { "special1", "今月のお薦め" },
        { "special3", "限定メニュー" },
        { "special2", "ネット注文特別価格メニュー" },
        { "main1", "メインメニュー" },
        { "main2", "ハンバーガー" },
        { "main3", "ホットドック" },
        { "main4", "ソイパティ" },
        { "sidemenu1", "サイドメニュー" },
        { "sidemenu2", "ドリンク・スープ" },
        { "sidemenu3", "デザート" }
    };

    // 商品情報の定義
    private static readonly Dictionary<string, string> ProductInfo = new()
    {
        { "burger1", "モスバーガー" },
        { "burger2", "モスチーズバーガー" },
        { "burger3", "ダブルモスバーガー" },
        { "burger4", "ダブルモスチーズバーガー" },
        { "burger5", "スパイシーモスバーガー" },
        { "burger6", "スパイシーモスチーズバーガー" },
        { "burger7", "スパイシーダブルモスバーガー" },
        { "burger8", "スパイシーダブルモスチーズバーガー" },
        { "burger9", "テリヤキバーガー" },
        { "burger10", "モス野菜バーガー" },
        { "hotdog1", "ホットドッグ" },
        { "hotdog2", "チリドッグ" },
        { "hotdog3", "スパイシーチリドッグ" },
        { "soiburger1", "ソイモスバーガー" },
        { "soiburger2", "ソイバーガー" },
        { "soiburger3", "ソイチーズバーガー" },
        { "side1", "フレンチフライポテト" },
        { "side2", "オニポテ（フレンチフライポテト＆オニオンフライ）" },
        { "side3", "モスチキン" },
        { "side4", "チキンナゲット" },
        { "drink1", "アイスコーヒー" },
        { "drink2", "アイスティ" },
        { "drink3", "ブレンドコーヒー" },
        { "dessert1", "ひんやりドルチェ 葛 ベリー" },
        { "dessert2", "ひんやりドルチェ 葛 トロピカル" }
    };

    // 各カテゴリに対応する英語プロンプト
    private static readonly Dictionary<string, string> CategoryPrompts = new()
    {
        { "special1", "A beautiful and appetizing seasonal hamburger set with fresh ingredients, warm orange and yellow color scheme, professional food photography, featuring 'Monthly Recommendation' text overlay" },
        { "special3", "A premium limited edition hamburger with luxury presentation, elegant black and gold color scheme, high-end food photography, featuring 'Limited Menu' text overlay" },
        { "special2", "A special price hamburger with discount elements, eye-catching red and white color scheme, online ordering theme, featuring 'Special Online Price' text overlay" },
        { "main1", "A variety of delicious hamburgers arranged together, appetizing brown and red color scheme, main menu showcase, featuring 'Main Menu' text overlay" },
        { "main2", "A classic hamburger cross-section showing layers of bun, patty, and fresh vegetables, vibrant green, red, and brown colors, featuring 'Hamburger' text overlay" },
        { "main3", "A delicious hot dog with sausage, bun, mustard and ketchup, warm brown and red color scheme, featuring 'Hot Dog' text overlay" },
        { "main4", "A healthy soy patty burger with fresh vegetables, healthy green and brown color scheme, emphasizing healthiness, featuring 'Soy Patty' text overlay" },
        { "sidemenu1", "A variety of side dishes including french fries and onion rings, golden yellow color scheme, featuring 'Side Menu' text overlay" },
        { "sidemenu2", "Various drinks and soups with glasses, cups, ice, and steam, refreshing blue and clear color scheme, featuring 'Drinks & Soup' text overlay" },
        { "sidemenu3", "Delicious desserts including ice cream and pies, sweet pastel color scheme, happy atmosphere, featuring 'Dessert' text overlay" }
    };

    // 各商品に対応する英語プロンプト
    private static readonly Dictionary<string, string> ProductPrompts = new()
    {
        { "burger1", "A delicious classic Mos Burger with fresh vegetables, lettuce, tomato, beef patty, and special sauce, professional food photography, appetizing presentation" },
        { "burger2", "A tasty Mos Cheese Burger with melted cheese, fresh vegetables, lettuce, tomato, beef patty, and special sauce, professional food photography" },
        { "burger3", "A hearty Double Mos Burger with two beef patties, fresh vegetables, lettuce, tomato, and special sauce, professional food photography" },
        { "burger4", "A delicious Double Mos Cheese Burger with two beef patties, melted cheese, fresh vegetables, and special sauce, professional food photography" },
        { "burger5", "A spicy Mos Burger with jalapeños, spicy sauce, fresh vegetables, lettuce, tomato, and beef patty, professional food photography" },
        { "burger6", "A spicy Mos Cheese Burger with jalapeños, spicy sauce, melted cheese, fresh vegetables, and beef patty, professional food photography" },
        { "burger7", "A spicy Double Mos Burger with two beef patties, jalapeños, spicy sauce, and fresh vegetables, professional food photography" },
        { "burger8", "A spicy Double Mos Cheese Burger with two beef patties, jalapeños, spicy sauce, melted cheese, and fresh vegetables, professional food photography" },
        { "burger9", "A delicious Teriyaki Burger with grilled chicken, teriyaki sauce, fresh vegetables, lettuce, and special sauce, professional food photography" },
        { "burger10", "A healthy Mos Vegetable Burger with fresh vegetables, lettuce, tomato, avocado, and vegetarian patty, professional food photography" },
        { "hotdog1", "A classic hot dog with sausage, bun, mustard, and ketchup, professional food photography, appetizing presentation" },
        { "hotdog2", "A spicy chili dog with sausage, chili sauce, onions, and cheese, professional food photography, appetizing presentation" },
        { "hotdog3", "A spicy chili dog with extra spicy sauce, jalapeños, sausage, and cheese, professional food photography, appetizing presentation" },
        { "soiburger1", "A healthy soy Mos Burger with soy patty, fresh vegetables, lettuce, tomato, and special sauce, professional food photography" },
        { "soiburger2", "A delicious soy burger with soy patty, fresh vegetables, lettuce, tomato, and healthy ingredients, professional food photography" },
        { "soiburger3", "A tasty soy cheese burger with soy patty, melted cheese, fresh vegetables, and healthy ingredients, professional food photography" },
        { "side1", "Golden crispy French fries in a container, perfectly seasoned, professional food photography, appetizing presentation" },
        { "side2", "A combination of golden French fries and crispy onion rings, professional food photography, appetizing presentation" },
        { "side3", "Crispy fried chicken pieces with golden coating, professional food photography, appetizing presentation" },
        { "side4", "Golden chicken nuggets with crispy coating, professional food photography, appetizing presentation" },
        { "drink1", "A refreshing glass of iced coffee with ice cubes, professional beverage photography, cool and refreshing appearance" },
        { "drink2", "A refreshing glass of iced tea with ice cubes and lemon, professional beverage photography, cool and refreshing appearance" },
        { "drink3", "A hot cup of blend coffee with steam, professional beverage photography, warm and inviting appearance" },
        { "dessert1", "A beautiful Japanese dessert with kudzu, berries, and elegant presentation, professional food photography, sweet and appetizing" },
        { "dessert2", "A beautiful Japanese dessert with kudzu, tropical fruits, and elegant presentation, professional food photography, sweet and appetizing" }
    };

    static async Task Main(string[] args)
    {
        // OpenAI API キーを環境変数から取得
        var apiKey = Environment.GetEnvironmentVariable("OPENAI_API_KEY");
        if (string.IsNullOrEmpty(apiKey))
        {
            Console.WriteLine("エラー: OPENAI_API_KEY 環境変数が設定されていません。");
            Console.WriteLine("使用方法: set OPENAI_API_KEY=your_api_key_here");
            return;
        }

        var client = new OpenAIClient(apiKey);

        // 出力ディレクトリを作成
        var outputDir = Path.Combine(Directory.GetCurrentDirectory(), "generated_images");
        Directory.CreateDirectory(outputDir);

        Console.WriteLine("ハンバーガー注文サイト用画像生成ツール");
        Console.WriteLine("========================================");

        if (args.Length == 0)
        {
            Console.WriteLine("使用方法:");
            Console.WriteLine("  すべてのカテゴリ画像を生成: dotnet run category-all");
            Console.WriteLine("  特定のカテゴリ画像を生成: dotnet run category <slug>");
            Console.WriteLine("  すべての商品画像を生成: dotnet run product-all");
            Console.WriteLine("  特定の商品画像を生成: dotnet run product <slug>");
            Console.WriteLine("  カスタムプロンプトで生成: dotnet run custom \"<prompt>\" <filename>");
            Console.WriteLine();
            Console.WriteLine("利用可能なカテゴリ:");
            foreach (var category in CategoryInfo)
            {
                Console.WriteLine($"  {category.Key} - {category.Value}");
            }
            Console.WriteLine();
            Console.WriteLine("利用可能な商品:");
            foreach (var product in ProductInfo)
            {
                Console.WriteLine($"  {product.Key} - {product.Value}");
            }
            return;
        }

        try
        {
            if (args[0] == "category-all")
            {
                // すべてのカテゴリ画像を生成
                await GenerateAllCategoryImages(client, outputDir);
            }
            else if (args[0] == "category" && args.Length >= 2)
            {
                // 特定のカテゴリ画像を生成
                await GenerateCategoryImage(client, outputDir, args[1]);
            }
            else if (args[0] == "product-all")
            {
                // すべての商品画像を生成
                await GenerateAllProductImages(client, outputDir);
            }
            else if (args[0] == "product" && args.Length >= 2)
            {
                // 特定の商品画像を生成
                await GenerateProductImage(client, outputDir, args[1]);
            }
            else if (args[0] == "custom" && args.Length >= 3)
            {
                // カスタムプロンプトで画像生成
                await GenerateCustomImage(client, outputDir, args[1], args[2]);
            }
            else if (args[0] == "all")
            {
                // 後方互換性のため - すべてのカテゴリ画像を生成
                await GenerateAllCategoryImages(client, outputDir);
            }
            else if (CategoryInfo.ContainsKey(args[0]))
            {
                // 後方互換性のため - 特定のカテゴリ画像を生成
                await GenerateCategoryImage(client, outputDir, args[0]);
            }
            else
            {
                Console.WriteLine($"エラー: 不明なコマンドまたはスラッグ '{args[0]}'");
                Console.WriteLine("使用方法については 'dotnet run' を実行してください。");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"エラーが発生しました: {ex.Message}");
        }
    }

    static async Task GenerateAllCategoryImages(OpenAIClient client, string outputDir)
    {
        Console.WriteLine("すべてのカテゴリ画像を生成中...");
        
        foreach (var category in CategoryInfo)
        {
            await GenerateCategoryImage(client, outputDir, category.Key);
            // API制限を考慮して少し待機
            await Task.Delay(2000);
        }
    }

    static async Task GenerateAllProductImages(OpenAIClient client, string outputDir)
    {
        Console.WriteLine("すべての商品画像を生成中...");
        
        foreach (var product in ProductInfo)
        {
            await GenerateProductImage(client, outputDir, product.Key);
            // API制限を考慮して少し待機
            await Task.Delay(2000);
        }
    }

    static async Task GenerateCategoryImage(OpenAIClient client, string outputDir, string slug)
    {
        if (!CategoryPrompts.TryGetValue(slug, out var prompt))
        {
            Console.WriteLine($"エラー: カテゴリ '{slug}' のプロンプトが見つかりません。");
            return;
        }

        var title = CategoryInfo[slug];
        var filename = $"{slug}.jpg";
        
        Console.WriteLine($"カテゴリ生成中: {title} ({filename})");
        
        await GenerateImage(client, outputDir, prompt, filename);
    }

    static async Task GenerateProductImage(OpenAIClient client, string outputDir, string slug)
    {
        if (!ProductPrompts.TryGetValue(slug, out var prompt))
        {
            Console.WriteLine($"エラー: 商品 '{slug}' のプロンプトが見つかりません。");
            return;
        }

        var title = ProductInfo[slug];
        var filename = $"{slug}.jpg";
        
        Console.WriteLine($"商品生成中: {title} ({filename})");
        
        await GenerateImage(client, outputDir, prompt, filename);
    }

    static async Task GenerateCustomImage(OpenAIClient client, string outputDir, string prompt, string filename)
    {
        Console.WriteLine($"カスタム画像を生成中: {filename}");
        
        // ファイル拡張子を確認
        if (!filename.EndsWith(".jpg", StringComparison.OrdinalIgnoreCase) && 
            !filename.EndsWith(".png", StringComparison.OrdinalIgnoreCase))
        {
            filename += ".jpg";
        }
        
        await GenerateImage(client, outputDir, prompt, filename);
    }

    static async Task GenerateImage(OpenAIClient client, string outputDir, string prompt, string filename)
    {
        try
        {
            // 画像生成サービスを取得
            var imageClient = client.GetImageClient("dall-e-3");
            
            // 画像生成オプションを設定
            var options = new ImageGenerationOptions
            {
                Size = GeneratedImageSize.W1024xH1024, // DALL-E 3は1024x1024が最も近いサイズ
                Quality = GeneratedImageQuality.Standard,
                Style = GeneratedImageStyle.Vivid,
                ResponseFormat = GeneratedImageFormat.Uri
            };

            // 画像生成を実行
            var response = await imageClient.GenerateImageAsync(prompt, options);
            
            if (response?.Value != null)
            {
                var imageUri = response.Value.ImageUri;
                Console.WriteLine($"画像URI: {imageUri}");
                
                // 画像をダウンロード
                await DownloadImage(imageUri.ToString(), outputDir, filename);
                
                Console.WriteLine($"✓ 生成完了: {filename}");
            }
            else
            {
                Console.WriteLine($"✗ 画像生成に失敗しました: {filename}");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"✗ エラー ({filename}): {ex.Message}");
        }
    }

    static async Task DownloadImage(string imageUrl, string outputDir, string filename)
    {
        using var httpClient = new HttpClient();
        var imageBytes = await httpClient.GetByteArrayAsync(imageUrl);
        
        var filePath = Path.Combine(outputDir, filename);
        await File.WriteAllBytesAsync(filePath, imageBytes);
        
        Console.WriteLine($"保存先: {filePath}");
    }
}
