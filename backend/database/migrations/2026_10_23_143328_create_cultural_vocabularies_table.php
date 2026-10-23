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
        Schema::create('cultural_vocabularies', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('batak');
            $table->string('indonesian');
            $table->string('category')->default('sapaan');
            $table->string('phonetic')->nullable();
            $table->json('syllables')->nullable();
            $table->text('example_batak')->nullable();
            $table->text('example_indonesian')->nullable();
            $table->string('audio_note')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cultural_vocabularies');
    }
};
