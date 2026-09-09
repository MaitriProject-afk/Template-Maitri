import React from 'react';
import { 
    Zap, 
    ShieldCheck, 
    CreditCard, 
    ArrowRight, 
    Flame, 
    Sparkles, 
    Clock, 
    Search
} from 'lucide-react';

export default function HeroBanner({ onOpenTracking, onSelectCategory }) {
    return (
        <section className="relative overflow-hidden pt-6 pb-8 md:pt-10 md:pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero Grid Container */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    
                    {/* Left Column: Big Sketchbook Card (7 cols) */}
                    <div className="lg:col-span-7 sketch-card bg-paper-grid p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
                        {/* Doodle Decorative Tape/Pin on Top Left */}
                        <div className="absolute -top-3 left-8 w-20 h-6 bg-sketch-yellow/80 border-2 border-ink -rotate-3 z-10 shadow-sm hidden sm:block"></div>
                        
                        <div>
                            {/* Hand-drawn Accent Badge */}
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-accent border-2 border-ink shadow-sketch-xs text-xs font-bold font-mono uppercase mb-5">
                                <Zap className="w-3.5 h-3.5 fill-ink" />
                                <span>Platform Top Up #1 Indonesia</span>
                            </div>

                            {/* Main Headline */}
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-ink tracking-tight leading-[1.15] mb-4">
                                Top Up Game & PPOB <br className="hidden sm:inline" />
                                <span className="relative inline-block mt-1">
                                    <span className="relative z-10 text-ink">Murah, Cepat & Legal</span>
                                    <span className="absolute bottom-1.5 left-0 w-full h-3.5 bg-brand-accent -rotate-1 -z-0 rounded-sm"></span>
                                </span>
                            </h1>

                            {/* Subtitle / Sketch Note */}
                            <p className="text-ink-light text-base sm:text-lg mb-6 leading-relaxed max-w-xl">
                                Layanan top up game online terpercaya dengan sistem otomatis 24 jam. Tanpa ribet login, diamond & voucher langsung mendarat ke akun kamu!
                            </p>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap items-center gap-3.5 pt-2">
                                <a
                                    href="#katalog"
                                    className="sketch-btn px-6 py-3.5 bg-brand hover:bg-brand-hover text-white font-bold text-sm sm:text-base rounded-xl inline-flex items-center gap-2 group"
                                >
                                    <span>Pilih Game Sekarang</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </a>

                                <button
                                    type="button"
                                    onClick={onOpenTracking}
                                    className="sketch-btn px-5 py-3.5 bg-white hover:bg-paper-dark text-ink font-bold text-sm sm:text-base rounded-xl inline-flex items-center gap-2"
                                >
                                    <Search className="w-4 h-4" />
                                    <span>Lacak Pesanan</span>
                                </button>
                            </div>
                        </div>

                        {/* Hand-written Note at bottom */}
                        <div className="mt-8 pt-5 border-t-2 border-dashed border-ink/30 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-ink-muted">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-ping"></span>
                                <span className="font-bold text-ink">Server Online: 99.9% Uptime</span>
                            </div>
                            <span className="font-sketch text-ink font-bold text-sm">
                                ✍️ "Cepatnya bikin takjub!"
                            </span>
                        </div>
                    </div>

                    {/* Right Column: 3 Sketch Highlight Cards (5 cols) */}
                    <div className="lg:col-span-5 flex flex-col justify-between gap-4">
                        
                        {/* Feature 1 */}
                        <div className="sketch-card p-5 bg-white flex items-start gap-4 hover:-translate-y-1 transition-transform">
                            <div className="w-12 h-12 rounded-xl bg-sketch-yellow border-2 border-ink shadow-sketch-xs flex items-center justify-center shrink-0">
                                <Clock className="w-6 h-6 text-ink stroke-[2.5]" />
                            </div>
                            <div>
                                <h2 className="font-extrabold text-ink text-base mb-1 flex items-center gap-1.5">
                                    <span>Otomatis 1-3 Detik</span>
                                    <span className="text-[10px] bg-brand-subtle text-brand-navy font-mono font-bold px-1.5 py-0.5 rounded border border-ink">KILAT</span>
                                </h2>
                                <p className="text-xs text-ink-muted leading-relaxed">
                                    Didukung bot transaksi otomatis berkecepatan tinggi tanpa perlu konfirmasi manual admin.
                                </p>
                            </div>
                        </div>

                        {/* Feature 2 */}
                        <div className="sketch-card p-5 bg-white flex items-start gap-4 hover:-translate-y-1 transition-transform">
                            <div className="w-12 h-12 rounded-xl bg-sketch-coral border-2 border-ink shadow-sketch-xs flex items-center justify-center shrink-0">
                                <ShieldCheck className="w-6 h-6 text-ink stroke-[2.5]" />
                            </div>
                            <div>
                                <h2 className="font-extrabold text-ink text-base mb-1 flex items-center gap-1.5">
                                    <span>100% Legal & Bergaransi</span>
                                    <span className="text-[10px] bg-ink text-white font-mono font-bold px-1.5 py-0.5 rounded border border-ink">RESMI</span>
                                </h2>
                                <p className="text-xs text-ink-muted leading-relaxed">
                                    Sumber resmi dari publisher game langsung, akun aman dari suspend dan minus diamond.
                                </p>
                            </div>
                        </div>

                        {/* Feature 3 */}
                        <div className="sketch-card p-5 bg-white flex items-start gap-4 hover:-translate-y-1 transition-transform">
                            <div className="w-12 h-12 rounded-xl bg-sketch-sky border-2 border-ink shadow-sketch-xs flex items-center justify-center shrink-0">
                                <CreditCard className="w-6 h-6 text-ink stroke-[2.5]" />
                            </div>
                            <div>
                                <h2 className="font-extrabold text-ink text-base mb-1 flex items-center gap-1.5">
                                    <span>Metode Bayar Lengkap</span>
                                    <span className="text-[10px] bg-sketch-purple text-ink font-mono font-bold px-1.5 py-0.5 rounded border border-ink">QRIS</span>
                                </h2>
                                <p className="text-xs text-ink-muted leading-relaxed">
                                    Dukung QRIS seluruh bank, Virtual Account (BCA, BRI, Mandiri, BNI), E-Wallet, hingga Alfamart/Indomaret.
                                </p>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
}
