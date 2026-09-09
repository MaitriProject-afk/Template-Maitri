import React, { useState, useMemo, useEffect } from 'react';
import { 
    Search, 
    Layers, 
    Zap, 
    Clock, 
    Ticket, 
    Wallet, 
    Smartphone, 
    Folder,
    PackageOpen,
    Filter
} from 'lucide-react';
import CatalogProductCard from '../Components/CatalogProductCard';
import MainLayout from '../Layouts/MainLayout';
import { router, usePage } from '@inertiajs/react';

export default function Catalog({ 
    auth, 
    categories = [], 
    subCategories = [], 
    products = [] 
}) {
    const { site } = usePage().props;
    const siteName = site?.site_name || 'Maitri Project';
    
    // Active filters
    const [activeCategory, setActiveCategory] = useState('all'); // 'all' or category id / slug
    const [activeSubCategory, setActiveSubCategory] = useState('all'); // 'all' or subcategory id / slug
    const [searchQuery, setSearchQuery] = useState('');
    const [isTrackerOpen, setIsTrackerOpen] = useState(false);

    const handleSelectProduct = (product) => {
        const slug = product.slug || (product.name ? product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'product');
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

    // Active Category Object
    const currentCategory = useMemo(() => {
        if (activeCategory === 'all') return null;
        return categories.find(c => String(c.id) === String(activeCategory) || c.slug === activeCategory) || null;
    }, [categories, activeCategory]);

    // Available sub-categories for the selected category
    const availableSubCategories = useMemo(() => {
        if (!currentCategory) return [];
        return subCategories.filter(s => s.category_id === currentCategory.id);
    }, [currentCategory, subCategories]);

    // Handle category click: reset subcategory to 'all'
    const handleCategoryClick = (catId) => {
        setActiveCategory(catId);
        setActiveSubCategory('all');
    };

    // Filter products
    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            // Category filter
            let matchesCategory = true;
            if (activeCategory !== 'all') {
                matchesCategory = 
                    String(product.category_id) === String(activeCategory) || 
                    product.category === activeCategory;
            }

            // Subcategory filter
            let matchesSub = true;
            if (activeSubCategory !== 'all') {
                matchesSub = 
                    String(product.sub_category_id) === String(activeSubCategory) || 
                    product.sub_category === activeSubCategory;
            }

            // Search query filter
            const q = (searchQuery || '').toLowerCase();
            const matchesSearch = 
                !q || 
                (product.name && product.name.toLowerCase().includes(q)) ||
                (product.brand && product.brand.toLowerCase().includes(q)) ||
                (product.category_name && product.category_name.toLowerCase().includes(q)) ||
                (product.sub_category_name && product.sub_category_name.toLowerCase().includes(q));

            return matchesCategory && matchesSub && matchesSearch;
        });
    }, [products, activeCategory, activeSubCategory, searchQuery]);

    return (
        <MainLayout
            auth={auth}
            title={`Katalog Produk Lengkap — ${siteName}`}
            description="Pilih kategori game, PPOB, pulsa, dan voucher digital lengkap dengan sistem otomatis 24 jam nonstop."
            activeTab="katalog"
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelectProduct={handleSelectProduct}
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
                        Pilih kategori game/layanan, filter sub-kategori, lalu klik produk untuk memulai transaksi otomatis 24 jam.
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
                {categories.length > 0 && (
                    <div>
                        <h2 className="text-xs font-mono font-black text-ink uppercase tracking-wider mb-2.5">
                            1. PILIH KATEGORI UTAMA:
                        </h2>
                        
                        <div className="flex flex-wrap gap-2 sm:gap-2.5">
                            {/* All Categories Option */}
                            <button
                                type="button"
                                onClick={() => handleCategoryClick('all')}
                                className={`sketch-btn px-3.5 py-2 rounded-2xl text-xs font-bold inline-flex items-center gap-2 border-2 border-ink transition-all ${
                                    activeCategory === 'all'
                                        ? 'bg-brand text-white shadow-sketch-xs scale-102 ring-2 ring-brand-navy/30'
                                        : 'bg-white text-ink hover:bg-brand-subtle shadow-sketch-xs'
                                }`}
                            >
                                <Layers className="w-4 h-4" />
                                <span>Semua Kategori</span>
                                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full border font-bold ${
                                    activeCategory === 'all'
                                        ? 'bg-white text-brand border-ink'
                                        : 'bg-brand-subtle text-brand-navy border-ink/20'
                                }`}>
                                    {products.length}
                                </span>
                            </button>

                            {/* Dynamic Database Categories */}
                            {categories.map((cat) => {
                                const isActive = String(activeCategory) === String(cat.id) || activeCategory === cat.slug;
                                const catCount = products.filter(p => p.category_id === cat.id).length;

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
                                        <Folder className={`w-4 h-4 ${isActive ? 'text-white' : 'text-brand'}`} />
                                        <span>{cat.name}</span>
                                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full border font-bold ${
                                            isActive 
                                                ? 'bg-white text-brand border-ink' 
                                                : 'bg-brand-subtle text-brand-navy border-ink/20'
                                        }`}>
                                            {catCount}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* 2. PILIH SUB-KATEGORI (Muncul saat Kategori ditekan & memiliki subkategori) */}
                {currentCategory && availableSubCategories.length > 0 && (
                    <div className="sketch-card p-3.5 sm:p-4 bg-white rounded-2xl border-2 border-ink shadow-sketch animate-in fade-in duration-200">
                        <h3 className="text-xs font-mono font-black text-ink uppercase tracking-wider mb-2.5">
                            2. PILIH SUB-KATEGORI ({currentCategory.name.toUpperCase()}):
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {/* All subcategories pill */}
                            <button
                                type="button"
                                onClick={() => setActiveSubCategory('all')}
                                className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 border-ink transition-all active:translate-x-0.5 active:translate-y-0.5 ${
                                    activeSubCategory === 'all'
                                        ? 'bg-brand text-white shadow-sketch-xs scale-102'
                                        : 'bg-white text-ink hover:bg-brand-subtle shadow-sketch-xs'
                                }`}
                            >
                                Semua Subkategori
                            </button>

                            {availableSubCategories.map((sub) => {
                                const isSubActive = String(activeSubCategory) === String(sub.id) || activeSubCategory === sub.slug;
                                const subCount = products.filter(p => p.sub_category_id === sub.id).length;

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
                                        <span>{sub.name}</span>
                                        <span className="ml-1 opacity-70 font-mono text-[10px]">({subCount})</span>
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
                            <div className="w-14 h-14 rounded-full bg-brand-subtle border-2 border-ink shadow-sketch-xs mx-auto flex items-center justify-center mb-3">
                                {searchQuery ? (
                                    <Search className="w-6 h-6 text-ink stroke-[2.5]" />
                                ) : (
                                    <PackageOpen className="w-6 h-6 text-brand stroke-[2.5]" />
                                )}
                            </div>
                            <h3 className="font-black text-base text-ink">
                                {searchQuery ? 'Tidak Ada Produk yang Cocok' : 'Belum Ada Produk di Kategori Ini'}
                            </h3>
                            <p className="text-xs text-ink-muted mt-1 max-w-sm mx-auto">
                                {searchQuery
                                    ? 'Coba pilih sub-kategori lain atau bersihkan kata kunci pencarian Anda.'
                                    : 'Produk akan segera ditampilkan setelah ditambahkan oleh admin toko.'}
                            </p>
                            {(searchQuery || activeCategory !== 'all') && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearchQuery('');
                                        setActiveCategory('all');
                                        setActiveSubCategory('all');
                                    }}
                                    className="sketch-btn px-4 py-2 mt-4 bg-brand text-white text-xs font-bold rounded-xl border-2 border-ink shadow-sketch-xs"
                                >
                                    Reset Filter
                                </button>
                            )}
                        </div>
                    )}
                </div>

            </div>
        </MainLayout>
    );
}
