import React from 'react';
import { Home, LayoutGrid, Search, History, User } from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function BottomNav({ activeTab = 'home', onTabChange, onOpenSearch, auth, stickyBar }) {
    return (
        <aside 
            aria-label="Navigasi Mobile"
            className="md:hidden fixed bottom-0 left-0 right-0 z-50 pointer-events-none pb-safe"
        >
            {/* Card Container with smooth rounded-t corners, sketch border and subtle shadow */}
            <div className={`max-w-md mx-auto pointer-events-auto bg-white border-t-2 border-x-2 border-ink shadow-[0_-4px_24px_rgba(15,23,42,0.12)] ${
                stickyBar ? 'rounded-t-2xl' : 'rounded-t-[28px] px-2 pt-2.5 pb-2'
            }`}>
                {/* Optional Sticky Bar (e.g. for Product Detail Page) */}
                {stickyBar && (
                    <div className="border-b-2 border-ink px-4 py-2 bg-white relative z-10">
                        {stickyBar}
                    </div>
                )}

                <div className={`grid grid-cols-5 h-[64px] items-stretch ${stickyBar ? 'px-2 pt-2.5 pb-2' : ''}`}>
                    
                    {/* 1. Beranda */}
                    <button
                        type="button"
                        onClick={() => onTabChange && onTabChange('home')}
                        className="flex flex-col items-center justify-between py-1 group transition-transform active:scale-95"
                    >
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                            activeTab === 'home'
                                ? 'border-2 border-brand text-brand bg-brand-subtle/50'
                                : 'text-ink-muted group-hover:text-ink'
                        }`}>
                            <Home className="w-5 h-5 stroke-[2.2]" />
                        </div>
                        <span className={`text-[11px] font-bold transition-colors ${
                            activeTab === 'home' ? 'text-brand' : 'text-ink-muted'
                        }`}>
                            Beranda
                        </span>
                    </button>

                    {/* 2. Katalog */}
                    <button
                        type="button"
                        onClick={() => onTabChange && onTabChange('katalog')}
                        className="flex flex-col items-center justify-between py-1 group transition-transform active:scale-95"
                    >
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                            activeTab === 'katalog'
                                ? 'border-2 border-brand text-brand bg-brand-subtle/50'
                                : 'text-ink-muted group-hover:text-ink'
                        }`}>
                            <LayoutGrid className="w-5 h-5 stroke-[2.2]" />
                        </div>
                        <span className={`text-[11px] font-bold transition-colors ${
                            activeTab === 'katalog' ? 'text-brand' : 'text-ink-muted'
                        }`}>
                            Katalog
                        </span>
                    </button>

                    {/* 3. Central Action: Cari (Floating Elevated Button) */}
                    <div className="flex flex-col items-center justify-between py-1 relative">
                        <button
                            type="button"
                            onClick={onOpenSearch}
                            className="-mt-7 w-12 h-12 rounded-full bg-brand text-white border-2 border-ink shadow-[0_4px_0_#0f172a] flex items-center justify-center transition-all active:translate-y-1 active:shadow-none hover:scale-105 shrink-0"
                            title="Cari Game & Produk"
                        >
                            <Search className="w-6 h-6 stroke-[2.5]" />
                        </button>
                        <span className="text-[11px] font-bold text-ink">
                            Cari
                        </span>
                    </div>

                    {/* 4. Transaksi */}
                    <button
                        type="button"
                        onClick={() => onTabChange && onTabChange('transaksi')}
                        className="flex flex-col items-center justify-between py-1 group transition-transform active:scale-95"
                    >
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                            activeTab === 'transaksi'
                                ? 'border-2 border-brand text-brand bg-brand-subtle/50'
                                : 'text-ink-muted group-hover:text-ink'
                        }`}>
                            <History className="w-5 h-5 stroke-[2.2]" />
                        </div>
                        <span className={`text-[11px] font-bold transition-colors ${
                            activeTab === 'transaksi' ? 'text-brand' : 'text-ink-muted'
                        }`}>
                            Transaksi
                        </span>
                    </button>

                    {/* 5. Profil */}
                    <Link
                        href={auth?.user ? '/user/profile' : route('login')}
                        className="flex flex-col items-center justify-between py-1 group transition-transform active:scale-95"
                    >
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                            activeTab === 'profil'
                                ? 'border-2 border-brand text-brand bg-brand-subtle/50'
                                : 'text-ink-muted group-hover:text-ink'
                        }`}>
                            <User className="w-5 h-5 stroke-[2.2]" />
                        </div>
                        <span className={`text-[11px] font-bold transition-colors ${
                            activeTab === 'profil' ? 'text-brand' : 'text-ink-muted'
                        }`}>
                            Profil
                        </span>
                    </Link>

                </div>
            </div>
        </aside>
    );
}
