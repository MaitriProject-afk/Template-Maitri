import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { 
    LayoutDashboard, 
    Package, 
    ReceiptText, 
    Wallet, 
    Users, 
    Settings, 
    ExternalLink, 
    LogOut, 
    Menu, 
    X, 
    Bell, 
    ShieldCheck, 
    Activity, 
    Search,
    ChevronRight,
    Sparkles
} from 'lucide-react';

export default function AdminLayout({ 
    children, 
    auth, 
    title = 'Admin Panel', 
    activeMenu = 'dashboard' 
}) {
    const { site } = usePage().props;
    const siteSettings = site || {
        site_name: 'Maitri Project',
        brand_logo_text_prefix: 'MAITRI',
        brand_logo_text_suffix: 'TOPUP',
    };
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const user = auth?.user || { name: 'Administrator', email: 'admin@maitri.com', role: 'admin' };

    const navigationItems = [
        {
            id: 'dashboard',
            name: 'Dashboard Utama',
            icon: LayoutDashboard,
            href: '/admin',
            badge: 'Live',
            badgeColor: 'bg-emerald-100 text-emerald-800',
        },
        {
            id: 'products',
            name: 'Produk & Harga',
            icon: Package,
            href: '#',
            badge: '184',
            badgeColor: 'bg-brand-subtle text-brand-navy',
        },
        {
            id: 'orders',
            name: 'Data Transaksi',
            icon: ReceiptText,
            href: '#',
            badge: 'Baru (3)',
            badgeColor: 'bg-sketch-yellow text-ink font-bold',
        },
        {
            id: 'finance',
            name: 'Keuangan & Saldo',
            icon: Wallet,
            href: '#',
        },
        {
            id: 'users',
            name: 'Kelola Pengguna',
            icon: Users,
            href: '#',
        },
        {
            id: 'settings',
            name: 'Pengaturan & API',
            icon: Settings,
            href: '/admin/settings',
        },
    ];

    const handleLogout = () => {
        if (confirm('Apakah Anda yakin ingin keluar dari akun administrator?')) {
            router.post(route('logout'));
        }
    };

    return (
        <>
            <Head title={`${title} — ${siteSettings.brand_logo_text_prefix || 'MAITRI'} Admin`} />

            <div className="min-h-screen bg-paper text-ink flex flex-col md:flex-row selection:bg-brand-accent selection:text-ink">
                
                {/* 1. DESKTOP SIDEBAR */}
                <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-white border-r-2 border-ink shrink-0 h-screen sticky top-0 justify-between p-4 z-30 shadow-sketch-xs">
                    <div>
                        {/* Admin Logo Branding */}
                        <div className="p-3 bg-paper-grid rounded-2xl border-2 border-ink shadow-sketch-xs mb-6 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-xl bg-brand text-white border-2 border-ink shadow-sketch-xs flex items-center justify-center font-mono font-black text-base shrink-0">
                                    {(siteSettings.brand_logo_text_prefix || 'M').charAt(0)}
                                </div>
                                <div>
                                    <div className="flex items-center gap-1.5 leading-none">
                                        <span className="font-black text-sm tracking-tight text-ink font-sans uppercase">
                                            {siteSettings.brand_logo_text_prefix || 'MAITRI'}<span className="text-brand">ADMIN</span>
                                        </span>
                                    </div>
                                    <span className="text-[10px] font-mono font-bold text-ink-muted block mt-0.5">
                                        Control Center v2.0
                                    </span>
                                </div>
                            </div>
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-ink animate-pulse" title="System Online"></span>
                        </div>

                        {/* Navigation Links */}
                        <div className="space-y-1">
                            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-muted px-3 mb-2">
                                MENU ADMINISTRATOR
                            </div>

                            {navigationItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = activeMenu === item.id;
                                return (
                                    <Link
                                        key={item.id}
                                        href={item.href}
                                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border-2 text-xs font-black transition-all group ${
                                            isActive
                                                ? 'bg-brand text-white border-ink shadow-sketch-xs scale-[1.02]'
                                                : 'bg-transparent text-ink border-transparent hover:border-ink hover:bg-paper-dark'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <Icon className={`w-4 h-4 shrink-0 stroke-[2.2] ${isActive ? 'text-white' : 'text-brand'}`} />
                                            <span className="truncate">{item.name}</span>
                                        </div>

                                        {item.badge && (
                                            <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border border-ink shadow-sketch-xs shrink-0 ${item.badgeColor || 'bg-white text-ink'}`}>
                                                {item.badge}
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Bottom Section: Admin info & Back to Web */}
                    <div className="space-y-2.5 pt-4 border-t-2 border-dashed border-ink/20">
                        {/* Link back to Main Web */}
                        <Link
                            href="/"
                            className="sketch-btn w-full px-3 py-2 bg-paper-dark hover:bg-white text-ink rounded-xl text-xs font-bold flex items-center justify-between border-2 border-ink shadow-sketch-xs transition-all"
                        >
                            <span className="flex items-center gap-2">
                                <ExternalLink className="w-3.5 h-3.5 text-brand" />
                                <span>Lihat Website</span>
                            </span>
                            <ChevronRight className="w-3.5 h-3.5 text-ink-muted" />
                        </Link>

                        {/* Current Logged In Admin Profile Box */}
                        <div className="p-2.5 rounded-xl bg-paper-grid border-2 border-ink shadow-sketch-xs flex items-center justify-between gap-2">
                            <div className="min-w-0 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-amber-300 border border-ink flex items-center justify-center font-bold text-xs shrink-0">
                                    👑
                                </div>
                                <div className="min-w-0">
                                    <div className="font-black text-xs text-ink truncate leading-tight">{user.name}</div>
                                    <div className="text-[10px] font-mono text-ink-muted truncate">Admin Super</div>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="p-1.5 text-ink-muted hover:text-rose-600 hover:bg-white rounded-lg border border-transparent hover:border-ink transition-colors"
                                title="Keluar dari Admin"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </aside>

                {/* 2. MOBILE TOPBAR & SIDEBAR DRAWER */}
                <div className="md:hidden sticky top-0 z-40 bg-white border-b-2 border-ink px-4 py-3 flex items-center justify-between shadow-sketch-xs">
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setIsMobileSidebarOpen(true)}
                            className="p-2 rounded-xl bg-paper-dark border-2 border-ink shadow-sketch-xs text-ink"
                            title="Buka Menu Admin"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <span className="font-black text-sm tracking-tight text-ink font-sans uppercase">
                            {siteSettings.brand_logo_text_prefix || 'MAITRI'}<span className="text-brand">ADMIN</span>
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-amber-300 text-ink border border-ink text-[10px] font-black font-mono">
                            ADMIN
                        </span>
                        <Link
                            href="/"
                            className="p-2 rounded-xl bg-paper-dark border-2 border-ink shadow-sketch-xs text-ink"
                            title="Ke Website"
                        >
                            <ExternalLink className="w-4 h-4" />
                        </Link>
                    </div>
                </div>

                {/* Mobile Drawer Overlay */}
                {isMobileSidebarOpen && (
                    <div className="md:hidden fixed inset-0 z-50 flex">
                        <div 
                            className="fixed inset-0 bg-ink/60 backdrop-blur-xs animate-in fade-in duration-150"
                            onClick={() => setIsMobileSidebarOpen(false)}
                        ></div>
                        <div className="relative w-72 max-w-[80vw] bg-white border-r-2 border-ink h-full p-4 flex flex-col justify-between shadow-sketch z-10 animate-in slide-in-from-left duration-200">
                            <div>
                                <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-ink/10">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-brand text-white border-2 border-ink flex items-center justify-center font-black text-xs">
                                            M
                                        </div>
                                        <span className="font-black text-sm text-ink">Admin Panel</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setIsMobileSidebarOpen(false)}
                                        className="p-1 rounded-lg border border-ink text-ink"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="space-y-1">
                                    {navigationItems.map((item) => {
                                        const Icon = item.icon;
                                        const isActive = activeMenu === item.id;
                                        return (
                                            <Link
                                                key={item.id}
                                                href={item.href}
                                                onClick={() => setIsMobileSidebarOpen(false)}
                                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border-2 text-xs font-black transition-all ${
                                                    isActive
                                                        ? 'bg-brand text-white border-ink shadow-sketch-xs'
                                                        : 'text-ink border-transparent hover:bg-paper-dark'
                                                }`}
                                            >
                                                <div className="flex items-center gap-2.5">
                                                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-brand'}`} />
                                                    <span>{item.name}</span>
                                                </div>
                                                {item.badge && (
                                                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border border-ink ${item.badgeColor || 'bg-white text-ink'}`}>
                                                        {item.badge}
                                                    </span>
                                                )}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="space-y-2 pt-4 border-t-2 border-dashed border-ink/20">
                                <Link
                                    href="/"
                                    className="sketch-btn w-full px-3 py-2 bg-paper-dark text-ink rounded-xl text-xs font-bold flex items-center justify-center gap-2 border-2 border-ink shadow-sketch-xs"
                                >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    <span>Kembali ke Website</span>
                                </Link>
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="sketch-btn w-full px-3 py-2 bg-rose-100 text-rose-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border-2 border-ink shadow-sketch-xs"
                                >
                                    <LogOut className="w-3.5 h-3.5" />
                                    <span>Keluar</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. MAIN WORKSPACE / CONTENT AREA */}
                <div className="flex-1 flex flex-col min-w-0">
                    {/* Desktop Top Header Bar */}
                    <header className="hidden md:flex items-center justify-between px-6 lg:px-8 py-3.5 bg-white border-b-2 border-ink sticky top-0 z-20 shadow-sketch-xs">
                        {/* Title & Live Status */}
                        <div className="flex items-center gap-3">
                            <h1 className="text-base sm:text-lg font-black text-ink tracking-tight font-sans">
                                {title}
                            </h1>
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-ink text-[10px] font-mono font-bold shadow-sketch-xs">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                                <span>SISTEM NORMAL</span>
                            </span>
                        </div>

                        {/* Topbar Right Tools */}
                        <div className="flex items-center gap-3">
                            {/* Live Clock / Date Indicator */}
                            <div className="text-[11px] font-mono text-ink-muted font-bold hidden lg:block">
                                📅 Server Online • 24 Jam
                            </div>

                            {/* Notifications stub */}
                            <button
                                type="button"
                                className="p-2 rounded-xl bg-white hover:bg-paper-dark border-2 border-ink shadow-sketch-xs text-ink relative transition-transform active:scale-95"
                                title="Notifikasi Sistem"
                            >
                                <Bell className="w-4 h-4 stroke-[2.2]" />
                                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-brand rounded-full border border-ink"></span>
                            </button>

                            {/* User Profile Pill */}
                            <Link
                                href="/user/profile"
                                className="sketch-btn px-3 py-1.5 bg-paper-dark hover:bg-brand-subtle text-ink rounded-xl text-xs font-bold flex items-center gap-2 border-2 border-ink shadow-sketch-xs transition-all"
                            >
                                <span className="w-5 h-5 rounded-full bg-amber-300 border border-ink flex items-center justify-center text-[10px]">
                                    👑
                                </span>
                                <span className="max-w-[120px] truncate">{user.name}</span>
                            </Link>
                        </div>
                    </header>

                    {/* Body Content Container */}
                    <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                        {children}
                    </main>
                </div>

            </div>
        </>
    );
}
