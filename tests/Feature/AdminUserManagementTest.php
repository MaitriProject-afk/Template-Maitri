<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminUserManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_and_regular_users_cannot_access_user_management(): void
    {
        $response = $this->get('/admin/users');
        $response->assertRedirect('/login');

        $user = User::factory()->create(['role' => 'user']);
        $response = $this->actingAs($user)->get('/admin/users');
        $response->assertStatus(403);
    }

    public function test_admin_can_view_user_management_page(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        User::factory()->count(3)->create(['role' => 'user']);

        $response = $this->actingAs($admin)->get('/admin/users');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Users')
            ->has('users.data', 4)
            ->has('metrics')
        );
    }

    public function test_admin_can_promote_regular_user_to_admin(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $targetUser = User::factory()->create(['role' => 'user']);

        $response = $this->actingAs($admin)->postJson("/admin/users/{$targetUser->id}/role", [
            'role' => 'admin',
        ]);

        $response->assertStatus(200);
        $response->assertJson(['success' => true]);

        $this->assertEquals('admin', $targetUser->fresh()->role);
    }

    public function test_admin_cannot_demote_themselves(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)->postJson("/admin/users/{$admin->id}/role", [
            'role' => 'user',
        ]);

        $response->assertStatus(403);
        $response->assertJson(['success' => false]);

        $this->assertEquals('admin', $admin->fresh()->role);
    }

    public function test_admin_can_demote_another_admin(): void
    {
        $admin1 = User::factory()->create(['role' => 'admin']);
        $admin2 = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin1)->postJson("/admin/users/{$admin2->id}/role", [
            'role' => 'user',
        ]);

        $response->assertStatus(200);
        $response->assertJson(['success' => true]);

        $this->assertEquals('user', $admin2->fresh()->role);
    }
}
