import React from 'react';
import { 
    Flame, 
    Gamepad2, 
    Ticket, 
    Smartphone, 
    Zap, 
    Wallet 
} from 'lucide-react';

export const CATEGORIES = [
    { id: 'all', name: 'Semua Produk', icon: Flame, badge: 'HOT' },
    { id: 'games', name: 'Game Populer', icon: Gamepad2, badge: '25+' },
    { id: 'voucher', name: 'Voucher Digital', icon: Ticket, badge: 'Murah' },
    { id: 'pulsa', name: 'Pulsa & Data', icon: Smartphone, badge: 'Promo' },
    { id: 'pln', name: 'Listrik & PPOB', icon: Zap, badge: 'Instan' },
    { id: 'emoney', name: 'E-Money', icon: Wallet, badge: 'Bebas Admin' },
];

export default function CategoryTabs({ activeCategory, onSelectCategory }) {
    return (
        <div className="w-full overflow-x-auto no-scrollbar py-2">
            <div className="flex items-center gap-2.5 min-w-max">
                {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const isActive = activeCategory === cat.id;

                    return (
                        <button
                            key={cat.id}
                            type="button"
                            onClick={() => onSelectCategory(cat.id)}
                            className={`sketch-btn px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
                                isActive
                                    ? 'bg-brand text-white shadow-sketch'
                                    : 'bg-white text-ink hover:bg-paper-dark'
                            }`}
                        >
                            <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-brand'}`} />
                            <span>{cat.name}</span>
                            {cat.badge && (
                                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                                    isActive 
                                        ? 'bg-white/20 text-white border-white/40' 
                                        : 'bg-paper-dark text-ink-muted border-ink/20'
                                }`}>
                                    {cat.badge}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
