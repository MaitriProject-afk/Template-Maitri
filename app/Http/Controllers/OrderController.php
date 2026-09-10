<?php

namespace App\Http\Controllers;

use App\Models\H2hProduct;
use App\Models\ProductItem;
use App\Models\SiteSetting;
use App\Models\Transaction;
use App\Services\H2hCheckoutService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function __construct(
        protected H2hCheckoutService $checkoutService
    ) {}

    /**
     * Handle checkout order submission from product detail page.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'item_id' => 'required|integer',
            'target_input' => 'required|string|max:100',
            'zone_id' => 'nullable|string|max:50',
            'whatsapp' => 'nullable|string|max:30',
            'payment_method' => 'required|string|in:qris',
        ]);

        $item = ProductItem::with('product')->find($request->item_id);

        if (! $item) {
            return back()->withErrors(['checkout' => 'Item produk yang dipilih tidak ditemukan.']);
        }

        if (! $item->product || ! $item->product->is_active) {
            return back()->withErrors(['checkout' => 'Layanan produk sedang tidak aktif.']);
        }

        if (! $item->canPurchase()) {
            return back()->withErrors(['checkout' => $item->getDisabledReason() ?? 'Item produk sedang tidak dapat dipesan.']);
        }

        // Check if item SKU is active in H2H master
        if ($item->buyer_sku_code) {
            $h2h = H2hProduct::where('buyer_sku_code', $item->buyer_sku_code)->first();
            if (! $h2h || ! $h2h->is_active || $h2h->status !== 'AVAILABLE') {
                return back()->withErrors(['checkout' => 'Produk ini sedang gangguan dari pihak penyedia dan tidak dapat diproses.']);
            }
        }

        // Format customer target (e.g., "12345678 (2001)" if zone_id exists)
        $customerNo = trim($request->target_input);
        if (! empty($request->zone_id)) {
            $customerNo .= ' ('.trim($request->zone_id).')';
        }

        // Generate unique reseller reference invoice code
        $invoiceCode = 'INV-'.date('YmdHis').'-'.strtoupper(Str::random(4));

        $transaction = Transaction::create([
            'invoice_code' => $invoiceCode,
            'user_id' => auth()->id(),
            'product_id' => $item->product_id,
            'product_item_id' => $item->id,
            'buyer_sku_code' => $item->buyer_sku_code ?: 'CUSTOM-'.$item->id,
            'product_name' => $item->product->name.' - '.$item->name,
            'customer_no' => $customerNo,
            'customer_whatsapp' => $request->whatsapp,
            'h2h_price' => $item->h2h_price,
            'reseller_price' => $item->price,
            'admin_fee' => 0,
            'total_payment' => $item->price,
            'commission_amount' => max(0, $item->price - $item->h2h_price),
            'service' => '11', // Paydisini QRIS
            'payment_status' => 'UNPAID',
            'topup_status' => 'WAITING_PAYMENT',
            'expired_at' => Carbon::now()->addMinutes(30),
        ]);

        // Request QRIS and invoice creation to Maitri H2H API
        $checkoutResult = $this->checkoutService->createCheckout($transaction);

        if (! $checkoutResult['success']) {
            return back()->withErrors([
                'checkout' => 'Gagal memproses transaksi QRIS: '.$checkoutResult['message'],
            ]);
        }

        return redirect()->route('invoice.show', ['invoice_code' => $transaction->invoice_code]);
    }

    /**
     * Display invoice page for the customer.
     */
    public function show(string $invoiceCode): Response
    {
        $transaction = Transaction::with(['product:id,name,slug,thumbnail', 'productItem:id,name,category_group'])
            ->where('invoice_code', $invoiceCode)
            ->firstOrFail();

        $settings = SiteSetting::getSettings();
        $adminPhone = $settings['contact_whatsapp'] ?? '628123456789';

        $payload = [
            'id' => $transaction->id,
            'invoice_code' => $transaction->invoice_code,
            'maitri_invoice' => $transaction->maitri_invoice,
            'product_name' => $transaction->product_name,
            'product_slug' => $transaction->product?->slug,
            'product_thumbnail' => $transaction->product?->thumbnail,
            'item_name' => $transaction->productItem?->name,
            'customer_no' => $transaction->customer_no,
            'customer_whatsapp' => $transaction->customer_whatsapp,
            'reseller_price' => $transaction->reseller_price,
            'formatted_reseller_price' => $transaction->formatted_reseller_price,
            'admin_fee' => $transaction->admin_fee,
            'formatted_admin_fee' => $transaction->formatted_admin_fee,
            'total_payment' => $transaction->total_payment,
            'formatted_total_payment' => $transaction->formatted_total_payment,
            'qr_content' => $transaction->qr_content,
            'checkout_url' => $transaction->checkout_url,
            'payment_status' => $transaction->payment_status,
            'topup_status' => $transaction->topup_status,
            'sn' => $transaction->sn,
            'payment_message' => $transaction->payment_message,
            'topup_message' => $transaction->topup_message,
            'is_paid' => $transaction->isPaid(),
            'is_expired' => $transaction->isExpired(),
            'is_completed' => $transaction->isTopupCompleted(),
            'is_failed' => $transaction->isTopupFailed(),
            'created_at' => $transaction->created_at?->translatedFormat('d F Y, H:i:s').' WIB',
            'expired_at' => $transaction->expired_at?->toIso8601String(),
            'expired_at_formatted' => $transaction->expired_at?->translatedFormat('d F Y, H:i:s').' WIB',
            'paid_at_formatted' => $transaction->paid_at?->translatedFormat('d F Y, H:i:s').' WIB',
            'completed_at_formatted' => $transaction->completed_at?->translatedFormat('d F Y, H:i:s').' WIB',
        ];

        return Inertia::render('Public/Invoice', [
            'transaction' => $payload,
            'adminPhone' => $adminPhone,
        ]);
    }

    /**
     * Check current status of transaction (used by browser auto-polling).
     */
    public function status(string $invoiceCode): JsonResponse
    {
        $transaction = Transaction::where('invoice_code', $invoiceCode)->firstOrFail();

        return response()->json([
            'success' => true,
            'invoice_code' => $transaction->invoice_code,
            'maitri_invoice' => $transaction->maitri_invoice,
            'payment_status' => $transaction->payment_status,
            'topup_status' => $transaction->topup_status,
            'is_paid' => $transaction->isPaid(),
            'is_expired' => $transaction->isExpired(),
            'is_completed' => $transaction->isTopupCompleted(),
            'is_failed' => $transaction->isTopupFailed(),
            'sn' => $transaction->sn,
            'payment_message' => $transaction->payment_message,
            'topup_message' => $transaction->topup_message,
            'expired_at' => $transaction->expired_at?->toIso8601String(),
            'paid_at' => $transaction->paid_at?->toIso8601String(),
            'completed_at' => $transaction->completed_at?->toIso8601String(),
        ]);
    }

    /**
     * Track transaction status by invoice code.
     */
    public function track(Request $request): JsonResponse
    {
        $request->validate([
            'invoice_code' => 'required|string',
        ]);

        $code = trim($request->invoice_code);
        $transaction = Transaction::with(['product:id,name,slug,thumbnail', 'productItem:id,name'])
            ->where('invoice_code', $code)
            ->orWhere('maitri_invoice', $code)
            ->first();

        if (! $transaction) {
            return response()->json([
                'success' => false,
                'message' => 'Pesanan dengan kode invoice "'.$code.'" tidak ditemukan dalam sistem kami.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'invoice_code' => $transaction->invoice_code,
                'product_name' => $transaction->product_name,
                'product_thumbnail' => $transaction->product?->thumbnail,
                'customer_no' => $transaction->customer_no,
                'total_payment' => $transaction->total_payment,
                'formatted_total_payment' => $transaction->formatted_total_payment,
                'payment_status' => $transaction->payment_status,
                'topup_status' => $transaction->topup_status,
                'is_paid' => $transaction->isPaid(),
                'is_expired' => $transaction->isExpired(),
                'is_completed' => $transaction->isTopupCompleted(),
                'is_failed' => $transaction->isTopupFailed(),
                'sn' => $transaction->sn,
                'payment_message' => $transaction->payment_message,
                'topup_message' => $transaction->topup_message,
                'created_at' => $transaction->created_at?->translatedFormat('d M Y, H:i').' WIB',
                'invoice_url' => route('invoice.show', ['invoice_code' => $transaction->invoice_code]),
            ],
        ]);
    }
}
