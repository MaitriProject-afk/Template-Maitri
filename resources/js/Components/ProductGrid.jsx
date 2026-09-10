import React from 'react';
import ProductCard from './ProductCard';
import { Flame, Layers, ChevronRight, PackageOpen } from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function ProductGrid({ 
    products = [], 
    onSelectProduct,
    maxItems = 10
}) {
    const displayedProducts = maxItems ? products.slice(0, maxItems) : products;

    return (
        <section id="katalog" className="py-8 scroll-mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-sketch-yellow border-2 border-ink shadow-sketch-xs text-xs font-mono font-bold mb-2">
                            <Flame className="w-3.5 h-3.5 fill-ink" /> PRODUK PILIHAN TOP
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">
                            Pilih Game & Layanan Top Up
                        </h2>
                        <p className="text-sm text-ink-muted mt-1 font-medium">
                            10 rekomendasi pilihan yang diperbarui setiap saat. Temukan ribuan produk lainnya di katalog.
                        </p>
                    </div>

                    <div className="shrink-0">
                        <Link
                            href="/katalog"
                            className="sketch-btn px-4 py-2.5 bg-paper hover:bg-paper-dark text-ink border-2 border-ink shadow-sketch-xs rounded-xl text-xs sm:text-sm font-bold inline-flex items-center gap-1.5 transition-all"
                        >
                            <Layers className="w-4 h-4 text-brand" />
                            <span>Buka Katalog Lengkap</span>
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>

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
                            <PackageOpen className="w-8 h-8 text-brand stroke-[2]" />
                        </div>
                        <h3 className="font-extrabold text-lg text-ink">
                            Belum Ada Produk Ditambahkan
                        </h3>
                        <p className="text-xs text-ink-muted mt-1 max-w-xs mx-auto">
                            Katalog produk toko akan segera tersedia setelah admin menambahkan produk.
                        </p>
                    </div>
                )}

            </div>
        </section>
    );
}
