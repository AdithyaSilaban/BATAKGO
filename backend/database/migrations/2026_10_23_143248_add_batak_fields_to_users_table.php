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
        Schema::table('users', function (Blueprint $table) {
            $table->string('marga')->nullable()->after('name');
            $table->string('avatar')->default('🧒')->after('marga');
            $table->unsignedInteger('xp')->default(0)->after('password');
            $table->unsignedInteger('streak')->default(1)->after('xp');
            $table->unsignedInteger('hearts')->default(5)->after('streak');
            $table->unsignedInteger('max_hearts')->default(5)->after('hearts');
            $table->json('completed_lessons')->nullable()->after('max_hearts');
            $table->json('unlocked_units')->nullable()->after('completed_lessons');
            $table->json('unlocked_ulos')->nullable()->after('unlocked_units');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'marga',
                'avatar',
                'xp',
                'streak',
                'hearts',
                'max_hearts',
                'completed_lessons',
                'unlocked_units',
                'unlocked_ulos'
            ]);
        });
    }
};
