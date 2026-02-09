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
        Schema::table('visits', function (Blueprint $table) {
            $table->string('user_agent', 255)->nullable()->after('ip_address');
            
            // Drop old unique if it exists
            try {
                $table->dropUnique(['ip_address', 'visit_date']);
            } catch (\Exception $e) { }

            // Add new unique including user_agent
            $table->unique(['ip_address', 'visit_date', 'user_agent']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('visits', function (Blueprint $table) {
            $table->dropUnique(['ip_address', 'visit_date', 'user_agent']);
            $table->dropColumn('user_agent');
            $table->unique(['ip_address', 'visit_date']);
        });
    }
};
