<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'id' => 1,
                'slug' => 'special1',
                'title' => '今月のお薦め',
                'description' => '今月のお薦め商品を紹介します。',
                'image' => 'special1.jpg',
                'sortid' => 1,
                'display' => 1,
            ],
            [
                'id' => 2,
                'slug' => 'special2',
                'title' => 'ネット注文特別価格メニュー',
                'description' => '',
                'image' => 'special2.jpg',
                'sortid' => 2,
                'display' => true,
            ],
            [
                'id' => 3,
                'slug' => 'special3',
                'title' => '限定メニュー',
                'description' => '',
                'image' => 'special3.jpg',
                'sortid' => 3,
                'display' => 1,
            ],
            [
                'id' => 4,
                'slug' => 'main1',
                'title' => 'メインメニュー',
                'description' => 'メインメニューのハンバーガーを紹介します。',
                'image' => 'main1.jpg',
                'sortid' => 10,
                'display' => true,
            ],
            [
                'id' => 5,
                'slug' => 'main2',
                'title' => 'ハンバーガー',
                'description' => '',
                'image' => 'main2.jpg',
                'sortid' => 11,
                'display' => true,
            ],
            [
                'id' => 6,
                'slug' => 'main3',
                'title' => 'ホットドック',
                'description' => '',
                'image' => 'main3.jpg',
                'sortid' => 12,
                'display' => true,
            ],
            [
                'id' => 7,
                'slug' => 'main4',
                'title' => 'ソイパティ',
                'description' => '',
                'image' => 'main4.jpg',
                'sortid' => 13,
                'display' => true,
            ],
            [
                'id' => 8,
                'slug' => 'sidemenu1',
                'title' => 'サイドメニュー',
                'description' => 'サイドメニューのポテトやドリンクを紹介します。',
                'image' => 'sidemenu1.jpg',
                'sortid' => 20,
                'display' => true,
            ],
            [
                'id' => 9,
                'slug' => 'sidemenu2',
                'title' => 'ドリンク・スープ',
                'description' => '',
                'image' => 'sidemenu2.jpg',
                'sortid' => 21,
                'display' => true,
            ],
            [
                'id' => 10,
                'slug' => 'sidemenu3',
                'title' => 'デザート',
                'description' => '',
                'image' => 'sidemenu3.jpg',
                'sortid' => 22,
                'display' => true,
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
