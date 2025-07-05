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
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('slug', 191)->unique();
            $table->string('title', 191);
            $table->text('description')->nullable();
            $table->string('image', 191)->nullable();
            $table->integer('sortid')->default(0);
            $table->integer('display')->default(1);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['display', 'sortid']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
