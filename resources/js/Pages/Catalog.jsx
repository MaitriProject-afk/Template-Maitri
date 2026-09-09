import React, { useState, useMemo, useEffect } from 'react';
import { 
    Gamepad2, 
    Search, 
    Layers, 
    Zap, 
    Clock, 
    Ticket, 
    Wallet, 
    Smartphone, 
    Wifi, 
    PhoneCall, 
    Folder
} from 'lucide-react';
import { CATALOG_CATEGORIES, CATALOG_SUB_CATEGORIES, CATALOG_PRODUCTS } from '../data/catalogData';
import CatalogProductCard from '../Components/CatalogProductCard';
import MainLayout from '../Layouts/MainLayout';
import TopUpModal from '../Components/TopUpModal';
import { router, usePage } from '@inertiajs/react';

export default function Catalog({ auth }) {
    const { site } = usePage().props;
    const siteName = site?.site_name || 'Maitri Project';
    const [activeCategory, setActiveCategory] = useState('sms-telpon'); // Default to demo category
    const [activeSubCategory, setActiveSubCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isTrackerOpen, setIsTrackerOpen] = useState(false);

    const handleSelectProduct = (product) => {
        const slug = product.slug || (product.name ? product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'indosat');
        router.visit(`/product/${slug}`);
    };

    // Read search param from URL if present (e.g. redirected from navbar search)
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const q = params.get('search');
        if (q) {
            setSearchQuery(q);
            setActiveCategory('all');
        }
    }, []);

    // Get current category object
    const currentCategory = useMemo(() => {
        return CATALOG_CATEGORIES.find(c => c.id === activeCategory) || CATALOG_CATEGORIES[0];
    }, [activeCategory]);

    // Get available sub-categories for active category
    const availableSubCategories = useMemo(() => {
        if (activeCategory === 'all') return [];
        return CATALOG_SUB_CATEGORIES[activeCategory] || [];
    }, [activeCategory]);

    // Handle category click: reset subcategory to 'all'
    const handleCategoryClick = (catId) => {
        setActiveCategory(catId);
        setActiveSubCategory('all');
    };

    // Filter products
    const filteredProducts = useMemo(() => {
        return CATALOG_PRODUCTS.filter((product) => {
            // Category filter
            const matchesCategory = 
                activeCategory === 'all' || product.category === activeCategory;

            // Subcategory filter
            const matchesSub = 
                activeSubCategory === 'all' || product.subCategory === activeSubCategory;

            // Search query filter
            const matchesSearch = 
                !searchQuery || 
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (product.publisher && product.publisher.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (product.badge && product.badge.toLowerCase().includes(searchQuery.toLowerCase()));

            return matchesCategory && matchesSub && matchesSearch;
        });
    }, [activeCategory, activeSubCategory, searchQuery]);

    // Render category icon
    const getCategoryIcon = (iconName) => {
        const props = { className: "w-4 h-4 shrink-0" };
        switch (iconName) {
            case 'Layers': return <Layers {...props} />;
            case 'Zap': return <Zap {...props} />;
            case 'Clock': return <Clock {...props} />;
            case 'Ticket': return <Ticket {...props} />;
            case 'Wallet': return <Wallet {...props} />;
            case 'Smartphone': return <Smartphone {...props} />;
            case 'Gamepad2': return <Gamepad2 {...props} />;
            case 'Wifi': return <Wifi {...props} />;
            case 'PhoneCall': return <PhoneCall {...props} />;
            default: return <Folder {...props} />;
        }
    };

    return (
        <MainLayout
            auth={auth}
            title={`Katalog Produk Lengkap — ${siteName}`}
            description="Pilih kategori game, PPOB, pulsa, dan voucher digital lengkap dengan sistem otomatis 24 jam nonstop."
            activeTab="katalog"
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelectProduct={(p) => setSelectedProduct(p)}
            isTrackerOpen={isTrackerOpen}
            setIsTrackerOpen={setIsTrackerOpen}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
                
                {/* Header Banner Card (Sketchbook Styled) */}
                <div className="sketch-card bg-paper-grid p-5 sm:p-7 rounded-2xl border-2 border-ink shadow-sketch relative overflow-hidden">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-brand-subtle text-brand-navy border-2 border-ink shadow-sketch-xs text-xs font-bold font-mono">
                            🏷️ Katalog Lengkap
                        </span>
                        <span className="font-sketch font-bold text-xs text-ink-muted">
                            Proses 1-3 Detik ⚡
                        </span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">
                        Pilih Kategori & Produk Top-Up
                    </h1>
                    <p className="text-xs sm:text-sm text-ink-muted mt-1 max-w-2xl leading-relaxed">
                        Pilih kategori game/PPOB, sub-kategori, lalu klik produk untuk memulai transaksi top-up otomatis 24 jam.
                    </p>

                    <div className="my-4 border-t-2 border-dashed border-ink/20"></div>

                    {/* Search Bar in Banner */}
                    <div className="relative max-w-xl">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-muted">
                            <Search className="w-4 h-4" />
                        </div>
                        <input 
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari nama produk (Mobile Legends, Free Fire, PLN...)"
                            className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-ink rounded-xl text-xs sm:text-sm font-semibold focus:ring-0 focus:border-brand shadow-sketch-xs"
                        />
                        {searchQuery && (
                            <button 
                                onClick={() => setSearchQuery('')}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs font-mono font-bold text-ink-muted hover:text-ink"
                            >
                                RESET
                            </button>
                        )}
                    </div>
                </div>

                {/* 1. PILIH KATEGORI UTAMA */}
                <div>
                    <h2 className="text-xs font-mono font-black text-ink uppercase tracking-wider mb-2.5">
                        1. PILIH KATEGORI UTAMA:
                    </h2>
                    
                    {/* Categories Horizontal Wrap / Pills */}
                    <div className="flex flex-wrap gap-2 sm:gap-2.5">
                        {CATALOG_CATEGORIES.map((cat) => {
                            const isActive = activeCategory === cat.id;
                            return (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => handleCategoryClick(cat.id)}
                                    className={`sketch-btn px-3 sm:px-3.5 py-2 rounded-2xl text-xs font-bold inline-flex items-center gap-2 border-2 border-ink transition-all ${
                                        isActive
                                            ? 'bg-brand text-white shadow-sketch-xs scale-102 ring-2 ring-brand-navy/30'
                                            : 'bg-white text-ink hover:bg-brand-subtle hover:border-brand shadow-sketch-xs'
                                    }`}
                                >
                                    <span className={isActive ? 'text-white' : 'text-brand'}>
                                        {getCategoryIcon(cat.icon)}
                                    </span>
                                    <span>{cat.name}</span>
                                    {cat.count !== undefined && (
                                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full border font-bold ${
                                            isActive 
                                                ? 'bg-white text-brand border-ink' 
                                                : 'bg-brand-subtle text-brand-navy border-ink/20'
                                        }`}>
                                            {cat.count}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* 2. PILIH SUB-KATEGORI (Muncul saat Kategori ditekan) */}
                {availableSubCategories.length > 0 && (
                    <div className="sketch-card p-3.5 sm:p-4 bg-white rounded-2xl border-2 border-ink shadow-sketch animate-in fade-in duration-200">
                        <h3 className="text-xs font-mono font-black text-ink uppercase tracking-wider mb-2.5">
                            2. PILIH SUB-KATEGORI ({currentCategory.name.toUpperCase()}):
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {availableSubCategories.map((sub) => {
                                const isSubActive = activeSubCategory === sub.id;
                                return (
                                    <button
                                        key={sub.id}
                                        type="button"
                                        onClick={() => setActiveSubCategory(sub.id)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 border-ink transition-all active:translate-x-0.5 active:translate-y-0.5 ${
                                            isSubActive
                                                ? 'bg-brand text-white shadow-sketch-xs scale-102'
                                                : 'bg-white text-ink hover:bg-brand-subtle hover:text-brand-navy shadow-sketch-xs'
                                        }`}
                                    >
                                        {sub.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* 3. DAFTAR PRODUK */}
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <h2 className="text-lg sm:text-xl font-black text-ink font-sans">
                            Daftar Produk
                        </h2>
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-lg bg-paper-dark border-2 border-ink shadow-sketch-xs">
                            {filteredProducts.length} Produk
                        </span>
                    </div>

                    {/* Product Grid */}
                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                            {filteredProducts.map((product) => (
                                <CatalogProductCard 
                                    key={product.id}
                                    product={product}
                                    onSelect={handleSelectProduct}
                                />
                            ))}
                        </div>
                    ) : (
                        /* Empty state */
                        <div className="sketch-card p-8 sm:p-12 text-center bg-paper-grid rounded-2xl border-2 border-ink my-4">
                            <div className="w-14 h-14 rounded-full bg-sketch-coral/30 border-2 border-ink shadow-sketch-xs mx-auto flex items-center justify-center mb-3">
                                <Search className="w-6 h-6 text-ink stroke-[2.5]" />
                            </div>
                            <h3 className="font-black text-base text-ink">
                                Tidak Ada Produk yang Cocok
                            </h3>
                            <p className="text-xs text-ink-muted mt-1 max-w-sm mx-auto">
                                Coba pilih sub-kategori lain atau bersihkan kata kunci pencarian kamu.
                            </p>
                            <button
                                type="button"
                                onClick={() => {
                                    setSearchQuery('');
                                    setActiveSubCategory('all');
                                }}
                                className="sketch-btn px-4 py-2 mt-4 bg-brand text-white text-xs font-bold rounded-xl border-2 border-ink shadow-sketch-xs"
                            >
                                Reset Filter
                            </button>
                        </div>
                    )}
                </div>

            </div>

            {/* Product Top Up Modal */}
            <TopUpModal 
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
                onOrderCreated={() => {
                    setSelectedProduct(null);
                    setIsTrackerOpen(true);
                }}
            />
        </MainLayout>
    );
}
