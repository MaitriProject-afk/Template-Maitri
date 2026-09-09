import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Package,
    RefreshCw,
    Search,
    Filter,
    Clock,
    CheckCircle,
    AlertCircle,
    AlertTriangle,
    Copy,
    Check,
    ExternalLink,
    Terminal,
    ArrowUpDown,
    SlidersHorizontal,
    Layers,
    TrendingUp,
    Sparkles,
    Calendar,
    Globe,
    Zap,
    Tag,
} from 'lucide-react';

export default function ProductsIndex({
    products,
    filters = {},
    stats = {},
    categories = [],
    brands = [],
    logs = [],
    cronInfo = {},
    h2hConfigured = false,
}) {
    const [activeTab, setActiveTab] = useState('products'); // 'products', 'logs', 'cron'
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || 'all');
    const [selectedBrand, setSelectedBrand] = useState(filters.brand || 'all');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || 'all');
    const [isSyncing, setIsSyncing] = useState(false);
    const [copiedKey, setCopiedKey] = useState(null);

    const handleCopy = (text, key) => {
        navigator.clipboard.writeText(text);
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 2000);
    };

    const handleFilterSubmit = (e) => {
        if (e) e.preventDefault();
        router.get(
            '/admin/products',
            {
                search: searchQuery || undefined,
                category: selectedCategory !== 'all' ? selectedCategory : undefined,
                brand: selectedBrand !== 'all' ? selectedBrand : undefined,
                status: selectedStatus !== 'all' ? selectedStatus : undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        );
    };

    const handleResetFilter = () => {
        setSearchQuery('');
        setSelectedCategory('all');
        setSelectedBrand('all');
        setSelectedStatus('all');
        router.get('/admin/products', {}, { preserveState: true, preserveScroll: true, replace: true });
    };

    const handleManualSync = () => {
        if (!h2hConfigured) {
            alert('Silakan atur API Key Maitri H2H terlebih dahulu di Pengaturan & API.');
            return;
        }

        if (confirm('Apakah Anda ingin menyinkronkan seluruh katalog produk dan harga grosir terbaru dari server Maitri?')) {
            setIsSyncing(true);
            router.post(
                '/admin/products/sync',
                {},
                {
                    preserveScroll: true,
                    onFinish: () => setIsSyncing(false),
                }
            );
        }
    };

    const formatDate = (isoString) => {
        if (!isoString) return '-';
        try {
            const date = new Date(isoString);
            return new Intl.DateTimeFormat('id-ID', {
                dateStyle: 'medium',
                timeStyle: 'short',
            }).format(date);
        } catch {
            return isoString;
        }
    };

    return (
        <AdminLayout title="Katalog Produk H2H" activeMenu="products">
            <Head title="Kelola Produk & Harga H2H — Maitri Admin" />

            <div className="space-y-6 max-w-7xl mx-auto pb-16">
                {/* 1. Header Banner */}
                <div className="sketch-card bg-paper-dark p-5 sm:p-7 rounded-3xl border-2 border-ink shadow-sketch relative overflow-hidden">
                    <div className="absolute -right-8 -top-8 w-44 h-44 bg-brand/5 rounded-full pointer-events-none blur-xl"></div>

                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
                        <div className="space-y-2 max-w-2xl">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-brand-subtle text-brand-navy border border-ink shadow-sketch-xs flex items-center gap-1.5">
                                    <Sparkles className="w-3.5 h-3.5 text-brand" />
                                    <span>H2H PROVIDER INTEGRATION</span>
                                </span>
                                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-ink shadow-sketch-xs">
                                    Maitri Project API v1
                                </span>
                            </div>

                            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-ink font-sans">
                                Katalog Produk & Harga Grosir H2H
                            </h2>

                            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed font-sans">
                                Mengelola seluruh produk game dan digital yang disinkronkan dari server provider <strong className="text-ink">Maitri Project</strong>. Data tersimpan di basis data lokal sehingga katalog website pelanggan merespon secara instan.
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
                            <button
                                type="button"
                                onClick={handleManualSync}
                                disabled={isSyncing}
                                className="sketch-btn px-5 py-3 bg-brand hover:bg-brand-hover text-white rounded-2xl border-2 border-ink shadow-sketch font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                            >
                                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                                <span>{isSyncing ? 'Sedang Sinkronisasi...' : '⚡ Sinkronkan Produk Sekarang'}</span>
                            </button>

                            <Link
                                href="/admin/settings"
                                className="sketch-btn px-4 py-3 bg-white hover:bg-paper-dark text-ink rounded-2xl border-2 border-ink shadow-sketch font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all"
                            >
                                <span>Atur Kredensial API</span>
                            </Link>
                        </div>
                    </div>

                    {/* Unconfigured Alert */}
                    {!h2hConfigured && (
                        <div className="mt-4 p-3.5 bg-amber-50 border-2 border-amber-900 rounded-2xl flex items-center gap-3 text-xs text-amber-900 shadow-sketch-xs">
                            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                            <div className="flex-1">
                                <strong>API Key Belum Dikonfigurasi:</strong> Anda belum memasukkan API Key di Pengaturan & API Toko. Sinkronisasi produk membutuhkan API Key aktif dari akun Reseller Maitri Project Anda.
                            </div>
                            <Link
                                href="/admin/settings"
                                className="px-3 py-1.5 bg-amber-200 hover:bg-amber-300 text-ink rounded-lg font-bold border border-ink shadow-sketch-xs shrink-0"
                            >
                                Atur Sekarang &rarr;
                            </Link>
                        </div>
                    )}
                </div>

                {/* 2. Top Stats Overview */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <div className="sketch-card bg-white p-4 sm:p-5 rounded-2xl border-2 border-ink shadow-sketch flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-xl bg-brand-subtle text-brand border-2 border-ink shadow-sketch-xs flex items-center justify-center font-bold shrink-0">
                            <Package className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                            <span className="text-[11px] font-mono text-ink-muted uppercase font-bold block truncate">
                                Total Produk
                            </span>
                            <div className="text-xl sm:text-2xl font-black text-ink font-mono">
                                {stats.total_products?.toLocaleString('id-ID') || 0}
                            </div>
                        </div>
                    </div>

                    <div className="sketch-card bg-white p-4 sm:p-5 rounded-2xl border-2 border-ink shadow-sketch flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 border-2 border-ink shadow-sketch-xs flex items-center justify-center font-bold shrink-0">
                            <CheckCircle className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                            <span className="text-[11px] font-mono text-ink-muted uppercase font-bold block truncate">
                                Produk Aktif (Ready)
                            </span>
                            <div className="text-xl sm:text-2xl font-black text-emerald-700 font-mono">
                                {stats.available_products?.toLocaleString('id-ID') || 0}
                            </div>
                        </div>
                    </div>

                    <div className="sketch-card bg-white p-4 sm:p-5 rounded-2xl border-2 border-ink shadow-sketch flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-xl bg-sketch-sky text-ink border-2 border-ink shadow-sketch-xs flex items-center justify-center font-bold shrink-0">
                            <Layers className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                            <span className="text-[11px] font-mono text-ink-muted uppercase font-bold block truncate">
                                Brand Game / PPOB
                            </span>
                            <div className="text-xl sm:text-2xl font-black text-ink font-mono">
                                {stats.total_brands?.toLocaleString('id-ID') || 0}
                            </div>
                        </div>
                    </div>

                    <div className="sketch-card bg-white p-4 sm:p-5 rounded-2xl border-2 border-ink shadow-sketch flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-800 border-2 border-ink shadow-sketch-xs flex items-center justify-center font-bold shrink-0">
                            <Clock className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                            <span className="text-[11px] font-mono text-ink-muted uppercase font-bold block truncate">
                                Terakhir Disinkronkan
                            </span>
                            <div className="text-xs sm:text-sm font-bold text-ink truncate mt-0.5" title={stats.last_synced_at}>
                                {stats.last_synced_at ? formatDate(stats.last_synced_at) : 'Belum Pernah'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Navigation Tabs */}
                <div className="flex items-center gap-2 border-b-2 border-ink pb-2 overflow-x-auto">
                    <button
                        type="button"
                        onClick={() => setActiveTab('products')}
                        className={`sketch-btn px-4 py-2.5 rounded-xl border-2 text-xs sm:text-sm font-black flex items-center gap-2 transition-all shrink-0 ${
                            activeTab === 'products'
                                ? 'bg-brand text-white border-ink shadow-sketch'
                                : 'bg-white text-ink border-transparent hover:border-ink hover:bg-paper-dark'
                        }`}
                    >
                        <Package className="w-4 h-4" />
                        <span>Katalog Produk Tersimpan</span>
                        <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border border-ink ${activeTab === 'products' ? 'bg-white text-ink' : 'bg-brand-subtle text-brand-navy'}`}>
                            {stats.total_products || 0}
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('logs')}
                        className={`sketch-btn px-4 py-2.5 rounded-xl border-2 text-xs sm:text-sm font-black flex items-center gap-2 transition-all shrink-0 ${
                            activeTab === 'logs'
                                ? 'bg-brand text-white border-ink shadow-sketch'
                                : 'bg-white text-ink border-transparent hover:border-ink hover:bg-paper-dark'
                        }`}
                    >
                        <Clock className="w-4 h-4" />
                        <span>Log Riwayat Sinkronisasi</span>
                        <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border border-ink ${activeTab === 'logs' ? 'bg-white text-ink' : 'bg-paper-dark text-ink'}`}>
                            {logs.length}
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('cron')}
                        className={`sketch-btn px-4 py-2.5 rounded-xl border-2 text-xs sm:text-sm font-black flex items-center gap-2 transition-all shrink-0 ${
                            activeTab === 'cron'
                                ? 'bg-brand text-white border-ink shadow-sketch'
                                : 'bg-white text-ink border-transparent hover:border-ink hover:bg-paper-dark'
                        }`}
                    >
                        <Terminal className="w-4 h-4" />
                        <span>Pengaturan Cron Job API</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-ink">
                            Otomatis
                        </span>
                    </button>
                </div>

                {/* 4. Tab Contents */}

                {/* TAB 1: PRODUCT CATALOG TABLE */}
                {activeTab === 'products' && (
                    <div className="space-y-4">
                        {/* Filters Card */}
                        <div className="sketch-card bg-white p-4 sm:p-5 rounded-2xl border-2 border-ink shadow-sketch">
                            <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                                {/* Search */}
                                <div className="lg:col-span-2 relative">
                                    <Search className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    <input
                                        type="text"
                                        placeholder="Cari SKU atau nama produk..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="sketch-input w-full pl-9 pr-3.5 py-2 rounded-xl border-2 border-ink text-xs font-bold bg-paper-light text-ink focus:bg-white"
                                    />
                                </div>

                                {/* Category Dropdown */}
                                <div>
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="sketch-input w-full px-3 py-2 rounded-xl border-2 border-ink text-xs font-bold bg-paper-light text-ink focus:bg-white"
                                    >
                                        <option value="all">Semua Kategori</option>
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Brand Dropdown */}
                                <div>
                                    <select
                                        value={selectedBrand}
                                        onChange={(e) => setSelectedBrand(e.target.value)}
                                        className="sketch-input w-full px-3 py-2 rounded-xl border-2 border-ink text-xs font-bold bg-paper-light text-ink focus:bg-white"
                                    >
                                        <option value="all">Semua Brand</option>
                                        {brands.map((b) => (
                                            <option key={b} value={b}>{b}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Filter Submit & Reset Buttons */}
                                <div className="flex items-center gap-2">
                                    <button
                                        type="submit"
                                        className="sketch-btn flex-1 px-3 py-2 bg-brand hover:bg-brand-hover text-white rounded-xl border-2 border-ink shadow-sketch-xs text-xs font-black flex items-center justify-center gap-1.5 transition-all"
                                    >
                                        <Filter className="w-3.5 h-3.5" />
                                        <span>Filter</span>
                                    </button>

                                    {(searchQuery || selectedCategory !== 'all' || selectedBrand !== 'all' || selectedStatus !== 'all') && (
                                        <button
                                            type="button"
                                            onClick={handleResetFilter}
                                            className="sketch-btn px-3 py-2 bg-paper-dark hover:bg-rose-50 text-ink rounded-xl border-2 border-ink shadow-sketch-xs text-xs font-bold transition-all"
                                        >
                                            Reset
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* Products Table Card */}
                        <div className="sketch-card bg-white rounded-3xl border-2 border-ink shadow-sketch overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-paper-dark border-b-2 border-ink text-[11px] font-mono uppercase font-bold text-ink">
                                            <th className="py-3 px-4">Kode SKU</th>
                                            <th className="py-3 px-4">Nama Produk & Brand</th>
                                            <th className="py-3 px-4">Kategori</th>
                                            <th className="py-3 px-4 text-right">Harga Modal (H2H)</th>
                                            <th className="py-3 px-4 text-right">Harga Retail (Publik)</th>
                                            <th className="py-3 px-4 text-right">Margin Untung</th>
                                            <th className="py-3 px-4 text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y-2 divide-ink/10 text-xs font-medium">
                                        {products.data && products.data.length > 0 ? (
                                            products.data.map((item) => {
                                                const margin = (item.retail_price || 0) - (item.h2h_price || 0);
                                                return (
                                                    <tr key={item.id} className="hover:bg-paper-light/50 transition-colors">
                                                        {/* SKU */}
                                                        <td className="py-3.5 px-4 font-mono font-bold text-ink whitespace-nowrap">
                                                            <div className="flex items-center gap-1.5">
                                                                <span className="px-2 py-0.5 rounded bg-paper-dark border border-ink/30 text-[11px]">
                                                                    {item.buyer_sku_code}
                                                                </span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleCopy(item.buyer_sku_code, `sku_${item.id}`)}
                                                                    className="p-1 hover:bg-paper-dark rounded text-ink-muted hover:text-ink transition-colors"
                                                                    title="Salin SKU"
                                                                >
                                                                    {copiedKey === `sku_${item.id}` ? (
                                                                        <Check className="w-3 h-3 text-emerald-600" />
                                                                    ) : (
                                                                        <Copy className="w-3 h-3" />
                                                                    )}
                                                                </button>
                                                            </div>
                                                        </td>

                                                        {/* Product Name & Brand */}
                                                        <td className="py-3.5 px-4">
                                                            <div className="font-bold text-ink text-xs line-clamp-1">
                                                                {item.product_name}
                                                            </div>
                                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                                <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-sketch-sky/50 text-ink border border-ink/20">
                                                                    {item.brand}
                                                                </span>
                                                                {item.type && (
                                                                    <span className="text-[10px] font-mono text-ink-muted">
                                                                        • {item.type}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>

                                                        {/* Category */}
                                                        <td className="py-3.5 px-4 whitespace-nowrap">
                                                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-ink-muted bg-paper-grid px-2 py-0.5 rounded-lg border border-ink/20">
                                                                <Tag className="w-3 h-3 text-brand" />
                                                                <span>{item.category}</span>
                                                            </span>
                                                        </td>

                                                        {/* H2H Wholesale Price */}
                                                        <td className="py-3.5 px-4 text-right font-mono font-bold text-ink whitespace-nowrap">
                                                            Rp {(item.h2h_price || 0).toLocaleString('id-ID')}
                                                        </td>

                                                        {/* Retail Price */}
                                                        <td className="py-3.5 px-4 text-right font-mono font-bold text-brand whitespace-nowrap">
                                                            Rp {(item.retail_price || 0).toLocaleString('id-ID')}
                                                        </td>

                                                        {/* Profit Margin */}
                                                        <td className="py-3.5 px-4 text-right font-mono whitespace-nowrap">
                                                            <span className={`inline-block px-1.5 py-0.5 rounded font-bold text-[11px] ${
                                                                margin > 0
                                                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                                                    : 'bg-paper-dark text-ink-muted'
                                                            }`}>
                                                                +{margin > 0 ? `Rp ${margin.toLocaleString('id-ID')}` : 'Rp 0'}
                                                            </span>
                                                        </td>

                                                        {/* Availability Status */}
                                                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                                                            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-wider ${
                                                                item.status === 'AVAILABLE'
                                                                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                                                    : 'bg-rose-100 text-rose-800 border-rose-300'
                                                            }`}>
                                                                {item.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan="7" className="py-12 text-center text-ink-muted">
                                                    <Package className="w-10 h-10 mx-auto mb-2 text-ink-muted/50" />
                                                    <p className="font-bold text-sm text-ink">Belum ada data produk tersimpan</p>
                                                    <p className="text-xs text-ink-muted mt-1 max-w-sm mx-auto">
                                                        Klik tombol <strong>"⚡ Sinkronkan Produk Sekarang"</strong> di atas untuk mengimpor seluruh katalog dari provider Maitri.
                                                    </p>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {products.links && products.links.length > 3 && (
                                <div className="p-4 bg-paper-dark border-t-2 border-ink flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                                    <div className="text-ink-muted font-mono">
                                        Menampilkan <strong className="text-ink">{products.from || 0}</strong> - <strong className="text-ink">{products.to || 0}</strong> dari <strong className="text-ink">{products.total || 0}</strong> produk
                                    </div>

                                    <div className="flex items-center gap-1 flex-wrap">
                                        {products.links.map((link, idx) => (
                                            <Link
                                                key={idx}
                                                href={link.url || '#'}
                                                preserveScroll
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                className={`px-3 py-1.5 rounded-lg border-2 text-xs font-bold transition-all ${
                                                    link.active
                                                        ? 'bg-brand text-white border-ink shadow-sketch-xs'
                                                        : link.url
                                                        ? 'bg-white text-ink border-ink hover:bg-paper-light'
                                                        : 'bg-transparent text-ink-muted border-transparent cursor-not-allowed opacity-50'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* TAB 2: SYNC LOGS TABLE */}
                {activeTab === 'logs' && (
                    <div className="sketch-card bg-white rounded-3xl border-2 border-ink shadow-sketch overflow-hidden">
                        <div className="p-4 sm:p-5 border-b-2 border-ink bg-paper-dark flex items-center justify-between gap-3">
                            <div>
                                <h3 className="text-base font-black text-ink">Riwayat Log Sinkronisasi Produk</h3>
                                <p className="text-xs text-ink-muted mt-0.5">
                                    Mencatat setiap histori proses pembaruan harga & produk (manual admin, otomatis cron job, maupun via CLI).
                                </p>
                            </div>
                            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-white text-ink border border-ink shadow-sketch-xs">
                                {logs.length} Log Terakhir
                            </span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-paper-light border-b-2 border-ink text-[11px] font-mono uppercase font-bold text-ink">
                                        <th className="py-3 px-4">Waktu Eksekusi</th>
                                        <th className="py-3 px-4">Status</th>
                                        <th className="py-3 px-4">Pemicu</th>
                                        <th className="py-3 px-4 text-center">Total Item</th>
                                        <th className="py-3 px-4 text-center">Baru / Diperbarui</th>
                                        <th className="py-3 px-4 text-right">Durasi</th>
                                        <th className="py-3 px-4">Keterangan / Pesan Log</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y-2 divide-ink/10 text-xs font-medium">
                                    {logs && logs.length > 0 ? (
                                        logs.map((log) => (
                                            <tr key={log.id} className="hover:bg-paper-light/50 transition-colors">
                                                {/* Timestamp */}
                                                <td className="py-3.5 px-4 font-mono whitespace-nowrap text-ink">
                                                    {formatDate(log.created_at)}
                                                </td>

                                                {/* Status */}
                                                <td className="py-3.5 px-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-wider ${
                                                        log.status === 'SUCCESS'
                                                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                                            : log.status === 'RATE_LIMITED'
                                                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                                                            : 'bg-rose-100 text-rose-800 border-rose-300'
                                                    }`}>
                                                        {log.status === 'SUCCESS' && <CheckCircle className="w-3 h-3" />}
                                                        {log.status === 'RATE_LIMITED' && <Clock className="w-3 h-3" />}
                                                        {log.status === 'FAILED' && <AlertCircle className="w-3 h-3" />}
                                                        <span>{log.status}</span>
                                                    </span>
                                                </td>

                                                {/* Triggered By */}
                                                <td className="py-3.5 px-4 whitespace-nowrap">
                                                    <span className={`inline-block px-2 py-0.5 rounded font-mono font-bold text-[10px] border ${
                                                        log.triggered_by === 'CRON'
                                                            ? 'bg-purple-100 text-purple-800 border-purple-300'
                                                            : log.triggered_by === 'MANUAL'
                                                            ? 'bg-brand-subtle text-brand-navy border-brand/30'
                                                            : 'bg-paper-dark text-ink border-ink/30'
                                                    }`}>
                                                        {log.triggered_by}
                                                    </span>
                                                </td>

                                                {/* Total Items */}
                                                <td className="py-3.5 px-4 text-center font-mono font-bold text-ink whitespace-nowrap">
                                                    {log.total_items}
                                                </td>

                                                {/* Added / Updated */}
                                                <td className="py-3.5 px-4 text-center font-mono text-[11px] whitespace-nowrap">
                                                    <span className="text-emerald-700 font-bold">+{log.items_added}</span>
                                                    <span className="text-ink-muted mx-1">/</span>
                                                    <span className="text-brand font-bold">~{log.items_updated}</span>
                                                </td>

                                                {/* Duration */}
                                                <td className="py-3.5 px-4 text-right font-mono text-ink whitespace-nowrap">
                                                    {Number(log.duration_seconds || 0).toFixed(2)}s
                                                </td>

                                                {/* Message */}
                                                <td className="py-3.5 px-4 text-ink-muted text-xs">
                                                    <div className="line-clamp-2" title={log.message}>
                                                        {log.message || '-'}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="py-10 text-center text-ink-muted">
                                                <Clock className="w-8 h-8 mx-auto mb-2 text-ink-muted/50" />
                                                <p className="font-bold text-xs text-ink">Belum ada riwayat log sinkronisasi</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* TAB 3: CRON JOB API SETUP INSTRUCTIONS */}
                {activeTab === 'cron' && (
                    <div className="space-y-5">
                        <div className="sketch-card bg-white p-5 sm:p-7 rounded-3xl border-2 border-ink shadow-sketch space-y-6">
                            <div className="space-y-2">
                                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-sketch-yellow text-ink border border-ink shadow-sketch-xs">
                                    AUTOMATION & CRON JOB
                                </span>
                                <h3 className="text-xl font-black text-ink">
                                    Otomatisasi Sinkronisasi Produk dengan Cron Job
                                </h3>
                                <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
                                    Gunakan URL endpoint ini pada scheduler hosting Anda (cPanel Cron Jobs, EasyCron, cron-job.org, atau Crontab VPS) agar harga modal dan daftar produk selalu sinkron secara berkala tanpa perlu menekan tombol manual.
                                </p>
                            </div>

                            {/* Recommendation Notice */}
                            <div className="p-4 bg-sky-50 border-2 border-sky-900 rounded-2xl flex items-start gap-3 text-xs text-sky-950 shadow-sketch-xs">
                                <Clock className="w-5 h-5 text-sky-700 shrink-0 mt-0.5" />
                                <div className="space-y-1">
                                    <strong className="font-bold">Rekomendasi Interval Waktu (10 - 30 Menit):</strong>
                                    <p className="leading-relaxed text-sky-900">
                                        Gateway Maitri Project meng-cache katalog produk selama <strong>5 menit (300 detik)</strong>. Kami menyarankan untuk menjadwalkan Cron Job setiap <strong>15 menit atau 30 menit</strong> sekali untuk efisiensi performa server.
                                    </p>
                                </div>
                            </div>

                            {/* Cron URL Box */}
                            <div className="space-y-2">
                                <label className="text-xs font-mono font-bold uppercase tracking-wider text-ink block">
                                    URL Endpoint Cron Job (GET / POST):
                                </label>
                                <div className="flex flex-col sm:flex-row items-stretch gap-2">
                                    <input
                                        type="text"
                                        readOnly
                                        value={cronInfo.url}
                                        className="sketch-input flex-1 px-3.5 py-2.5 rounded-xl border-2 border-ink font-mono text-xs font-bold bg-paper-light text-ink select-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleCopy(cronInfo.url, 'cron_url')}
                                        className="sketch-btn px-4 py-2.5 bg-brand hover:bg-brand-hover text-white rounded-xl border-2 border-ink shadow-sketch-xs text-xs font-bold flex items-center justify-center gap-1.5 shrink-0 transition-all"
                                    >
                                        {copiedKey === 'cron_url' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                        <span>{copiedKey === 'cron_url' ? 'Tersalin!' : 'Salin URL'}</span>
                                    </button>
                                </div>
                                <span className="text-[11px] font-mono text-ink-muted block">
                                    Token otentikasi disertakan otomatis di dalam URL untuk mengamankan eksekusi dari akses publik yang tidak berwenang.
                                </span>
                            </div>

                            {/* Secret Token Box */}
                            <div className="space-y-2">
                                <label className="text-xs font-mono font-bold uppercase tracking-wider text-ink block">
                                    Secret Token Cron:
                                </label>
                                <div className="flex flex-col sm:flex-row items-stretch gap-2">
                                    <input
                                        type="text"
                                        readOnly
                                        value={cronInfo.token}
                                        className="sketch-input flex-1 px-3.5 py-2.5 rounded-xl border-2 border-ink font-mono text-xs font-bold bg-paper-light text-ink select-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleCopy(cronInfo.token, 'cron_token')}
                                        className="sketch-btn px-4 py-2.5 bg-white hover:bg-paper-dark text-ink rounded-xl border-2 border-ink shadow-sketch-xs text-xs font-bold flex items-center justify-center gap-1.5 shrink-0 transition-all"
                                    >
                                        {copiedKey === 'cron_token' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                        <span>{copiedKey === 'cron_token' ? 'Tersalin!' : 'Salin Token'}</span>
                                    </button>
                                </div>
                            </div>

                            {/* cURL Command Example */}
                            <div className="space-y-2">
                                <label className="text-xs font-mono font-bold uppercase tracking-wider text-ink block">
                                    Contoh Perintah cURL (Untuk Crontab Linux / VPS):
                                </label>
                                <div className="p-3.5 bg-slate-900 rounded-xl border-2 border-ink text-slate-100 font-mono text-xs flex items-center justify-between gap-3 overflow-x-auto">
                                    <code>{cronInfo.curlCommand}</code>
                                    <button
                                        type="button"
                                        onClick={() => handleCopy(cronInfo.curlCommand, 'curl_cmd')}
                                        className="p-1.5 hover:bg-slate-800 rounded text-slate-300 hover:text-white transition-colors shrink-0"
                                        title="Salin cURL"
                                    >
                                        {copiedKey === 'curl_cmd' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Alternative Artisan CLI command */}
                            <div className="space-y-2 pt-2 border-t-2 border-dashed border-ink/20">
                                <label className="text-xs font-mono font-bold uppercase tracking-wider text-ink block">
                                    Alternatif: Perintah Artisan CLI (Jika Memiliki Akses SSH):
                                </label>
                                <div className="p-3.5 bg-paper-grid rounded-xl border-2 border-ink font-mono text-xs text-ink flex items-center justify-between gap-3">
                                    <code>php artisan h2h:sync-products --triggered-by=CRON</code>
                                    <button
                                        type="button"
                                        onClick={() => handleCopy('php artisan h2h:sync-products --triggered-by=CRON', 'artisan_cmd')}
                                        className="p-1.5 hover:bg-paper-dark rounded text-ink-muted hover:text-ink transition-colors shrink-0"
                                        title="Salin Perintah"
                                    >
                                        {copiedKey === 'artisan_cmd' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
