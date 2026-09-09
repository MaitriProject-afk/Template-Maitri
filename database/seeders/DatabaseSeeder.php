<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Admin User
        User::updateOrCreate(
            ['email' => 'admin@maitri.com'],
            [
                'name' => 'Administrator',
                'password' => bcrypt('password123'),
                'role' => 'admin',
                'phone' => '081234567890',
                'balance' => 5000000,
            ]
        );

        // 2. Regular User (Matching screenshot)
        User::updateOrCreate(
            ['email' => 'peduliacare@gmail.com'],
            [
                'name' => 'Pedulia Care',
                'password' => bcrypt('password123'),
                'role' => 'user',
                'phone' => null,
                'balance' => 0,
            ]
        );
    }
}
