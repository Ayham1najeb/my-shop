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
        // Drop old tables if they exist to start fresh with new schema
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
        Schema::dropIfExists('coupons');
        Schema::dropIfExists('user_addresses');
        Schema::dropIfExists('addresses');
        Schema::enableForeignKeyConstraints();

        // 1. Addresses Table
        Schema::create('addresses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('type')->default('shipping'); // shipping, billing
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email')->nullable();
            $table->string('phone');
            $table->string('street_address');
            $table->string('city');
            $table->string('state')->nullable();
            $table->string('zip_code')->nullable();
            $table->string('country')->default('Saudi Arabia');
            $table->boolean('is_default')->default(false);
            $table->timestamps();
        });

        // 2. Coupons Table
        Schema::create('coupons', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('type')->default('percent'); // percent, fixed
            $table->decimal('value', 10, 2); // Amount off or % off
            $table->decimal('min_spend', 10, 2)->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->integer('usage_limit')->nullable();
            $table->integer('used_count')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 3. Orders Table
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('order_number')->unique();
            
            $table->enum('status', ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'])->default('pending');
            $table->enum('payment_status', ['paid', 'unpaid', 'failed'])->default('unpaid');
            $table->string('payment_method')->default('cod'); // cod, card, etc.
            
            $table->decimal('subtotal', 10, 2);
            $table->decimal('tax', 10, 2)->default(0);
            $table->decimal('shipping_cost', 10, 2)->default(0);
            $table->decimal('discount', 10, 2)->default(0);
            $table->decimal('total', 10, 2);
            
            $table->string('coupon_code')->nullable();
            
            // Snapshots of addresses to preserve history even if user updates profile
            $table->json('shipping_address_json')->nullable();
            $table->json('billing_address_json')->nullable();
            
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        // 4. Order Items Table
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
            $table->foreignId('product_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('variant_id')->nullable(); // Can link to product_variants if strict
            
            $table->string('product_name');
            $table->string('color')->nullable();
            $table->string('size')->nullable();
            $table->string('sku')->nullable();
            
            $table->integer('quantity');
            $table->decimal('price', 10, 2); // Unit price at time of purchase
            $table->decimal('total', 10, 2); // qty * price
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
        Schema::dropIfExists('coupons');
        Schema::dropIfExists('addresses');
        Schema::enableForeignKeyConstraints();
    }
};
