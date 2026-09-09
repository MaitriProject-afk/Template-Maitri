import React from 'react';
import { Zap, Sparkles, Gamepad2 } from 'lucide-react';

export default function CatalogProductCard({ product, onSelect }) {
    const renderBrandVisual = () => {
        if (product.thumbnail) {
            return (
                <img 
                    src={product.thumbnail} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                />
            );
        }

        return (
            <div className="w-full h-full bg-gradient-to-br from-brand via-brand-navy to-ink flex flex-col items-center justify-center p-2 text-white">
                <Gamepad2 className="w-7 h-7 text-white/80 mb-1" />
                <span className="font-black text-sm sm:text-base font-mono tracking-wider text-center line-clamp-1">
                    {product.name}
                </span>
                <span className="text-[9px] font-bold text-white/80 uppercase mt-0.5">
                    {product.brand || product.category_name || 'Layanan'}
                </span>
            </div>
        );
    };

    return (
        <div 
            onClick={() => onSelect && onSelect(product)}
            className="sketch-card bg-white rounded-2xl border-2 border-ink shadow-sketch p-3 sm:p-4 text-center cursor-pointer hover:-translate-y-1 transition-all group flex flex-col items-center justify-between"
        >
            {/* Visual Box with badge */}
            <div className="w-full aspect-square rounded-xl border-2 border-ink overflow-hidden relative shadow-sketch-xs bg-paper-dark flex items-center justify-center">
                {/* Category mini badge at top of box */}
                <div className="absolute top-1.5 left-1.5 right-1.5 z-10 flex justify-center">
                    <span className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-md bg-brand-subtle text-brand-navy border border-ink shadow-sketch-xs truncate max-w-full font-mono">
                        {product.category_name || product.brand || 'Resmi'}
                    </span>
                </div>

                {/* Main Visual Logo */}
                {renderBrandVisual()}
            </div>

            {/* Product Title & Action */}
            <div className="mt-2.5 w-full">
                <h3 className="text-xs sm:text-sm font-black text-ink group-hover:text-brand transition-colors line-clamp-1">
                    {product.name}
                </h3>
                <div className="flex items-center justify-center gap-1 mt-1 text-[10px] font-mono text-ink-muted">
                    {product.formatted_min_price && product.min_price > 0 ? (
                        <span className="text-brand font-black">{product.formatted_min_price}</span>
                    ) : (
                        <span>⚡ Proses 1-3 Detik</span>
                    )}
                </div>
            </div>
        </div>
    );
}
