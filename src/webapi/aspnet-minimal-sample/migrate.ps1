# マイグレーション管理用PowerShellスクリプト

param(
    [Parameter(Position=0)]
    [string]$Command = "help",
    
    [Parameter(Position=1)]
    [string]$Name = ""
)

# カラーコードの定義
$Red = "Red"
$Green = "Green"
$Yellow = "Yellow"

# ヘルプメッセージ
function Show-Help {
    Write-Host "Usage: .\migrate.ps1 [COMMAND] [OPTIONS]" -ForegroundColor White
    Write-Host ""
    Write-Host "Commands:" -ForegroundColor White
    Write-Host "  init         初期マイグレーションを作成" -ForegroundColor White
    Write-Host "  add [name]   新しいマイグレーションを作成" -ForegroundColor White
    Write-Host "  update       データベースを最新のマイグレーションに更新" -ForegroundColor White
    Write-Host "  status       マイグレーションの状態を確認" -ForegroundColor White
    Write-Host "  rollback     前のマイグレーションにロールバック" -ForegroundColor White
    Write-Host "  seed         初期データを投入" -ForegroundColor White
    Write-Host "  reset        データベースをリセット（危険）" -ForegroundColor White
    Write-Host "  help         このヘルプを表示" -ForegroundColor White
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor White
    Write-Host "  .\migrate.ps1 init" -ForegroundColor White
    Write-Host "  .\migrate.ps1 add AddProductCategory" -ForegroundColor White
    Write-Host "  .\migrate.ps1 update" -ForegroundColor White
    Write-Host "  .\migrate.ps1 seed" -ForegroundColor White
}

# 初期マイグレーション作成
function Create-InitialMigration {
    Write-Host "初期マイグレーションを作成中..." -ForegroundColor $Yellow
    $result = dotnet ef migrations add InitialCreate
    if ($LASTEXITCODE -eq 0) {
        Write-Host "初期マイグレーションが作成されました" -ForegroundColor $Green
    } else {
        Write-Host "初期マイグレーションの作成に失敗しました" -ForegroundColor $Red
        exit 1
    }
}

# 新しいマイグレーション作成
function Add-Migration {
    param([string]$MigrationName)
    
    if ([string]::IsNullOrEmpty($MigrationName)) {
        Write-Host "マイグレーション名を指定してください" -ForegroundColor $Red
        exit 1
    }
    
    Write-Host "マイグレーション '$MigrationName' を作成中..." -ForegroundColor $Yellow
    $result = dotnet ef migrations add $MigrationName
    if ($LASTEXITCODE -eq 0) {
        Write-Host "マイグレーション '$MigrationName' が作成されました" -ForegroundColor $Green
    } else {
        Write-Host "マイグレーション '$MigrationName' の作成に失敗しました" -ForegroundColor $Red
        exit 1
    }
}

# データベース更新
function Update-Database {
    Write-Host "データベースを最新のマイグレーションに更新中..." -ForegroundColor $Yellow
    $result = dotnet ef database update
    if ($LASTEXITCODE -eq 0) {
        Write-Host "データベースが正常に更新されました" -ForegroundColor $Green
    } else {
        Write-Host "データベースの更新に失敗しました" -ForegroundColor $Red
        exit 1
    }
}

# マイグレーション状態確認
function Check-MigrationStatus {
    Write-Host "マイグレーションの状態を確認中..." -ForegroundColor $Yellow
    dotnet ef migrations list
}

# ロールバック
function Rollback-Migration {
    Write-Host "前のマイグレーションにロールバック中..." -ForegroundColor $Yellow
    $result = dotnet ef database update 0
    if ($LASTEXITCODE -eq 0) {
        Write-Host "ロールバックが完了しました" -ForegroundColor $Green
    } else {
        Write-Host "ロールバックに失敗しました" -ForegroundColor $Red
        exit 1
    }
}

# 初期データ投入
function Seed-Database {
    Write-Host "初期データを投入中..." -ForegroundColor $Yellow
    # 初期データ投入用のC#プログラムを実行
    $result = dotnet run -- --seed
    if ($LASTEXITCODE -eq 0) {
        Write-Host "初期データの投入が完了しました" -ForegroundColor $Green
    } else {
        Write-Host "初期データの投入に失敗しました" -ForegroundColor $Red
        exit 1
    }
}

# データベースリセット
function Reset-Database {
    Write-Host "警告: この操作はデータベースを完全にリセットします" -ForegroundColor $Red
    $confirmation = Read-Host "続行しますか? (y/N)"
    if ($confirmation -eq "y" -or $confirmation -eq "Y") {
        Write-Host "データベースをリセット中..." -ForegroundColor $Yellow
        dotnet ef database drop --force
        dotnet ef database update
        if ($LASTEXITCODE -eq 0) {
            Write-Host "データベースのリセットが完了しました" -ForegroundColor $Green
        } else {
            Write-Host "データベースのリセットに失敗しました" -ForegroundColor $Red
            exit 1
        }
    } else {
        Write-Host "操作がキャンセルされました" -ForegroundColor $Yellow
    }
}

# メイン処理
switch ($Command.ToLower()) {
    "init" {
        Create-InitialMigration
    }
    "add" {
        Add-Migration -MigrationName $Name
    }
    "update" {
        Update-Database
    }
    "status" {
        Check-MigrationStatus
    }
    "rollback" {
        Rollback-Migration
    }
    "seed" {
        Seed-Database
    }
    "reset" {
        Reset-Database
    }
    "help" {
        Show-Help
    }
    default {
        Write-Host "不明なコマンド: $Command" -ForegroundColor $Red
        Show-Help
        exit 1
    }
}
