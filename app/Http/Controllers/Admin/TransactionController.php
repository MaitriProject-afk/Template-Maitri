<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Services\H2hCheckoutService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TransactionController extends Controller
{
    public function __construct(
        protected H2hCheckoutService $checkoutService
    ) {}

    /**
     * Display a full listing of all transactions with filters, search, and pagination.
     */
    public function index(Request $request): Response
    {
        $search = trim($request->input('search', ''));
        $paymentStatus = $request->input('payment_status', 'all');
        $topupStatus = $request->input('topup_status', 'all');

        $query = Transaction::with(['product:id,name,slug,thumbnail', 'productItem:id,name', 'user:id,name,email'])
            ->latest();

        if ($search !== '') {
            $query->where(function ($sub) use ($search) {
                $sub->where('invoice_code', 'like', "%{$search}%")
                    ->orWhere('maitri_invoice', 'like', "%{$search}%")
                    ->orWhere('customer_no', 'like', "%{$search}%")
                    ->orWhere('customer_whatsapp', 'like', "%{$search}%")
                    ->orWhere('product_name', 'like', "%{$search}%")
                    ->orWhere('sn', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($u) use ($search) {
                        $u->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            });
        }

        if ($paymentStatus === 'NEEDS_REFUND') {
            $query->whereIn('payment_status', ['PAID', 'SETTLED', 'SUCCESS'])
                ->where('topup_status', 'FAILED');
        } elseif ($paymentStatus !== 'all' && $paymentStatus !== '') {
            $query->where('payment_status', $paymentStatus);
        }

        if ($topupStatus !== 'all' && $topupStatus !== '') {
            $query->where('topup_status', $topupStatus);
        }

        $transactions = $query->paginate(15)->withQueryString();

        // Summary metrics
        // Omset Sukses: Hanya pesanan yang Lunas DAN Top Up Sukses
        $successPaidRevenue = Transaction::whereIn('payment_status', ['PAID', 'SETTLED', 'SUCCESS'])
            ->where('topup_status', 'SUCCESS')
            ->sum('total_payment');

        // Total Masuk Bruto
        $grossPaidRevenue = Transaction::whereIn('payment_status', ['PAID', 'SETTLED', 'SUCCESS'])
            ->sum('total_payment');

        // Dana yang Perlu Di-Refund: Lunas tapi Top Up Gagal
        $needRefundAmount = Transaction::whereIn('payment_status', ['PAID', 'SETTLED', 'SUCCESS'])
            ->where('topup_status', 'FAILED')
            ->sum('total_payment');
        $needRefundCount = Transaction::whereIn('payment_status', ['PAID', 'SETTLED', 'SUCCESS'])
            ->where('topup_status', 'FAILED')
            ->count();

        // Total Sudah Di-Refund
        $refundedAmount = Transaction::where('payment_status', 'REFUNDED')->sum('total_payment');
        $refundedCount = Transaction::where('payment_status', 'REFUNDED')->count();

        $metrics = [
            'total_transactions' => Transaction::count(),
            'total_paid_revenue' => $successPaidRevenue,
            'formatted_paid_revenue' => 'Rp '.number_format((float) $successPaidRevenue, 0, ',', '.'),
            'total_gross_revenue' => $grossPaidRevenue,
            'formatted_gross_revenue' => 'Rp '.number_format((float) $grossPaidRevenue, 0, ',', '.'),
            'total_need_refund_amount' => $needRefundAmount,
            'formatted_need_refund_amount' => 'Rp '.number_format((float) $needRefundAmount, 0, ',', '.'),
            'total_need_refund_count' => $needRefundCount,
            'total_refunded_amount' => $refundedAmount,
            'formatted_refunded_amount' => 'Rp '.number_format((float) $refundedAmount, 0, ',', '.'),
            'total_refunded_count' => $refundedCount,
            'total_success_topup' => Transaction::where('topup_status', 'SUCCESS')->count(),
            'total_processing_topup' => Transaction::whereIn('topup_status', ['PROCESSING', 'WAITING'])->count(),
            'total_failed_topup' => Transaction::where('topup_status', 'FAILED')->count(),
        ];

        return Inertia::render('Admin/Transactions', [
            'transactions' => $transactions,
            'filters' => [
                'search' => $search,
                'payment_status' => $paymentStatus,
                'topup_status' => $topupStatus,
            ],
            'metrics' => $metrics,
        ]);
    }

    /**
     * Mark a failed transaction as refunded by admin.
     */
    public function markRefunded(Transaction $transaction): JsonResponse|RedirectResponse
    {
        $transaction->update([
            'payment_status' => 'REFUNDED',
            'payment_message' => 'Dana sebesar '.$transaction->formatted_total_payment.' telah berhasil di-refund ke pelanggan oleh Admin.',
        ]);

        if (request()->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Transaksi '.$transaction->invoice_code.' berhasil ditandai sebagai SUDAH DI-REFUND.',
                'transaction' => $transaction->fresh(),
            ]);
        }

        return back()->with('success', 'Transaksi '.$transaction->invoice_code.' berhasil ditandai sebagai SUDAH DI-REFUND.');
    }

    /**
     * Check and sync live status of a single transaction from Maitri H2H gateway.
     */
    public function syncStatus(Transaction $transaction): JsonResponse|RedirectResponse
    {
        $updatedTransaction = $this->checkoutService->syncTransactionStatus($transaction);

        if (request()->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Status transaksi berhasil disinkronkan dengan server H2H.',
                'transaction' => $updatedTransaction,
            ]);
        }

        return back()->with('success', 'Status transaksi berhasil disinkronkan dengan server H2H.');
    }

    /**
     * Resend transaction invoice or failed notice email manually by Admin.
     */
    public function resendInvoiceEmail(Transaction $transaction): JsonResponse|RedirectResponse
    {
        $sent = $transaction->sendInvoiceEmail(force: true);

        if ($sent) {
            $msg = 'Email invoice transaksi '.$transaction->invoice_code.' berhasil dikirimkan.';
            if (request()->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => $msg,
                    'transaction' => $transaction->fresh(),
                ]);
            }

            return back()->with('success', $msg);
        }

        $recipient = $transaction->getRecipientEmail();
        $reason = ! $recipient ? 'Email pembeli tidak ditemukan.' : (! $transaction->isPaid() ? 'Transaksi belum lunas.' : 'Status pengisian belum selesai atau gagal.');
        $msg = 'Gagal mengirim email invoice: '.$reason;

        if (request()->wantsJson()) {
            return response()->json([
                'success' => false,
                'message' => $msg,
            ], 422);
        }

        return back()->with('error', $msg);
    }
}
