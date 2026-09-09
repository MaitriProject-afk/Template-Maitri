import React from 'react';
import { Zap, Sparkles } from 'lucide-react';

export default function CatalogProductCard({ product, onSelect }) {
    const renderBrandVisual = () => {
        switch (product.brandType) {
            case 'telkomsel':
                return (
                    <div className="w-full h-full bg-gradient-to-br from-red-600 to-rose-700 flex flex-col items-center justify-center p-2">
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-inner border-2 border-ink/20">
                            <span className="text-red-600 font-black text-2xl tracking-tighter">T</span>
                        </div>
                        <span className="text-[10px] font-bold text-white tracking-wider mt-1 uppercase">Telkomsel</span>
                    </div>
                );
            case 'indosat':
                return (
                    <div className="w-full h-full bg-amber-400 flex flex-col items-center justify-center p-2">
                        <div className="text-center">
                            <div className="font-black text-red-600 text-sm tracking-tight leading-none">indosat</div>
                            <div className="font-extrabold text-red-700 text-xs tracking-widest mt-0.5">ooredoo</div>
                        </div>
                    </div>
                );
            case 'axis':
                return (
                    <div className="w-full h-full bg-purple-700 flex items-center justify-center p-2">
                        <div className="bg-purple-800 px-3 py-1.5 rounded-lg border border-purple-400/40 shadow-inner">
                            <span className="text-white font-black text-lg tracking-wider">AXIS</span>
                        </div>
                    </div>
                );
            case 'smartfren':
                return (
                    <div className="w-full h-full bg-white flex items-center justify-center p-2">
                        <div className="flex items-center gap-1 font-black text-ink text-sm">
                            <span>smartfren</span>
                            <span className="w-2 h-2 rounded-full bg-red-600 inline-block"></span>
                        </div>
                    </div>
                );
            case 'xl':
                return (
                    <div className="w-full h-full bg-blue-600 flex items-center justify-center p-2">
                        <span className="text-lime-300 font-black text-2xl tracking-tight">XL</span>
                    </div>
                );
            case 'tri':
                return (
                    <div className="w-full h-full bg-white flex items-center justify-center p-2">
                        <div className="w-10 h-10 rounded-full border-2 border-ink flex items-center justify-center bg-black text-white font-black text-xl">
                            3
                        </div>
                    </div>
                );
            case 'byu':
                return (
                    <div className="w-full h-full bg-sky-500 flex items-center justify-center p-2">
                        <span className="text-white font-black text-xl tracking-tight italic">by.U</span>
                    </div>
                );
            case 'pln':
                return (
                    <div className="w-full h-full bg-amber-400 flex flex-col items-center justify-center p-2">
                        <Zap className="w-8 h-8 fill-red-600 text-red-600" />
                        <span className="text-ink font-black text-xs mt-1">PLN</span>
                    </div>
                );
            case 'dana':
                return (
                    <div className="w-full h-full bg-blue-500 flex items-center justify-center p-2">
                        <span className="text-white font-black text-xl tracking-wider">DANA</span>
                    </div>
                );
            case 'gopay':
                return (
                    <div className="w-full h-full bg-emerald-500 flex items-center justify-center p-2">
                        <span className="text-white font-black text-xl tracking-tight">gopay</span>
                    </div>
                );
            case 'ovo':
                return (
                    <div className="w-full h-full bg-purple-800 flex items-center justify-center p-2">
                        <span className="text-white font-black text-xl tracking-widest">OVO</span>
                    </div>
                );
            case 'shopeepay':
                return (
                    <div className="w-full h-full bg-orange-500 flex items-center justify-center p-2">
                        <span className="text-white font-black text-sm tracking-tight text-center leading-tight">Shopee<br/>Pay</span>
                    </div>
                );
            case 'steam':
                return (
                    <div className="w-full h-full bg-slate-900 flex items-center justify-center p-2">
                        <span className="text-white font-mono font-black text-base tracking-wider">STEAM</span>
                    </div>
                );
            case 'google-play':
                return (
                    <div className="w-full h-full bg-emerald-600 flex items-center justify-center p-2">
                        <span className="text-white font-black text-xs text-center uppercase leading-tight">Google<br/>Play</span>
                    </div>
                );
            case 'garena':
                return (
                    <div className="w-full h-full bg-red-600 flex items-center justify-center p-2">
                        <span className="text-white font-black text-sm uppercase">Garena</span>
                    </div>
                );
            default:
                // Games
                return (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-700 via-blue-800 to-slate-900 flex flex-col items-center justify-center p-2 text-white">
                        <span className="font-black text-lg sm:text-xl font-mono tracking-wider">{product.name.slice(0, 4).toUpperCase()}</span>
                        <span className="text-[9px] font-bold text-white/80 uppercase mt-0.5">{product.publisher}</span>
                    </div>
                );
        }
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
                        {product.badge || 'Resmi'}
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
                    <span>{product.processTime || '⚡ 1 Detik'}</span>
                </div>
            </div>
        </div>
    );
}
