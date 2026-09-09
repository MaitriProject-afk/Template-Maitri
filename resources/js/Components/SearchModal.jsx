import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Zap, ArrowRight } from 'lucide-react';

export default function SearchModal({ isOpen, onClose, products, onSelectProduct }) {
    const [query, setQuery] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 50);
        } else {
            setQuery('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const results = query
        ? products.filter(
              (p) =>
                  p.name.toLowerCase().includes(query.toLowerCase()) ||
                  p.publisher.toLowerCase().includes(query.toLowerCase())
          )
        : products.slice(0, 6);

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 bg-ink/75 backdrop-blur-xs">
            <div className="relative w-full max-w-lg bg-white sketch-card p-4 sm:p-6 animate-in fade-in zoom-in-95 duration-150">
                
                {/* Search Header */}
                <div className="flex items-center gap-2 pb-3 border-b-2 border-ink">
                    <Search className="w-5 h-5 text-ink-muted" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Ketik nama game atau voucher..."
                        className="flex-1 bg-transparent border-0 text-sm sm:text-base font-bold text-ink focus:ring-0 placeholder:text-ink-muted/60 p-0"
                    />
                    <button
                        onClick={onClose}
                        className="p-1 rounded-md hover:bg-paper-dark text-ink"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Search Results / Suggestions */}
                <div className="mt-3 max-h-80 overflow-y-auto no-scrollbar divide-y divide-ink/10">
                    <div className="text-[11px] font-mono font-bold text-ink-muted uppercase py-1">
                        {query ? `Hasil Pencarian (${results.length})` : '🔥 Game Paling Sering Dicari'}
                    </div>

                    {results.map((product) => (
                        <div
                            key={product.id}
                            onClick={() => {
                                onClose();
                                onSelectProduct(product);
                            }}
                            className="py-2.5 px-2 flex items-center justify-between hover:bg-brand-accent/20 rounded-lg cursor-pointer transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${product.bgGradient} border border-ink flex items-center justify-center text-white font-black text-xs`}>
                                    {product.thumbnailText}
                                </div>
                                <div>
                                    <h4 className="font-bold text-xs sm:text-sm text-ink leading-tight">
                                        {product.name}
                                    </h4>
                                    <span className="text-[10px] text-ink-muted font-medium">
                                        {product.publisher} • {product.tagline}
                                    </span>
                                </div>
                            </div>
                            <button className="sketch-btn px-2.5 py-1 bg-brand-accent text-ink text-[11px] font-bold rounded-md flex items-center gap-1">
                                <span>Top Up</span>
                                <ArrowRight className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Footer Tip */}
                <div className="mt-4 pt-3 border-t border-ink/10 flex items-center justify-between text-[11px] font-mono text-ink-muted">
                    <span>Tekan produk untuk langsung membuka form top up</span>
                    <kbd className="px-1.5 py-0.5 bg-paper-dark border border-ink/30 rounded text-[10px]">
                        ESC untuk tutup
                    </kbd>
                </div>

            </div>
        </div>
    );
}
