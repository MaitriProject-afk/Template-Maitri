<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductItem;
use App\Models\SubCategory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CategoryAndProductHierarchyTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_create_category(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)->post('/admin/categories', [
            'name' => 'Games',
            'slug' => 'games',
            'icon' => 'Gamepad2',
            'sort_order' => 1,
            'is_active' => true,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('categories', [
            'name' => 'Games',
            'slug' => 'games',
        ]);
    }

    public function test_admin_can_create_sub_category_under_category(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $category = Category::create([
            'name' => 'Pulsa & Data',
            'slug' => 'pulsa-data',
            'sort_order' => 1,
            'is_active' => true,
        ]);

        $response = $this->actingAs($admin)->post('/admin/subcategories', [
            'category_id' => $category->id,
            'name' => 'Paket Data',
            'slug' => 'paket-data',
            'sort_order' => 1,
            'is_active' => true,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('sub_categories', [
            'category_id' => $category->id,
            'name' => 'Paket Data',
            'slug' => 'paket-data',
        ]);
    }

    public function test_admin_can_create_product_with_or_without_subcategory(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $category = Category::create([
            'name' => 'Games',
            'slug' => 'games',
            'sort_order' => 1,
            'is_active' => true,
        ]);
        $subCategory = SubCategory::create([
            'category_id' => $category->id,
            'name' => 'Mobile Game',
            'slug' => 'mobile-game',
            'sort_order' => 1,
            'is_active' => true,
        ]);

        // Product 1: In category with subcategory
        $response1 = $this->actingAs($admin)->post('/admin/products', [
            'category_id' => $category->id,
            'sub_category_id' => $subCategory->id,
            'name' => 'Mobile Legends: Bang Bang',
            'slug' => 'mobile-legends',
            'brand' => 'Moonton',
            'input_type' => 'game_user_zone',
            'input_label' => 'User ID',
            'is_active' => true,
        ]);
        $response1->assertRedirect();

        $this->assertDatabaseHas('products', [
            'name' => 'Mobile Legends: Bang Bang',
            'category_id' => $category->id,
            'sub_category_id' => $subCategory->id,
        ]);

        // Product 2: In category without subcategory (nullable sub_category_id)
        $response2 = $this->actingAs($admin)->post('/admin/products', [
            'category_id' => $category->id,
            'sub_category_id' => null,
            'name' => 'Valorant Point',
            'slug' => 'valorant',
            'brand' => 'Riot Games',
            'input_type' => 'id_only',
            'input_label' => 'Riot ID',
            'is_active' => true,
        ]);
        $response2->assertRedirect();

        $this->assertDatabaseHas('products', [
            'name' => 'Valorant Point',
            'category_id' => $category->id,
            'sub_category_id' => null,
        ]);
    }

    public function test_admin_can_add_item_to_product_with_profit_calculation(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $category = Category::create(['name' => 'Games', 'slug' => 'games']);
        $product = Product::create([
            'category_id' => $category->id,
            'name' => 'Free Fire',
            'slug' => 'free-fire',
            'brand' => 'Garena',
            'input_type' => 'id_only',
        ]);

        // Item with fixed profit
        $response = $this->actingAs($admin)->post("/admin/products/{$product->id}/items", [
            'buyer_sku_code' => 'FF-100',
            'name' => '100 Diamonds',
            'h2h_price' => 13000,
            'profit_type' => 'fixed',
            'profit_value' => 2000,
            'status' => 'AVAILABLE',
            'is_active' => true,
        ]);
        $response->assertRedirect();

        $this->assertDatabaseHas('product_items', [
            'product_id' => $product->id,
            'buyer_sku_code' => 'FF-100',
            'h2h_price' => 13000,
            'price' => 15000, // 13000 + 2000
            'profit_type' => 'fixed',
            'profit_value' => 2000,
        ]);

        // Item with percent profit
        $response2 = $this->actingAs($admin)->post("/admin/products/{$product->id}/items", [
            'buyer_sku_code' => 'FF-200',
            'name' => '200 Diamonds',
            'h2h_price' => 25000,
            'profit_type' => 'percent',
            'profit_value' => 10,
            'status' => 'AVAILABLE',
            'is_active' => true,
        ]);
        $response2->assertRedirect();

        $this->assertDatabaseHas('product_items', [
            'product_id' => $product->id,
            'buyer_sku_code' => 'FF-200',
            'h2h_price' => 25000,
            'price' => 27500, // 25000 + 10% (2500)
            'profit_type' => 'percent',
            'profit_value' => 10,
        ]);
    }

    public function test_public_pages_render_with_dynamic_data(): void
    {
        $category = Category::create(['name' => 'Games', 'slug' => 'games', 'is_active' => true]);
        $product = Product::create([
            'category_id' => $category->id,
            'name' => 'Mobile Legends',
            'slug' => 'mobile-legends',
            'brand' => 'Moonton',
            'input_type' => 'game_user_zone',
            'is_active' => true,
        ]);
        ProductItem::create([
            'product_id' => $product->id,
            'buyer_sku_code' => 'ML-86',
            'name' => '86 Diamonds',
            'h2h_price' => 20000,
            'price' => 22000,
            'status' => 'AVAILABLE',
            'is_active' => true,
        ]);

        // Welcome / Home
        $this->get('/')->assertStatus(200);

        // Catalog
        $this->get('/katalog')->assertStatus(200);

        // Product Detail
        $this->get('/product/mobile-legends')->assertStatus(200);
    }

    public function test_admin_can_access_edit_product_page(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $category = Category::create(['name' => 'Games', 'slug' => 'games', 'is_active' => true]);
        $product = Product::create([
            'category_id' => $category->id,
            'name' => 'Mobile Legends',
            'slug' => 'mobile-legends',
            'brand' => 'Moonton',
            'input_type' => 'game_user_zone',
            'is_active' => true,
        ]);

        $response = $this->actingAs($admin)->get("/admin/products/{$product->id}/edit");
        $response->assertStatus(200);
    }
}
