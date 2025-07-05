# 画像生成ツール

OpenAI DALL-E 3 APIを使用してハンバーガー注文サイト用の画像を生成するツールです。

## セットアップ

1. NuGetパッケージの復元
```bash
dotnet restore
```

2. OpenAI API キーの設定
```bash
# Windows (PowerShell)
$env:OPENAI_API_KEY="your_api_key_here"

# Windows (Command Prompt)
set OPENAI_API_KEY=your_api_key_here

# Linux/macOS
export OPENAI_API_KEY="your_api_key_here"
```

## 使用方法

### すべてのカテゴリ画像を生成
```bash
dotnet run category-all
```

### 特定のカテゴリ画像を生成
```bash
dotnet run category special1
dotnet run category main2
dotnet run category sidemenu3
```

### すべての商品画像を生成
```bash
dotnet run product-all
```

### 特定の商品画像を生成
```bash
dotnet run product burger1
dotnet run product hotdog2
dotnet run product side1
```

### カスタムプロンプトで画像生成
```bash
dotnet run custom "A delicious pizza with cheese and pepperoni, professional food photography" "pizza.jpg"
```

### 後方互換性（旧コマンド）
```bash
dotnet run all           # category-all と同じ
dotnet run special1      # category special1 と同じ
```

## カテゴリ一覧

| slug | タイトル | 説明 |
|------|----------|------|
| special1 | 今月のお薦め | 季節感のあるハンバーガーセット |
| special3 | 限定メニュー | 特別感のあるプレミアムハンバーガー |
| special2 | ネット注文特別価格メニュー | 割引価格を強調したハンバーガー |
| main1 | メインメニュー | 代表的なハンバーガーの集合 |
| main2 | ハンバーガー | クラシックなハンバーガーの断面図 |
| main3 | ホットドック | 美味しそうなホットドック |
| main4 | ソイパティ | ヘルシーなソイパティバーガー |
| sidemenu1 | サイドメニュー | フライドポテト、オニオンリング等 |
| sidemenu2 | ドリンク・スープ | 様々な飲み物とスープ |
| sidemenu3 | デザート | アイスクリーム、パイ等のデザート |

## 商品一覧

### ハンバーガー
| slug | タイトル |
|------|----------|
| burger1 | モスバーガー |
| burger2 | モスチーズバーガー |
| burger3 | ダブルモスバーガー |
| burger4 | ダブルモスチーズバーガー |
| burger5 | スパイシーモスバーガー |
| burger6 | スパイシーモスチーズバーガー |
| burger7 | スパイシーダブルモスバーガー |
| burger8 | スパイシーダブルモスチーズバーガー |
| burger9 | テリヤキバーガー |
| burger10 | モス野菜バーガー |

### ホットドック
| slug | タイトル |
|------|----------|
| hotdog1 | ホットドッグ |
| hotdog2 | チリドッグ |
| hotdog3 | スパイシーチリドッグ |

### ソイバーガー
| slug | タイトル |
|------|----------|
| soiburger1 | ソイモスバーガー |
| soiburger2 | ソイバーガー |
| soiburger3 | ソイチーズバーガー |

### サイドメニュー
| slug | タイトル |
|------|----------|
| side1 | フレンチフライポテト |
| side2 | オニポテ（フレンチフライポテト＆オニオンフライ） |
| side3 | モスチキン |
| side4 | チキンナゲット |

### ドリンク
| slug | タイトル |
|------|----------|
| drink1 | アイスコーヒー |
| drink2 | アイスティ |
| drink3 | ブレンドコーヒー |

### デザート
| slug | タイトル |
|------|----------|
| dessert1 | ひんやりドルチェ 葛 ベリー |
| dessert2 | ひんやりドルチェ 葛 トロピカル |

## 出力

生成された画像は `generated_images` フォルダに保存されます。

## 注意事項

- OpenAI API の利用には料金がかかります
- API制限により、連続生成時は2秒間の待機時間が設けられています
- DALL-E 3は1024x1024サイズで生成されるため、必要に応じて後からリサイズしてください

## トラブルシューティング

### API キーエラー
- 環境変数 `OPENAI_API_KEY` が正しく設定されているか確認してください
- API キーが有効で、十分なクレジットがあることを確認してください

### 画像生成エラー
- プロンプトが適切であることを確認してください
- インターネット接続を確認してください
- OpenAI APIの状態を確認してください
