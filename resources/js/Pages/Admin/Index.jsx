import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import axios from 'axios';
import { 
    TrendingUp, 
    ArrowUpRight, 
    DollarSign, 
    ReceiptText, 
    Clock, 
    CheckCircle2, 
    AlertCircle, 
    PlusCircle, 
    RefreshCw, 
    Layers, 
    Server, 
    ShieldCheck, 
    Gamepad2, 
    ExternalLink,
    Package,
    Activity,
    Wallet,
    UserCheck,
    Flame,
    ArrowRight,
    Copy,
    Check,
    XCircle
} from 'lucide-react';

export default function AdminDashboard({ 
    auth, 
    stats = {}, 
    productSummary = {}, 
    latestTransactions = [], 
    topProducts = [], 
    h2hProfile = {} 
}) {
    const user = auth?.user || { name: 'Administrator', email: 'admin@maitri.com', role: 'admin' };

    // Format Rupiah helper
    const formatRp = (num) => 'Rp ' + Number(num || 0).toLocaleString('id-ID');

    // State for live H2H profile & balance refresh
    const [providerProfile, setProviderProfile] = useState(h2hProfile?.profile || null);
    const [isRefreshingBalance, setIsRefreshingBalance] = useState(false);
    const [refreshMsg, setRefreshMsg] = useState(null);
    const [copiedInv, setCopiedInv] = useState(null);

    const handleRefreshBalance = async () => {
        setIsRefreshingBalance(true);
        setRefreshMsg(null);
        try {
            const res = await axios.post('/admin/refresh-h2h-profile');
            if (res.data && res.data.success && res.data.profile) {
                setProviderProfile(res.data.profile);
                setRefreshMsg({ type: 'success', text: 'Saldo & profil provider berhasil diperbarui!' });
            } else {
                setRefreshMsg({ type: 'error', text: res.data?.message || 'Gagal menyegarkan saldo provider.' });
            }
        } catch (err) {
            setRefreshMsg({ type: 'error', text: err.response?.data?.message || 'Gagal menghubungkan ke server provider.' });
        } finally {
            setIsRefreshingBalance(false);
            setTimeout(() => setRefreshMsg(null), 4000);
        }
    };

    const handleCopy = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedInv(id);
        setTimeout(() => setCopiedInv(null), 2000);
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
                        SUKSES
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

    return (
        <AdminLayout auth={auth} title="Dashboard Ringkasan" activeMenu="dashboard">
            <div className="space-y-6">

                {/* 1. TOP WELCOME & SYSTEM BANNER */}
                <div className="sketch-card bg-white p-5 sm:p-6 rounded-3xl border-2 border-ink shadow-sketch flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-brand-subtle text-brand-navy border border-ink shadow-sketch-xs">
                                👑 AKUN: ADMINISTRATOR
                            </span>
                            <span className="text-xs font-mono text-ink-muted font-bold">
                                • Sesi Aktif
                            </span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black text-ink tracking-tight">
                            Selamat Datang, {user.name}! 👋
                        </h2>
                        <p className="text-xs sm:text-sm text-ink-muted mt-1 font-medium">
                            Pantau performa penjualan top-up, status server API, dan arus transaksi secara real-time.
                        </p>
                    </div>

                    {/* Quick Admin Actions */}
                    <div className="flex flex-wrap items-center gap-2.5 shrink-0 relative z-10">
                        <Link
                            href="/admin/products"
                            className="sketch-btn px-4 py-2 bg-brand text-white font-bold text-xs rounded-xl border-2 border-ink shadow-sketch-xs flex items-center gap-1.5 hover:bg-brand-hover active:scale-95 transition-all"
                        >
                            <PlusCircle className="w-4 h-4" />
                            <span>Kelola Produk</span>
                        </Link>
                        <Link
                            href="/admin/transactions"
                            className="sketch-btn px-4 py-2 bg-brand-accent text-ink font-bold text-xs rounded-xl border-2 border-ink shadow-sketch-xs flex items-center gap-1.5 hover:bg-brand-accent/80 transition-all"
                        >
                            <ReceiptText className="w-4 h-4" />
                            <span>Semua Transaksi</span>
                        </Link>
                        <Link
                            href="/"
                            target="_blank"
                            className="sketch-btn px-4 py-2 bg-paper-dark hover:bg-white text-ink font-bold text-xs rounded-xl border-2 border-ink shadow-sketch-xs flex items-center gap-1.5 transition-all"
                        >
                            <ExternalLink className="w-3.5 h-3.5 text-brand" />
                            <span>Buka Web</span>
                        </Link>
                    </div>
                </div>

                {/* 2. STAT CARDS (4 METRICS: OMSET, LABA, PENDING, TOTAL USER) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    
                    {/* Card 1: Total Omzet Hari Ini */}
                    <div className="sketch-card bg-paper-grid p-4 sm:p-5 rounded-2xl border-2 border-ink shadow-sketch flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-mono uppercase text-ink-muted font-bold">
                                OMZET HARI INI
                            </span>
                            <div className="w-8 h-8 rounded-xl bg-rose-100 border border-ink flex items-center justify-center text-rose-600 shadow-sketch-xs">
                                <DollarSign className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="my-2">
                            <div className="text-xl sm:text-2xl font-black font-mono text-ink">
                                {stats.formatted_today_revenue || 'Rp 0'}
                            </div>
                            <div className="text-[11px] font-bold font-mono text-emerald-600 flex items-center gap-1 mt-0.5">
                                <ArrowUpRight className="w-3.5 h-3.5" />
                                <span>{stats.total_transactions_today || 0} transaksi hari ini</span>
                            </div>
                        </div>
                        <div className="text-[10px] font-sketch text-ink-muted font-bold pt-2 border-t border-ink/10">
                            Total pesanan dibayar
                        </div>
                    </div>

                    {/* Card 2: Laba Bersih */}
                    <div className="sketch-card bg-paper-grid p-4 sm:p-5 rounded-2xl border-2 border-ink shadow-sketch flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-mono uppercase text-ink-muted font-bold">
                                ESTIMASI LABA BERSIH
                            </span>
                            <div className="w-8 h-8 rounded-xl bg-emerald-100 border border-ink flex items-center justify-center text-emerald-600 shadow-sketch-xs">
                                <TrendingUp className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="my-2">
                            <div className="text-xl sm:text-2xl font-black font-mono text-emerald-700">
                                {stats.formatted_today_profit || 'Rp 0'}
                            </div>
                            <div className="text-[11px] font-bold text-ink-muted flex items-center gap-1 mt-0.5">
                                <span>Margin komisi reseller</span>
                            </div>
                        </div>
                        <div className="text-[10px] font-sketch text-ink-muted font-bold pt-2 border-t border-ink/10">
                            Keuntungan bersih otomatis
                        </div>
                    </div>

                    {/* Card 3: Pesanan Pending */}
                    <div className="sketch-card bg-paper-grid p-4 sm:p-5 rounded-2xl border-2 border-ink shadow-sketch flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-mono uppercase text-ink-muted font-bold">
                                PESANAN PENDING
                            </span>
                            <div className="w-8 h-8 rounded-xl bg-amber-100 border border-ink flex items-center justify-center text-amber-600 shadow-sketch-xs">
                                <Clock className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="my-2">
                            <div className="text-xl sm:text-2xl font-black font-mono text-amber-600">
                                {stats.pending_orders || 0} Pesanan
                            </div>
                            <div className="text-[11px] font-bold text-ink-muted mt-0.5">
                                <span>Menunggu verifikasi provider</span>
                            </div>
                        </div>
                        <div className="text-[10px] font-sketch text-ink-muted font-bold pt-2 border-t border-ink/10">
                            Waktu respon 1-3 detik
                        </div>
                    </div>

                    {/* Card 4: Total Member */}
                    <div className="sketch-card bg-paper-grid p-4 sm:p-5 rounded-2xl border-2 border-ink shadow-sketch flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-mono uppercase text-ink-muted font-bold">
                                TOTAL MEMBER
                            </span>
                            <div className="w-8 h-8 rounded-xl bg-sketch-yellow border border-ink flex items-center justify-center text-ink shadow-sketch-xs">
                                <ShieldCheck className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="my-2">
                            <div className="text-xl sm:text-2xl font-black font-mono text-ink">
                                {stats.total_members || 0} User
                            </div>
                            <div className="text-[11px] font-bold font-mono text-emerald-600 flex items-center gap-1 mt-0.5">
                                <PlusCircle className="w-3.5 h-3.5" />
                                <span>+{stats.new_members_today || 0} pendaftar hari ini</span>
                            </div>
                        </div>
                        <div className="text-[10px] font-sketch text-ink-muted font-bold pt-2 border-t border-ink/10">
                            Member akun pembeli
                        </div>
                    </div>

                </div>

                {/* 3. API PROFILE & SALDO PROVIDER H2H CARD */}
                <div className="sketch-card bg-white p-5 sm:p-6 rounded-3xl border-2 border-ink shadow-sketch">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-ink/10">
                        <div className="flex items-center gap-2.5">
                            <div className="w-10 h-10 rounded-xl bg-brand-subtle border-2 border-ink shadow-sketch-xs flex items-center justify-center text-brand">
                                <Wallet className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-base sm:text-lg font-black text-ink">
                                    Informasi Akun & Saldo Provider Maitri H2H
                                </h3>
                                <p className="text-xs text-ink-muted">
                                    Pantau sisa saldo dan status akun reseller Anda langsung dari server pusat API.
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            disabled={isRefreshingBalance}
                            onClick={handleRefreshBalance}
                            className="sketch-btn px-3.5 py-2 bg-paper hover:bg-paper-dark text-ink font-bold text-xs rounded-xl border-2 border-ink shadow-sketch-xs inline-flex items-center gap-1.5 self-start sm:self-auto disabled:opacity-50 transition-all"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 text-brand ${isRefreshingBalance ? 'animate-spin' : ''}`} />
                            <span>{isRefreshingBalance ? 'Memeriksa...' : 'Cek / Refresh Saldo'}</span>
                        </button>
                    </div>

                    {refreshMsg && (
                        <div className={`mt-3 p-3 rounded-xl border text-xs font-bold ${
                            refreshMsg.type === 'success' 
                                ? 'bg-emerald-50 border-emerald-500 text-emerald-900' 
                                : 'bg-rose-50 border-rose-500 text-rose-900'
                        }`}>
                            {refreshMsg.text}
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                        <div className="p-4 rounded-2xl bg-paper-grid border-2 border-ink shadow-sketch-xs">
                            <span className="text-[10px] font-mono uppercase text-ink-muted font-bold block">
                                SISA SALDO / KOMISI
                            </span>
                            <div className="text-xl sm:text-2xl font-black font-mono text-emerald-700 mt-1">
                                {providerProfile?.formatted_balance || (providerProfile?.balance ? formatRp(providerProfile.balance) : 'Rp 0')}
                            </div>
                            <span className="text-[10px] text-ink-muted mt-0.5 block">Saldo aktif di provider</span>
                        </div>

                        <div className="p-4 rounded-2xl bg-paper-grid border-2 border-ink shadow-sketch-xs">
                            <span className="text-[10px] font-mono uppercase text-ink-muted font-bold block">
                                NAMA RESELLER H2H
                            </span>
                            <div className="text-base font-black text-ink mt-1 truncate">
                                {providerProfile?.reseller_name || providerProfile?.name || 'Maitri Reseller'}
                            </div>
                            <span className="text-[10px] text-ink-muted mt-0.5 block truncate">
                                {providerProfile?.email || '-'}
                            </span>
                        </div>

                        <div className="p-4 rounded-2xl bg-paper-grid border-2 border-ink shadow-sketch-xs">
                            <span className="text-[10px] font-mono uppercase text-ink-muted font-bold block">
                                STATUS AKUN PROVIDER
                            </span>
                            <div className="mt-1 flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span className="text-sm font-black font-mono text-emerald-800">
                                    {providerProfile?.status || 'CONNECTED'}
                                </span>
                            </div>
                            <span className="text-[10px] text-ink-muted mt-0.5 block">Koneksi gateway siap pakai</span>
                        </div>

                        <div className="p-4 rounded-2xl bg-paper-grid border-2 border-ink shadow-sketch-xs flex flex-col justify-between">
                            <span className="text-[10px] font-mono uppercase text-ink-muted font-bold block">
                                PENGATURAN KUNCI API
                            </span>
                            <div className="mt-1">
                                <Link
                                    href="/admin/settings"
                                    className="sketch-btn px-3 py-1.5 bg-brand text-white font-bold text-xs rounded-xl border border-ink shadow-sketch-xs inline-flex items-center gap-1"
                                >
                                    <span>Konfigurasi API</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                            <span className="text-[10px] text-ink-muted mt-1 block">Atur Key & Webhook Secret</span>
                        </div>
                    </div>
                </div>

                {/* 4. RINGKASAN PRODUK & STATUS KATALOG */}
                <div className="sketch-card bg-white p-5 sm:p-6 rounded-3xl border-2 border-ink shadow-sketch space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b-2 border-ink/10">
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-sketch-yellow border-2 border-ink shadow-sketch-xs flex items-center justify-center text-ink">
                                <Package className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-black text-base sm:text-lg text-ink">
                                    Ringkasan Produk & Master SKU
                                </h3>
                                <p className="text-xs text-ink-muted">
                                    Status ketersediaan katalog game, pulsa, dan sinkronisasi SKU provider pusat.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Link
                                href="/admin/products"
                                className="sketch-btn px-3 py-1.5 bg-paper hover:bg-paper-dark text-ink font-bold text-xs rounded-xl border border-ink shadow-sketch-xs inline-flex items-center gap-1"
                            >
                                <Package className="w-3.5 h-3.5 text-brand" />
                                <span>Kelola Produk</span>
                            </Link>
                            <Link
                                href="/admin/h2h-products"
                                className="sketch-btn px-3 py-1.5 bg-brand-subtle text-brand-navy font-bold text-xs rounded-xl border border-ink shadow-sketch-xs inline-flex items-center gap-1"
                            >
                                <Activity className="w-3.5 h-3.5 text-brand" />
                                <span>Sinkronisasi H2H</span>
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                        <div className="p-3.5 rounded-2xl bg-paper-grid border-2 border-ink text-center shadow-sketch-xs">
                            <span className="text-[10px] font-mono uppercase text-ink-muted font-bold block">
                                TOTAL PRODUK
                            </span>
                            <div className="text-xl sm:text-2xl font-black font-mono text-ink mt-1">
                                {productSummary.total_products || 0}
                            </div>
                            <span className="text-[10px] text-ink-muted block mt-0.5">Game & Kategori</span>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-paper-grid border-2 border-ink text-center shadow-sketch-xs">
                            <span className="text-[10px] font-mono uppercase text-ink-muted font-bold block">
                                PRODUK AKTIF
                            </span>
                            <div className="text-xl sm:text-2xl font-black font-mono text-emerald-600 mt-1">
                                {productSummary.active_products || 0}
                            </div>
                            <span className="text-[10px] text-ink-muted block mt-0.5">Tampil di web</span>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-paper-grid border-2 border-ink text-center shadow-sketch-xs">
                            <span className="text-[10px] font-mono uppercase text-ink-muted font-bold block">
                                TOTAL SKU ITEM
                            </span>
                            <div className="text-xl sm:text-2xl font-black font-mono text-ink mt-1">
                                {productSummary.total_items || 0}
                            </div>
                            <span className="text-[10px] text-ink-muted block mt-0.5">Denom nominal</span>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-paper-grid border-2 border-ink text-center shadow-sketch-xs">
                            <span className="text-[10px] font-mono uppercase text-ink-muted font-bold block">
                                SKU AKTIF JUAL
                            </span>
                            <div className="text-xl sm:text-2xl font-black font-mono text-emerald-600 mt-1">
                                {productSummary.active_items || 0}
                            </div>
                            <span className="text-[10px] text-ink-muted block mt-0.5">Bisa dicheckout</span>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-paper-grid border-2 border-ink text-center shadow-sketch-xs">
                            <span className="text-[10px] font-mono uppercase text-ink-muted font-bold block">
                                GANGGUAN / CUT-OFF
                            </span>
                            <div className="text-xl sm:text-2xl font-black font-mono text-rose-600 mt-1">
                                {productSummary.disabled_items || 0}
                            </div>
                            <span className="text-[10px] text-ink-muted block mt-0.5">Auto disable</span>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-paper-grid border-2 border-ink text-center shadow-sketch-xs">
                            <span className="text-[10px] font-mono uppercase text-ink-muted font-bold block">
                                SKU H2H PUSAT
                            </span>
                            <div className="text-xl sm:text-2xl font-black font-mono text-brand mt-1">
                                {productSummary.total_h2h_skus || 0}
                            </div>
                            <span className="text-[10px] text-ink-muted block mt-0.5">Database provider</span>
                        </div>
                    </div>
                </div>

                {/* 5. MAIN CONTENT 2-COLUMNS: 5 TRANSAKSI TERBARU & PRODUK TERLARIS */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* LEFT (8 Cols): 5 Transaksi Terbaru (Dengan Layout Khusus Mobile Tanpa Scroll) */}
                    <div className="lg:col-span-8 sketch-card bg-white p-5 sm:p-6 rounded-3xl border-2 border-ink shadow-sketch space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b-2 border-ink/10">
                            <div>
                                <h3 className="font-black text-base sm:text-lg text-ink">
                                    5 Transaksi Pesanan Terakhir
                                </h3>
                                <p className="text-xs text-ink-muted">
                                    Daftar pesanan terbaru yang diproses sistem.
                                </p>
                            </div>

                            <Link
                                href="/admin/transactions"
                                className="sketch-btn px-3 py-1.5 bg-paper hover:bg-paper-dark text-ink font-bold text-xs rounded-xl border border-ink shadow-sketch-xs inline-flex items-center gap-1 self-start sm:self-auto"
                            >
                                <span>Lihat Seluruh Transaksi ({stats.total_transactions_today || 0})</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>

                        {/* DESKTOP TABLE VIEW (hidden md kebawah, terlihat di md ke atas) */}
                        <div className="hidden md:block overflow-x-auto no-scrollbar">
                            <table className="w-full text-left text-xs font-medium">
                                <thead className="bg-paper-dark text-ink font-mono font-bold uppercase border-y-2 border-ink text-[11px]">
                                    <tr>
                                        <th className="py-2.5 px-3">Invoice</th>
                                        <th className="py-2.5 px-3">Pelanggan / ID</th>
                                        <th className="py-2.5 px-3">Produk</th>
                                        <th className="py-2.5 px-3">Total</th>
                                        <th className="py-2.5 px-3">Status</th>
                                        <th className="py-2.5 px-3 text-right">Invoice</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-ink/10">
                                    {latestTransactions.length > 0 ? (
                                        latestTransactions.map((tx) => (
                                            <tr key={tx.id} className="hover:bg-brand-subtle/20 transition-colors">
                                                <td className="py-3 px-3 font-mono font-bold text-ink">
                                                    <div className="flex items-center gap-1">
                                                        <span>{tx.invoice_code}</span>
                                                        <button 
                                                            type="button" 
                                                            onClick={() => handleCopy(tx.invoice_code, tx.id)}
                                                            className="text-ink-muted hover:text-ink"
                                                            title="Salin"
                                                        >
                                                            {copiedInv === tx.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                                                        </button>
                                                    </div>
                                                    <span className="block text-[10px] text-ink-muted font-normal">{tx.time_ago}</span>
                                                </td>
                                                <td className="py-3 px-3">
                                                    <div className="font-bold text-ink truncate max-w-[120px]">{tx.customer_name}</div>
                                                    <span className="font-mono text-[10px] text-ink-muted">{tx.customer_no}</span>
                                                </td>
                                                <td className="py-3 px-3">
                                                    <div className="font-bold text-ink truncate max-w-[140px]">{tx.product_name}</div>
                                                    <span className="text-[10px] text-ink-muted block truncate max-w-[140px]">{tx.item_name}</span>
                                                </td>
                                                <td className="py-3 px-3 font-mono font-bold text-brand">
                                                    {tx.formatted_total_payment}
                                                </td>
                                                <td className="py-3 px-3">
                                                    <div className="space-y-0.5">
                                                        {getPaymentBadge(tx.payment_status)}
                                                        {getTopupBadge(tx.topup_status)}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-3 text-right">
                                                    <Link
                                                        href={tx.invoice_url}
                                                        target="_blank"
                                                        className="sketch-btn px-2 py-1 bg-brand-accent text-ink text-[11px] font-bold rounded-lg border border-ink shadow-sketch-xs inline-flex items-center gap-1"
                                                    >
                                                        <span>Lihat</span>
                                                        <ExternalLink className="w-3 h-3" />
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="py-8 text-center text-ink-muted">
                                                <Gamepad2 className="w-8 h-8 mx-auto mb-2 text-ink-muted/50" />
                                                <p className="font-bold text-ink">Belum Ada Transaksi</p>
                                                <p className="text-xs mt-0.5">Transaksi pesanan pelanggan akan muncul di sini.</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* MOBILE STACKED CARDS VIEW (md:hidden - TIDAK PERLU SCROLL KANAN KIRI) */}
                        <div className="md:hidden space-y-3">
                            {latestTransactions.length > 0 ? (
                                latestTransactions.map((tx) => (
                                    <div
                                        key={tx.id}
                                        className="p-3.5 rounded-2xl border-2 border-ink bg-paper-grid shadow-sketch-xs space-y-2.5"
                                    >
                                        <div className="flex items-center justify-between border-b border-ink/15 pb-2">
                                            <div className="flex items-center gap-1 font-mono font-black text-xs text-ink">
                                                <span>{tx.invoice_code}</span>
                                                <button 
                                                    type="button"
                                                    onClick={() => handleCopy(tx.invoice_code, `m-${tx.id}`)}
                                                    className="text-ink-muted hover:text-ink p-0.5"
                                                >
                                                    {copiedInv === `m-${tx.id}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                                                </button>
                                            </div>
                                            <span className="text-[10px] text-ink-muted font-mono">{tx.time_ago}</span>
                                        </div>

                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            {getPaymentBadge(tx.payment_status)}
                                            {getTopupBadge(tx.topup_status)}
                                        </div>

                                        <div className="text-xs">
                                            <div className="font-black text-ink">{tx.product_name}</div>
                                            <div className="text-[11px] text-ink-muted">{tx.item_name}</div>
                                            <div className="text-[11px] font-mono mt-1">
                                                <span className="text-ink-muted">Tujuan: </span>
                                                <span className="font-bold text-ink">{tx.customer_no}</span>
                                            </div>
                                        </div>

                                        <div className="pt-2 border-t border-ink/15 flex items-center justify-between">
                                            <div>
                                                <span className="text-[10px] text-ink-muted block font-mono">Total</span>
                                                <span className="font-black font-mono text-brand text-xs">
                                                    {tx.formatted_total_payment}
                                                </span>
                                            </div>

                                            <Link
                                                href={tx.invoice_url}
                                                target="_blank"
                                                className="sketch-btn px-2.5 py-1 bg-brand-accent text-ink text-xs font-black rounded-lg border border-ink shadow-sketch-xs inline-flex items-center gap-1"
                                            >
                                                <span>Invoice</span>
                                                <ExternalLink className="w-3 h-3" />
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-6 text-center text-ink-muted">
                                    <Gamepad2 className="w-7 h-7 mx-auto mb-1.5 text-ink-muted/50" />
                                    <p className="font-bold text-xs text-ink">Belum Ada Transaksi</p>
                                </div>
                            )}
                        </div>

                        <div className="pt-2 text-center">
                            <Link
                                href="/admin/transactions"
                                className="text-xs font-black font-mono text-brand hover:underline inline-flex items-center gap-1"
                            >
                                <span>Buka Halaman Data Transaksi Lengkap</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </div>

                    {/* RIGHT (4 Cols): Produk Terlaris */}
                    <div className="lg:col-span-4 sketch-card bg-white p-5 sm:p-6 rounded-3xl border-2 border-ink shadow-sketch space-y-4">
                        <div className="pb-3 border-b-2 border-ink/10 flex items-center justify-between">
                            <div>
                                <h3 className="font-black text-base sm:text-lg text-ink flex items-center gap-1.5">
                                    <Flame className="w-4 h-4 text-brand fill-brand" />
                                    <span>Produk Terlaris</span>
                                </h3>
                                <p className="text-xs text-ink-muted">
                                    Game & layanan paling sering dipesan.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {topProducts.map((prod, idx) => (
                                <div 
                                    key={idx} 
                                    className="p-3 bg-paper-grid rounded-2xl border-2 border-ink shadow-sketch-xs flex items-center justify-between gap-3 hover:border-brand transition-all"
                                >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <div className={`w-7 h-7 rounded-xl border border-ink flex items-center justify-center font-black text-xs shrink-0 shadow-sketch-xs ${
                                            idx === 0 
                                                ? 'bg-amber-400 text-ink' 
                                                : idx === 1 
                                                    ? 'bg-slate-300 text-ink' 
                                                    : idx === 2 
                                                        ? 'bg-amber-700 text-white' 
                                                        : 'bg-paper text-ink'
                                        }`}>
                                            {idx + 1}
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="font-black text-xs text-ink truncate">
                                                {prod.name}
                                            </h4>
                                            <span className="text-[10px] text-ink-muted font-mono font-medium block">
                                                {prod.total_sales} transaksi
                                            </span>
                                        </div>
                                    </div>

                                    <div className="text-right shrink-0">
                                        <span className="text-xs font-black font-mono text-brand block">
                                            {prod.formatted_revenue || formatRp(prod.total_revenue)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-2 text-center">
                            <Link
                                href="/admin/products"
                                className="text-xs font-bold font-mono text-ink-muted hover:text-ink"
                            >
                                Kelola Seluruh Produk →
                            </Link>
                        </div>
                    </div>

                </div>

            </div>
        </AdminLayout>
    );
}
