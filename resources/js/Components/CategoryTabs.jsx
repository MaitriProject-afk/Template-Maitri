import React from 'react';
import { 
    Flame, 
    Gamepad2, 
    Ticket, 
    Smartphone, 
    Zap, 
    Wallet,
    Layers
} from 'lucide-react';

export default function CategoryTabs({ categories = [], activeCategory, onSelectCategory }) {
    // Generate tabs: prepend 'Semua Produk'
    const tabs = [
        { id: 'all', name: 'Semua Produk', icon: Flame },
        ...categories.map((c) => ({
            id: c.slug || String(c.id),
            name: c.name,
            icon: Layers,
        })),
    ];

    return (
        <div className="w-full overflow-x-auto no-scrollbar py-2">
            <div className="flex items-center gap-2.5 min-w-max">
                {tabs.map((cat) => {
                    const Icon = cat.icon || Layers;
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
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
