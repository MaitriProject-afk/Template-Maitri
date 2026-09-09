import React from 'react';
import { Zap, ArrowRight, ShieldCheck } from 'lucide-react';

export default function ProductCard({ product, onSelect }) {
    return (
        <div 
            onClick={() => onSelect && onSelect(product)}
            className="sketch-card bg-white p-3.5 sm:p-4 cursor-pointer flex flex-col justify-between group relative overflow-hidden"
        >
            {/* Top Badge: Discount or Flash */}
            <div className="flex items-center justify-between gap-2 mb-2.5">
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-ink shadow-sketch-xs ${product.badgeColor || 'bg-brand-accent text-ink'}`}>
                    {product.badge}
                </span>
                <span className="text-[11px] font-mono font-semibold text-ink-muted flex items-center gap-1">
                    <Zap className="w-3 h-3 text-brand fill-brand" />
                    {product.processTime}
                </span>
            </div>

            {/* Thumbnail Banner Illustration */}
            <div className={`w-full h-28 sm:h-32 rounded-xl bg-gradient-to-br ${product.bgGradient} border-2 border-ink shadow-sketch-xs flex flex-col items-center justify-center p-3 relative overflow-hidden group-hover:scale-[1.02] transition-transform`}>
                {/* Decorative Paper Texture lines */}
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:8px_8px]"></div>
                
                {/* Game / Product Initial Art */}
                <span className="text-2xl sm:text-3xl font-black text-white tracking-wider drop-shadow-md font-sans">
                    {product.thumbnailText}
                </span>
                <span className="text-[10px] font-mono uppercase bg-black/40 text-white px-2 py-0.5 rounded-full border border-white/30 mt-1 backdrop-blur-xs">
                    {product.publisher}
                </span>
            </div>

            {/* Product Info */}
            <div className="mt-3 flex-1 flex flex-col justify-between">
                <div>
                    <h2 className="font-extrabold text-ink text-sm sm:text-base leading-tight group-hover:text-brand transition-colors line-clamp-1">
                        {product.name}
                    </h2>
                    <p className="text-xs text-ink-muted mt-0.5 line-clamp-1">
                        {product.tagline}
                    </p>
                </div>

                {/* Card Action Footer */}
                <div className="mt-3 pt-2.5 border-t-2 border-dashed border-ink/15 flex items-center justify-between">
                    <span className="text-[11px] font-sketch font-bold text-ink">
                        {product.discount}
                    </span>
                    <button
                        type="button"
                        className="sketch-btn px-3 py-1.5 bg-brand-subtle group-hover:bg-brand text-brand-navy group-hover:text-white text-xs font-bold rounded-lg flex items-center gap-1"
                    >
                        <span>Top Up</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
}
