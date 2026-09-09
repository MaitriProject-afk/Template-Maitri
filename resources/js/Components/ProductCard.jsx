import React from 'react';
import { Zap, ArrowRight, ShieldCheck, Gamepad2 } from 'lucide-react';

export default function ProductCard({ product, onSelect }) {
    const minPriceText = product.formatted_min_price && product.min_price > 0
        ? `Mulai ${product.formatted_min_price}`
        : (product.discount || '⚡ Proses Kilat');

    return (
        <div 
            onClick={() => onSelect && onSelect(product)}
            className="sketch-card bg-white p-3.5 sm:p-4 cursor-pointer flex flex-col justify-between group relative overflow-hidden transition-all hover:-translate-y-1"
        >
            {/* Top Badge: Category or Brand */}
            <div className="flex items-center justify-between gap-2 mb-2.5">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-ink shadow-sketch-xs bg-brand-subtle text-brand-navy truncate max-w-[120px]">
                    {product.category_name || product.brand || 'Layanan'}
                </span>
                <span className="text-[11px] font-mono font-semibold text-ink-muted flex items-center gap-1 shrink-0">
                    <Zap className="w-3 h-3 text-brand fill-brand" />
                    1–3 Detik
                </span>
            </div>

            {/* Thumbnail Banner Illustration */}
            <div className="w-full h-28 sm:h-32 rounded-xl bg-gradient-to-br from-brand via-brand-navy to-ink border-2 border-ink shadow-sketch-xs flex flex-col items-center justify-center p-3 relative overflow-hidden group-hover:scale-[1.02] transition-transform">
                {product.thumbnail ? (
                    <img 
                        src={product.thumbnail} 
                        alt={product.name} 
                        className="w-full h-full object-cover rounded-lg"
                    />
                ) : (
                    <>
                        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:8px_8px]"></div>
                        <Gamepad2 className="w-8 h-8 text-white/80 mb-1" />
                        <span className="text-sm sm:text-base font-black text-white tracking-wider drop-shadow-md font-sans text-center line-clamp-1 px-1">
                            {product.name}
                        </span>
                        <span className="text-[9px] font-mono uppercase bg-black/40 text-white px-2 py-0.5 rounded-full border border-white/30 mt-1 backdrop-blur-xs">
                            {product.brand || 'MAITRI'}
                        </span>
                    </>
                )}
            </div>

            {/* Product Info */}
            <div className="mt-3 flex-1 flex flex-col justify-between">
                <div>
                    <h2 className="font-extrabold text-ink text-sm sm:text-base leading-tight group-hover:text-brand transition-colors line-clamp-1">
                        {product.name}
                    </h2>
                    <p className="text-xs text-ink-muted mt-0.5 line-clamp-1">
                        {product.tagline || (product.sub_category_name ? `${product.sub_category_name}` : 'Top Up Cepat & Legal')}
                    </p>
                </div>

                {/* Card Action Footer */}
                <div className="mt-3 pt-2.5 border-t-2 border-dashed border-ink/15 flex items-center justify-between">
                    <span className="text-[11px] font-mono font-black text-brand truncate max-w-[120px]">
                        {minPriceText}
                    </span>
                    <button
                        type="button"
                        className="sketch-btn px-3 py-1.5 bg-brand-subtle group-hover:bg-brand text-brand-navy group-hover:text-white text-xs font-bold rounded-lg flex items-center gap-1 transition-colors"
                    >
                        <span>Top Up</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
}
