<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Create specific test user
        \App\Models\User::firstOrCreate(
            ['email' => 'customer@example.com'],
            [
                'name' => 'Customer User',
                'password' => bcrypt('password'),
                'role' => 'customer'
            ]
        );

        // 2. Create 50 random customers
        \App\Models\User::factory(50)->create([
            'role' => 'customer'
        ]);
    }
}
