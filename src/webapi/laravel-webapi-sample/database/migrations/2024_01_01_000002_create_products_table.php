<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->nullable()->constrained('categories')->onDelete('set null');
            $table->string('slug', 191)->unique();
            $table->string('name', 191);
            $table->text('description')->nullable();
            $table->string('image', 191)->nullable();
            $table->decimal('price', 10, 2);
            $table->integer('sortid')->default(0);
            $table->integer('display')->default(1);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['category_id', 'display', 'sortid']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
