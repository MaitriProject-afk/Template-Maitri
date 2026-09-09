import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { 
    Gamepad2, 
    Search, 
    Zap, 
    ReceiptText, 
    Sparkles, 
    Volume2, 
    X,
    ShieldCheck,
    Layers,
    User,
    Menu
} from 'lucide-react';

export default function Navbar({ 
    searchQuery, 
    onSearchChange, 
    onOpenSearch, 
    auth, 
    onOpenTracking,
    activeTab = 'home',
}) {
    const { site } = usePage().props;
    const sitePrefix = site?.brand_logo_text_prefix || 'MAITRI';
    const siteSuffix = site?.brand_logo_text_suffix || 'TOPUP';
    const siteTagline = site?.site_tagline || 'Sketsa Top Up Game & PPOB';
    const [showBanner, setShowBanner] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter' && searchQuery && searchQuery.trim().length > 0) {
            if (window.location.pathname !== '/katalog') {
                router.visit(`/katalog?search=${encodeURIComponent(searchQuery.trim())}`);
            }
        }
    };

    return (
        <header className="sticky top-0 z-40 bg-paper/95 backdrop-blur-md border-b-2 border-ink">
            {/* Running Text / Announcement Bar */}
            {showBanner && (
                <div className="bg-brand-accent border-b-2 border-ink py-1.5 px-4 text-xs font-medium text-ink flex items-center justify-between">
                    <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap max-w-7xl mx-auto w-full">
                        <span className="flex items-center gap-1 font-bold font-mono bg-ink text-brand-accent px-2 py-0.5 rounded border border-ink text-[11px] shrink-0">
                            <Volume2 className="w-3.5 h-3.5 animate-pulse" /> INFO TERKINI
                        </span>
                        <div className="marquee-content truncate flex items-center gap-4 text-ink-light font-semibold">
                            <span>⚡ Promo Top Up: Diamond Mobile Legends & Free Fire diskon s/d 20% Hari Ini!</span>
                            <span className="text-ink/30">•</span>
                            <span>🛡️ Semua transaksi 100% Legal & Bergaransi resmi</span>
                            <span className="text-ink/30">•</span>
                            <span>🚀 Rata-rata waktu proses otomatis 1-3 detik saja</span>
                        </div>
                    </div>
                    <button 
                        onClick={() => setShowBanner(false)}
                        className="ml-2 p-0.5 hover:bg-ink/10 rounded transition-colors text-ink shrink-0"
                        title="Tutup pengumuman"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            )}

            {/* Main Navigation Bar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-18 gap-4">
                    {/* Brand Logo (Hand-drawn Sketchbook style) */}
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="w-11 h-11 bg-brand-accent rounded-xl border-2 border-ink shadow-sketch flex items-center justify-center group-hover:rotate-3 transition-transform">
                            <Gamepad2 className="w-6 h-6 text-ink stroke-[2.5]" />
                        </div>
                        <div>
                            <div className="flex items-center gap-1.5">
                                <span className="font-extrabold text-xl tracking-tight text-ink font-sans uppercase">
                                    {sitePrefix}<span className="text-brand">{siteSuffix}</span>
                                </span>
                                <span className="text-[10px] font-bold font-mono uppercase bg-ink text-white px-1.5 py-0.5 rounded border border-ink">
                                    v2.0
                                </span>
                            </div>
                            <p className="text-[11px] font-sketch text-ink-muted -mt-0.5 font-bold tracking-wide">
                                {siteTagline}
                            </p>
                        </div>
                    </Link>

                    {/* Desktop Live Search Bar */}
                    <div className="hidden md:flex flex-1 max-w-md mx-4">
                        <div className="relative w-full">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-muted">
                                <Search className="w-4 h-4" />
                            </div>
                            <input
                                type="text"
                                value={searchQuery || ''}
                                onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                                onKeyDown={handleSearchKeyDown}
                                placeholder="Cari game favoritmu (e.g. Mobile Legends, Genshin)..."
                                className="w-full pl-10 pr-16 py-2 bg-white border-2 border-ink rounded-xl shadow-sketch-xs focus:ring-0 focus:border-ink focus:shadow-sketch transition-all text-sm font-medium placeholder:text-ink-muted/70"
                            />
                            <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
                                <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-paper-dark border border-ink rounded text-ink-muted">
                                    ESC
                                </kbd>
                            </div>
                        </div>
                    </div>

                    {/* Desktop Nav Links */}
                    <nav className="hidden lg:flex items-center gap-6">
                        <Link 
                            href="/katalog" 
                            className={`text-sm font-bold flex items-center gap-1.5 transition-colors ${
                                activeTab === 'katalog'
                                    ? 'text-brand underline underline-offset-4 decoration-2 decoration-brand'
                                    : 'text-ink hover:text-brand'
                            }`}
                        >
                            <Layers className="w-4 h-4 text-brand" /> Katalog
                        </Link>
                        <button 
                            type="button"
                            onClick={onOpenTracking}
                            className={`text-sm font-bold flex items-center gap-1.5 transition-colors ${
                                activeTab === 'transaksi'
                                    ? 'text-brand underline underline-offset-4 decoration-2 decoration-brand'
                                    : 'text-ink hover:text-brand'
                            }`}
                        >
                            <ReceiptText className="w-4 h-4" /> Cek Pesanan
                        </button>
                        <a 
                            href="/#keunggulan" 
                            className="text-sm font-bold text-ink hover:text-brand-hover flex items-center gap-1.5 transition-colors"
                        >
                            <ShieldCheck className="w-4 h-4" /> Legal & Aman
                        </a>
                        <Link 
                            href="/style-guide" 
                            className={`text-sm font-bold flex items-center gap-1.5 transition-colors ${
                                activeTab === 'styleguide'
                                    ? 'text-brand underline underline-offset-4 decoration-2 decoration-brand'
                                    : 'text-ink hover:text-brand-hover'
                            }`}
                        >
                            <Sparkles className="w-4 h-4 text-brand-hover" /> Style Guide
                        </Link>
                    </nav>

                    {/* Auth & CTA Buttons */}
                    <div className="hidden sm:flex items-center gap-2.5">
                        {auth?.user ? (
                            <>
                                {/* Admin Button (Only if user is admin) */}
                                {auth.user.role === 'admin' && (
                                    <Link
                                        href="/admin"
                                        className="sketch-btn px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-ink rounded-xl text-xs font-black flex items-center gap-1.5 border-2 border-ink shadow-sketch-xs transition-all"
                                        title="Panel Administrator"
                                    >
                                        <span>👑 Admin</span>
                                    </Link>
                                )}

                                {/* User Profile Button */}
                                <Link
                                    href="/user/profile"
                                    className="sketch-btn px-3.5 py-1.5 bg-brand text-white hover:bg-brand-hover rounded-xl text-xs font-bold flex items-center gap-1.5 border-2 border-ink shadow-sketch-xs transition-all"
                                >
                                    <User className="w-3.5 h-3.5" />
                                    <span className="max-w-[120px] truncate">{auth.user.name}</span>
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="sketch-btn px-4 py-2 bg-white text-ink rounded-xl text-sm font-bold hover:bg-paper-dark transition-colors"
                                >
                                    Masuk
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="sketch-btn px-4 py-2 bg-brand text-white rounded-xl text-sm font-bold hover:bg-brand-hover transition-colors"
                                >
                                    Daftar
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Top Right Actions */}
                    <div className="flex md:hidden items-center gap-2">
                        {auth?.user && (
                            <Link
                                href="/user/profile"
                                className="px-3 py-1.5 bg-brand text-white rounded-xl border-2 border-ink shadow-sketch-xs text-xs font-bold flex items-center gap-1"
                                title="Profil Saya"
                            >
                                <User className="w-3.5 h-3.5" />
                                <span className="max-w-[90px] truncate">{auth.user.name}</span>
                            </Link>
                        )}

                        <button
                            type="button"
                            onClick={onOpenSearch}
                            className="p-2 bg-white rounded-xl border-2 border-ink shadow-sketch-xs text-ink"
                            title="Buka Pencarian"
                        >
                            <Search className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
