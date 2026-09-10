import React, { useState } from 'react';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { 
    User, 
    Mail, 
    Phone, 
    History, 
    Settings, 
    ShieldCheck, 
    ArrowRight, 
    Check, 
    AlertCircle, 
    LogOut, 
    Lock, 
    Gamepad2, 
    Copy,
    Sparkles,
    ExternalLink,
    ReceiptText,
    Clock,
    CheckCircle2,
    XCircle,
    PackageCheck
} from 'lucide-react';

export default function Profile({ auth, transactions = { data: [] } }) {
    const { site } = usePage().props;
    const siteName = site?.site_name || 'Maitri Project';
    const user = auth?.user || {
        name: 'Member',
        email: 'member@gmail.com',
        phone: null,
        role: 'user',
    };

    const isAdmin = user.role === 'admin';

    // Tabs: 'orders', 'settings'
    const [activeTab, setActiveTab] = useState('orders');

    // Phone form
    const [phoneInput, setPhoneInput] = useState(user.phone || '');
    const [phoneSaved, setPhoneSaved] = useState(false);
    const [phoneSaving, setPhoneSaving] = useState(false);
    const [copiedCode, setCopiedCode] = useState(null);

    const handleCopy = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedCode(id);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    const handleSavePhone = (e) => {
        e.preventDefault();
        setPhoneSaving(true);
        router.post(route('user.profile.phone'), { phone: phoneInput }, {
            preserveScroll: true,
            onSuccess: () => {
                setPhoneSaved(true);
                setPhoneSaving(false);
                setTimeout(() => setPhoneSaved(false), 3000);
            },
            onError: () => {
                setPhoneSaving(false);
            }
        });
    };

    const handleLogout = () => {
        if (confirm('Apakah Anda yakin ingin keluar dari akun?')) {
            router.post(route('logout'));
        }
    };

    const orderList = transactions?.data || [];

    const getPaymentBadge = (status) => {
        switch (status) {
            case 'PAID':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-500 text-[11px] font-bold font-mono">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Lunas</span>
                    </span>
                );
            case 'UNPAID':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-500 text-[11px] font-bold font-mono">
                        <Clock className="w-3 h-3 text-amber-600" />
                        <span>Menunggu Bayar</span>
                    </span>
                );
            case 'EXPIRED':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-400 text-[11px] font-bold font-mono">
                        <XCircle className="w-3 h-3 text-gray-500" />
                        <span>Kadaluarsa</span>
                    </span>
                );
            case 'FAILED':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-500 text-[11px] font-bold font-mono">
                        <AlertCircle className="w-3 h-3 text-rose-600" />
                        <span>Gagal</span>
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-paper-dark text-ink border border-ink text-[11px] font-mono">
                        <span>{status}</span>
                    </span>
                );
        }
    };

    const getTopupBadge = (status) => {
        switch (status) {
            case 'SUCCESS':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-500 text-[11px] font-bold font-mono">
                        <PackageCheck className="w-3 h-3 text-emerald-600" />
                        <span>Top Up Sukses</span>
                    </span>
                );
            case 'PROCESSING':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-500 text-[11px] font-bold font-mono">
                        <Clock className="w-3 h-3 text-sky-600 animate-spin" />
                        <span>Diproses</span>
                    </span>
                );
            case 'WAITING':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-400 text-[11px] font-bold font-mono">
                        <Clock className="w-3 h-3 text-amber-600" />
                        <span>Menunggu Proses</span>
                    </span>
                );
            case 'FAILED':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-500 text-[11px] font-bold font-mono">
                        <AlertCircle className="w-3 h-3 text-rose-600" />
                        <span>Top Up Gagal</span>
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-paper-dark text-ink border border-ink text-[11px] font-mono">
                        <span>{status}</span>
                    </span>
                );
        }
    };

    return (
        <MainLayout
            auth={auth}
            title={`${user.name} — Profil Pengguna | ${siteName}`}
            description={`Kelola akun dan pantau riwayat pembelian game di ${siteName}.`}
            activeTab="profil"
        >
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">

                {/* 1. Profile Hero Card (Sketchbook Style) */}
                <div className="sketch-card bg-white p-5 sm:p-7 rounded-3xl border-2 border-ink shadow-sketch relative overflow-hidden">
                    {/* Background Dot pattern texture */}
                    <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#0f172a_1.2px,transparent_1.2px)] [background-size:16px_16px] pointer-events-none"></div>

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        
                        {/* User Identity Info */}
                        <div className="flex items-center gap-4 sm:gap-5">
                            {/* Avatar Circle */}
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-brand-subtle border-2 border-ink shadow-sketch-xs flex items-center justify-center shrink-0">
                                <User className="w-8 h-8 sm:w-10 sm:h-10 text-brand stroke-[2.2]" />
                            </div>

                            {/* Name, Badges, Email, Phone */}
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-ink text-[11px] font-bold font-mono shadow-sketch-xs">
                                        <Sparkles className="w-3 h-3 text-emerald-600" />
                                        <span>Member Resmi</span>
                                    </span>

                                    {isAdmin ? (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-300 text-ink border border-ink text-[11px] font-black font-mono shadow-sketch-xs">
                                            <span>👑 ADMIN</span>
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-paper-dark text-ink border border-ink text-[11px] font-bold font-mono">
                                            <span>USER</span>
                                        </span>
                                    )}
                                </div>

                                <h1 className="text-xl sm:text-2xl font-black text-ink tracking-tight mt-1">
                                    {user.name}
                                </h1>

                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-muted mt-1 font-medium">
                                    <span className="flex items-center gap-1">
                                        <Mail className="w-3.5 h-3.5 text-brand" />
                                        {user.email}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Phone className="w-3.5 h-3.5 text-brand" />
                                        {user.phone || 'Belum diisi'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Admin Action Button (Hanya Muncul Jika Role Admin) */}
                        {isAdmin && (
                            <div className="flex items-center shrink-0">
                                <Link
                                    href="/admin"
                                    className="sketch-btn px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-ink font-black text-xs sm:text-sm rounded-2xl border-2 border-ink shadow-sketch-xs flex items-center justify-center gap-2 transition-all w-full sm:w-auto"
                                >
                                    <span>👑 Masuk Panel Admin</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        )}

                    </div>
                </div>

                {/* 2. Tabs Navigation */}
                <div className="border-b-2 border-ink flex items-center gap-2 overflow-x-auto no-scrollbar pt-2">
                    <button
                        type="button"
                        onClick={() => setActiveTab('orders')}
                        className={`flex-1 sm:flex-initial px-6 sm:px-8 py-3 rounded-t-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 border-t-2 border-x-2 border-ink transition-all relative -mb-[2px] ${
                            activeTab === 'orders'
                                ? 'bg-white text-brand shadow-sketch'
                                : 'bg-paper-dark text-ink-muted hover:text-ink'
                        }`}
                    >
                        <History className="w-4 h-4" />
                        <span>RIWAYAT PEMBELIAN GAME</span>
                        {orderList.length > 0 && (
                            <span className="px-2 py-0.5 text-[10px] bg-brand text-white rounded-full font-mono font-bold">
                                {transactions?.total || orderList.length}
                            </span>
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('settings')}
                        className={`flex-1 sm:flex-initial px-6 sm:px-8 py-3 rounded-t-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 border-t-2 border-x-2 border-ink transition-all relative -mb-[2px] ${
                            activeTab === 'settings'
                                ? 'bg-white text-brand shadow-sketch'
                                : 'bg-paper-dark text-ink-muted hover:text-ink'
                        }`}
                    >
                        <Settings className="w-4 h-4" />
                        <span>PENGATURAN AKUN</span>
                    </button>
                </div>

                {/* 3. Tab Contents */}

                {/* TAB 1: RIWAYAT PEMBELIAN GAME */}
                {activeTab === 'orders' && (
                    <div className="sketch-card bg-white p-5 sm:p-7 rounded-3xl border-2 border-ink shadow-sketch space-y-6 animate-in fade-in duration-150">
                        <div className="pb-4 border-b-2 border-ink/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                                <h2 className="text-base sm:text-lg font-black text-ink">
                                    Riwayat Pembelian Game & PPOB
                                </h2>
                                <p className="text-xs text-ink-muted mt-0.5">
                                    Daftar pesanan top up yang Anda lakukan saat login di akun ini.
                                </p>
                            </div>
                            <Link
                                href="/katalog"
                                className="sketch-btn px-3.5 py-1.5 bg-brand text-white text-xs font-bold rounded-xl border-2 border-ink shadow-sketch-xs inline-flex items-center gap-1 self-start sm:self-auto"
                            >
                                <span>+ Pesan Lagi</span>
                            </Link>
                        </div>

                        {/* List Transactions */}
                        {orderList.length > 0 ? (
                            <div className="space-y-4">
                                {orderList.map((item) => {
                                    const createdDate = item.created_at 
                                        ? new Date(item.created_at).toLocaleString('id-ID', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                          }) + ' WIB'
                                        : '-';

                                    return (
                                        <div 
                                            key={item.id} 
                                            className="p-4 sm:p-5 rounded-2xl border-2 border-ink bg-paper-grid hover:border-brand transition-all shadow-sketch-xs space-y-3"
                                        >
                                            {/* Header row: Invoice & Badges */}
                                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink/15 pb-2.5">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-mono font-black text-ink">
                                                        {item.invoice_code}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleCopy(item.invoice_code, `inv-${item.id}`)}
                                                        className="p-1 hover:bg-paper-dark rounded text-ink-muted hover:text-ink transition-colors"
                                                        title="Salin Nomor Invoice"
                                                    >
                                                        {copiedCode === `inv-${item.id}` ? (
                                                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                                                        ) : (
                                                            <Copy className="w-3.5 h-3.5" />
                                                        )}
                                                    </button>
                                                    <span className="text-[11px] text-ink-muted font-mono hidden sm:inline">
                                                        • {createdDate}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    {getPaymentBadge(item.payment_status)}
                                                    {getTopupBadge(item.topup_status)}
                                                </div>
                                            </div>

                                            {/* Main Info */}
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                                <div className="flex items-center gap-3">
                                                    {/* Product Thumbnail */}
                                                    <div className="w-12 h-12 rounded-xl border-2 border-ink bg-white overflow-hidden shrink-0 flex items-center justify-center">
                                                        {item.product?.thumbnail ? (
                                                            <img 
                                                                src={item.product.thumbnail} 
                                                                alt={item.product_name} 
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <Gamepad2 className="w-6 h-6 text-brand" />
                                                        )}
                                                    </div>

                                                    {/* Name & Target */}
                                                    <div>
                                                        <h3 className="text-sm font-black text-ink">
                                                            {item.product_name}
                                                        </h3>
                                                        <p className="text-xs text-ink-muted font-medium">
                                                            Item: <span className="font-bold text-ink">{item.product_item?.name || item.product_name}</span>
                                                        </p>
                                                        <p className="text-[11px] font-mono text-ink-muted">
                                                            Tujuan: <span className="font-bold text-ink">{item.customer_no}</span>
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Price & Action */}
                                                <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-ink/10">
                                                    <div className="text-left sm:text-right">
                                                        <span className="text-[10px] uppercase font-mono font-bold text-ink-muted block">
                                                            Total Bayar
                                                        </span>
                                                        <span className="text-sm sm:text-base font-black font-mono text-brand">
                                                            {item.formatted_total_payment || `Rp ${Number(item.total_payment).toLocaleString('id-ID')}`}
                                                        </span>
                                                    </div>

                                                    <Link
                                                        href={`/invoice/${item.invoice_code}`}
                                                        className="sketch-btn px-3.5 py-2 bg-brand-accent hover:bg-brand-accent/80 text-ink font-black text-xs rounded-xl border-2 border-ink shadow-sketch-xs inline-flex items-center gap-1 shrink-0"
                                                    >
                                                        <span>Invoice</span>
                                                        <ExternalLink className="w-3.5 h-3.5" />
                                                    </Link>
                                                </div>
                                            </div>

                                            {/* SN Footer if Topup Success */}
                                            {item.sn && (
                                                <div className="p-2 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between text-xs font-mono">
                                                    <span className="text-emerald-900 font-bold">
                                                        SN / Voucher: <span className="text-ink font-black">{item.sn}</span>
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleCopy(item.sn, `sn-${item.id}`)}
                                                        className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
                                                    >
                                                        {copiedCode === `sn-${item.id}` ? 'Tersalin!' : 'Salin SN'}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}

                                {/* Pagination */}
                                {transactions?.links && transactions.links.length > 3 && (
                                    <div className="pt-4 flex items-center justify-center gap-1.5 flex-wrap">
                                        {transactions.links.map((link, idx) => {
                                            if (!link.url) {
                                                return (
                                                    <span
                                                        key={idx}
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                        className="px-3 py-1.5 rounded-lg border border-ink/20 text-ink-muted text-xs font-mono opacity-50 cursor-not-allowed"
                                                    />
                                                );
                                            }
                                            return (
                                                <Link
                                                    key={idx}
                                                    href={link.url}
                                                    preserveScroll
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                    className={`px-3 py-1.5 rounded-lg border-2 border-ink text-xs font-mono font-bold transition-all shadow-sketch-xs ${
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
                        ) : (
                            /* Empty State */
                            <div className="p-8 sm:p-14 text-center rounded-2xl border-2 border-dashed border-ink/25 bg-paper-grid">
                                <div className="w-14 h-14 rounded-2xl bg-sketch-yellow/40 border-2 border-ink shadow-sketch-xs mx-auto flex items-center justify-center mb-3">
                                    <Gamepad2 className="w-7 h-7 text-ink stroke-[2]" />
                                </div>
                                <h3 className="text-sm sm:text-base font-black text-ink">
                                    Belum Ada Riwayat Pembelian
                                </h3>
                                <p className="text-xs text-ink-muted mt-1 max-w-sm mx-auto leading-relaxed">
                                    Anda belum melakukan pembelian produk game atau pulsa. Jelajahi katalog dan nikmati harga terbaik!
                                </p>
                                <Link
                                    href="/katalog"
                                    className="sketch-btn px-4 py-2 mt-4 bg-brand text-white font-bold text-xs rounded-xl border-2 border-ink shadow-sketch-xs inline-flex items-center gap-1.5"
                                >
                                    <span>Lihat Katalog Produk</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                        )}
                    </div>
                )}

                {/* TAB 2: PENGATURAN AKUN */}
                {activeTab === 'settings' && (
                    <div className="sketch-card bg-white p-5 sm:p-7 rounded-3xl border-2 border-ink shadow-sketch space-y-6 animate-in fade-in duration-150">
                        <div className="pb-4 border-b-2 border-ink/10 flex items-center justify-between">
                            <div>
                                <h2 className="text-base sm:text-lg font-black text-ink">
                                    Pengaturan Akun & Kontak
                                </h2>
                                <p className="text-xs text-ink-muted mt-0.5">
                                    Perbarui nomor WhatsApp aktif dan informasi akun Anda.
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleSavePhone} className="max-w-xl space-y-4">
                            <div>
                                <label className="block text-xs font-mono font-bold uppercase text-ink mb-1.5">
                                    NAMA LENGKAP
                                </label>
                                <input
                                    type="text"
                                    disabled
                                    value={user.name}
                                    className="w-full px-4 py-2.5 bg-paper-dark border-2 border-ink rounded-xl text-xs sm:text-sm font-semibold text-ink-muted cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-mono font-bold uppercase text-ink mb-1.5">
                                    ALAMAT EMAIL
                                </label>
                                <input
                                    type="email"
                                    disabled
                                    value={user.email}
                                    className="w-full px-4 py-2.5 bg-paper-dark border-2 border-ink rounded-xl text-xs sm:text-sm font-semibold text-ink-muted cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-mono font-bold uppercase text-ink mb-1.5">
                                    NOMOR WHATSAPP / TELEPON AKTIF
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-muted">
                                        <Phone className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="tel"
                                        value={phoneInput}
                                        onChange={(e) => setPhoneInput(e.target.value)}
                                        placeholder="Cth: 08123456789"
                                        className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-ink rounded-xl shadow-sketch-xs focus:ring-0 focus:border-brand text-xs sm:text-sm font-semibold font-mono"
                                    />
                                </div>
                                <p className="text-[10px] text-ink-muted mt-1">
                                    Digunakan untuk konfirmasi pesanan dan notifikasi transaksi top up Anda.
                                </p>
                            </div>

                            {phoneSaved && (
                                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-500 text-emerald-800 text-xs font-bold flex items-center gap-2">
                                    <Check className="w-4 h-4" /> Nomor WhatsApp berhasil disimpan!
                                </div>
                            )}

                            <div className="pt-2 flex items-center gap-3">
                                <button
                                    type="submit"
                                    disabled={phoneSaving}
                                    className="sketch-btn px-5 py-2.5 bg-brand text-white font-bold text-xs sm:text-sm rounded-xl border-2 border-ink shadow-sketch-xs hover:bg-brand-hover disabled:opacity-50"
                                >
                                    {phoneSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </button>
                                
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="sketch-btn px-4 py-2.5 bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold text-xs sm:text-sm rounded-xl border-2 border-ink shadow-sketch-xs flex items-center gap-1.5 ml-auto"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Keluar dari Akun</span>
                                </button>
                            </div>
                        </form>
                    </div>
                )}

            </div>

        </MainLayout>
    );
}
