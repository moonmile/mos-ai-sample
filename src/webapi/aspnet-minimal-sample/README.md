# ASP.NET Core Minimal API with MySQL - マイグレーション管理

このプロジェクトでは、Entity Framework Coreを使用してMySQLデータベースとの連携を行います。

## 前提条件

- .NET 9.0
- MySQL 8.0以降
- Entity Framework Core Tools

## データベース設定

### 1. 接続文字列の設定

`appsettings.json`または`appsettings.Development.json`で接続文字列を設定してください：

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=mos;User=root;Password=your_password;Port=3306;"
  }
}
```

### 2. マイグレーションの管理

#### PowerShell（Windows）

```powershell
# 初期マイグレーションを作成
.\migrate.ps1 init

# 新しいマイグレーションを作成
.\migrate.ps1 add "AddNewTable"

# データベースを最新のマイグレーションに更新
.\migrate.ps1 update

# マイグレーションの状態を確認
.\migrate.ps1 status

# 初期データを投入
.\migrate.ps1 seed

# データベースをリセット（危険）
.\migrate.ps1 reset
```

#### Bash（Linux/Mac）

```bash
# 初期マイグレーションを作成
./migrate.sh init

# 新しいマイグレーションを作成
./migrate.sh add "AddNewTable"

# データベースを最新のマイグレーションに更新
./migrate.sh update

# マイグレーションの状態を確認
./migrate.sh status

# 初期データを投入
./migrate.sh seed

# データベースをリセット（危険）
./migrate.sh reset
```

#### 手動でのEntity Framework Coreコマンド

```bash
# 初期マイグレーションを作成
dotnet ef migrations add InitialCreate

# データベースを更新
dotnet ef database update

# 初期データを投入
dotnet run -- --seed

# マイグレーションの状態を確認
dotnet ef migrations list

# 特定のマイグレーションに移行
dotnet ef database update TargetMigration

# データベースを削除
dotnet ef database drop
```

## マイグレーションファイルの構成

### 自動生成されるマイグレーション

Entity Framework Coreは、モデルの変更を検出して自動的にマイグレーションを作成します：

- `Migrations/[timestamp]_InitialCreate.cs`: マイグレーションの実行内容
- `Migrations/[timestamp]_InitialCreate.Designer.cs`: EF Coreのメタデータ
- `Migrations/AppDbContextModelSnapshot.cs`: 現在のモデルのスナップショット

### 手動でのSQL実行

手動でSQLを実行する場合は、`database/init/01_create_tables.sql`を使用できます：

```sql
-- MySQLに直接接続して実行
mysql -u root -p mos < database/init/01_create_tables.sql
```

## 初期データについて

### 自動投入される初期データ

`Services/DatabaseSeeder.cs`で以下のデータが自動投入されます：

- **カテゴリ**: 10件（今月のお薦め、特別価格メニュー、限定メニュー、メインメニュー、ハンバーガー、ホットドック、ソイパティ、サイドメニュー、ドリンク・スープ、デザート）
- **商品**: 25件（モスバーガー風のファストフード商品）
- **注文**: 3件（サンプル注文データ）
- **注文商品**: 関連する注文商品データ

### 初期データの投入

```bash
# 初期データを投入
dotnet run -- --seed

# または PowerShell
.\migrate.ps1 seed

# または Bash
./migrate.sh seed
```

## Docker環境での使用

### 通常のDocker環境

Docker環境では、データベースの初期化が自動で行われます：

```bash
# 開発環境の起動
docker-compose -f docker-compose.dev.yml up

# 本番環境の起動
docker-compose up
```

### VS Code Dev Container環境 🚀

**推奨**: 完全に分離された開発環境として、VS Code の Dev Container 機能を使用できます。

```bash
# VS Code で開く
code .

# コマンドパレット (Ctrl+Shift+P) で以下を選択
Remote-Containers: Reopen in Container
```

**含まれるサービス**:
- ASP.NET Core 9.0 開発環境
- MySQL 8.0 データベース
- phpMyAdmin データベース管理ツール
- Entity Framework Core ツール
- 開発用エイリアス（`dev`, `migrate`, `seed` など）

**自動で実行される処理**:
- パッケージの復元
- データベースマイグレーション
- 初期データの投入
- 便利なエイリアスの設定

詳細は `.devcontainer/README.md` を参照してください。

## トラブルシューティング

### マイグレーションエラー

```bash
# マイグレーションをリセット
dotnet ef migrations remove

# データベースを削除して再作成
dotnet ef database drop
dotnet ef database update
```

### 接続エラー

1. MySQL サーバーが起動していることを確認
2. 接続文字列が正しいことを確認
3. データベース `mos` が存在することを確認

### パッケージエラー

```bash
# パッケージを復元
dotnet restore

# キャッシュをクリア
dotnet nuget locals all --clear
```

## API エンドポイント

マイグレーション後、以下のAPIエンドポイントが利用可能になります：

- `GET /mos/api/categories` - カテゴリ一覧
- `GET /mos/api/products` - 商品一覧
- `GET /mos/api/orders` - 注文一覧
- `POST /mos/api/orders` - 注文作成

詳細な仕様については、`webapi/mos-api.yaml`を参照してください。
