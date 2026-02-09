<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('visits', function (Blueprint $table) {
            $table->id();
            $table->string('ip_address');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->date('visit_date'); // To easily group by day
            $table->timestamps();
            
            // Ensure unique visit per IP per day
            $table->unique(['ip_address', 'visit_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('visits');
    }
};
