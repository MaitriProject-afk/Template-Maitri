import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Gamepad2, Loader2, Frown } from 'lucide-react';
import { router } from '@inertiajs/react';
import axios from 'axios';

export default function SearchModal({ isOpen, onClose }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef(null);
    const searchTimeoutRef = useRef(null);

    // Fetch initial suggestions or searched products
    const fetchProducts = async (searchStr = '') => {
        setIsLoading(true);
        try {
            const response = await axios.get('/api/products/search', {
                params: { q: searchStr }
            });
            if (response.data && response.data.success) {
                setResults(response.data.data || []);
            }
        } catch (error) {
            console.error('Failed to search products:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchProducts('');
            setTimeout(() => inputRef.current?.focus(), 80);
        } else {
            setQuery('');
            setResults([]);
        }
    }, [isOpen]);

    // Debounced search when typing
    const handleQueryChange = (val) => {
        setQuery(val);
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
        searchTimeoutRef.current = setTimeout(() => {
            fetchProducts(val.trim());
        }, 250);
    };

    const handleSelect = (product) => {
        onClose();
        if (product?.slug) {
            router.visit(`/product/${product.slug}`);
        } else {
            router.visit(`/katalog?search=${encodeURIComponent(product.name)}`);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 bg-ink/75 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="relative w-full max-w-lg bg-white sketch-card p-4 sm:p-6 animate-in fade-in zoom-in-95 duration-150 shadow-sketch">
                
                {/* Search Header */}
                <div className="flex items-center gap-2 pb-3 border-b-2 border-ink">
                    <Search className="w-5 h-5 text-ink-muted shrink-0" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => handleQueryChange(e.target.value)}
                        placeholder="Cari game, pulsa, atau voucher..."
                        className="flex-1 bg-transparent border-0 text-sm sm:text-base font-bold text-ink focus:ring-0 placeholder:text-ink-muted/60 p-0"
                    />
                    {isLoading && (
                        <Loader2 className="w-4 h-4 text-brand animate-spin shrink-0" />
                    )}
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg hover:bg-paper-dark text-ink transition-colors"
                        title="Tutup"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Search Results / Suggestions */}
                <div className="mt-3 max-h-80 overflow-y-auto no-scrollbar divide-y divide-ink/10">
                    <div className="text-[11px] font-mono font-bold text-ink-muted uppercase py-1 flex items-center justify-between">
                        <span>{query ? `Hasil Pencarian (${results.length})` : '🔥 Rekomendasi Game & Layanan'}</span>
                    </div>

                    {results.length > 0 ? (
                        results.map((product) => (
                            <div
                                key={product.id}
                                onClick={() => handleSelect(product)}
                                className="py-2.5 px-2 flex items-center justify-between hover:bg-brand-accent/20 rounded-xl cursor-pointer transition-colors group"
                            >
                                <div className="flex items-center gap-3 min-w-0 pr-2">
                                    <div className="w-10 h-10 rounded-xl border-2 border-ink bg-white overflow-hidden shrink-0 flex items-center justify-center">
                                        {product.thumbnail ? (
                                            <img 
                                                src={product.thumbnail} 
                                                alt={product.name} 
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                                            />
                                        ) : (
                                            <Gamepad2 className="w-5 h-5 text-brand" />
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="font-bold text-xs sm:text-sm text-ink truncate leading-tight">
                                            {product.name}
                                        </h4>
                                        <div className="flex items-center gap-2 mt-0.5 text-[10px] text-ink-muted font-medium">
                                            <span className="truncate">{product.category}</span>
                                            <span>•</span>
                                            <span className="font-bold font-mono text-brand">
                                                Mulai {product.formatted_min_price}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    type="button"
                                    className="sketch-btn px-2.5 py-1 bg-brand text-white text-[11px] font-bold rounded-lg flex items-center gap-1 shrink-0"
                                >
                                    <span>Top Up</span>
                                    <ArrowRight className="w-3 h-3" />
                                </button>
                            </div>
                        ))
                    ) : (
                        !isLoading && (
                            <div className="py-8 text-center text-ink-muted">
                                <Frown className="w-8 h-8 mx-auto mb-2 text-ink-muted/60" />
                                <p className="text-xs font-bold text-ink">Produk Tidak Ditemukan</p>
                                <p className="text-[11px] mt-0.5">
                                    Tidak ada game atau voucher yang cocok dengan "{query}".
                                </p>
                            </div>
                        )
                    )}
                </div>

                {/* Footer Tip */}
                <div className="mt-4 pt-3 border-t border-ink/10 flex items-center justify-between text-[11px] font-mono text-ink-muted">
                    <span>Pilih produk untuk langsung top up</span>
                    <button
                        type="button"
                        onClick={() => {
                            onClose();
                            router.visit(`/katalog?search=${encodeURIComponent(query)}`);
                        }}
                        className="text-brand font-bold underline hover:text-brand-hover"
                    >
                        Lihat di Katalog →
                    </button>
                </div>

            </div>
        </div>
    );
}
