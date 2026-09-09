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
    Sparkles
} from 'lucide-react';

export default function Profile({ auth }) {
    const { site } = usePage().props;
    const siteName = site?.site_name || 'Maitri Project';
    const user = auth?.user || {
        name: 'Pedulia Care',
        email: 'peduliacare@gmail.com',
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

                {/* 2. Tabs Navigation (Only Riwayat Pembelian & Pengaturan Akun) */}
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

                {/* TAB 2: RIWAYAT PEMBELIAN GAME */}
                {activeTab === 'orders' && (
                    <div className="sketch-card bg-white p-5 sm:p-7 rounded-3xl border-2 border-ink shadow-sketch space-y-6 animate-in fade-in duration-150">
                        <div className="pb-4 border-b-2 border-ink/10">
                            <h2 className="text-base sm:text-lg font-black text-ink">
                                Riwayat Pembelian Game & PPOB
                            </h2>
                            <p className="text-xs text-ink-muted mt-0.5">
                                Daftar pesanan top up otomatis 24 jam nonstop.
                            </p>
                        </div>

                        {/* Empty State */}
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
                    </div>
                )}

                {/* TAB 3: PENGATURAN AKUN */}
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

