<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

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
            ]
        );

        // 3. Impor data kategori, produk, dan item dari legacy maitri_laravel4 jika ada
        if (! empty(DB::select("SHOW DATABASES LIKE 'maitri_laravel4'"))) {
            $this->command->call('maitri:import-legacy');
        }
    }
}
