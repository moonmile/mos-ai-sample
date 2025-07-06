#!/bin/bash
# マイグレーション管理用スクリプト

# カラーコードの定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# ヘルプメッセージ
show_help() {
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo ""
    echo "Commands:"
    echo "  init         初期マイグレーションを作成"
    echo "  add [name]   新しいマイグレーションを作成"
    echo "  update       データベースを最新のマイグレーションに更新"
    echo "  status       マイグレーションの状態を確認"
    echo "  rollback     前のマイグレーションにロールバック"
    echo "  seed         初期データを投入"
    echo "  reset        データベースをリセット（危険）"
    echo "  help         このヘルプを表示"
    echo ""
    echo "Examples:"
    echo "  $0 init"
    echo "  $0 add AddProductCategory"
    echo "  $0 update"
    echo "  $0 seed"
}

# 初期マイグレーション作成
create_initial_migration() {
    echo -e "${YELLOW}初期マイグレーションを作成中...${NC}"
    dotnet ef migrations add InitialCreate
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}初期マイグレーションが作成されました${NC}"
    else
        echo -e "${RED}初期マイグレーションの作成に失敗しました${NC}"
        exit 1
    fi
}

# 新しいマイグレーション作成
add_migration() {
    if [ -z "$1" ]; then
        echo -e "${RED}マイグレーション名を指定してください${NC}"
        exit 1
    fi
    
    echo -e "${YELLOW}マイグレーション '$1' を作成中...${NC}"
    dotnet ef migrations add "$1"
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}マイグレーション '$1' が作成されました${NC}"
    else
        echo -e "${RED}マイグレーション '$1' の作成に失敗しました${NC}"
        exit 1
    fi
}

# データベース更新
update_database() {
    echo -e "${YELLOW}データベースを最新のマイグレーションに更新中...${NC}"
    dotnet ef database update
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}データベースが正常に更新されました${NC}"
    else
        echo -e "${RED}データベースの更新に失敗しました${NC}"
        exit 1
    fi
}

# マイグレーション状態確認
check_migration_status() {
    echo -e "${YELLOW}マイグレーションの状態を確認中...${NC}"
    dotnet ef migrations list
}

# ロールバック
rollback_migration() {
    echo -e "${YELLOW}前のマイグレーションにロールバック中...${NC}"
    dotnet ef database update 0
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}ロールバックが完了しました${NC}"
    else
        echo -e "${RED}ロールバックに失敗しました${NC}"
        exit 1
    fi
}

# 初期データ投入
seed_database() {
    echo -e "${YELLOW}初期データを投入中...${NC}"
    # 初期データ投入用のC#プログラムを実行
    dotnet run -- --seed
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}初期データの投入が完了しました${NC}"
    else
        echo -e "${RED}初期データの投入に失敗しました${NC}"
        exit 1
    fi
}

# データベースリセット
reset_database() {
    echo -e "${RED}警告: この操作はデータベースを完全にリセットします${NC}"
    read -p "続行しますか? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}データベースをリセット中...${NC}"
        dotnet ef database drop --force
        dotnet ef database update
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}データベースのリセットが完了しました${NC}"
        else
            echo -e "${RED}データベースのリセットに失敗しました${NC}"
            exit 1
        fi
    else
        echo -e "${YELLOW}操作がキャンセルされました${NC}"
    fi
}

# メイン処理
case "$1" in
    "init")
        create_initial_migration
        ;;
    "add")
        add_migration "$2"
        ;;
    "update")
        update_database
        ;;
    "status")
        check_migration_status
        ;;
    "rollback")
        rollback_migration
        ;;
    "seed")
        seed_database
        ;;
    "reset")
        reset_database
        ;;
    "help"|"")
        show_help
        ;;
    *)
        echo -e "${RED}不明なコマンド: $1${NC}"
        show_help
        exit 1
        ;;
esac
