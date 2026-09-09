import React, { useMemo } from 'react';
import ProductCard from './ProductCard';
import CategoryTabs from './CategoryTabs';
import { Search, Flame, Sparkles, Frown, Layers, ChevronRight, PackageOpen } from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function ProductGrid({ 
    categories = [],
    products = [], 
    activeCategory, 
    onSelectCategory, 
    searchQuery, 
    onSearchChange,
    onSelectProduct,
    maxItems = 10
}) {
    // Filter products by category & search term
    const filteredProducts = useMemo(() => {
        return products.filter((item) => {
            const matchesCategory = 
                activeCategory === 'all' || item.category === activeCategory;
            
            const q = (searchQuery || '').toLowerCase();
            const matchesSearch = 
                !q || 
                (item.name && item.name.toLowerCase().includes(q)) ||
                (item.brand && item.brand.toLowerCase().includes(q)) ||
                (item.category_name && item.category_name.toLowerCase().includes(q)) ||
                (item.tagline && item.tagline.toLowerCase().includes(q));

            return matchesCategory && matchesSearch;
        });
    }, [products, activeCategory, searchQuery]);

    const displayedProducts = useMemo(() => {
        return maxItems ? filteredProducts.slice(0, maxItems) : filteredProducts;
    }, [filteredProducts, maxItems]);

    return (
        <section id="katalog" className="py-8 scroll-mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-sketch-yellow border-2 border-ink shadow-sketch-xs text-xs font-mono font-bold mb-2">
                            <Flame className="w-3.5 h-3.5 fill-ink" /> PRODUK PILIHAN TOP
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">
                            Pilih Game & Layanan Top Up
                        </h2>
                        <p className="text-sm text-ink-muted mt-1 font-medium">
                            Produk terpopuler pilihan kami. Temukan seluruh produk di halaman katalog lengkap.
                        </p>
                    </div>

                    {/* Search input within catalog */}
                    <div className="w-full md:w-72">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ink-muted">
                                <Search className="w-4 h-4" />
                            </div>
                            <input
                                type="text"
                                value={searchQuery || ''}
                                onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                                placeholder="Cari nama game / produk..."
                                className="w-full pl-9 pr-4 py-2 bg-white border-2 border-ink rounded-xl shadow-sketch-xs text-xs sm:text-sm font-medium focus:ring-0 focus:border-ink focus:shadow-sketch"
                            />
                        </div>
                    </div>
                </div>

                {/* Category Pills Slider */}
                {categories.length > 0 && (
                    <div className="mb-6">
                        <CategoryTabs 
                            categories={categories}
                            activeCategory={activeCategory} 
                            onSelectCategory={onSelectCategory} 
                        />
                    </div>
                )}

                {/* Grid of Products */}
                {displayedProducts.length > 0 ? (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4 md:gap-5">
                            {displayedProducts.map((product) => (
                                <ProductCard 
                                    key={product.id} 
                                    product={product} 
                                    onSelect={onSelectProduct}
                                />
                            ))}
                        </div>

                        {/* CTA button to see all products in catalog page */}
                        <div className="mt-8 text-center">
                            <Link
                                href="/katalog"
                                className="sketch-btn px-6 py-3.5 bg-brand hover:bg-brand-hover text-white text-sm font-black rounded-2xl inline-flex items-center gap-2 border-2 border-ink shadow-sketch transition-all hover:scale-102"
                            >
                                <Layers className="w-4 h-4" />
                                <span>Lihat Semua Produk di Halaman Katalog</span>
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </>
                ) : (
                    /* Empty state in Sketchbook style */
                    <div className="sketch-card p-10 text-center bg-paper-grid max-w-md mx-auto my-8">
                        <div className="w-16 h-16 rounded-full bg-brand-subtle border-2 border-ink shadow-sketch-xs mx-auto flex items-center justify-center mb-3">
                            {searchQuery ? (
                                <Frown className="w-8 h-8 text-ink stroke-[2]" />
                            ) : (
                                <PackageOpen className="w-8 h-8 text-brand stroke-[2]" />
                            )}
                        </div>
                        <h3 className="font-extrabold text-lg text-ink">
                            {searchQuery ? 'Produk Tidak Ditemukan' : 'Belum Ada Produk Ditambahkan'}
                        </h3>
                        <p className="text-xs text-ink-muted mt-1 max-w-xs mx-auto">
                            {searchQuery
                                ? `Tidak ada game atau produk yang cocok dengan "${searchQuery}".`
                                : 'Katalog produk toko akan segera tersedia setelah admin menambahkan produk.'}
                        </p>
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => {
                                    onSearchChange('');
                                    onSelectCategory('all');
                                }}
                                className="sketch-btn px-4 py-2 bg-brand text-white font-bold text-xs rounded-xl mt-4 inline-flex items-center gap-1.5 border-2 border-ink shadow-sketch-xs"
                            >
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Reset Pencarian</span>
                            </button>
                        )}
                    </div>
                )}

            </div>
        </section>
    );
}
