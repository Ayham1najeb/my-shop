<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class GuestAdminSeeder extends Seeder
{
    public function run()
    {
        // Force delete if exists to ensure clean slate (optional, but safer for password reset)
        User::where('email', 'guest@mystore.com')->delete();

        $user = User::create([
            'email' => 'guest@mystore.com',
            'name' => 'Guest Admin',
            'password' => Hash::make('guest12345'), // Explicitly hash
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);
        
        $this->command->info('Guest Admin created. ID: ' . $user->id);
    }
}
