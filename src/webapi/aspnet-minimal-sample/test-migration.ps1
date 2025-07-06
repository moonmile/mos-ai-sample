# マイグレーション実行テスト用スクリプト

Write-Host "=== ASP.NET Core Minimal API マイグレーション実行テスト ===" -ForegroundColor Green
Write-Host ""

# 1. 現在のマイグレーション状態を確認
Write-Host "1. マイグレーション状態の確認" -ForegroundColor Yellow
dotnet ef migrations list
Write-Host ""

# 2. データベースの更新（マイグレーション実行）
Write-Host "2. マイグレーション実行（データベース更新）" -ForegroundColor Yellow
dotnet ef database update
Write-Host ""

# 3. 初期データの投入
Write-Host "3. 初期データの投入" -ForegroundColor Yellow
dotnet run -- --seed
Write-Host ""

# 4. 動作確認用のAPIテスト
Write-Host "4. APIエンドポイントのテスト" -ForegroundColor Yellow
Write-Host "アプリケーションを起動してAPIテストを実行します..."
Write-Host ""

# 5. 完了メッセージ
Write-Host "=== マイグレーション実行完了 ===" -ForegroundColor Green
Write-Host "次のステップ:" -ForegroundColor White
Write-Host "1. dotnet run でアプリケーションを起動" -ForegroundColor White
Write-Host "2. http://localhost:5000/mos/api/categories でカテゴリ一覧をテスト" -ForegroundColor White
Write-Host "3. http://localhost:5000/mos/api/products で商品一覧をテスト" -ForegroundColor White
Write-Host "4. Docker環境での動作確認: docker-compose up" -ForegroundColor White
