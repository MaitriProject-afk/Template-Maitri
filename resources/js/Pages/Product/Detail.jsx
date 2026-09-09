import React, { useState, useMemo, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { getProductDetailBySlug } from '@/data/productDataHelper';
import { 
    ArrowLeft, 
    ArrowRight,
    Zap, 
    ShieldCheck, 
    Sparkles, 
    Phone, 
    QrCode, 
    Check, 
    Copy, 
    Clock, 
    HelpCircle, 
    CheckCircle2, 
    AlertCircle, 
    Tag, 
    Share2, 
    MessageCircle,
    ChevronDown,
    Mail,
    Lock,
    ExternalLink
} from 'lucide-react';

export default function ProductDetail({ slug = 'indosat', auth }) {
    const { site } = usePage().props;
    const siteName = site?.site_name || 'Maitri Project';
    const contactWhatsapp = site?.contact_whatsapp || '081234567890';
    const waNumber = contactWhatsapp.replace(/[^0-9]/g, '');
    const waUrl = waNumber.startsWith('0') ? `https://wa.me/62${waNumber.slice(1)}` : `https://wa.me/${waNumber}`;

    // Resolve product data
    const product = useMemo(() => {
        return getProductDetailBySlug(slug);
    }, [slug]);

    // Form states
    const [targetInput, setTargetInput] = useState('');
    const [zoneInput, setZoneInput] = useState('');
    const [serverInput, setServerInput] = useState(product.serverOptions ? product.serverOptions[0] : '');
    const [selectedCategory, setSelectedCategory] = useState('Semua');
    const [selectedItem, setSelectedItem] = useState(product.items[0] || null);
    const [whatsapp, setWhatsapp] = useState('');
    const [email, setEmail] = useState((auth?.user?.email) || '');
    const [promoCode, setPromoCode] = useState('');
    const [promoDiscount, setPromoDiscount] = useState(0);
    const [promoSuccess, setPromoSuccess] = useState(false);

    // Modal & Invoice states
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isQrisModalOpen, setIsQrisModalOpen] = useState(false);
    const [invoiceCode, setInvoiceCode] = useState('');
    const [countdownSeconds, setCountdownSeconds] = useState(900); // 15 minutes
    const [copiedInvoice, setCopiedInvoice] = useState(false);
    const [copiedTotal, setCopiedTotal] = useState(false);

    // Filter items by sub-category tab
    const filteredItems = useMemo(() => {
        if (selectedCategory === 'Semua') return product.items;
        return product.items.filter(item => item.category === selectedCategory);
    }, [product.items, selectedCategory]);

    // Calculations (QRIS 0.7% fee as requested)
    const basePrice = selectedItem ? selectedItem.price : 0;
    const qrisFee = Math.ceil(basePrice * 0.007);
    const totalPrice = Math.max(0, basePrice + qrisFee - promoDiscount);

    // Countdown timer for QRIS invoice
    useEffect(() => {
        let timer;
        if (isQrisModalOpen && countdownSeconds > 0) {
            timer = setInterval(() => {
                setCountdownSeconds(prev => (prev > 0 ? prev - 1 : 0));
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isQrisModalOpen, countdownSeconds]);

    // Format timer MM:SS
    const formattedTimer = useMemo(() => {
        const m = Math.floor(countdownSeconds / 60);
        const s = countdownSeconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }, [countdownSeconds]);

    // Format Rupiah
    const formatRp = (num) => {
        return 'Rp ' + Number(num).toLocaleString('id-ID');
    };

    // Apply promo voucher
    const handleApplyPromo = () => {
        if (!promoCode.trim()) return;
        const code = promoCode.trim().toUpperCase();
        if (code === 'MAITRIHEMAT' || code === 'MAITRI' || code === 'PROMO') {
            setPromoDiscount(2000);
            setPromoSuccess(true);
        } else {
            alert('Kode promo tidak valid atau sudah habis kuota. Coba gunakan: MAITRIHEMAT');
            setPromoDiscount(0);
            setPromoSuccess(false);
        }
    };

    // Form validation before checkout
    const handleCheckoutClick = () => {
        if (!targetInput.trim()) {
            alert(product.inputType === 'phone' ? 'Silakan masukkan nomor handphone tujuan.' : 'Silakan masukkan User ID akun Anda.');
            return;
        }
        if (!selectedItem) {
            alert('Silakan pilih nominal top-up yang Anda inginkan.');
            return;
        }
        if (!whatsapp.trim()) {
            alert('Silakan masukkan nomor WhatsApp untuk notifikasi dan bukti transaksi.');
            return;
        }
        setIsConfirmModalOpen(true);
    };

    // Confirm order & trigger QRIS payment
    const handleConfirmOrder = () => {
        setIsConfirmModalOpen(false);
        const newInvoice = 'INV-' + new Date().getFullYear() + String(Math.floor(100000 + Math.random() * 900000));
        setInvoiceCode(newInvoice);
        setCountdownSeconds(900);
        setIsQrisModalOpen(true);
    };

    // Visual helper for product logo
    const renderBrandVisual = () => {
        switch (product.brandType) {
            case 'indosat':
                return (
                    <div className="w-full h-full bg-amber-400 flex flex-col items-center justify-center p-3">
                        <div className="font-black text-red-600 text-xl tracking-tight leading-none">indosat</div>
                        <div className="font-extrabold text-red-700 text-xs tracking-widest mt-1">ooredoo</div>
                    </div>
                );
            case 'telkomsel':
                return (
                    <div className="w-full h-full bg-gradient-to-br from-red-600 to-rose-700 flex flex-col items-center justify-center p-3">
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-inner border-2 border-ink/20">
                            <span className="text-red-600 font-black text-2xl">T</span>
                        </div>
                        <span className="text-[11px] font-bold text-white tracking-wider mt-1 uppercase">Telkomsel</span>
                    </div>
                );
            case 'mlbb':
            case 'mobile-legends':
                return (
                    <div className="w-full h-full bg-gradient-to-br from-blue-700 via-indigo-800 to-slate-900 flex flex-col items-center justify-center p-3 text-white">
                        <span className="font-black text-2xl font-mono tracking-wider">MLBB</span>
                        <span className="text-[10px] font-bold text-white/80 uppercase mt-0.5">Moonton</span>
                    </div>
                );
            case 'ff':
            case 'free-fire':
                return (
                    <div className="w-full h-full bg-gradient-to-br from-amber-500 to-red-600 flex flex-col items-center justify-center p-3 text-white">
                        <span className="font-black text-2xl font-mono tracking-wider">FREE FIRE</span>
                        <span className="text-[10px] font-bold text-white/80 uppercase mt-0.5">Garena</span>
                    </div>
                );
            case 'pln':
                return (
                    <div className="w-full h-full bg-amber-400 flex flex-col items-center justify-center p-3">
                        <Zap className="w-10 h-10 fill-red-600 text-red-600" />
                        <span className="text-ink font-black text-sm mt-1">PLN Prabayar</span>
                    </div>
                );
            default:
                return (
                    <div className="w-full h-full bg-gradient-to-br from-brand via-brand-navy to-ink flex flex-col items-center justify-center p-3 text-white">
                        <span className="font-black text-xl font-mono tracking-wider">{product.name.slice(0, 8).toUpperCase()}</span>
                        <span className="text-[10px] font-bold text-white/80 uppercase mt-1">{product.publisher}</span>
                    </div>
                );
        }
    };

    // Mobile sticky bar component (matching user reference)
    const mobileStickyBar = (
        <div className="flex items-center justify-between gap-2 w-full">
            {/* Left: Item Name/Badge & Total */}
            <div className="flex flex-col justify-center min-w-0 pr-1">
                {selectedItem ? (
                    <>
                        <div className="flex items-center gap-1.5 min-w-0">
                            <span className="font-extrabold text-xs text-ink truncate max-w-[120px] sm:max-w-[150px]">
                                {selectedItem.name}
                            </span>
                            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-brand-subtle text-brand-navy border border-ink shadow-sketch-xs shrink-0">
                                QRIS
                            </span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-ink-muted leading-tight mt-0.5">
                            <span>TOTAL:</span>
                            <span className="font-black text-sm text-brand">{formatRp(totalPrice)}</span>
                        </div>
                    </>
                ) : (
                    <>
                        <span className="text-xs font-bold text-ink-muted truncate">
                            Pilih Item Top Up
                        </span>
                        <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-ink-muted leading-tight mt-0.5">
                            <span>TOTAL:</span>
                            <span className="font-black text-sm text-ink">{formatRp(0)}</span>
                        </div>
                    </>
                )}
            </div>

            {/* Right: Beli Sekarang Button */}
            <button
                type="button"
                onClick={handleCheckoutClick}
                className="sketch-btn px-3.5 py-2 bg-brand hover:bg-brand-hover text-white font-black text-xs rounded-full border-2 border-ink shadow-sketch-xs flex items-center gap-1 shrink-0 z-20 active:scale-95 transition-all"
            >
                <span>Beli Sekarang</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
        </div>
    );

    return (
        <MainLayout
            auth={auth}
            title={`${product.fullName || product.name} — Top Up Murah, Cepat & Legal | ${siteName}`}
            description={`Beli ${product.name} otomatis 24 jam nonstop proses 1-3 detik tercepat & termurah hanya dengan pembayaran QRIS.`}
            activeTab="katalog"
            stickyBar={mobileStickyBar}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
                
                {/* 1. Breadcrumb Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono font-bold">
                    <Link
                        href="/katalog"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border-2 border-ink shadow-sketch-xs text-ink hover:text-brand hover:bg-brand-subtle transition-all active:translate-x-0.5 active:translate-y-0.5"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Kembali ke Katalog</span>
                    </Link>

                    <div className="hidden sm:flex items-center gap-2 text-ink-muted">
                        <Link href="/" className="hover:text-ink">Beranda</Link>
                        <span>/</span>
                        <Link href="/katalog" className="hover:text-ink">Katalog</Link>
                        <span>/</span>
                        <span className="text-brand font-black">{product.name}</span>
                    </div>
                </div>

                {/* 2. Main 2-Column Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                    
                    {/* LEFT COLUMN: Product Info & Instructions (Sticky on Desktop) */}
                    <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-24">
                        
                        {/* Product Hero Info Card */}
                        <div className="sketch-card bg-paper-grid p-5 sm:p-6 rounded-3xl border-2 border-ink shadow-sketch">
                            {/* Visual Thumbnail */}
                            <div className="w-full aspect-video rounded-2xl border-2 border-ink shadow-sketch-xs overflow-hidden relative mb-4 bg-paper-dark">
                                {renderBrandVisual()}
                                <div className="absolute top-2.5 right-2.5">
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-white text-ink border border-ink text-[10px] font-mono font-bold shadow-sketch-xs">
                                        <Zap className="w-3 h-3 text-brand fill-brand" /> {product.badge}
                                    </span>
                                </div>
                            </div>

                            {/* Title & Badges */}
                            <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">
                                {product.name}
                            </h1>
                            <p className="text-xs font-mono font-bold text-ink-muted mt-0.5">
                                {product.publisher} • {product.category}
                            </p>

                            <div className="flex flex-wrap gap-2 mt-3">
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-brand-subtle text-brand-navy border border-ink text-[11px] font-bold font-mono">
                                    <Clock className="w-3 h-3" /> 1–3 Detik Otomatis
                                </span>
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-white text-ink border border-ink text-[11px] font-bold font-mono">
                                    <ShieldCheck className="w-3 h-3 text-emerald-600" /> 100% Legal
                                </span>
                            </div>

                            <div className="my-4 border-t-2 border-dashed border-ink/20"></div>

                            {/* Description Block */}
                            <div>
                                <h3 className="text-xs font-mono font-bold text-ink uppercase tracking-wider mb-2">
                                    Deskripsi Produk:
                                </h3>
                                <div className="text-xs text-ink/80 leading-relaxed whitespace-pre-line bg-white p-3.5 rounded-xl border-2 border-ink/30 font-sans">
                                    {product.description}
                                </div>
                            </div>
                        </div>

                        {/* Cara Top Up Card */}
                        <div className="sketch-card bg-white p-5 rounded-3xl border-2 border-ink shadow-sketch">
                            <h3 className="text-xs font-mono font-black text-ink uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                <Sparkles className="w-4 h-4 text-brand" /> 
                                Panduan Singkat Top Up:
                            </h3>
                            <ol className="space-y-2.5 text-xs text-ink/90 font-medium">
                                <li className="flex items-start gap-2">
                                    <span className="w-5 h-5 rounded-full bg-brand-subtle text-brand-navy border border-ink flex items-center justify-center text-[10px] font-mono font-bold shrink-0 mt-0.5">1</span>
                                    <span>Masukkan {product.inputLabel} secara teliti.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-5 h-5 rounded-full bg-brand-subtle text-brand-navy border border-ink flex items-center justify-center text-[10px] font-mono font-bold shrink-0 mt-0.5">2</span>
                                    <span>Pilih nominal top-up yang Anda butuhkan.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-5 h-5 rounded-full bg-brand-subtle text-brand-navy border border-ink flex items-center justify-center text-[10px] font-mono font-bold shrink-0 mt-0.5">3</span>
                                    <span>Pilih pembayaran <strong>QRIS (Semua Bank & E-Wallet)</strong>.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-5 h-5 rounded-full bg-brand-subtle text-brand-navy border border-ink flex items-center justify-center text-[10px] font-mono font-bold shrink-0 mt-0.5">4</span>
                                    <span>Masukkan nomor WhatsApp & klik <strong>Beli Sekarang</strong>.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-5 h-5 rounded-full bg-brand text-white border border-ink flex items-center justify-center text-[10px] font-mono font-bold shrink-0 mt-0.5">5</span>
                                    <span>Scan QR code QRIS, produk masuk otomatis 1–3 detik!</span>
                                </li>
                            </ol>
                        </div>

                        {/* CS Support Banner */}
                        <div className="sketch-card bg-brand-subtle p-4 rounded-2xl border-2 border-ink shadow-sketch-xs flex items-center justify-between gap-3">
                            <div>
                                <p className="text-xs font-black text-brand-navy">Butuh Bantuan Transaksi?</p>
                                <p className="text-[11px] text-ink-muted">Customer Service siap 24 jam</p>
                            </div>
                            <a 
                                href={waUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="sketch-btn px-3 py-1.5 bg-white text-ink border-2 border-ink text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sketch-xs shrink-0"
                            >
                                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                                <span>WhatsApp CS</span>
                            </a>
                        </div>

                    </div>

                    {/* RIGHT COLUMN: Multi-Step Order Form */}
                    <div className="lg:col-span-8 space-y-6">
                        
                        {/* STEP 1: Masukkan Data Akun / Nomor Tujuan */}
                        <div className="sketch-card bg-white p-5 sm:p-6 rounded-3xl border-2 border-ink shadow-sketch">
                            <div className="flex items-center gap-2.5 mb-4 pb-3 border-b-2 border-ink/10">
                                <span className="w-7 h-7 rounded-xl bg-brand text-white border-2 border-ink shadow-sketch-xs font-mono font-black text-xs flex items-center justify-center">
                                    01
                                </span>
                                <h2 className="text-base sm:text-lg font-black text-ink">
                                    Masukkan Data Tujuan
                                </h2>
                            </div>

                            {/* Field Types */}
                            {product.inputType === 'game_user_zone' ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                    <div>
                                        <label className="block text-xs font-mono font-bold uppercase tracking-wider text-ink mb-1.5">
                                            USER ID
                                        </label>
                                        <input
                                            type="text"
                                            value={targetInput}
                                            onChange={(e) => setTargetInput(e.target.value)}
                                            placeholder={product.inputPlaceholder || 'Cth: 12345678'}
                                            className="w-full px-4 py-2.5 bg-white border-2 border-ink rounded-xl shadow-sketch-xs focus:ring-0 focus:border-brand text-xs sm:text-sm font-semibold"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-mono font-bold uppercase tracking-wider text-ink mb-1.5">
                                            ZONE / SERVER ID
                                        </label>
                                        <input
                                            type="text"
                                            value={zoneInput}
                                            onChange={(e) => setZoneInput(e.target.value)}
                                            placeholder={product.inputPlaceholder2 || 'Cth: 2019'}
                                            className="w-full px-4 py-2.5 bg-white border-2 border-ink rounded-xl shadow-sketch-xs focus:ring-0 focus:border-brand text-xs sm:text-sm font-semibold"
                                        />
                                    </div>
                                </div>
                            ) : product.inputType === 'game_user_server' ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                    <div>
                                        <label className="block text-xs font-mono font-bold uppercase tracking-wider text-ink mb-1.5">
                                            USER ID (UID)
                                        </label>
                                        <input
                                            type="text"
                                            value={targetInput}
                                            onChange={(e) => setTargetInput(e.target.value)}
                                            placeholder={product.inputPlaceholder || 'Cth: 812345678'}
                                            className="w-full px-4 py-2.5 bg-white border-2 border-ink rounded-xl shadow-sketch-xs focus:ring-0 focus:border-brand text-xs sm:text-sm font-semibold"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-mono font-bold uppercase tracking-wider text-ink mb-1.5">
                                            PILIH SERVER
                                        </label>
                                        <select
                                            value={serverInput}
                                            onChange={(e) => setServerInput(e.target.value)}
                                            className="w-full px-4 py-2.5 bg-white border-2 border-ink rounded-xl shadow-sketch-xs focus:ring-0 focus:border-brand text-xs sm:text-sm font-semibold"
                                        >
                                            {product.serverOptions?.map(opt => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-ink mb-1.5">
                                        {product.inputLabel}
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-muted">
                                            <Phone className="w-4 h-4" />
                                        </div>
                                        <input
                                            type="tel"
                                            value={targetInput}
                                            onChange={(e) => setTargetInput(e.target.value.replace(/[^0-9]/g, ''))}
                                            placeholder={product.inputPlaceholder}
                                            className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white border-2 border-ink rounded-xl shadow-sketch-xs focus:ring-0 focus:border-brand text-xs sm:text-sm font-semibold"
                                        />
                                    </div>
                                </div>
                            )}

                            <p className="text-[11px] text-ink-muted mt-2">
                                ℹ️ {product.inputHelp}
                            </p>
                        </div>

                        {/* STEP 2: Pilih Nominal Top-Up */}
                        <div className="sketch-card bg-white p-5 sm:p-6 rounded-3xl border-2 border-ink shadow-sketch">
                            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b-2 border-ink/10">
                                <div className="flex items-center gap-2.5">
                                    <span className="w-7 h-7 rounded-xl bg-brand text-white border-2 border-ink shadow-sketch-xs font-mono font-black text-xs flex items-center justify-center">
                                        02
                                    </span>
                                    <h2 className="text-base sm:text-lg font-black text-ink">
                                        Pilih Nominal Top-Up
                                    </h2>
                                </div>

                                {/* Category Pills */}
                                {product.categories && product.categories.length > 1 && (
                                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                                        {product.categories.map((cat) => (
                                            <button
                                                key={cat}
                                                type="button"
                                                onClick={() => setSelectedCategory(cat)}
                                                className={`px-3 py-1 rounded-full text-xs font-bold border-2 border-ink transition-all ${
                                                    selectedCategory === cat
                                                        ? 'bg-brand text-white shadow-sketch-xs scale-102'
                                                        : 'bg-white text-ink hover:bg-brand-subtle'
                                                }`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Denominations Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-3.5">
                                {filteredItems.map((item) => {
                                    const isSelected = selectedItem?.id === item.id;
                                    return (
                                        <button
                                            key={item.id}
                                            type="button"
                                            onClick={() => setSelectedItem(item)}
                                            className={`p-3 sm:p-3.5 rounded-2xl border-2 border-ink text-left transition-all relative flex flex-col justify-between group active:scale-98 ${
                                                isSelected
                                                    ? 'bg-brand-subtle border-brand ring-2 ring-brand shadow-sketch-xs font-bold scale-[1.02]'
                                                    : 'bg-white hover:border-brand hover:bg-brand-subtle/20 shadow-sketch-xs'
                                            }`}
                                        >
                                            {/* Item Badge */}
                                            {item.badge && (
                                                <div className="mb-1.5">
                                                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border font-bold ${
                                                        isSelected 
                                                            ? 'bg-brand text-white border-brand' 
                                                            : 'bg-paper-dark text-ink border-ink'
                                                    }`}>
                                                        {item.badge}
                                                    </span>
                                                </div>
                                            )}

                                            <div>
                                                <p className="text-xs sm:text-sm font-black text-ink leading-snug line-clamp-2 group-hover:text-brand transition-colors">
                                                    {item.name}
                                                </p>
                                                <p className="text-xs sm:text-sm font-black font-mono text-brand mt-1.5">
                                                    {formatRp(item.price)}
                                                </p>
                                            </div>

                                            {/* Selection Check Circle */}
                                            <div className="mt-2 pt-2 border-t border-ink/10 flex items-center justify-between">
                                                <span className="text-[10px] font-sketch text-ink-muted">
                                                    ⚡ Proses Kilat
                                                </span>
                                                <div className={`w-4 h-4 rounded-full border-2 border-ink flex items-center justify-center ${
                                                    isSelected ? 'bg-brand text-white' : 'bg-white'
                                                }`}>
                                                    {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* STEP 3: Pilih Metode Pembayaran (HANYA QRIS) */}
                        <div className="sketch-card bg-white p-5 sm:p-6 rounded-3xl border-2 border-ink shadow-sketch">
                            <div className="flex items-center gap-2.5 mb-4 pb-3 border-b-2 border-ink/10">
                                <span className="w-7 h-7 rounded-xl bg-brand text-white border-2 border-ink shadow-sketch-xs font-mono font-black text-xs flex items-center justify-center">
                                    03
                                </span>
                                <div>
                                    <h2 className="text-base sm:text-lg font-black text-ink">
                                        Pilih Metode Pembayaran
                                    </h2>
                                    <p className="text-xs text-ink-muted">Pembayaran Instan & Otomatis via QRIS</p>
                                </div>
                            </div>

                            {/* QRIS Card (Active & Selected) */}
                            <div className="p-4 sm:p-5 rounded-2xl border-2 border-brand bg-brand-subtle/50 ring-2 ring-brand shadow-sketch-xs">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div className="flex items-start gap-3.5">
                                        <div className="w-12 h-12 rounded-xl bg-white border-2 border-ink shadow-sketch-xs flex items-center justify-center shrink-0">
                                            <QrCode className="w-7 h-7 text-brand stroke-[2.5]" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-black text-ink text-sm sm:text-base">
                                                    QRIS Realtime (Semua E-Wallet & Bank)
                                                </h3>
                                                <span className="px-2 py-0.5 rounded-md bg-brand text-white text-[10px] font-mono font-bold">
                                                    OTOMATIS
                                                </span>
                                            </div>
                                            <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                                                BCA, Mandiri, BRI, BNI, DANA, GoPay, OVO, ShopeePay, LinkAja & Semua Mobile Banking.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Fee & Checkmark */}
                                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 border-ink/10 pt-2 sm:pt-0 shrink-0">
                                        <div className="text-right">
                                            <span className="text-[10px] font-mono uppercase text-ink-muted font-bold block">Biaya Layanan</span>
                                            <span className="text-xs font-mono font-black text-brand">0.7% ({formatRp(qrisFee)})</span>
                                        </div>
                                        <div className="w-5 h-5 rounded-full bg-brand text-white border border-ink flex items-center justify-center sm:mt-1.5 shadow-sketch-xs">
                                            <Check className="w-3 h-3 stroke-[3]" />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-3 pt-3 border-t-2 border-dashed border-brand/20 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-brand-navy">
                                    <span>⚡ Verifikasi 1-3 Detik Tanpa Upload Bukti</span>
                                    <span>🛡️ 100% Aman & Berlisensi Bank Indonesia</span>
                                </div>
                            </div>
                        </div>

                        {/* STEP 4: Kontak & Bukti Pesanan */}
                        <div className="sketch-card bg-white p-5 sm:p-6 rounded-3xl border-2 border-ink shadow-sketch">
                            <div className="flex items-center gap-2.5 mb-4 pb-3 border-b-2 border-ink/10">
                                <span className="w-7 h-7 rounded-xl bg-brand text-white border-2 border-ink shadow-sketch-xs font-mono font-black text-xs flex items-center justify-center">
                                    04
                                </span>
                                <div>
                                    <h2 className="text-base sm:text-lg font-black text-ink">
                                        Kontak & Bukti Pesanan
                                    </h2>
                                    <p className="text-xs text-ink-muted">Notifikasi status transaksi & digital invoice</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Nomor WhatsApp */}
                                <div>
                                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-ink mb-1.5">
                                        NOMOR WHATSAPP (AKTIF)
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-muted">
                                            <Phone className="w-4 h-4" />
                                        </div>
                                        <input
                                            type="tel"
                                            value={whatsapp}
                                            onChange={(e) => setWhatsapp(e.target.value.replace(/[^0-9]/g, ''))}
                                            placeholder="Cth: 081234567890"
                                            className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white border-2 border-ink rounded-xl shadow-sketch-xs focus:ring-0 focus:border-brand text-xs sm:text-sm font-semibold"
                                        />
                                    </div>
                                    <p className="text-[10px] text-ink-muted mt-1">
                                        Notifikasi status transaksi otomatis dikirim ke nomor ini.
                                    </p>
                                </div>

                                {/* Alamat Email */}
                                <div>
                                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-ink mb-1.5">
                                        ALAMAT EMAIL (OPSIONAL)
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-muted">
                                            <Mail className="w-4 h-4" />
                                        </div>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Cth: nama@email.com"
                                            className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white border-2 border-ink rounded-xl shadow-sketch-xs focus:ring-0 focus:border-brand text-xs sm:text-sm font-semibold"
                                        />
                                    </div>
                                    <p className="text-[10px] text-ink-muted mt-1">
                                        Untuk pengiriman struk digital & bukti pembayaran resmi.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* STEP 5: Kode Promo (Opsional) */}
                        <div className="sketch-card bg-white p-5 sm:p-6 rounded-3xl border-2 border-ink shadow-sketch">
                            <div className="flex items-center gap-2.5 mb-3">
                                <span className="w-7 h-7 rounded-xl bg-brand text-white border-2 border-ink shadow-sketch-xs font-mono font-black text-xs flex items-center justify-center">
                                    05
                                </span>
                                <h2 className="text-base sm:text-lg font-black text-ink">
                                    Kode Promo (Opsional)
                                </h2>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="relative flex-1">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-muted">
                                        <Tag className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="text"
                                        value={promoCode}
                                        onChange={(e) => setPromoCode(e.target.value)}
                                        placeholder="Masukkan kode promo (Cth: MAITRIHEMAT)"
                                        className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-ink rounded-xl shadow-sketch-xs focus:ring-0 focus:border-brand text-xs sm:text-sm font-semibold uppercase font-mono"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={handleApplyPromo}
                                    className="sketch-btn px-4 py-2.5 bg-brand text-white text-xs font-bold rounded-xl border-2 border-ink shadow-sketch-xs shrink-0"
                                >
                                    Terapkan
                                </button>
                            </div>

                            {promoSuccess && (
                                <p className="text-xs font-bold text-emerald-600 mt-2 flex items-center gap-1">
                                    <Check className="w-4 h-4" /> Kode promo berhasil diterapkan! Hemat {formatRp(promoDiscount)}.
                                </p>
                            )}
                        </div>

                        {/* STEP 6: Ringkasan & Tombol Beli */}
                        <div className="sketch-card bg-paper-grid p-5 sm:p-7 rounded-3xl border-2 border-ink shadow-sketch">
                            <h2 className="text-lg font-black text-ink mb-4 pb-2 border-b-2 border-ink/10">
                                Ringkasan Pembayaran
                            </h2>

                            <div className="space-y-2 text-xs sm:text-sm font-medium">
                                <div className="flex justify-between items-center text-ink/80">
                                    <span>Produk:</span>
                                    <span className="font-bold text-ink">{product.name}</span>
                                </div>
                                <div className="flex justify-between items-center text-ink/80">
                                    <span>Nominal:</span>
                                    <span className="font-bold text-ink">{selectedItem?.name || '-'}</span>
                                </div>
                                <div className="flex justify-between items-center text-ink/80">
                                    <span>Harga Dasar:</span>
                                    <span className="font-mono font-bold text-ink">{formatRp(basePrice)}</span>
                                </div>
                                <div className="flex justify-between items-center text-ink/80">
                                    <span>Biaya Layanan (QRIS 0.7%):</span>
                                    <span className="font-mono font-bold text-ink">{formatRp(qrisFee)}</span>
                                </div>
                                {promoDiscount > 0 && (
                                    <div className="flex justify-between items-center text-emerald-600 font-bold">
                                        <span>Potongan Promo:</span>
                                        <span className="font-mono">-{formatRp(promoDiscount)}</span>
                                    </div>
                                )}

                                <div className="my-3 border-t-2 border-dashed border-ink/20"></div>

                                <div className="flex justify-between items-center text-base sm:text-lg font-black">
                                    <span className="text-ink">Total Pembayaran:</span>
                                    <span className="font-mono text-brand text-xl sm:text-2xl">{formatRp(totalPrice)}</span>
                                </div>
                            </div>

                            {/* Tombol Beli Sekarang (Hanya Desktop, di Mobile menggunakan Sticky Bar Bawah) */}
                            <div className="mt-5 hidden md:block">
                                <button
                                    type="button"
                                    onClick={handleCheckoutClick}
                                    className="sketch-btn w-full py-3.5 sm:py-4 px-6 bg-brand text-white font-black text-sm sm:text-base rounded-2xl border-2 border-ink shadow-sketch hover:bg-brand-hover active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2"
                                >
                                    <Zap className="w-5 h-5 fill-white" />
                                    <span>Beli Sekarang ({formatRp(totalPrice)})</span>
                                </button>
                                <p className="text-[11px] text-center text-ink-muted mt-2 font-mono">
                                    🛡️ 100% Bergaransi Resmi • Proses Kilat 1–3 Detik
                                </p>
                            </div>

                            {/* Teks Garansi di Mobile (tanpa tombol beli, karena sudah ada di sticky bar) */}
                            <p className="text-[11px] text-center text-ink-muted mt-4 md:hidden font-mono">
                                🛡️ 100% Bergaransi Resmi • Proses Kilat 1–3 Detik
                            </p>
                        </div>

                    </div>

                </div>

            </div>

            {/* CONFIRMATION MODAL */}
            {isConfirmModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-xs">
                    <div className="w-full max-w-md bg-white rounded-3xl border-2 border-ink shadow-sketch p-6 relative animate-in fade-in zoom-in-95 duration-150">
                        <h3 className="text-xl font-black text-ink pb-3 border-b-2 border-ink/10">
                            Konfirmasi Pesanan
                        </h3>

                        <div className="mt-4 space-y-2.5 text-xs text-ink/90">
                            <div className="p-3 rounded-xl bg-paper-dark border border-ink/30 space-y-1.5">
                                <div className="flex justify-between">
                                    <span className="text-ink-muted">Tujuan / ID:</span>
                                    <span className="font-mono font-bold text-ink">{targetInput} {zoneInput ? `(${zoneInput})` : ''}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-ink-muted">Produk:</span>
                                    <span className="font-bold text-ink">{product.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-ink-muted">Item:</span>
                                    <span className="font-bold text-ink">{selectedItem?.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-ink-muted">Metode Pembayaran:</span>
                                    <span className="font-bold text-brand">QRIS Realtime</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-ink-muted">Nomor WA:</span>
                                    <span className="font-mono font-bold text-ink">{whatsapp}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center text-sm font-black pt-1">
                                <span>Total Tagihan:</span>
                                <span className="text-brand font-mono text-lg">{formatRp(totalPrice)}</span>
                            </div>
                        </div>

                        <div className="mt-6 flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setIsConfirmModalOpen(false)}
                                className="sketch-btn flex-1 py-2.5 bg-white text-ink text-xs font-bold rounded-xl border-2 border-ink shadow-sketch-xs hover:bg-paper-dark"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmOrder}
                                className="sketch-btn flex-1 py-2.5 bg-brand text-white text-xs font-black rounded-xl border-2 border-ink shadow-sketch hover:bg-brand-hover"
                            >
                                Lanjut Bayar →
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* QRIS PAYMENT INVOICE DIALOG MODAL */}
            {isQrisModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/75 backdrop-blur-xs overflow-y-auto">
                    <div className="w-full max-w-lg bg-white rounded-3xl border-2 border-ink shadow-sketch p-6 sm:p-7 relative my-8 animate-in fade-in zoom-in-95 duration-200 text-center">
                        
                        {/* Header Tag */}
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-subtle text-brand-navy border border-ink text-xs font-mono font-bold mb-2">
                            <Clock className="w-3.5 h-3.5" /> Selesaikan dalam: {formattedTimer}
                        </div>

                        <h3 className="text-2xl font-black text-ink">
                            Bayar dengan QRIS
                        </h3>
                        <p className="text-xs text-ink-muted mt-1">
                            Scan kode QR di bawah menggunakan aplikasi E-Wallet atau Mobile Banking Anda.
                        </p>

                        {/* Invoice & Total Box */}
                        <div className="mt-4 p-3.5 rounded-2xl bg-paper-grid border-2 border-ink/30 text-left space-y-1.5 text-xs">
                            <div className="flex justify-between items-center">
                                <span className="text-ink-muted">Kode Invoice:</span>
                                <div className="flex items-center gap-1.5">
                                    <span className="font-mono font-bold text-ink">{invoiceCode}</span>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            navigator.clipboard.writeText(invoiceCode);
                                            setCopiedInvoice(true);
                                            setTimeout(() => setCopiedInvoice(false), 1500);
                                        }}
                                        className="text-[10px] px-1.5 py-0.5 rounded bg-white border border-ink font-bold hover:bg-brand-subtle"
                                    >
                                        {copiedInvoice ? 'Disalin!' : 'Salin'}
                                    </button>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-ink-muted">Total Tagihan:</span>
                                <span className="font-mono font-black text-brand text-base">{formatRp(totalPrice)}</span>
                            </div>
                        </div>

                        {/* QR Code Frame */}
                        <div className="my-5 p-4 bg-white border-2 border-ink rounded-2xl shadow-sketch inline-block max-w-xs mx-auto">
                            {/* QRIS Header Logo text */}
                            <div className="flex items-center justify-between pb-2 mb-2 border-b-2 border-ink text-xs font-black font-mono">
                                <span className="text-brand">QRIS</span>
                                <span className="text-[9px] bg-ink text-white px-1.5 py-0.5 rounded">PASAR RESMI</span>
                            </div>

                            {/* Stylized QR Code Graphic */}
                            <div className="w-56 h-56 bg-paper-dark border-2 border-ink rounded-xl flex items-center justify-center p-3 relative overflow-hidden">
                                <svg viewBox="0 0 100 100" className="w-full h-full text-ink">
                                    {/* Corner finder patterns */}
                                    <rect x="5" y="5" width="26" height="26" fill="currentColor" rx="4" />
                                    <rect x="9" y="9" width="18" height="18" fill="white" rx="2" />
                                    <rect x="13" y="13" width="10" height="10" fill="currentColor" rx="1" />

                                    <rect x="69" y="5" width="26" height="26" fill="currentColor" rx="4" />
                                    <rect x="73" y="9" width="18" height="18" fill="white" rx="2" />
                                    <rect x="77" y="13" width="10" height="10" fill="currentColor" rx="1" />

                                    <rect x="5" y="69" width="26" height="26" fill="currentColor" rx="4" />
                                    <rect x="9" y="73" width="18" height="18" fill="white" rx="2" />
                                    <rect x="13" y="77" width="10" height="10" fill="currentColor" rx="1" />

                                    {/* Grid Matrix pattern dots */}
                                    <rect x="36" y="8" width="6" height="6" fill="currentColor" />
                                    <rect x="46" y="8" width="6" height="6" fill="currentColor" />
                                    <rect x="56" y="8" width="6" height="6" fill="currentColor" />
                                    <rect x="36" y="18" width="6" height="6" fill="currentColor" />
                                    <rect x="56" y="18" width="6" height="6" fill="currentColor" />
                                    <rect x="46" y="28" width="6" height="6" fill="currentColor" />
                                    
                                    <rect x="8" y="36" width="6" height="6" fill="currentColor" />
                                    <rect x="18" y="36" width="6" height="6" fill="currentColor" />
                                    <rect x="28" y="36" width="6" height="6" fill="currentColor" />
                                    <rect x="36" y="36" width="28" height="28" fill="#2563eb" rx="4" />
                                    <rect x="46" y="46" width="8" height="8" fill="white" rx="1" />
                                    
                                    <rect x="68" y="36" width="6" height="6" fill="currentColor" />
                                    <rect x="78" y="36" width="6" height="6" fill="currentColor" />
                                    <rect x="88" y="36" width="6" height="6" fill="currentColor" />

                                    <rect x="36" y="68" width="6" height="6" fill="currentColor" />
                                    <rect x="46" y="78" width="6" height="6" fill="currentColor" />
                                    <rect x="56" y="68" width="6" height="6" fill="currentColor" />
                                    <rect x="68" y="68" width="6" height="6" fill="currentColor" />
                                    <rect x="78" y="78" width="6" height="6" fill="currentColor" />
                                    <rect x="88" y="88" width="6" height="6" fill="currentColor" />
                                </svg>
                            </div>

                            <p className="text-[10px] font-mono font-bold text-ink mt-2">
                                NMID: ID10200391823910
                            </p>
                        </div>

                        {/* Supported Logos note */}
                        <p className="text-[11px] text-ink-muted">
                            Dukung: BCA, Mandiri, BRI, BNI, DANA, OVO, GoPay, ShopeePay, LinkAja & QRIS Bank Lainnya.
                        </p>

                        {/* Modal Action Buttons */}
                        <div className="mt-5 flex flex-col sm:flex-row gap-2.5">
                            <button
                                type="button"
                                onClick={() => {
                                    alert('Status Pembayaran: Menunggu pembayaran QRIS dari sistem perbankan. Silakan selesaikan scan.');
                                }}
                                className="sketch-btn flex-1 py-2.5 bg-brand text-white text-xs font-black rounded-xl border-2 border-ink shadow-sketch hover:bg-brand-hover"
                            >
                                ⚡ Cek Status Pembayaran
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsQrisModalOpen(false)}
                                className="sketch-btn py-2.5 px-4 bg-white text-ink text-xs font-bold rounded-xl border-2 border-ink shadow-sketch-xs hover:bg-paper-dark"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </MainLayout>
    );
}
