import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    TrendingUp, 
    ArrowUpRight, 
    ArrowDownRight, 
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
    Filter,
    Search,
    ExternalLink
} from 'lucide-react';

export default function AdminDashboard({ auth }) {
    const user = auth?.user || { name: 'Administrator', email: 'admin@maitri.com', role: 'admin' };

    // Format Rupiah helper
    const formatRp = (num) => {
        return 'Rp ' + Number(num || 0).toLocaleString('id-ID');
    };

    // Mock recent transactions for rough prototype
    const [transactions] = useState([
        {
            id: 'INV-202609101',
            customer: 'Budi Santoso',
            target: '085712345678',
            product: 'Indosat 25.000 Promo',
            category: 'Pulsa',
            amount: 26002,
            profit: 1500,
            payment: 'QRIS',
            time: '2 menit lalu',
            status: 'Sukses',
            statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-500',
        },
        {
            id: 'INV-202609102',
            customer: 'Fajar Gaming',
            target: '128491823 (2041)',
            product: 'Mobile Legends 86 Diamonds',
            category: 'Games',
            amount: 21500,
            profit: 2200,
            payment: 'QRIS',
            time: '5 menit lalu',
            status: 'Sukses',
            statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-500',
        },
        {
            id: 'INV-202609103',
            customer: 'Rian Pratama',
            target: '849102381',
            product: 'Free Fire 140 Diamonds',
            category: 'Games',
            amount: 19500,
            profit: 1800,
            payment: 'QRIS',
            time: '12 menit lalu',
            status: 'Pending',
            statusColor: 'bg-amber-100 text-amber-800 border-amber-500',
        },
        {
            id: 'INV-202609104',
            customer: 'Dewi Lestari',
            target: '081298765432',
            product: 'Telkomsel 50.000',
            category: 'Pulsa',
            amount: 51250,
            profit: 1750,
            payment: 'QRIS',
            time: '25 menit lalu',
            status: 'Sukses',
            statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-500',
        },
        {
            id: 'INV-202609105',
            customer: 'Khaerul Anwar',
            target: '3201948123',
            product: 'Token PLN 50.000',
            category: 'PLN',
            amount: 52500,
            profit: 2500,
            payment: 'QRIS',
            time: '40 menit lalu',
            status: 'Diproses',
            statusColor: 'bg-sky-100 text-sky-800 border-sky-500',
        },
    ]);

    // Mock top products
    const topProducts = [
        { name: 'Mobile Legends: Bang Bang', category: 'Games', sales: 74, total: 2450000 },
        { name: 'Pulsa Indosat Reguler', category: 'Pulsa', sales: 52, total: 1820000 },
        { name: 'Free Fire MAX', category: 'Games', sales: 41, total: 980000 },
        { name: 'Telkomsel Paket Data', category: 'Data', sales: 29, total: 1450000 },
    ];

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
                        <button
                            type="button"
                            onClick={() => alert('Fitur simulasi: Modal tambah produk baru.')}
                            className="sketch-btn px-4 py-2 bg-brand text-white font-bold text-xs rounded-xl border-2 border-ink shadow-sketch-xs flex items-center gap-1.5 hover:bg-brand-hover active:scale-95 transition-all"
                        >
                            <PlusCircle className="w-4 h-4" />
                            <span>Tambah Produk</span>
                        </button>
                        <Link
                            href="/"
                            className="sketch-btn px-4 py-2 bg-paper-dark hover:bg-white text-ink font-bold text-xs rounded-xl border-2 border-ink shadow-sketch-xs flex items-center gap-1.5 transition-all"
                        >
                            <ExternalLink className="w-3.5 h-3.5 text-brand" />
                            <span>Buka Web</span>
                        </Link>
                    </div>
                </div>

                {/* 2. STAT CARDS (4 METRICS) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    
                    {/* Card 1: Total Omzet Hari Ini */}
                    <div className="sketch-card bg-paper-grid p-4 sm:p-5 rounded-2xl border-2 border-ink shadow-sketch flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-mono uppercase text-ink-muted font-bold">
                                OMZET HARI INI
                            </span>
                            <div className="w-8 h-8 rounded-xl bg-brand-subtle border border-ink flex items-center justify-center">
                                <DollarSign className="w-4 h-4 text-brand stroke-[2.5]" />
                            </div>
                        </div>
                        <div className="my-2">
                            <div className="text-xl sm:text-2xl font-black font-mono text-ink">
                                {formatRp(14850000)}
                            </div>
                            <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-700 font-bold mt-1">
                                <ArrowUpRight className="w-3.5 h-3.5" />
                                <span>+14.8% vs kemarin</span>
                            </div>
                        </div>
                        <div className="text-[10px] font-sketch text-ink-muted font-bold pt-2 border-t border-ink/10">
                            Total 184 transaksi masuk
                        </div>
                    </div>

                    {/* Card 2: Laba Bersih */}
                    <div className="sketch-card bg-paper-grid p-4 sm:p-5 rounded-2xl border-2 border-ink shadow-sketch flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-mono uppercase text-ink-muted font-bold">
                                LABA BERSIH
                            </span>
                            <div className="w-8 h-8 rounded-xl bg-emerald-100 border border-ink flex items-center justify-center">
                                <TrendingUp className="w-4 h-4 text-emerald-700 stroke-[2.5]" />
                            </div>
                        </div>
                        <div className="my-2">
                            <div className="text-xl sm:text-2xl font-black font-mono text-emerald-600">
                                {formatRp(1485000)}
                            </div>
                            <div className="text-[11px] font-mono text-ink-muted font-bold mt-1">
                                Estimasi Margin: ~10%
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
                            <div className="w-8 h-8 rounded-xl bg-amber-200 border border-ink flex items-center justify-center">
                                <Clock className="w-4 h-4 text-amber-900 stroke-[2.5]" />
                            </div>
                        </div>
                        <div className="my-2">
                            <div className="text-xl sm:text-2xl font-black font-mono text-amber-700">
                                3 Pesanan
                            </div>
                            <div className="text-[11px] font-mono text-ink-muted font-bold mt-1">
                                Menunggu verifikasi provider
                            </div>
                        </div>
                        <div className="text-[10px] font-sketch text-ink-muted font-bold pt-2 border-t border-ink/10">
                            Waktu respons: 1–3 detik
                        </div>
                    </div>

                    {/* Card 4: Total Member */}
                    <div className="sketch-card bg-paper-grid p-4 sm:p-5 rounded-2xl border-2 border-ink shadow-sketch flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-mono uppercase text-ink-muted font-bold">
                                TOTAL MEMBER
                            </span>
                            <div className="w-8 h-8 rounded-xl bg-sketch-yellow border border-ink flex items-center justify-center">
                                <ShieldCheck className="w-4 h-4 text-ink stroke-[2.5]" />
                            </div>
                        </div>
                        <div className="my-2">
                            <div className="text-xl sm:text-2xl font-black font-mono text-ink">
                                1.250 User
                            </div>
                            <div className="flex items-center gap-1 text-[11px] font-mono text-brand font-bold mt-1">
                                <PlusCircle className="w-3.5 h-3.5" />
                                <span>+18 pendaftar baru hari ini</span>
                            </div>
                        </div>
                        <div className="text-[10px] font-sketch text-ink-muted font-bold pt-2 border-t border-ink/10">
                            Role: 1 Admin, 1.249 User
                        </div>
                    </div>

                </div>

                {/* 3. PROVIDER & GATEWAY STATUS BAR */}
                <div className="p-3.5 bg-white rounded-2xl border-2 border-ink shadow-sketch-xs flex flex-wrap items-center justify-between gap-3 text-xs font-mono font-bold">
                    <div className="flex items-center gap-2">
                        <Server className="w-4 h-4 text-brand" />
                        <span>STATUS KONEKSI PROVIDER:</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                        <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            <span>Digiflazz H2H (99.8%)</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            <span>Paydisini QRIS (Online)</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            <span>Database MySQL (Normal)</span>
                        </span>
                    </div>
                </div>

                {/* 4. MAIN CONTENT 2-COLUMNS: TRANSAKSI TERBARU & PRODUK TERLARIS */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* LEFT (8 Cols): Tabel Transaksi Terbaru */}
                    <div className="lg:col-span-8 sketch-card bg-white p-5 sm:p-6 rounded-3xl border-2 border-ink shadow-sketch space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b-2 border-ink/10">
                            <div>
                                <h3 className="font-black text-base sm:text-lg text-ink">
                                    Transaksi Pesanan Terbaru
                                </h3>
                                <p className="text-xs text-ink-muted">
                                    Daftar 5 transaksi pesanan terakhir yang diproses sistem.
                                </p>
                            </div>

                            <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-paper-dark border border-ink text-ink-muted font-bold shrink-0">
                                Total Hari Ini: 184 Pesanan
                            </span>
                        </div>

                        {/* Transaction Table */}
                        <div className="overflow-x-auto no-scrollbar">
                            <table className="w-full text-left text-xs font-medium">
                                <thead className="bg-paper-dark text-ink font-mono font-bold uppercase border-y-2 border-ink text-[11px]">
                                    <tr>
                                        <th className="py-2.5 px-3">Invoice</th>
                                        <th className="py-2.5 px-3">Pelanggan / ID</th>
                                        <th className="py-2.5 px-3">Produk</th>
                                        <th className="py-2.5 px-3">Total</th>
                                        <th className="py-2.5 px-3">Metode</th>
                                        <th className="py-2.5 px-3 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-ink/10">
                                    {transactions.map((tx) => (
                                        <tr key={tx.id} className="hover:bg-brand-subtle/20 transition-colors">
                                            <td className="py-3 px-3 font-mono font-bold text-ink">
                                                {tx.id}
                                                <span className="block text-[10px] text-ink-muted font-normal">{tx.time}</span>
                                            </td>
                                            <td className="py-3 px-3">
                                                <div className="font-bold text-ink truncate max-w-[120px]">{tx.customer}</div>
                                                <span className="font-mono text-[10px] text-ink-muted">{tx.target}</span>
                                            </td>
                                            <td className="py-3 px-3">
                                                <div className="font-bold text-ink">{tx.product}</div>
                                                <span className="text-[10px] text-ink-muted">{tx.category}</span>
                                            </td>
                                            <td className="py-3 px-3 font-mono font-bold text-brand">
                                                {formatRp(tx.amount)}
                                            </td>
                                            <td className="py-3 px-3">
                                                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-brand-subtle text-brand-navy border border-ink">
                                                    {tx.payment}
                                                </span>
                                            </td>
                                            <td className="py-3 px-3 text-center">
                                                <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${tx.statusColor}`}>
                                                    {tx.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="pt-2 text-center">
                            <button
                                type="button"
                                onClick={() => alert('Fitur simulasi: Halaman data transaksi lengkap.')}
                                className="text-xs font-bold font-mono text-brand hover:underline"
                            >
                                Lihat Seluruh Data Transaksi →
                            </button>
                        </div>
                    </div>

                    {/* RIGHT (4 Cols): Produk Terlaris & Quick Notice */}
                    <div className="lg:col-span-4 space-y-4">
                        
                        {/* Top Products Box */}
                        <div className="sketch-card bg-paper-grid p-5 rounded-3xl border-2 border-ink shadow-sketch space-y-3">
                            <h3 className="font-black text-sm text-ink pb-2 border-b-2 border-ink/10 flex items-center gap-1.5">
                                <Gamepad2 className="w-4 h-4 text-brand" />
                                <span>Produk Terlaris Hari Ini</span>
                            </h3>

                            <div className="space-y-2.5">
                                {topProducts.map((p, idx) => (
                                    <div key={p.name} className="p-2.5 rounded-xl bg-white border-2 border-ink shadow-sketch-xs flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <span className="w-5 h-5 rounded-md bg-brand text-white border border-ink font-mono font-bold text-[10px] flex items-center justify-center shrink-0">
                                                {idx + 1}
                                            </span>
                                            <div className="min-w-0">
                                                <div className="font-bold text-ink truncate">{p.name}</div>
                                                <div className="text-[10px] font-mono text-ink-muted">{p.sales} transaksi</div>
                                            </div>
                                        </div>
                                        <div className="font-mono font-black text-brand text-right shrink-0">
                                            {formatRp(p.total)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Developer Notice Prototype Card */}
                        <div className="p-4 rounded-2xl bg-amber-50 border-2 border-ink shadow-sketch-xs text-xs space-y-2">
                            <div className="font-black text-ink flex items-center gap-1.5">
                                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                                <span>Tampilan Kasar (Prototype)</span>
                            </div>
                            <p className="text-ink/80 text-[11px] leading-relaxed">
                                Ini adalah tampilan kasar (wireframe) halaman khusus Administrator dengan <strong>layout mandiri</strong> dan <strong>dashboard mandiri</strong>. Halaman ini diproteksi oleh role Admin.
                            </p>
                        </div>

                    </div>

                </div>

            </div>
        </AdminLayout>
    );
}
