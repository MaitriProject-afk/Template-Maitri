import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { 
    Gamepad2, 
    ArrowLeft, 
    Copy, 
    Check, 
    Zap, 
    ShieldCheck, 
    Flame, 
    CreditCard, 
    Search, 
    ReceiptText, 
    Home, 
    User, 
    CheckCircle2, 
    AlertTriangle, 
    Info, 
    XCircle, 
    Sparkles,
    Smartphone,
    Layers,
    ChevronRight,
    HelpCircle
} from 'lucide-react';
import BottomNav from '../Components/BottomNav';
import ProductCard from '../Components/ProductCard';
import TopUpModal from '../Components/TopUpModal';
import TransactionTrackerModal from '../Components/TransactionTrackerModal';
import SearchModal from '../Components/SearchModal';
import { MOCK_PRODUCTS } from '../data/mockProducts';

export default function StyleGuide() {
    const [copiedColor, setCopiedColor] = useState(null);
    const [activeSection, setActiveSection] = useState('colors');
    const [testInput, setTestInput] = useState('081234567890');
    const [isTopUpOpen, setIsTopUpOpen] = useState(false);
    const [isTrackerOpen, setIsTrackerOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [activeMobileTab, setActiveMobileTab] = useState('home');

    const copyToClipboard = (text, label) => {
        navigator.clipboard.writeText(text);
        setCopiedColor(label);
        setTimeout(() => setCopiedColor(null), 1500);
    };

    const navItems = [
        { id: 'overview', label: 'Prinsip Desain' },
        { id: 'colors', label: '1. Palet Warna' },
        { id: 'typography', label: '2. Tipografi' },
        { id: 'shadows', label: '3. Garis & Bayangan' },
        { id: 'buttons', label: '4. Komponen Tombol' },
        { id: 'badges', label: '5. Badges & Stiker' },
        { id: 'forms', label: '6. Form & Input' },
        { id: 'cards', label: '7. Variasi Kartu' },
        { id: 'mobile', label: '8. Layout Mobile' },
        { id: 'modals', label: '9. Modal Dialog' },
    ];

    return (
        <>
            <Head>
                <title>Style Guide & Design System — Maitri TopUp</title>
                <meta name="description" content="Pedoman desain antarmuka, token warna, tipografi, dan komponen konsisten untuk web top up bergaya sketchbook." />
            </Head>

            <div className="min-h-screen bg-paper text-ink selection:bg-brand-subtle selection:text-brand-navy pb-28 md:pb-16">
                
                {/* Header Style Guide */}
                <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-ink">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center gap-3">
                                <Link 
                                    href="/" 
                                    className="sketch-btn p-2 bg-paper rounded-xl border-2 border-ink text-ink hover:bg-brand hover:text-white transition-colors"
                                    title="Kembali ke Beranda"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </Link>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h1 className="text-base sm:text-lg font-black tracking-tight text-ink font-sans">
                                            STYLE GUIDE & DESIGN SYSTEM
                                        </h1>
                                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-brand text-white border border-ink shadow-sketch-xs">
                                            v2.0 • BLUE EDITION
                                        </span>
                                    </div>
                                    <p className="text-[11px] font-sketch font-bold text-ink-muted">
                                        Pedoman Palet Biru Putih & Konsistensi Tampilan Sketchbook
                                    </p>
                                </div>
                            </div>

                            <Link
                                href="/"
                                className="sketch-btn px-4 py-2 bg-brand hover:bg-brand-hover text-white text-xs font-bold rounded-xl hidden sm:inline-flex items-center gap-1.5 shadow-sketch-xs"
                            >
                                <span>Lihat Landing Page</span>
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Sub Navigation Anchor Bar */}
                <div className="bg-paper-dark border-b-2 border-ink sticky top-16 z-30 overflow-x-auto no-scrollbar py-2">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 min-w-max">
                        {navItems.map((item) => (
                            <a
                                key={item.id}
                                href={`#${item.id}`}
                                onClick={() => setActiveSection(item.id)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all border ${
                                    activeSection === item.id
                                        ? 'bg-brand text-white border-ink shadow-sketch-xs'
                                        : 'bg-white text-ink-light border-ink/20 hover:border-ink'
                                }`}
                            >
                                {item.label}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Main Content Area */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
                    
                    {/* OVERVIEW / FILOSOFI DESAIN */}
                    <section id="overview" className="scroll-mt-32">
                        <div className="sketch-card bg-paper-grid p-6 sm:p-8 relative overflow-hidden">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-subtle text-brand-navy border-2 border-ink shadow-sketch-xs text-xs font-mono font-bold uppercase mb-4">
                                <Sparkles className="w-3.5 h-3.5 fill-brand" />
                                <span>FILOSOFI DESAIN SKETCHBOOK • BIRU PUTIH</span>
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-black text-ink mb-3">
                                Ciri Khas Desain Maitri TopUp
                            </h2>
                            <p className="text-sm sm:text-base text-ink-light max-w-3xl leading-relaxed">
                                Konsep desain memadukan <strong>Neo-Brutalism</strong> bertema <strong>buku sketsa (sketchbook)</strong> dengan palet resmi <strong>Biru & Putih</strong> yang modern, bersih, dan tepercaya untuk platform top-up game. 
                                Setiap elemen ditopang garis tepi tinta tebal (<code className="font-mono bg-paper-dark px-1 py-0.5 rounded border border-ink/20">border-2 border-ink</code>), 
                                bayangan padat sketsa (<code className="font-mono bg-paper-dark px-1 py-0.5 rounded border border-ink/20">box-shadow: 4px 4px 0px #0f172a</code>), 
                                aksen biru royal (<code className="font-mono bg-brand text-white px-1 py-0.5 rounded">#2563eb</code>) yang tajam, kontras putih bersih, serta tactile micro-interactions saat ditekan.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t-2 border-dashed border-ink/20">
                                <div className="p-4 bg-white rounded-xl border-2 border-ink shadow-sketch-xs">
                                    <div className="font-black text-sm text-brand mb-1">1. Biru & Putih Modern</div>
                                    <p className="text-xs text-ink-muted">Warna biru royal dan putih memberikan citra tepercaya, profesional, serta nyaman dilihat di layar monitor maupun smartphone.</p>
                                </div>
                                <div className="p-4 bg-white rounded-xl border-2 border-ink shadow-sketch-xs">
                                    <div className="font-black text-sm text-brand mb-1">2. Tactile Feedback</div>
                                    <p className="text-xs text-ink-muted">Setiap tombol dan kartu terasa hidup dengan efek translate `2px 2px` saat disentuh / ditekan.</p>
                                </div>
                                <div className="p-4 bg-white rounded-xl border-2 border-ink shadow-sketch-xs">
                                    <div className="font-black text-sm text-brand mb-1">3. Mobile-First Android</div>
                                    <p className="text-xs text-ink-muted">Navigasi bawah khas aplikasi Android memastikan jempol pengguna dapat menjangkau seluruh fitur utama.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 1. PALET WARNA (COLOR PALETTE) */}
                    <section id="colors" className="scroll-mt-32">
                        <div className="mb-4">
                            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-brand text-white border border-ink uppercase">Bagian 1</span>
                            <h2 className="text-2xl font-black text-ink mt-1">Palet Warna Resmi (Biru & Putih)</h2>
                            <p className="text-xs text-ink-muted">Klik warna untuk menyalin kode HEX ke clipboard.</p>
                        </div>

                        <div className="space-y-6">
                            {/* Brand / Primary Blue Palette */}
                            <div>
                                <h3 className="text-sm font-bold font-mono text-brand uppercase mb-2.5 flex items-center gap-2">
                                    <span>Warna Resmi Utama (Brand Blue)</span>
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-subtle text-brand-navy border border-ink/20">Official Core</span>
                                </h3>
                                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                                    {[
                                        { name: 'Brand Primary', hex: '#2563eb', class: 'bg-brand text-white', usage: 'Tombol CTA utama, badge aktif, navbar branding' },
                                        { name: 'Brand Accent', hex: '#38bdf8', class: 'bg-brand-accent text-ink', usage: 'Highlight cerah, border fokus, stiker kilat' },
                                        { name: 'Brand Hover', hex: '#1d4ed8', class: 'bg-brand-hover text-white', usage: 'State hover tombol & link penting' },
                                        { name: 'Brand Subtle', hex: '#e0f2fe', class: 'bg-brand-subtle text-brand-navy', usage: 'Background nominal aktif, badge ice blue' },
                                        { name: 'Brand Navy', hex: '#1e40af', class: 'bg-brand-navy text-white', usage: 'Heading teks aksen, dark variant' },
                                    ].map((c, i) => (
                                        <div 
                                            key={i}
                                            onClick={() => copyToClipboard(c.hex, c.name)}
                                            className="sketch-card p-3 cursor-pointer hover:scale-102 transition-transform bg-white"
                                        >
                                            <div className={`h-16 rounded-lg ${c.class} border-2 border-ink shadow-sketch-xs flex items-center justify-center font-mono font-black text-xs`}>
                                                {copiedColor === c.name ? <Check className="w-5 h-5" /> : c.hex}
                                            </div>
                                            <div className="mt-2">
                                                <div className="font-extrabold text-xs text-ink">{c.name}</div>
                                                <div className="text-[10px] text-ink-muted mt-0.5 leading-tight">{c.usage}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Ink & Paper White */}
                            <div>
                                <h3 className="text-sm font-bold font-mono text-ink uppercase mb-2.5">Netral (Tinta Blueprint & Kertas Putih)</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                                    {[
                                        { name: 'Pure White (Card)', hex: '#ffffff', class: 'bg-white text-ink border-ink', usage: 'Permukaan kartu, popup, kontainer form' },
                                        { name: 'Paper Base (Canvas)', hex: '#f8fafc', class: 'bg-paper text-ink border-ink', usage: 'Latar kanvas bertekstur dot grid seluruh web' },
                                        { name: 'Ink Dark (Default)', hex: '#0f172a', class: 'bg-ink text-white', usage: 'Border tebal sketsa, bayangan solid, judul teks' },
                                        { name: 'Ink Light', hex: '#1e293b', class: 'bg-ink-light text-white', usage: 'Body text utama, sub-judul' },
                                        { name: 'Ink Muted', hex: '#64748b', class: 'bg-ink-muted text-white', usage: 'Deskripsi sekunder, watermark, caption' },
                                    ].map((c, i) => (
                                        <div 
                                            key={i}
                                            onClick={() => copyToClipboard(c.hex, c.name)}
                                            className="sketch-card p-3 cursor-pointer hover:scale-102 transition-transform bg-white"
                                        >
                                            <div className={`h-16 rounded-lg ${c.class} border-2 border-ink shadow-sketch-xs flex items-center justify-center font-mono font-black text-xs`}>
                                                {copiedColor === c.name ? <Check className="w-5 h-5" /> : c.hex}
                                            </div>
                                            <div className="mt-2">
                                                <div className="font-extrabold text-xs text-ink">{c.name}</div>
                                                <div className="text-[10px] text-ink-muted mt-0.5 leading-tight">{c.usage}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Sketch Accents */}
                            <div>
                                <h3 className="text-sm font-bold font-mono text-ink uppercase mb-2.5">Aksen Spidol Sketsa Tambahan (Stickers & Badges)</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                                    {[
                                        { name: 'Sketch Yellow', hex: '#fef08a', class: 'bg-sketch-yellow text-ink', tag: 'Tape / Catatan Penting' },
                                        { name: 'Sketch Coral', hex: '#fda4af', class: 'bg-sketch-coral text-ink', tag: 'Diskon / Alert / Promo' },
                                        { name: 'Sketch Sky', hex: '#7dd3fc', class: 'bg-sketch-sky text-ink', tag: 'Info Bank / Transfer' },
                                        { name: 'Sketch Purple', hex: '#d8b4fe', class: 'bg-sketch-purple text-ink', tag: 'Voucher / Loyalty' },
                                        { name: 'Sketch Orange', hex: '#fdba74', class: 'bg-sketch-orange text-ink', tag: 'Trending / Flash Sale' },
                                    ].map((c, i) => (
                                        <div 
                                            key={i}
                                            onClick={() => copyToClipboard(c.hex, c.name)}
                                            className="sketch-card p-3 cursor-pointer hover:scale-102 transition-transform bg-white"
                                        >
                                            <div className={`h-14 rounded-lg ${c.class} border-2 border-ink shadow-sketch-xs flex items-center justify-center font-mono font-black text-xs`}>
                                                {copiedColor === c.name ? <Check className="w-5 h-5" /> : c.hex}
                                            </div>
                                            <div className="mt-2">
                                                <div className="font-extrabold text-xs text-ink">{c.name}</div>
                                                <div className="text-[10px] font-sketch font-bold text-ink-muted">{c.tag}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 2. TIPOGRAFI (TYPOGRAPHY) */}
                    <section id="typography" className="scroll-mt-32">
                        <div className="mb-4">
                            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-brand-subtle text-brand-navy border border-ink uppercase">Bagian 2</span>
                            <h2 className="text-2xl font-black text-ink mt-1">Sistem Tipografi Tiga Font</h2>
                            <p className="text-xs text-ink-muted">Setiap font memiliki fungsi peran yang terdefinisi dengan jelas.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            
                            {/* Font 1: Plus Jakarta Sans */}
                            <div className="sketch-card p-5 bg-white">
                                <div className="text-xs font-mono font-bold uppercase text-brand pb-2 border-b border-ink/10">
                                    Font UI Utama (font-sans)
                                </div>
                                <h3 className="text-xl font-extrabold text-ink mt-2">
                                    Plus Jakarta Sans
                                </h3>
                                <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                                    Digunakan untuk seluruh komponen struktural: navbar, judul artikel, tombol, navigasi, dan body text.
                                </p>

                                <div className="mt-4 space-y-3 pt-4 border-t-2 border-dashed border-ink/15">
                                    <div>
                                        <span className="text-[10px] font-mono text-ink-muted">H1 • ExtraBold (32px / 2rem)</span>
                                        <div className="text-2xl font-black text-ink leading-tight">Top Up Game Cepat</div>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-mono text-ink-muted">H2 • Bold (20px / 1.25rem)</span>
                                        <div className="text-lg font-bold text-ink leading-tight">Pilih Nominal Diamond</div>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-mono text-ink-muted">Body • Medium (14px / 0.875rem)</span>
                                        <div className="text-sm font-medium text-ink-light">Layanan otomatis 24 jam tanpa registrasi akun.</div>
                                    </div>
                                </div>
                            </div>

                            {/* Font 2: Architects Daughter */}
                            <div className="sketch-card p-5 bg-white">
                                <div className="text-xs font-mono font-bold uppercase text-brand-accent pb-2 border-b border-ink/10">
                                    Font Tulisan Tangan (font-sketch)
                                </div>
                                <h3 className="text-xl font-sketch font-bold text-ink mt-2">
                                    Architects Daughter
                                </h3>
                                <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                                    Digunakan khusus untuk memberikan sentuhan sketsa kertas: coretan catatan kaki, kutipan singkat, stiker diskon, dan testimoni.
                                </p>

                                <div className="mt-4 space-y-3 pt-4 border-t-2 border-dashed border-ink/15">
                                    <div className="p-3 bg-brand-subtle rounded-lg border border-ink/30 -rotate-1">
                                        <span className="text-[10px] font-mono text-brand-navy block font-bold">Catatan Sketsa</span>
                                        <div className="font-sketch font-bold text-base text-ink">"Prosesnya cuma 1 detik, gokil!"</div>
                                    </div>
                                    <div className="p-3 bg-sketch-coral/30 rounded-lg border border-ink/30 rotate-1">
                                        <span className="text-[10px] font-mono text-ink-muted block">Stiker Promo</span>
                                        <div className="font-sketch font-bold text-base text-ink">Diskon Khusus Hari Ini ⚡</div>
                                    </div>
                                </div>
                            </div>

                            {/* Font 3: Space Mono */}
                            <div className="sketch-card p-5 bg-white">
                                <div className="text-xs font-mono font-bold uppercase text-brand-navy pb-2 border-b border-ink/10">
                                    Font Angka & Kode (font-mono)
                                </div>
                                <h3 className="text-xl font-mono font-bold text-ink mt-2">
                                    Space Mono
                                </h3>
                                <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                                    Digunakan untuk angka harga Rupiah, nomor invoice transaksi, kode referal, dan badge status server.
                                </p>

                                <div className="mt-4 space-y-3 pt-4 border-t-2 border-dashed border-ink/15">
                                    <div>
                                        <span className="text-[10px] font-mono text-ink-muted">Harga / Biaya</span>
                                        <div className="text-xl font-mono font-black text-brand">Rp 27.500,-</div>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-mono text-ink-muted">Kode Invoice</span>
                                        <div className="text-sm font-mono font-bold text-ink-muted bg-paper-dark px-2 py-1 rounded border border-ink inline-block">
                                            MP-892104-ID
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-mono text-ink-muted">Format Waktu</span>
                                        <div className="text-xs font-mono font-bold text-brand">
                                            09 Sep 2026 • 07:15:22 WIB
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </section>

                    {/* 3. GARIS & BAYANGAN (SHADOWS & BORDERS) */}
                    <section id="shadows" className="scroll-mt-32">
                        <div className="mb-4">
                            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-brand-subtle text-brand-navy border border-ink uppercase">Bagian 3</span>
                            <h2 className="text-2xl font-black text-ink mt-1">Sistem Garis & Bayangan Blok Sketsa</h2>
                            <p className="text-xs text-ink-muted">Aturan baku bayangan keras tanpa blur (hard box-shadow #0f172a) untuk mempertahankan identitas sketch.</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { name: 'shadow-sketch-xs', value: '2px 2px 0px #0f172a', usage: 'Badge kecil, tag item, tombol pagination' },
                                { name: 'shadow-sketch-sm', value: '3px 3px 0px #0f172a', usage: 'Tombol reguler, search bar' },
                                { name: 'shadow-sketch (Standard)', value: '4px 4px 0px #0f172a', usage: 'Kartu produk, box modal, container' },
                                { name: 'shadow-sketch-lg', value: '6px 6px 0px #0f172a', usage: 'Hero card, banner utama, modal dialog' },
                            ].map((s, i) => (
                                <div key={i} className="sketch-card p-4 bg-white flex flex-col justify-between">
                                    <div>
                                        <div className="font-mono font-bold text-xs text-ink pb-1 border-b border-ink/10">{s.name}</div>
                                        <code className="text-[10px] font-mono text-ink-muted block mt-1">{s.value}</code>
                                    </div>
                                    <div className="my-4 py-3 px-4 bg-paper rounded-xl border-2 border-ink text-center text-xs font-bold font-mono" style={{ boxShadow: s.value }}>
                                        Preview Box
                                    </div>
                                    <p className="text-[11px] text-ink-muted leading-tight">{s.usage}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* 4. TOMBOL (BUTTONS) */}
                    <section id="buttons" className="scroll-mt-32">
                        <div className="mb-4">
                            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-brand text-white border border-ink uppercase">Bagian 4</span>
                            <h2 className="text-2xl font-black text-ink mt-1">Variasi Tombol & Interaksi</h2>
                            <p className="text-xs text-ink-muted">Coba klik tombol-tombol di bawah untuk merasakan efek tactile bounce khas sketsa.</p>
                        </div>

                        <div className="sketch-card p-6 bg-white space-y-6">
                            <div>
                                <h3 className="text-xs font-mono font-bold text-ink uppercase mb-3">Varian Tombol Standar</h3>
                                <div className="flex flex-wrap gap-3 items-center">
                                    <button className="sketch-btn px-5 py-2.5 bg-brand hover:bg-brand-hover text-white font-bold text-sm rounded-xl inline-flex items-center gap-2 shadow-sketch">
                                        <Zap className="w-4 h-4 fill-white" />
                                        <span>Primary Brand (Blue)</span>
                                    </button>

                                    <button className="sketch-btn px-5 py-2.5 bg-white hover:bg-paper-dark text-ink font-bold text-sm rounded-xl inline-flex items-center gap-2">
                                        <span>Secondary White</span>
                                    </button>

                                    <button className="sketch-btn px-5 py-2.5 bg-ink hover:bg-ink-light text-white font-bold text-sm rounded-xl inline-flex items-center gap-2">
                                        <span>Dark Ink Button</span>
                                    </button>

                                    <button className="sketch-btn px-5 py-2.5 bg-brand-subtle hover:bg-sky-200 text-brand-navy font-bold text-sm rounded-xl inline-flex items-center gap-2">
                                        <span>Subtle Ice Blue</span>
                                    </button>

                                    <button className="sketch-btn px-5 py-2.5 bg-sketch-coral hover:bg-red-400 text-ink font-bold text-sm rounded-xl inline-flex items-center gap-2">
                                        <span>Danger / Alert</span>
                                    </button>

                                    <button disabled className="px-5 py-2.5 bg-gray-200 text-gray-400 border-2 border-gray-300 font-bold text-sm rounded-xl cursor-not-allowed">
                                        Disabled State
                                    </button>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-dashed border-ink/20">
                                <h3 className="text-xs font-mono font-bold text-ink uppercase mb-3">Tombol Ikon & Aksi Spesial</h3>
                                <div className="flex flex-wrap gap-3 items-center">
                                    <button className="w-12 h-12 rounded-xl bg-brand text-white border-2 border-ink shadow-sketch-sm flex items-center justify-center active:translate-x-0.5 active:translate-y-0.5 active:shadow-none">
                                        <Search className="w-5 h-5 stroke-[2.5]" />
                                    </button>

                                    <button className="w-12 h-12 rounded-full bg-sketch-yellow border-2 border-ink shadow-sketch-sm flex items-center justify-center active:translate-x-0.5 active:translate-y-0.5 active:shadow-none">
                                        <Flame className="w-5 h-5 text-ink stroke-[2.5]" />
                                    </button>

                                    <button className="w-14 h-14 rounded-full bg-brand text-white border-[2.5px] border-ink shadow-sketch flex flex-col items-center justify-center active:translate-x-0.5 active:translate-y-0.5 active:shadow-none">
                                        <Search className="w-6 h-6 stroke-[2.5]" />
                                    </button>
                                    <span className="text-xs font-sketch text-ink font-bold">← Tombol Melayang Mobile</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 5. BADGES & STIKER */}
                    <section id="badges" className="scroll-mt-32">
                        <div className="mb-4">
                            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-brand-subtle text-brand-navy border border-ink uppercase">Bagian 5</span>
                            <h2 className="text-2xl font-black text-ink mt-1">Badges, Tag & Stiker Promo</h2>
                            <p className="text-xs text-ink-muted">Digunakan untuk menonjolkan label diskon, kecepatan transaksi, dan status pesanan.</p>
                        </div>

                        <div className="sketch-card p-6 bg-white space-y-4">
                            <div className="flex flex-wrap gap-2.5 items-center">
                                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-brand text-white border border-ink shadow-sketch-xs">
                                    🔥 TERLARIS
                                </span>
                                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-brand-subtle text-brand-navy border border-ink shadow-sketch-xs">
                                    ⚡ 1 DETIK OTOMATIS
                                </span>
                                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-sketch-yellow text-ink border border-ink shadow-sketch-xs">
                                    ⭐ RESMI & LEGAL
                                </span>
                                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-sketch-coral text-ink border border-ink shadow-sketch-xs">
                                    🏷️ DISKON 20%
                                </span>
                                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-sketch-sky text-ink border border-ink shadow-sketch-xs">
                                    🛡️ 100% GARANSI
                                </span>
                                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-ink text-white border border-ink shadow-sketch-xs">
                                    💎 VIP MEMBER
                                </span>
                            </div>

                            <div className="pt-4 border-t border-dashed border-ink/20 flex flex-wrap gap-4 items-center">
                                <div className="p-2 bg-sketch-yellow/60 border-2 border-ink -rotate-2 shadow-sm font-sketch font-bold text-xs">
                                    📌 Catatan Penting
                                </div>
                                <div className="p-2 bg-sketch-coral/60 border-2 border-ink rotate-2 shadow-sm font-sketch font-bold text-xs">
                                    ⚡ Garansi Uang Kembali
                                </div>
                                <div className="p-2 bg-brand-subtle text-brand-navy border-2 border-ink -rotate-1 shadow-sm font-sketch font-bold text-xs">
                                    ✍️ Bebas Biaya Admin
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 6. FORM & INPUT */}
                    <section id="forms" className="scroll-mt-32">
                        <div className="mb-4">
                            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-brand text-white border border-ink uppercase">Bagian 6</span>
                            <h2 className="text-2xl font-black text-ink mt-1">Form, Input & Kontrol Form</h2>
                            <p className="text-xs text-ink-muted">Desain input wajib menggunakan border tegas dan state fokus dengan shadow sketch konsisten.</p>
                        </div>

                        <div className="sketch-card p-6 bg-white space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Input Biasa */}
                                <div>
                                    <label className="block text-xs font-bold text-ink mb-1">
                                        Input Teks Standar
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Ketik User ID..."
                                        className="w-full px-3.5 py-2.5 bg-paper border-2 border-ink rounded-xl text-sm font-semibold focus:ring-0 focus:border-brand shadow-sketch-xs"
                                    />
                                </div>

                                {/* Input dengan Ikon */}
                                <div>
                                    <label className="block text-xs font-bold text-ink mb-1">
                                        Input dengan Ikon & Shortcut
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-muted">
                                            <Search className="w-4 h-4" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Cari game..."
                                            className="w-full pl-10 pr-14 py-2.5 bg-paper border-2 border-ink rounded-xl text-sm font-semibold focus:ring-0 focus:border-brand shadow-sketch-xs"
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white border border-ink rounded">
                                                ESC
                                            </kbd>
                                        </div>
                                    </div>
                                </div>

                                {/* Select Dropdown */}
                                <div>
                                    <label className="block text-xs font-bold text-ink mb-1">
                                        Select Dropdown Kategori
                                    </label>
                                    <select className="w-full px-3.5 py-2.5 bg-paper border-2 border-ink rounded-xl text-sm font-semibold focus:ring-0 focus:border-brand shadow-sketch-xs">
                                        <option>Semua Kategori (Default)</option>
                                        <option>Game Populer</option>
                                        <option>Voucher Digital</option>
                                        <option>Pulsa & Paket Data</option>
                                    </select>
                                </div>

                                {/* Error State Input */}
                                <div>
                                    <label className="block text-xs font-bold text-red-600 mb-1">
                                        State Error Validasi
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue="123"
                                        className="w-full px-3.5 py-2.5 bg-red-50 border-2 border-red-600 rounded-xl text-sm font-semibold text-red-900 focus:ring-0 focus:border-red-600 shadow-sketch-xs"
                                    />
                                    <p className="text-[11px] text-red-600 font-bold mt-1">User ID minimal 6 digit.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 7. KARTU & CONTAINER (CARDS) */}
                    <section id="cards" className="scroll-mt-32">
                        <div className="mb-4">
                            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-brand text-white border border-ink uppercase">Bagian 7</span>
                            <h2 className="text-2xl font-black text-ink mt-1">Variasi Kartu & Container</h2>
                            <p className="text-xs text-ink-muted">Contoh kartu produk live, kartu fitur, dan banner informasi.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            {/* Sample Product Card */}
                            <div>
                                <h3 className="text-xs font-mono font-bold text-ink uppercase mb-2">1. Kartu Game (Interactive)</h3>
                                <ProductCard 
                                    product={MOCK_PRODUCTS[0]} 
                                    onSelect={() => setIsTopUpOpen(true)}
                                />
                            </div>

                            {/* Sample Feature Card */}
                            <div>
                                <h3 className="text-xs font-mono font-bold text-ink uppercase mb-2">2. Kartu Keunggulan</h3>
                                <div className="sketch-card p-5 bg-white h-full flex flex-col justify-between">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-brand-subtle text-brand border-2 border-ink shadow-sketch-xs flex items-center justify-center shrink-0">
                                            <Zap className="w-6 h-6 stroke-[2.5]" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-ink text-base">
                                                Proses Otomatis 1 Detik
                                            </h4>
                                            <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                                                Sistem bot kami terhubung langsung ke server resmi provider tanpa proses manual.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-3 border-t border-dashed border-ink/20 flex items-center justify-between text-xs font-mono text-ink">
                                        <span>Status Server: Normal</span>
                                        <span className="font-bold text-brand">● Online</span>
                                    </div>
                                </div>
                            </div>

                            {/* Sample Paper Note Card */}
                            <div>
                                <h3 className="text-xs font-mono font-bold text-ink uppercase mb-2">3. Kartu Kertas / Catatan</h3>
                                <div className="sketch-card p-5 bg-paper-grid h-full relative overflow-hidden flex flex-col justify-between">
                                    <div className="absolute -top-3 right-6 w-16 h-5 bg-brand-subtle border-2 border-ink rotate-3 shadow-xs"></div>
                                    <div>
                                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-brand text-white rounded">TIPS TOP UP</span>
                                        <h4 className="font-black text-ink text-base mt-2">
                                            Simpan User ID Kamu
                                        </h4>
                                        <p className="text-xs text-ink-light mt-1 leading-relaxed">
                                            Cukup salin User ID dan Server ID dari profil akun game kamu agar tidak terjadi salah tujuan.
                                        </p>
                                    </div>
                                    <div className="mt-4 font-sketch text-xs font-bold text-brand-navy">
                                        ✍️ "Transaksi aman, hati tenang!"
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 8. LAYOUT MOBILE & BOTTOM NAVBAR */}
                    <section id="mobile" className="scroll-mt-32">
                        <div className="mb-4">
                            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-brand text-white border border-ink uppercase">Bagian 8</span>
                            <h2 className="text-2xl font-black text-ink mt-1">Layout Mobile & Bottom Navbar Khas Android</h2>
                            <p className="text-xs text-ink-muted">Navigasi mobile khusus yang selalu menempel di bawah layar dengan tombol aksi tengah melayang.</p>
                        </div>

                        <div className="sketch-card p-6 bg-paper-grid">
                            <div className="max-w-md mx-auto bg-white rounded-2xl border-2 border-ink shadow-sketch p-4 relative">
                                <div className="text-xs font-mono font-bold text-ink-muted uppercase pb-2 mb-3 border-b border-ink/10 flex items-center justify-between">
                                    <span>Preview Komponen Bottom Navbar</span>
                                    <span className="text-brand font-bold">● Active Preview</span>
                                </div>

                                {/* Mini simulated mobile screen */}
                                <div className="bg-paper p-3 rounded-xl border border-ink/20 text-center text-xs text-ink-muted mb-4">
                                    <Smartphone className="w-5 h-5 mx-auto mb-1 text-brand" />
                                    Area Konten Layar Mobile (390px)
                                </div>

                                {/* Inlined BottomNav component for demonstration */}
                                <div className="rounded-t-[28px] border-2 border-ink bg-white p-3 shadow-sketch-sm">
                                    <div className="grid grid-cols-5 items-end">
                                        <button
                                            type="button"
                                            onClick={() => setActiveMobileTab('home')}
                                            className="flex flex-col items-center justify-center py-1 group transition-transform active:scale-95"
                                        >
                                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                                                activeMobileTab === 'home'
                                                    ? 'border-2 border-brand text-brand bg-brand-subtle/50'
                                                    : 'text-ink-muted group-hover:text-ink'
                                            }`}>
                                                <Home className="w-5 h-5 stroke-[2.2]" />
                                            </div>
                                            <span className={`text-[11px] font-bold mt-1 transition-colors ${
                                                activeMobileTab === 'home' ? 'text-brand' : 'text-ink-muted'
                                            }`}>
                                                Beranda
                                            </span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setActiveMobileTab('katalog')}
                                            className="flex flex-col items-center justify-center py-1 group transition-transform active:scale-95"
                                        >
                                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                                                activeMobileTab === 'katalog'
                                                    ? 'border-2 border-brand text-brand bg-brand-subtle/50'
                                                    : 'text-ink-muted group-hover:text-ink'
                                            }`}>
                                                <LayoutGrid className="w-5 h-5 stroke-[2.2]" />
                                            </div>
                                            <span className={`text-[11px] font-bold mt-1 transition-colors ${
                                                activeMobileTab === 'katalog' ? 'text-brand' : 'text-ink-muted'
                                            }`}>
                                                Katalog
                                            </span>
                                        </button>

                                        {/* Floating Center Button */}
                                        <div className="relative flex flex-col items-center justify-end pb-1">
                                            <button
                                                type="button"
                                                onClick={() => setIsSearchOpen(true)}
                                                className="absolute -top-7 w-13 h-13 rounded-full bg-brand text-white border-2 border-ink shadow-[0_4px_0_#0f172a] flex items-center justify-center transition-all active:translate-y-1 active:shadow-none hover:scale-105"
                                                title="Cari"
                                            >
                                                <Search className="w-6 h-6 stroke-[2.5]" />
                                            </button>
                                            <span className="text-[11px] font-bold text-ink mt-auto">
                                                Cari
                                            </span>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => setActiveMobileTab('transaksi')}
                                            className="flex flex-col items-center justify-center py-1 group transition-transform active:scale-95"
                                        >
                                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                                                activeMobileTab === 'transaksi'
                                                    ? 'border-2 border-brand text-brand bg-brand-subtle/50'
                                                    : 'text-ink-muted group-hover:text-ink'
                                            }`}>
                                                <History className="w-5 h-5 stroke-[2.2]" />
                                            </div>
                                            <span className={`text-[11px] font-bold mt-1 transition-colors ${
                                                activeMobileTab === 'transaksi' ? 'text-brand' : 'text-ink-muted'
                                            }`}>
                                                Transaksi
                                            </span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setActiveMobileTab('akun')}
                                            className="flex flex-col items-center justify-center py-1 group transition-transform active:scale-95"
                                        >
                                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                                                activeMobileTab === 'akun'
                                                    ? 'border-2 border-brand text-brand bg-brand-subtle/50'
                                                    : 'text-ink-muted group-hover:text-ink'
                                            }`}>
                                                <User className="w-5 h-5 stroke-[2.2]" />
                                            </div>
                                            <span className={`text-[11px] font-bold mt-1 transition-colors ${
                                                activeMobileTab === 'akun' ? 'text-brand' : 'text-ink-muted'
                                            }`}>
                                                Profil
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 9. MODAL DIALOG PREVIEW */}
                    <section id="modals" className="scroll-mt-32">
                        <div className="mb-4">
                            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-brand text-white border border-ink uppercase">Bagian 9</span>
                            <h2 className="text-2xl font-black text-ink mt-1">Uji Coba Dialog Modal</h2>
                            <p className="text-xs text-ink-muted">Seluruh modal menggunakan backdrop blur dan card kontras tinggi dengan palet biru putih.</p>
                        </div>

                        <div className="sketch-card p-6 bg-white flex flex-wrap gap-4 items-center">
                            <button
                                type="button"
                                onClick={() => setIsTopUpOpen(true)}
                                className="sketch-btn px-5 py-3 bg-brand hover:bg-brand-hover text-white font-bold text-sm rounded-xl flex items-center gap-2 shadow-sketch"
                            >
                                <Zap className="w-4 h-4 fill-white" />
                                <span>Buka Modal Top Up Game</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setIsTrackerOpen(true)}
                                className="sketch-btn px-5 py-3 bg-brand-subtle hover:bg-sky-200 text-brand-navy font-bold text-sm rounded-xl flex items-center gap-2"
                            >
                                <ReceiptText className="w-4 h-4" />
                                <span>Buka Modal Lacak Invoice</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setIsSearchOpen(true)}
                                className="sketch-btn px-5 py-3 bg-white hover:bg-paper-dark text-ink font-bold text-sm rounded-xl flex items-center gap-2"
                            >
                                <Search className="w-4 h-4" />
                                <span>Buka Modal Pencarian Mobile</span>
                            </button>
                        </div>
                    </section>

                </main>

                {/* Real interactive modals */}
                <TopUpModal
                    product={isTopUpOpen ? MOCK_PRODUCTS[0] : null}
                    onClose={() => setIsTopUpOpen(false)}
                />

                <TransactionTrackerModal
                    isOpen={isTrackerOpen}
                    onClose={() => setIsTrackerOpen(false)}
                />

                <SearchModal
                    isOpen={isSearchOpen}
                    onClose={() => setIsSearchOpen(false)}
                    products={MOCK_PRODUCTS}
                    onSelectProduct={(p) => {
                        setIsSearchOpen(false);
                        setIsTopUpOpen(true);
                    }}
                />

                {/* Android-style Mobile Bottom Navbar */}
                <BottomNav
                    activeTab="style-guide"
                    onTabChange={(tab) => {
                        if (tab === 'home') window.location.href = '/';
                        if (tab === 'katalog') window.location.href = '/#katalog';
                        if (tab === 'transaksi') setIsTrackerOpen(true);
                    }}
                    onOpenSearch={() => setIsSearchOpen(true)}
                />

            </div>
        </>
    );
}
