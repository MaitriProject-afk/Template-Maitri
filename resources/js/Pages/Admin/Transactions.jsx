import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import axios from 'axios';
import { 
    ReceiptText, 
    Search, 
    Filter, 
    RefreshCw, 
    ExternalLink, 
    CheckCircle2, 
    Clock, 
    XCircle, 
    AlertCircle, 
    DollarSign, 
    Copy, 
    Check, 
    Gamepad2, 
    RotateCcw,
    ShieldCheck,
    ArrowUpDown,
    HelpCircle
} from 'lucide-react';

export default function Transactions({ auth, transactions, filters, metrics }) {
    const [search, setSearch] = useState(filters.search || '');
    const [paymentStatus, setPaymentStatus] = useState(filters.payment_status || 'all');
    const [topupStatus, setTopupStatus] = useState(filters.topup_status || 'all');

    const [syncingId, setSyncingId] = useState(null);
    const [syncNotification, setSyncNotification] = useState(null);
    const [copiedId, setCopiedId] = useState(null);

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        router.get(route('admin.transactions.index'), {
            search: search.trim(),
            payment_status: paymentStatus,
            topup_status: topupStatus,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleResetFilter = () => {
        setSearch('');
        setPaymentStatus('all');
        setTopupStatus('all');
        router.get(route('admin.transactions.index'), {}, {
            preserveState: true,
            replace: true,
        });
    };

    const handleSyncStatus = async (transactionId, invoiceCode) => {
        setSyncingId(transactionId);
        setSyncNotification(null);

        try {
            const response = await axios.post(`/admin/transactions/${transactionId}/sync-status`);
            if (response.data && response.data.success) {
                setSyncNotification({
                    type: 'success',
                    message: response.data.message || `Status invoice ${invoiceCode} berhasil disinkronkan!`,
                });
                // Reload Inertia props quietly to reflect new DB values
                router.reload({ only: ['transactions', 'metrics'] });
            } else {
                setSyncNotification({
                    type: 'error',
                    message: response.data.message || 'Gagal menyinkronkan status dengan provider.',
                });
            }
        } catch (error) {
            setSyncNotification({
                type: 'error',
                message: error.response?.data?.message || 'Terjadi kesalahan saat mengecek status provider.',
            });
        } finally {
            setSyncingId(null);
            setTimeout(() => setSyncNotification(null), 5000);
        }
    };

    const handleCopy = (text, key) => {
        navigator.clipboard.writeText(text);
        setCopiedId(key);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const getPaymentBadge = (status) => {
        switch (status) {
            case 'PAID':
            case 'SETTLED':
            case 'SUCCESS':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-500">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        LUNAS
                    </span>
                );
            case 'UNPAID':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-500">
                        <Clock className="w-3 h-3 text-amber-600" />
                        MENUNGGU
                    </span>
                );
            case 'EXPIRED':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-gray-100 text-gray-700 border border-gray-400">
                        <XCircle className="w-3 h-3 text-gray-500" />
                        KADALUARSA
                    </span>
                );
            case 'FAILED':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-100 text-rose-800 border border-rose-500">
                        <AlertCircle className="w-3 h-3 text-rose-600" />
                        GAGAL
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-paper-dark border border-ink">
                        {status}
                    </span>
                );
        }
    };

    const getTopupBadge = (status) => {
        switch (status) {
            case 'SUCCESS':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-500">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        TOPUP SUKSES
                    </span>
                );
            case 'PROCESSING':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-100 text-sky-800 border border-sky-500">
                        <Clock className="w-3 h-3 text-sky-600 animate-spin" />
                        DIPROSES
                    </span>
                );
            case 'WAITING':
            case 'WAITING_PAYMENT':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-400">
                        <Clock className="w-3 h-3 text-amber-600" />
                        MENUNGGU
                    </span>
                );
            case 'FAILED':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-100 text-rose-800 border border-rose-500">
                        <AlertCircle className="w-3 h-3 text-rose-600" />
                        TOPUP GAGAL
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-paper-dark border border-ink">
                        {status}
                    </span>
                );
        }
    };

    const formatRp = (num) => 'Rp ' + Number(num || 0).toLocaleString('id-ID');

    return (
        <AdminLayout auth={auth} title="Data Transaksi Penjualan" activeMenu="orders">
            <div className="space-y-6">

                {/* 1. Header Banner & Metrics */}
                <div className="sketch-card bg-white p-5 sm:p-6 rounded-3xl border-2 border-ink shadow-sketch flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-brand-subtle text-brand-navy border border-ink shadow-sketch-xs">
                                📊 KELOLA TRANSAKSI
                            </span>
                            <span className="text-xs font-mono text-ink-muted font-bold">
                                • Real-time Monitoring
                            </span>
                        </div>
                        <h1 className="text-xl sm:text-2xl font-black text-ink tracking-tight">
                            Semua Data Transaksi Top Up & PPOB
                        </h1>
                        <p className="text-xs sm:text-sm text-ink-muted mt-0.5 font-medium">
                            Pantau seluruh riwayat pesanan, cek status real-time ke provider H2H, dan akses link invoice.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            type="button"
                            onClick={() => router.reload({ only: ['transactions', 'metrics'] })}
                            className="sketch-btn px-4 py-2 bg-paper hover:bg-paper-dark text-ink font-bold text-xs rounded-xl border-2 border-ink shadow-sketch-xs flex items-center gap-1.5 transition-all"
                            title="Segarkan Data"
                        >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>Refresh Data</span>
                        </button>
                    </div>
                </div>

                {/* Notification toast if status synced */}
                {syncNotification && (
                    <div className={`p-4 rounded-2xl border-2 shadow-sketch-xs flex items-center justify-between gap-3 text-xs font-bold animate-in fade-in ${
                        syncNotification.type === 'success'
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                            : 'bg-rose-50 border-rose-500 text-rose-900'
                    }`}>
                        <div className="flex items-center gap-2">
                            {syncNotification.type === 'success' ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            ) : (
                                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                            )}
                            <span>{syncNotification.message}</span>
                        </div>
                        <button 
                            type="button" 
                            onClick={() => setSyncNotification(null)}
                            className="p-1 rounded hover:bg-black/10 text-ink"
                        >
                            ✕
                        </button>
                    </div>
                )}

                {/* 2. Top Summary KPI Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
                    <div className="sketch-card bg-paper-grid p-4 rounded-2xl border-2 border-ink shadow-sketch-xs">
                        <span className="text-[10px] font-mono uppercase text-ink-muted font-bold block">
                            TOTAL TRANSAKSI
                        </span>
                        <div className="text-xl sm:text-2xl font-black font-mono text-ink mt-1">
                            {metrics?.total_transactions || 0}
                        </div>
                        <span className="text-[10px] text-ink-muted mt-0.5 block">Semua pesanan masuk</span>
                    </div>

                    <div className="sketch-card bg-paper-grid p-4 rounded-2xl border-2 border-ink shadow-sketch-xs">
                        <span className="text-[10px] font-mono uppercase text-ink-muted font-bold block">
                            OMSET LUNAS
                        </span>
                        <div className="text-xl sm:text-2xl font-black font-mono text-emerald-700 mt-1">
                            {metrics?.formatted_paid_revenue || 'Rp 0'}
                        </div>
                        <span className="text-[10px] text-ink-muted mt-0.5 block">Total omset berhasil</span>
                    </div>

                    <div className="sketch-card bg-paper-grid p-4 rounded-2xl border-2 border-ink shadow-sketch-xs">
                        <span className="text-[10px] font-mono uppercase text-ink-muted font-bold block">
                            TOPUP SUKSES
                        </span>
                        <div className="text-xl sm:text-2xl font-black font-mono text-emerald-600 mt-1">
                            {metrics?.total_success_topup || 0}
                        </div>
                        <span className="text-[10px] text-ink-muted mt-0.5 block">Pesanan terkirim</span>
                    </div>

                    <div className="sketch-card bg-paper-grid p-4 rounded-2xl border-2 border-ink shadow-sketch-xs">
                        <span className="text-[10px] font-mono uppercase text-ink-muted font-bold block">
                            DALAM PROSES
                        </span>
                        <div className="text-xl sm:text-2xl font-black font-mono text-amber-600 mt-1">
                            {metrics?.total_processing_topup || 0}
                        </div>
                        <span className="text-[10px] text-ink-muted mt-0.5 block">Menunggu provider</span>
                    </div>

                    <div className="sketch-card bg-paper-grid p-4 rounded-2xl border-2 border-ink shadow-sketch-xs col-span-2 lg:col-span-1">
                        <span className="text-[10px] font-mono uppercase text-ink-muted font-bold block">
                            GAGAL / REFUND
                        </span>
                        <div className="text-xl sm:text-2xl font-black font-mono text-rose-600 mt-1">
                            {metrics?.total_failed_topup || 0}
                        </div>
                        <span className="text-[10px] text-ink-muted mt-0.5 block">Perlu tindak lanjut</span>
                    </div>
                </div>

                {/* 3. Search & Filter Bar */}
                <div className="sketch-card bg-white p-4 sm:p-5 rounded-2xl border-2 border-ink shadow-sketch">
                    <form onSubmit={handleFilterSubmit} className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
                        <div className="relative flex-1">
                            <Search className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari invoice, nomor HP, nama produk, SN, atau nama pembeli..."
                                className="w-full pl-10 pr-4 py-2 bg-paper border-2 border-ink rounded-xl text-xs sm:text-sm font-semibold focus:ring-0 focus:border-ink shadow-sketch-xs placeholder:text-ink-muted/70"
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            {/* Payment status filter */}
                            <select
                                value={paymentStatus}
                                onChange={(e) => setPaymentStatus(e.target.value)}
                                className="px-3 py-2 bg-white border-2 border-ink rounded-xl text-xs font-bold font-mono focus:ring-0 focus:border-ink shadow-sketch-xs"
                            >
                                <option value="all">Semua Status Bayar</option>
                                <option value="PAID">LUNAS (Paid)</option>
                                <option value="UNPAID">MENUNGGU (Unpaid)</option>
                                <option value="EXPIRED">KADALUARSA (Expired)</option>
                                <option value="FAILED">GAGAL (Failed)</option>
                            </select>

                            {/* Topup status filter */}
                            <select
                                value={topupStatus}
                                onChange={(e) => setTopupStatus(e.target.value)}
                                className="px-3 py-2 bg-white border-2 border-ink rounded-xl text-xs font-bold font-mono focus:ring-0 focus:border-ink shadow-sketch-xs"
                            >
                                <option value="all">Semua Status Top Up</option>
                                <option value="SUCCESS">SUKSES (Success)</option>
                                <option value="PROCESSING">DIPROSES (Processing)</option>
                                <option value="WAITING">MENUNGGU (Waiting)</option>
                                <option value="FAILED">GAGAL (Failed)</option>
                            </select>

                            <button
                                type="submit"
                                className="sketch-btn px-4 py-2 bg-brand text-white font-bold text-xs rounded-xl border-2 border-ink shadow-sketch-xs flex items-center gap-1.5 hover:bg-brand-hover"
                            >
                                <Filter className="w-3.5 h-3.5" />
                                <span>Filter</span>
                            </button>

                            {(search || paymentStatus !== 'all' || topupStatus !== 'all') && (
                                <button
                                    type="button"
                                    onClick={handleResetFilter}
                                    className="sketch-btn px-3 py-2 bg-paper-dark hover:bg-white text-ink font-bold text-xs rounded-xl border-2 border-ink shadow-sketch-xs flex items-center gap-1"
                                    title="Reset Filter"
                                >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                    <span>Reset</span>
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* 4. Transactions List Container */}
                <div className="sketch-card bg-white p-4 sm:p-6 rounded-3xl border-2 border-ink shadow-sketch space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b-2 border-ink/10">
                        <div className="flex items-center gap-2">
                            <ReceiptText className="w-5 h-5 text-brand" />
                            <h2 className="text-base sm:text-lg font-black text-ink">
                                Daftar Transaksi ({transactions?.total || 0})
                            </h2>
                        </div>
                        <span className="text-[11px] font-mono text-ink-muted">
                            Halaman {transactions?.current_page || 1} dari {transactions?.last_page || 1}
                        </span>
                    </div>

                    {/* DESKTOP TABLE VIEW (hidden on mobile, visible on sm and up) */}
                    <div className="hidden md:block overflow-x-auto no-scrollbar">
                        <table className="w-full text-left text-xs font-medium">
                            <thead className="bg-paper-dark text-ink font-mono font-bold uppercase border-y-2 border-ink text-[11px]">
                                <tr>
                                    <th className="py-3 px-3">Invoice & Tanggal</th>
                                    <th className="py-3 px-3">Pelanggan / ID Tujuan</th>
                                    <th className="py-3 px-3">Produk & Item</th>
                                    <th className="py-3 px-3">Total Bayar</th>
                                    <th className="py-3 px-3">Status</th>
                                    <th className="py-3 px-3">SN / Provider Ref</th>
                                    <th className="py-3 px-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-ink/10">
                                {transactions?.data?.length > 0 ? (
                                    transactions.data.map((trx) => {
                                        const isSyncing = syncingId === trx.id;

                                        return (
                                            <tr key={trx.id} className="hover:bg-brand-subtle/20 transition-colors">
                                                {/* Invoice & Date */}
                                                <td className="py-3.5 px-3">
                                                    <div className="flex items-center gap-1.5 font-mono font-black text-ink text-xs">
                                                        <span>{trx.invoice_code}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleCopy(trx.invoice_code, `inv-${trx.id}`)}
                                                            className="text-ink-muted hover:text-ink"
                                                            title="Salin Invoice"
                                                        >
                                                            {copiedId === `inv-${trx.id}` ? (
                                                                <Check className="w-3 h-3 text-emerald-600" />
                                                            ) : (
                                                                <Copy className="w-3 h-3" />
                                                            )}
                                                        </button>
                                                    </div>
                                                    <span className="block text-[11px] text-ink-muted font-mono mt-0.5">
                                                        {trx.created_at ? new Date(trx.created_at).toLocaleString('id-ID', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        }) + ' WIB' : '-'}
                                                    </span>
                                                </td>

                                                {/* Customer & Target */}
                                                <td className="py-3.5 px-3">
                                                    <div className="font-bold text-ink">
                                                        {trx.user?.name || 'Pembeli Langsung'}
                                                    </div>
                                                    <div className="font-mono text-xs font-black text-brand mt-0.5">
                                                        {trx.customer_no}
                                                    </div>
                                                </td>

                                                {/* Product & Item */}
                                                <td className="py-3.5 px-3">
                                                    <div className="font-bold text-ink flex items-center gap-1.5">
                                                        <span>{trx.product_name}</span>
                                                    </div>
                                                    <span className="text-[11px] text-ink-muted font-medium block">
                                                        {trx.product_item?.name || trx.product_name}
                                                    </span>
                                                </td>

                                                {/* Total Payment */}
                                                <td className="py-3.5 px-3">
                                                    <div className="font-black font-mono text-brand text-xs">
                                                        {trx.formatted_total_payment || formatRp(trx.total_payment)}
                                                    </div>
                                                    <span className="text-[10px] text-ink-muted font-mono block">
                                                        QRIS Instan
                                                    </span>
                                                </td>

                                                {/* Status Badges */}
                                                <td className="py-3.5 px-3">
                                                    <div className="space-y-1">
                                                        <div>{getPaymentBadge(trx.payment_status)}</div>
                                                        <div>{getTopupBadge(trx.topup_status)}</div>
                                                    </div>
                                                </td>

                                                {/* SN or Ref */}
                                                <td className="py-3.5 px-3 font-mono text-xs">
                                                    {trx.sn ? (
                                                        <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded text-emerald-900 font-bold max-w-[140px] truncate">
                                                            <span className="truncate">{trx.sn}</span>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleCopy(trx.sn, `sn-${trx.id}`)}
                                                                className="text-emerald-700 hover:text-emerald-950 shrink-0"
                                                                title="Salin SN"
                                                            >
                                                                {copiedId === `sn-${trx.id}` ? (
                                                                    <Check className="w-3 h-3 text-emerald-600" />
                                                                ) : (
                                                                    <Copy className="w-3 h-3" />
                                                                )}
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <span className="text-ink-muted text-[11px] italic">
                                                            {trx.topup_message ? trx.topup_message.slice(0, 25) + '...' : '-'}
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Actions */}
                                                <td className="py-3.5 px-3 text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        {/* Tombol Cek Status Provider H2H */}
                                                        <button
                                                            type="button"
                                                            disabled={isSyncing}
                                                            onClick={() => handleSyncStatus(trx.id, trx.invoice_code)}
                                                            className="sketch-btn px-2.5 py-1.5 bg-paper hover:bg-paper-dark text-ink font-bold text-[11px] rounded-lg border border-ink flex items-center gap-1 shadow-sketch-xs transition-all disabled:opacity-50"
                                                            title="Cek Status Terbaru ke Provider H2H"
                                                        >
                                                            <RefreshCw className={`w-3 h-3 text-brand ${isSyncing ? 'animate-spin' : ''}`} />
                                                            <span>{isSyncing ? 'Cek...' : 'Cek Status'}</span>
                                                        </button>

                                                        {/* Tombol Halaman Invoice Real */}
                                                        <Link
                                                            href={`/invoice/${trx.invoice_code}`}
                                                            target="_blank"
                                                            className="sketch-btn px-2.5 py-1.5 bg-brand-accent hover:bg-brand-accent/80 text-ink font-bold text-[11px] rounded-lg border border-ink flex items-center gap-1 shadow-sketch-xs transition-all"
                                                            title="Buka Invoice Real"
                                                        >
                                                            <span>Invoice</span>
                                                            <ExternalLink className="w-3 h-3" />
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="py-10 text-center text-ink-muted">
                                            <Gamepad2 className="w-8 h-8 mx-auto mb-2 text-ink-muted/50" />
                                            <p className="font-bold text-ink">Tidak ada transaksi ditemukan.</p>
                                            <p className="text-xs mt-0.5">Coba ubah kata kunci pencarian atau reset filter.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* MOBILE CARD VIEW (md:hidden - Layout Khusus Mobile Tanpa Scroll Horizontal) */}
                    <div className="md:hidden space-y-3.5">
                        {transactions?.data?.length > 0 ? (
                            transactions.data.map((trx) => {
                                const isSyncing = syncingId === trx.id;
                                const createdTime = trx.created_at ? new Date(trx.created_at).toLocaleString('id-ID', {
                                    day: 'numeric',
                                    month: 'short',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                }) + ' WIB' : '-';

                                return (
                                    <div
                                        key={trx.id}
                                        className="p-4 rounded-2xl border-2 border-ink bg-paper-grid shadow-sketch-xs space-y-3 hover:border-brand transition-all"
                                    >
                                        {/* Baris Atas: Invoice, Tanggal & Badges */}
                                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink/15 pb-2.5">
                                            <div className="flex items-center gap-1.5">
                                                <span className="font-mono font-black text-xs text-ink">
                                                    {trx.invoice_code}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleCopy(trx.invoice_code, `mob-inv-${trx.id}`)}
                                                    className="text-ink-muted hover:text-ink p-1"
                                                >
                                                    {copiedId === `mob-inv-${trx.id}` ? (
                                                        <Check className="w-3 h-3 text-emerald-600" />
                                                    ) : (
                                                        <Copy className="w-3 h-3" />
                                                    )}
                                                </button>
                                            </div>
                                            <span className="text-[10px] text-ink-muted font-mono">
                                                {createdTime}
                                            </span>
                                        </div>

                                        {/* Status Badges Row */}
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            {getPaymentBadge(trx.payment_status)}
                                            {getTopupBadge(trx.topup_status)}
                                        </div>

                                        {/* Baris Tengah: Info Produk & Target */}
                                        <div className="flex items-start gap-3">
                                            <div className="w-11 h-11 rounded-xl border-2 border-ink bg-white overflow-hidden shrink-0 flex items-center justify-center">
                                                {trx.product?.thumbnail ? (
                                                    <img src={trx.product.thumbnail} alt={trx.product_name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <Gamepad2 className="w-5 h-5 text-brand" />
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h4 className="font-black text-xs text-ink truncate">
                                                    {trx.product_name}
                                                </h4>
                                                <p className="text-[11px] text-ink-muted font-medium truncate">
                                                    {trx.product_item?.name || trx.product_name}
                                                </p>
                                                <div className="mt-1 text-xs">
                                                    <span className="text-ink-muted text-[10px] font-mono block">ID / TUJUAN:</span>
                                                    <span className="font-mono font-black text-ink">{trx.customer_no}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* SN Display if exists */}
                                        {trx.sn && (
                                            <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-300 text-[11px] font-mono flex items-center justify-between">
                                                <div className="truncate mr-2">
                                                    <span className="text-emerald-900 font-bold block text-[10px]">SN / TOKEN:</span>
                                                    <span className="text-ink font-black">{trx.sn}</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleCopy(trx.sn, `mob-sn-${trx.id}`)}
                                                    className="p-1 rounded bg-white border border-emerald-400 text-emerald-800 text-[10px] font-bold shrink-0"
                                                >
                                                    {copiedId === `mob-sn-${trx.id}` ? 'Tersalin' : 'Salin'}
                                                </button>
                                            </div>
                                        )}

                                        {/* Baris Bawah: Total Bayar & Tombol Aksi */}
                                        <div className="pt-2 border-t border-ink/15 flex items-center justify-between gap-2">
                                            <div>
                                                <span className="text-[10px] uppercase font-mono text-ink-muted block">
                                                    Total Bayar
                                                </span>
                                                <span className="text-sm font-black font-mono text-brand">
                                                    {trx.formatted_total_payment || formatRp(trx.total_payment)}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-1.5">
                                                {/* Tombol Cek Status */}
                                                <button
                                                    type="button"
                                                    disabled={isSyncing}
                                                    onClick={() => handleSyncStatus(trx.id, trx.invoice_code)}
                                                    className="sketch-btn px-2.5 py-1.5 bg-paper hover:bg-paper-dark text-ink font-bold text-xs rounded-xl border border-ink flex items-center gap-1 shadow-sketch-xs"
                                                >
                                                    <RefreshCw className={`w-3 h-3 text-brand ${isSyncing ? 'animate-spin' : ''}`} />
                                                    <span>{isSyncing ? 'Cek...' : 'Cek'}</span>
                                                </button>

                                                {/* Tombol Invoice */}
                                                <Link
                                                    href={`/invoice/${trx.invoice_code}`}
                                                    target="_blank"
                                                    className="sketch-btn px-3 py-1.5 bg-brand-accent text-ink font-black text-xs rounded-xl border border-ink flex items-center gap-1 shadow-sketch-xs"
                                                >
                                                    <span>Invoice</span>
                                                    <ExternalLink className="w-3 h-3" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="py-8 text-center text-ink-muted sketch-card p-6 bg-paper-grid">
                                <Gamepad2 className="w-8 h-8 mx-auto mb-2 text-ink-muted/50" />
                                <p className="font-bold text-ink">Tidak ada transaksi ditemukan.</p>
                                <p className="text-xs mt-0.5">Coba ubah filter pencarian Anda.</p>
                            </div>
                        )}
                    </div>

                    {/* 5. Pagination Links */}
                    {transactions?.links && transactions.links.length > 3 && (
                        <div className="pt-4 flex items-center justify-center gap-1.5 flex-wrap border-t-2 border-ink/10">
                            {transactions.links.map((link, idx) => {
                                if (!link.url) {
                                    return (
                                        <span
                                            key={idx}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            className="px-3 py-1.5 rounded-xl border border-ink/20 text-ink-muted text-xs font-mono opacity-50 cursor-not-allowed"
                                        />
                                    );
                                }
                                return (
                                    <Link
                                        key={idx}
                                        href={link.url}
                                        preserveScroll
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-3 py-1.5 rounded-xl border-2 border-ink text-xs font-mono font-bold transition-all shadow-sketch-xs ${
                                            link.active 
                                                ? 'bg-brand text-white' 
                                                : 'bg-white hover:bg-paper-dark text-ink'
                                        }`}
                                    />
                                );
                            })}
                        </div>
                    )}

                </div>

            </div>
        </AdminLayout>
    );
}
