<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'order_number',
        'status',
        'payment_status',
        'payment_method',
        'subtotal',
        'tax',
        'shipping_cost',
        'discount',
        'total',
        'coupon_code',
        'payment_intent_id',
        'currency',
        'payment_error',
        'shipping_address_json',
        'billing_address_json',
        'notes'
    ];

    protected $casts = [
        'shipping_address_json' => 'array',
        'billing_address_json' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
