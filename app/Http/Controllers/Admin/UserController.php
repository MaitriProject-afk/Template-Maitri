<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    /**
     * Display a paginated listing of users with search and role filters.
     */
    public function index(Request $request): Response
    {
        $search = trim((string) $request->input('search', ''));
        $role = trim((string) $request->input('role', 'all'));

        $query = User::query()
            ->withCount('transactions')
            ->withSum(['transactions as total_spent' => function ($q) {
                $q->whereIn('payment_status', ['PAID', 'SETTLED', 'SUCCESS'])
                    ->where('topup_status', 'SUCCESS');
            }], 'total_payment')
            ->latest();

        if ($search !== '') {
            $query->where(function ($sub) use ($search) {
                $sub->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        if ($role !== 'all' && in_array($role, ['admin', 'user'])) {
            $query->where('role', $role);
        }

        $users = $query->paginate(15)->withQueryString();

        // Transform collection to format rupiah & created date
        $users->getCollection()->transform(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'role' => $user->role ?? 'user',
                'is_admin' => $user->isAdmin(),
                'transactions_count' => $user->transactions_count ?? 0,
                'total_spent' => (int) ($user->total_spent ?? 0),
                'formatted_total_spent' => 'Rp '.number_format((float) ($user->total_spent ?? 0), 0, ',', '.'),
                'created_at' => $user->created_at ? $user->created_at->toISOString() : null,
                'registered_date' => $user->created_at
                    ? $user->created_at->setTimezone('Asia/Jakarta')->translatedFormat('d M Y, H:i').' WIB'
                    : '-',
            ];
        });

        $today = Carbon::today('Asia/Jakarta');

        $metrics = [
            'total_users' => User::count(),
            'total_admins' => User::where('role', 'admin')->count(),
            'total_regular_users' => User::where(function ($q) {
                $q->where('role', '!=', 'admin')->orWhereNull('role');
            })->count(),
            'new_users_today' => User::whereDate('created_at', $today)->count(),
        ];

        return Inertia::render('Admin/Users', [
            'users' => $users,
            'filters' => [
                'search' => $search,
                'role' => $role,
            ],
            'metrics' => $metrics,
        ]);
    }

    /**
     * Promote a user to admin or demote an admin to regular user.
     */
    public function updateRole(Request $request, User $user): JsonResponse|RedirectResponse
    {
        $validated = $request->validate([
            'role' => 'required|string|in:admin,user',
        ]);

        $newRole = $validated['role'];
        $currentAdminId = Auth::id();

        // Security safeguard: do not allow the currently authenticated admin to demote themselves
        if ($user->id === $currentAdminId && $newRole !== 'admin') {
            if ($request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Demi keamanan sistem, Anda tidak dapat mencabut hak akses administrator dari akun Anda sendiri.',
                ], 403);
            }

            return back()->with('error', 'Demi keamanan sistem, Anda tidak dapat mencabut hak akses administrator dari akun Anda sendiri.');
        }

        $user->update(['role' => $newRole]);

        $roleLabel = $newRole === 'admin' ? 'Administrator' : 'User Biasa';
        $message = "Role pengguna '{$user->name}' berhasil diperbarui menjadi {$roleLabel}.";

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => $message,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'role' => $user->role,
                    'is_admin' => $user->isAdmin(),
                ],
            ]);
        }

        return back()->with('success', $message);
    }
}
