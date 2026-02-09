<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'type', // percent, fixed
        'value',
        'min_spend',
        'start_date',
        'end_date',
        'usage_limit',
        'used_count',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    // Helper to check validity
    public function isValid()
    {
        if (!$this->is_active) return false;
        if ($this->usage_limit && $this->used_count >= $this->usage_limit) return false;
        
        $now = now();
        if ($this->start_date && $now->lt($this->start_date)) return false;
        if ($this->end_date && $now->gt($this->end_date)) return false;

        return true;
    }
}
