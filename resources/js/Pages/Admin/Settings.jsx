import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import axios from 'axios';
import { 
    Palette, 
    Type, 
    Save, 
    RotateCcw, 
    Check, 
    Sparkles, 
    Eye, 
    EyeOff,
    ShieldCheck, 
    Mail, 
    Phone, 
    Sliders,
    Zap,
    ExternalLink,
    AlertCircle,
    CheckCircle2,
    KeyRound,
    Lock,
    Copy,
    Cpu,
    Globe,
    RefreshCw,
    Terminal,
    CheckCircle
} from 'lucide-react';

export default function AdminSettings({ auth, settings, presets, callbackUrl }) {
    const [activeTab, setActiveTab] = useState('theme'); // 'theme' | 'identity' | 'h2h'
    const [statusMessage, setStatusMessage] = useState(null);

    // H2H visibility & test states
    const [showApiKey, setShowApiKey] = useState(false);
    const [showApiSecret, setShowApiSecret] = useState(false);
    const [copiedCallback, setCopiedCallback] = useState(false);
    const [copiedKey, setCopiedKey] = useState(false);
    const [copiedSecret, setCopiedSecret] = useState(false);
    const [testingConnection, setTestingConnection] = useState(false);
    const [testResult, setTestResult] = useState(null);

    // Inertia form
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        site_name: settings?.site_name || 'Maitri Project',
        site_tagline: settings?.site_tagline || 'Top Up Game & PPOB Murah, Cepat & Legal',
        brand_logo_text_prefix: settings?.brand_logo_text_prefix || 'MAITRI',
        brand_logo_text_suffix: settings?.brand_logo_text_suffix || 'TOPUP',
        site_description: settings?.site_description || 'Layanan top up game online & PPOB tercepat, termurah, dan 100% legal di Indonesia dengan gaya sketchbook modern.',
        contact_email: settings?.contact_email || 'support@maitriproject.my.id',
        contact_whatsapp: settings?.contact_whatsapp || '081234567890',
        footer_copyright: settings?.footer_copyright || 'Maitri Project. All rights reserved.',
        theme_preset: settings?.theme_preset || 'blue',
        color_primary: settings?.color_primary || '#2563eb',
        color_primary_hover: settings?.color_primary_hover || '#1d4ed8',
        color_accent: settings?.color_accent || '#38bdf8',
        color_subtle: settings?.color_subtle || '#e0f2fe',
        color_navy: settings?.color_navy || '#1e40af',
        h2h_api_url: settings?.h2h_api_url || 'https://maitriproject.my.id/api/v1/h2h',
        h2h_api_key: settings?.h2h_api_key || '',
        h2h_api_secret: settings?.h2h_api_secret || '',
    });

    const handleTestH2h = async () => {
        if (!data.h2h_api_key || !data.h2h_api_key.trim()) {
            alert('Silakan masukkan API Key akun reseller Anda terlebih dahulu.');
            return;
        }

        setTestingConnection(true);
        setTestResult(null);

        try {
            const res = await axios.post(route('admin.settings.test-h2h'), {
                h2h_api_url: data.h2h_api_url,
                h2h_api_key: data.h2h_api_key,
            });
            setTestResult(res.data);
        } catch (err) {
            setTestResult({
                success: false,
                message: err.response?.data?.message || 'Gagal terhubung ke endpoint API server Maitri Project.',
            });
        } finally {
            setTestingConnection(false);
        }
    };

    // Apply 1-click preset
    const applyPreset = (key, presetData) => {
        setData({
            ...data,
            theme_preset: key,
            color_primary: presetData.color_primary,
            color_primary_hover: presetData.color_primary_hover,
            color_accent: presetData.color_accent,
            color_subtle: presetData.color_subtle,
            color_navy: presetData.color_navy,
        });
        setStatusMessage(`Preset "${presetData.name}" dipilih. Klik "Simpan Perubahan" untuk menerapkan.`);
        setTimeout(() => setStatusMessage(null), 4000);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.settings.update'), {
            preserveScroll: true,
            onSuccess: () => {
                setStatusMessage('Pengaturan website dan tema warna berhasil disimpan!');
                setTimeout(() => setStatusMessage(null), 4000);
            },
        });
    };

    const handleReset = () => {
        if (confirm('Apakah Anda yakin ingin mengembalikan seluruh pengaturan teks & warna ke bawaan template?')) {
            router.post(route('admin.settings.reset'), {}, {
                preserveScroll: true,
                onSuccess: () => {
                    setStatusMessage('Pengaturan telah di-reset ke nilai default template.');
                    setTimeout(() => setStatusMessage(null), 4000);
                }
            });
        }
    };

    return (
        <AdminLayout auth={auth} title="Pengaturan & Kustomisasi Tema" activeMenu="settings">
            <div className="space-y-6 max-w-6xl mx-auto">
                
                {/* 1. HEADER BANNER */}
                <div className="sketch-card bg-white p-5 sm:p-6 rounded-3xl border-2 border-ink shadow-sketch flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-brand-subtle text-brand-navy border border-ink shadow-sketch-xs">
                                🎨 STUDIO TEMPLATE & BRANDING
                            </span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black text-ink tracking-tight">
                            Pengaturan Website & Tema Warna
                        </h2>
                        <p className="text-xs sm:text-sm text-ink-muted mt-1">
                            Ubah seluruh teks brand dan sesuaikan komponen warna website agar cocok untuk template usaha Anda.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handleReset}
                            className="sketch-btn px-3 py-2 bg-paper-dark hover:bg-rose-50 text-ink hover:text-rose-700 font-bold text-xs rounded-xl border-2 border-ink shadow-sketch-xs flex items-center gap-1.5 transition-all"
                            title="Reset ke Bawaan"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Reset Bawaan</span>
                        </button>
                        <a
                            href="/"
                            target="_blank"
                            rel="noreferrer"
                            className="sketch-btn px-3.5 py-2 bg-brand text-white font-bold text-xs rounded-xl border-2 border-ink shadow-sketch-xs flex items-center gap-1.5 hover:bg-brand-hover transition-all"
                        >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Lihat Live Web</span>
                        </a>
                    </div>
                </div>

                {/* Status Alert Notification */}
                {statusMessage && (
                    <div className="p-3.5 rounded-2xl bg-emerald-100 border-2 border-ink shadow-sketch-xs flex items-center gap-2.5 text-xs font-bold text-emerald-900 animate-in fade-in">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span>{statusMessage}</span>
                    </div>
                )}

                {/* 2. TAB CONTROLLER */}
                <div className="flex items-center gap-2 p-1.5 bg-paper-dark rounded-2xl border-2 border-ink shadow-sketch-xs overflow-x-auto no-scrollbar">
                    <button
                        type="button"
                        onClick={() => setActiveTab('theme')}
                        className={`flex-1 min-w-[170px] py-2.5 px-4 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 border-2 ${
                            activeTab === 'theme'
                                ? 'bg-brand text-white border-ink shadow-sketch-xs'
                                : 'bg-transparent text-ink border-transparent hover:bg-white/60'
                        }`}
                    >
                        <Palette className="w-4 h-4" />
                        <span>Kustomisasi Warna & Tema</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('identity')}
                        className={`flex-1 min-w-[170px] py-2.5 px-4 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 border-2 ${
                            activeTab === 'identity'
                                ? 'bg-brand text-white border-ink shadow-sketch-xs'
                                : 'bg-transparent text-ink border-transparent hover:bg-white/60'
                        }`}
                    >
                        <Type className="w-4 h-4" />
                        <span>Identitas & Teks Template</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('h2h')}
                        className={`flex-1 min-w-[170px] py-2.5 px-4 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 border-2 ${
                            activeTab === 'h2h'
                                ? 'bg-brand text-white border-ink shadow-sketch-xs'
                                : 'bg-transparent text-ink border-transparent hover:bg-white/60'
                        }`}
                    >
                        <KeyRound className="w-4 h-4" />
                        <span>Koneksi API H2H Maitri</span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-sketch-yellow text-ink border border-ink hidden lg:inline-block">
                            RESELLER
                        </span>
                    </button>
                </div>

                {/* 3. FORM BODY */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* =========================================
                        TAB 1: TEMA & WARNA DINAMIS
                    ========================================== */}
                    {activeTab === 'theme' && (
                        <div className="space-y-6">
                            
                            {/* 1-Click Presets */}
                            <div className="sketch-card bg-white p-5 sm:p-6 rounded-3xl border-2 border-ink shadow-sketch space-y-4">
                                <div className="flex items-center justify-between pb-3 border-b-2 border-ink/10">
                                    <div>
                                        <h3 className="font-black text-base text-ink flex items-center gap-2">
                                            <Sparkles className="w-4 h-4 text-brand" />
                                            <span>Pilihan Preset Tema (1-Klik)</span>
                                        </h3>
                                        <p className="text-xs text-ink-muted">
                                            Pilih palet warna yang sudah dioptimalkan untuk harmoni Style Guide Sketchbook.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {presets && Object.entries(presets).map(([key, item]) => {
                                        const isSelected = data.color_primary.toLowerCase() === item.color_primary.toLowerCase();
                                        return (
                                            <button
                                                key={key}
                                                type="button"
                                                onClick={() => applyPreset(key, item)}
                                                className={`p-3.5 rounded-2xl border-2 text-left transition-all flex items-center justify-between ${
                                                    isSelected
                                                        ? 'bg-paper-dark border-ink shadow-sketch scale-[1.02] ring-2 ring-brand'
                                                        : 'bg-white border-ink/40 hover:border-ink hover:bg-paper-dark/50'
                                                }`}
                                            >
                                                <div className="space-y-1">
                                                    <div className="font-black text-xs text-ink flex items-center gap-1.5">
                                                        <span>{item.name}</span>
                                                        {isSelected && <Check className="w-3.5 h-3.5 text-brand stroke-[3]" />}
                                                    </div>
                                                    <div className="font-mono text-[10px] text-ink-muted">
                                                        {item.color_primary}
                                                    </div>
                                                </div>

                                                {/* Color Preview Dots */}
                                                <div className="flex items-center -space-x-1.5">
                                                    <span 
                                                        className="w-5 h-5 rounded-full border border-ink shadow-xs" 
                                                        style={{ backgroundColor: item.color_primary }}
                                                    ></span>
                                                    <span 
                                                        className="w-5 h-5 rounded-full border border-ink shadow-xs" 
                                                        style={{ backgroundColor: item.color_accent }}
                                                    ></span>
                                                    <span 
                                                        className="w-5 h-5 rounded-full border border-ink shadow-xs" 
                                                        style={{ backgroundColor: item.color_subtle }}
                                                    ></span>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Custom Color Pickers & Live Preview 2-Cols */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                
                                {/* Color Controls (7 cols) */}
                                <div className="lg:col-span-7 sketch-card bg-white p-5 sm:p-6 rounded-3xl border-2 border-ink shadow-sketch space-y-4">
                                    <h3 className="font-black text-base text-ink flex items-center gap-2 pb-2 border-b-2 border-ink/10">
                                        <Sliders className="w-4 h-4 text-brand" />
                                        <span>Pengaturan Kode Warna Kustom (HEX)</span>
                                    </h3>

                                    <div className="space-y-4 text-xs font-bold">
                                        {/* Primary Color */}
                                        <div>
                                            <label className="block mb-1 text-ink">
                                                Warna Utama (Brand Primary):
                                                <span className="text-[10px] text-ink-muted font-normal block">
                                                    Digunakan pada tombol utama, badge terpilih, dan ikon penting.
                                                </span>
                                            </label>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="color"
                                                    value={data.color_primary}
                                                    onChange={(e) => setData('color_primary', e.target.value)}
                                                    className="w-12 h-10 rounded-xl border-2 border-ink cursor-pointer p-1 bg-white shadow-sketch-xs"
                                                />
                                                <input
                                                    type="text"
                                                    value={data.color_primary}
                                                    onChange={(e) => setData('color_primary', e.target.value)}
                                                    placeholder="#2563eb"
                                                    className="sketch-input flex-1 px-3 py-2 rounded-xl border-2 border-ink font-mono text-xs font-bold uppercase"
                                                />
                                            </div>
                                            {errors.color_primary && <div className="text-rose-600 text-[10px] mt-1">{errors.color_primary}</div>}
                                        </div>

                                        {/* Primary Hover Color */}
                                        <div>
                                            <label className="block mb-1 text-ink">
                                                Warna Saat Ditekan/Hover:
                                                <span className="text-[10px] text-ink-muted font-normal block">
                                                    Warna tombol saat cursor mouse berada di atas tombol.
                                                </span>
                                            </label>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="color"
                                                    value={data.color_primary_hover}
                                                    onChange={(e) => setData('color_primary_hover', e.target.value)}
                                                    className="w-12 h-10 rounded-xl border-2 border-ink cursor-pointer p-1 bg-white shadow-sketch-xs"
                                                />
                                                <input
                                                    type="text"
                                                    value={data.color_primary_hover}
                                                    onChange={(e) => setData('color_primary_hover', e.target.value)}
                                                    placeholder="#1d4ed8"
                                                    className="sketch-input flex-1 px-3 py-2 rounded-xl border-2 border-ink font-mono text-xs font-bold uppercase"
                                                />
                                            </div>
                                        </div>

                                        {/* Accent Color */}
                                        <div>
                                            <label className="block mb-1 text-ink">
                                                Warna Aksen Cerah (Accent):
                                                <span className="text-[10px] text-ink-muted font-normal block">
                                                    Warna kilau, highlight teks, dan seleksi background.
                                                </span>
                                            </label>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="color"
                                                    value={data.color_accent}
                                                    onChange={(e) => setData('color_accent', e.target.value)}
                                                    className="w-12 h-10 rounded-xl border-2 border-ink cursor-pointer p-1 bg-white shadow-sketch-xs"
                                                />
                                                <input
                                                    type="text"
                                                    value={data.color_accent}
                                                    onChange={(e) => setData('color_accent', e.target.value)}
                                                    placeholder="#38bdf8"
                                                    className="sketch-input flex-1 px-3 py-2 rounded-xl border-2 border-ink font-mono text-xs font-bold uppercase"
                                                />
                                            </div>
                                        </div>

                                        {/* Subtle Tint Background */}
                                        <div>
                                            <label className="block mb-1 text-ink">
                                                Warna Latar Lembut (Subtle Tint):
                                                <span className="text-[10px] text-ink-muted font-normal block">
                                                    Latar belakang badge, kotak info, dan highlight kartu.
                                                </span>
                                            </label>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="color"
                                                    value={data.color_subtle}
                                                    onChange={(e) => setData('color_subtle', e.target.value)}
                                                    className="w-12 h-10 rounded-xl border-2 border-ink cursor-pointer p-1 bg-white shadow-sketch-xs"
                                                />
                                                <input
                                                    type="text"
                                                    value={data.color_subtle}
                                                    onChange={(e) => setData('color_subtle', e.target.value)}
                                                    placeholder="#e0f2fe"
                                                    className="sketch-input flex-1 px-3 py-2 rounded-xl border-2 border-ink font-mono text-xs font-bold uppercase"
                                                />
                                            </div>
                                        </div>

                                        {/* Dark / Navy Tone */}
                                        <div>
                                            <label className="block mb-1 text-ink">
                                                Warna Kontras Gelap (Dark Navy):
                                                <span className="text-[10px] text-ink-muted font-normal block">
                                                    Teks di atas latar belakang subtle dan badge status.
                                                </span>
                                            </label>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="color"
                                                    value={data.color_navy}
                                                    onChange={(e) => setData('color_navy', e.target.value)}
                                                    className="w-12 h-10 rounded-xl border-2 border-ink cursor-pointer p-1 bg-white shadow-sketch-xs"
                                                />
                                                <input
                                                    type="text"
                                                    value={data.color_navy}
                                                    onChange={(e) => setData('color_navy', e.target.value)}
                                                    placeholder="#1e40af"
                                                    className="sketch-input flex-1 px-3 py-2 rounded-xl border-2 border-ink font-mono text-xs font-bold uppercase"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Live Real-Time Interactive Preview Box (5 cols) */}
                                <div className="lg:col-span-5 space-y-4">
                                    <div className="sketch-card bg-paper-grid p-5 rounded-3xl border-2 border-ink shadow-sketch sticky top-24 space-y-4">
                                        <div className="flex items-center justify-between pb-3 border-b-2 border-ink/10">
                                            <h3 className="font-black text-sm text-ink flex items-center gap-1.5">
                                                <Eye className="w-4 h-4 text-brand" />
                                                <span>Live Real-Time Preview</span>
                                            </h3>
                                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-ink">
                                                Otomatis
                                            </span>
                                        </div>

                                        {/* Live Preview Box Content */}
                                        <div className="space-y-4 p-4 rounded-2xl bg-white border-2 border-ink shadow-sketch-xs">
                                            
                                            {/* Preview: Brand Logo */}
                                            <div className="flex items-center gap-2">
                                                <div 
                                                    className="w-8 h-8 rounded-xl text-white font-mono font-black text-sm border-2 border-ink shadow-sketch-xs flex items-center justify-center shrink-0"
                                                    style={{ backgroundColor: data.color_primary }}
                                                >
                                                    {data.brand_logo_text_prefix?.charAt(0) || 'M'}
                                                </div>
                                                <span className="font-black text-base text-ink tracking-tight font-sans uppercase">
                                                    {data.brand_logo_text_prefix || 'MAITRI'}
                                                    <span style={{ color: data.color_primary }}>
                                                        {data.brand_logo_text_suffix || 'TOPUP'}
                                                    </span>
                                                </span>
                                            </div>

                                            {/* Preview: Buttons */}
                                            <div className="space-y-2 pt-2 border-t border-ink/10">
                                                <div className="text-[10px] font-mono uppercase text-ink-muted font-bold">
                                                    Contoh Tombol Aksi:
                                                </div>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <button
                                                        type="button"
                                                        className="px-4 py-2 text-white font-black text-xs rounded-xl border-2 border-ink shadow-sketch-xs flex items-center gap-1.5"
                                                        style={{ 
                                                            backgroundColor: data.color_primary,
                                                        }}
                                                    >
                                                        <Zap className="w-3.5 h-3.5 fill-white" />
                                                        <span>Beli Sekarang</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="px-3 py-2 font-bold text-xs rounded-xl border-2 border-ink shadow-sketch-xs bg-white text-ink"
                                                    >
                                                        Pilih Nominal
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Preview: Badges & Tags */}
                                            <div className="space-y-2 pt-2 border-t border-ink/10">
                                                <div className="text-[10px] font-mono uppercase text-ink-muted font-bold">
                                                    Contoh Badge & Status:
                                                </div>
                                                <div className="flex flex-wrap items-center gap-1.5">
                                                    <span 
                                                        className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold border border-ink shadow-sketch-xs"
                                                        style={{ 
                                                            backgroundColor: data.color_subtle, 
                                                            color: data.color_navy 
                                                        }}
                                                    >
                                                        ✨ PROMO MEMBER VIP
                                                    </span>
                                                    <span 
                                                        className="px-2 py-0.5 rounded text-[10px] font-mono font-bold text-white border border-ink"
                                                        style={{ backgroundColor: data.color_primary }}
                                                    >
                                                        POPULER
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Preview: Price Highlight */}
                                            <div className="p-3 rounded-xl border-2 border-ink bg-paper-dark flex items-center justify-between">
                                                <div>
                                                    <div className="text-[10px] font-mono text-ink-muted font-bold">PRODUK PREVIEW</div>
                                                    <div className="font-black text-xs text-ink">86 Diamonds Mobile Legends</div>
                                                </div>
                                                <div 
                                                    className="font-mono font-black text-base"
                                                    style={{ color: data.color_primary }}
                                                >
                                                    Rp 21.500
                                                </div>
                                            </div>

                                        </div>

                                        <p className="text-[11px] text-ink-muted leading-relaxed font-medium">
                                            ℹ️ Begitu tombol <strong>Simpan Perubahan</strong> ditekan, seluruh navbar, footer, kartu, dan tombol di halaman pengguna langsung menerapkan palet ini.
                                        </p>
                                    </div>
                                </div>

                            </div>

                        </div>
                    )}

                    {/* =========================================
                        TAB 2: IDENTITAS & TEKS TEMPLATE
                    ========================================== */}
                    {activeTab === 'identity' && (
                        <div className="sketch-card bg-white p-5 sm:p-6 rounded-3xl border-2 border-ink shadow-sketch space-y-5">
                            <div className="pb-3 border-b-2 border-ink/10">
                                <h3 className="font-black text-base text-ink flex items-center gap-2">
                                    <Type className="w-4 h-4 text-brand" />
                                    <span>Identitas & Informasi Template Website</span>
                                </h3>
                                <p className="text-xs text-ink-muted">
                                    Ganti nama "Maitri" dengan nama brand, toko, atau bisnis Anda sendiri.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold">
                                
                                {/* Site Name */}
                                <div>
                                    <label className="block mb-1 text-ink">Nama Website / Usaha:</label>
                                    <input
                                        type="text"
                                        value={data.site_name}
                                        onChange={(e) => setData('site_name', e.target.value)}
                                        placeholder="Cth: Garuda TopUp"
                                        className="sketch-input w-full px-3.5 py-2.5 rounded-xl border-2 border-ink font-sans text-xs font-medium"
                                        required
                                    />
                                    {errors.site_name && <div className="text-rose-600 text-[10px] mt-1">{errors.site_name}</div>}
                                </div>

                                {/* Site Tagline */}
                                <div>
                                    <label className="block mb-1 text-ink">Slogan / Tagline Website:</label>
                                    <input
                                        type="text"
                                        value={data.site_tagline}
                                        onChange={(e) => setData('site_tagline', e.target.value)}
                                        placeholder="Cth: Top Up Game Cepat, Termurah & Terpercaya"
                                        className="sketch-input w-full px-3.5 py-2.5 rounded-xl border-2 border-ink font-sans text-xs font-medium"
                                    />
                                </div>

                                {/* Brand Logo Prefix */}
                                <div>
                                    <label className="block mb-1 text-ink">Teks Logo Depan (Prefix):</label>
                                    <input
                                        type="text"
                                        value={data.brand_logo_text_prefix}
                                        onChange={(e) => setData('brand_logo_text_prefix', e.target.value.toUpperCase())}
                                        placeholder="Cth: GARUDA"
                                        className="sketch-input w-full px-3.5 py-2.5 rounded-xl border-2 border-ink font-mono text-xs font-bold uppercase"
                                        required
                                    />
                                    <span className="text-[10px] text-ink-muted font-normal block mt-1">
                                        Huruf pertama akan dijadikan inisial ikon logo (Cth: "G").
                                    </span>
                                </div>

                                {/* Brand Logo Suffix */}
                                <div>
                                    <label className="block mb-1 text-ink">Teks Logo Belakang (Suffix Berwarna):</label>
                                    <input
                                        type="text"
                                        value={data.brand_logo_text_suffix}
                                        onChange={(e) => setData('brand_logo_text_suffix', e.target.value.toUpperCase())}
                                        placeholder="Cth: TOPUP"
                                        className="sketch-input w-full px-3.5 py-2.5 rounded-xl border-2 border-ink font-mono text-xs font-bold uppercase"
                                        required
                                    />
                                    <span className="text-[10px] text-ink-muted font-normal block mt-1">
                                        Bagian teks logo yang diwarnai dengan warna brand utama.
                                    </span>
                                </div>

                                {/* Support Email */}
                                <div>
                                    <label className="block mb-1 text-ink">Email Dukungan Pelanggan (CS):</label>
                                    <input
                                        type="email"
                                        value={data.contact_email}
                                        onChange={(e) => setData('contact_email', e.target.value)}
                                        placeholder="Cth: cs@tokoanda.com"
                                        className="sketch-input w-full px-3.5 py-2.5 rounded-xl border-2 border-ink font-sans text-xs font-medium"
                                    />
                                </div>

                                {/* Support WhatsApp */}
                                <div>
                                    <label className="block mb-1 text-ink">Nomor WhatsApp Customer Service:</label>
                                    <input
                                        type="text"
                                        value={data.contact_whatsapp}
                                        onChange={(e) => setData('contact_whatsapp', e.target.value)}
                                        placeholder="Cth: 081234567890"
                                        className="sketch-input w-full px-3.5 py-2.5 rounded-xl border-2 border-ink font-mono text-xs font-medium"
                                    />
                                </div>

                                {/* Site Description (Full width) */}
                                <div className="md:col-span-2">
                                    <label className="block mb-1 text-ink">Deskripsi Singkat / SEO Website:</label>
                                    <textarea
                                        rows="2"
                                        value={data.site_description}
                                        onChange={(e) => setData('site_description', e.target.value)}
                                        placeholder="Deskripsi ringkas yang tampil di footer dan meta tag pencarian..."
                                        className="sketch-input w-full px-3.5 py-2.5 rounded-xl border-2 border-ink font-sans text-xs font-medium resize-none"
                                    ></textarea>
                                </div>

                                {/* Footer Copyright (Full width) */}
                                <div className="md:col-span-2">
                                    <label className="block mb-1 text-ink">Teks Hak Cipta (Footer Copyright):</label>
                                    <input
                                        type="text"
                                        value={data.footer_copyright}
                                        onChange={(e) => setData('footer_copyright', e.target.value)}
                                        placeholder="Cth: Garuda TopUp Indonesia. All rights reserved."
                                        className="sketch-input w-full px-3.5 py-2.5 rounded-xl border-2 border-ink font-sans text-xs font-medium"
                                    />
                                </div>

                            </div>
                        </div>
                    )}

                    {/* =========================================
                        TAB 3: INTEGRASI API H2H MAITRI PROJECT
                    ========================================== */}
                    {activeTab === 'h2h' && (
                        <div className="space-y-6">
                            
                            {/* Card 1: H2H Overview & Documentation Link */}
                            <div className="sketch-card bg-paper-grid p-5 sm:p-6 rounded-3xl border-2 border-ink shadow-sketch">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="space-y-1">
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-subtle text-brand-navy border border-ink text-[11px] font-mono font-bold">
                                            <Cpu className="w-3.5 h-3.5" />
                                            <span>MAITRI H2H REST API v1</span>
                                        </div>
                                        <h3 className="text-lg font-black text-ink">
                                            Koneksi Host-to-Host (H2H) Maitri Project
                                        </h3>
                                        <p className="text-xs text-ink-muted leading-relaxed max-w-2xl">
                                            Website ini dirancang khusus sebagai template klien H2H resmi dari platform <strong className="text-ink">Maitri Project (https://maitriproject.my.id)</strong>. Hubungkan Link API, API Key, dan API Secret reseller Anda untuk memproses transaksi secara otomatis.
                                        </p>
                                    </div>

                                    <a
                                        href="https://maitriproject.my.id/docs/h2h"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="sketch-btn px-4 py-2.5 bg-white text-ink hover:text-brand font-bold text-xs rounded-xl border-2 border-ink shadow-sketch-xs flex items-center justify-center gap-2 shrink-0 transition-all"
                                    >
                                        <ExternalLink className="w-4 h-4 text-brand" />
                                        <span>Buka Tutorial H2H ↗</span>
                                    </a>
                                </div>
                            </div>

                            {/* Card 2: Main Credentials Input */}
                            <div className="sketch-card bg-white p-5 sm:p-6 rounded-3xl border-2 border-ink shadow-sketch space-y-5">
                                <div className="border-b-2 border-ink/10 pb-3">
                                    <h4 className="text-sm font-black text-ink font-mono uppercase tracking-wider flex items-center gap-2">
                                        <KeyRound className="w-4 h-4 text-brand" />
                                        Kredensial Otentikasi API
                                    </h4>
                                    <p className="text-xs text-ink-muted mt-0.5">
                                        Dapatkan API Key dan API Secret dari dashboard akun Reseller Anda di website Maitri Project.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    {/* Link API / Base URL */}
                                    <div>
                                        <label className="block text-xs font-mono font-bold uppercase tracking-wider text-ink mb-1.5 flex items-center justify-between">
                                            <span>Link API (Base URL Endpoint):</span>
                                            <span className="text-[10px] text-ink-muted lowercase font-normal font-mono">
                                                Default: https://maitriproject.my.id/api/v1/h2h
                                            </span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-muted">
                                                <Globe className="w-4 h-4" />
                                            </div>
                                            <input
                                                type="url"
                                                value={data.h2h_api_url}
                                                onChange={(e) => setData('h2h_api_url', e.target.value)}
                                                placeholder="https://maitriproject.my.id/api/v1/h2h"
                                                className="sketch-input w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-ink font-mono text-xs font-bold"
                                                required
                                            />
                                        </div>
                                        <p className="text-[11px] text-ink-muted mt-1 leading-normal">
                                            URL induk penyedia API Maitri Project. Digunakan untuk rute <code className="bg-paper-dark px-1 py-0.5 rounded border border-ink/30 text-[10px]">/profile</code>, <code className="bg-paper-dark px-1 py-0.5 rounded border border-ink/30 text-[10px]">/products</code>, <code className="bg-paper-dark px-1 py-0.5 rounded border border-ink/30 text-[10px]">/checkout</code>, dan <code className="bg-paper-dark px-1 py-0.5 rounded border border-ink/30 text-[10px]">/status/{'{ref_id}'}</code>.
                                        </p>
                                    </div>

                                    {/* API Key */}
                                    <div>
                                        <label className="block text-xs font-mono font-bold uppercase tracking-wider text-ink mb-1.5">
                                            API Key (X-Maitri-API-Key):
                                        </label>
                                        <div className="relative flex items-center">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-muted">
                                                <KeyRound className="w-4 h-4" />
                                            </div>
                                            <input
                                                type={showApiKey ? 'text' : 'password'}
                                                value={data.h2h_api_key}
                                                onChange={(e) => setData('h2h_api_key', e.target.value)}
                                                placeholder="Cth: mt_live_8f910a2b3c4d5e6f..."
                                                className="sketch-input w-full pl-10 pr-24 py-2.5 rounded-xl border-2 border-ink font-mono text-xs font-bold"
                                            />
                                            <div className="absolute inset-y-0 right-0 pr-2 flex items-center gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowApiKey(!showApiKey)}
                                                    className="p-1 text-ink-muted hover:text-ink rounded hover:bg-paper-dark"
                                                    title={showApiKey ? 'Sembunyikan' : 'Tampilkan'}
                                                >
                                                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                                {data.h2h_api_key && (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(data.h2h_api_key);
                                                            setCopiedKey(true);
                                                            setTimeout(() => setCopiedKey(false), 2000);
                                                        }}
                                                        className="p-1 text-ink-muted hover:text-ink rounded hover:bg-paper-dark"
                                                        title="Salin API Key"
                                                    >
                                                        {copiedKey ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-[11px] text-ink-muted mt-1 leading-normal">
                                            Kunci unik reseller yang dikirimkan pada HTTP header permintaan API untuk mengidentifikasi akun Anda.
                                        </p>
                                    </div>

                                    {/* API Secret */}
                                    <div>
                                        <label className="block text-xs font-mono font-bold uppercase tracking-wider text-ink mb-1.5">
                                            API Secret (Kunci HMAC-SHA256):
                                        </label>
                                        <div className="relative flex items-center">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-muted">
                                                <Lock className="w-4 h-4" />
                                            </div>
                                            <input
                                                type={showApiSecret ? 'text' : 'password'}
                                                value={data.h2h_api_secret}
                                                onChange={(e) => setData('h2h_api_secret', e.target.value)}
                                                placeholder="Cth: mt_sec_99aa88bb77cc66dd55ee44ff..."
                                                className="sketch-input w-full pl-10 pr-24 py-2.5 rounded-xl border-2 border-ink font-mono text-xs font-bold"
                                            />
                                            <div className="absolute inset-y-0 right-0 pr-2 flex items-center gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowApiSecret(!showApiSecret)}
                                                    className="p-1 text-ink-muted hover:text-ink rounded hover:bg-paper-dark"
                                                    title={showApiSecret ? 'Sembunyikan' : 'Tampilkan'}
                                                >
                                                    {showApiSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                                {data.h2h_api_secret && (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(data.h2h_api_secret);
                                                            setCopiedSecret(true);
                                                            setTimeout(() => setCopiedSecret(false), 2000);
                                                        }}
                                                        className="p-1 text-ink-muted hover:text-ink rounded hover:bg-paper-dark"
                                                        title="Salin API Secret"
                                                    >
                                                        {copiedSecret ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-[11px] text-ink-muted mt-1 leading-normal">
                                            Kunci rahasia untuk menghasilkan tanda tangan digital <code className="bg-paper-dark px-1 py-0.5 rounded border border-ink/30 text-[10px]">X-Maitri-Signature</code> via formula <code className="bg-paper-dark px-1 py-0.5 rounded border border-ink/30 text-[10px]">hash_hmac('sha256', reseller_ref_id . api_key, api_secret)</code>.
                                        </p>
                                    </div>
                                </div>

                                {/* Uji Koneksi Button & Result Box */}
                                <div className="pt-3 border-t-2 border-dashed border-ink/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div>
                                        <p className="text-xs font-bold text-ink">Tes Validitas Kredensial:</p>
                                        <p className="text-[11px] text-ink-muted">Uji apakah API Key Anda dapat membaca profil & saldo reseller di Maitri Project.</p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleTestH2h}
                                        disabled={testingConnection || !data.h2h_api_key}
                                        className="sketch-btn px-4 py-2 bg-brand-subtle hover:bg-brand-accent text-brand-navy border-2 border-ink text-xs font-black rounded-xl shadow-sketch-xs flex items-center justify-center gap-1.5 shrink-0 transition-all disabled:opacity-40"
                                    >
                                        <RefreshCw className={`w-3.5 h-3.5 ${testingConnection ? 'animate-spin' : ''}`} />
                                        <span>{testingConnection ? 'Sedang Menguji...' : '⚡ Uji Koneksi API'}</span>
                                    </button>
                                </div>

                                {/* Live Test Result Box */}
                                {testResult && (
                                    <div className={`p-4 rounded-2xl border-2 border-ink shadow-sketch-xs animate-in fade-in duration-200 ${
                                        testResult.success ? 'bg-emerald-50 border-emerald-900' : 'bg-rose-50 border-rose-900'
                                    }`}>
                                        <div className="flex items-start gap-2.5">
                                            {testResult.success ? (
                                                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                                            ) : (
                                                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                                            )}
                                            <div className="space-y-1 text-xs">
                                                <p className={`font-black ${testResult.success ? 'text-emerald-900' : 'text-rose-900'}`}>
                                                    {testResult.message}
                                                </p>
                                                {testResult.profile && (
                                                    <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
                                                        <div className="p-2 bg-white/80 rounded-lg border border-ink/20">
                                                            <span className="text-ink-muted block">Nama Reseller:</span>
                                                            <strong className="text-ink truncate block" title={testResult.profile.reseller_name || testResult.profile.name}>
                                                                {testResult.profile.reseller_name || testResult.profile.name || testResult.profile.store_name || '-'}
                                                            </strong>
                                                        </div>
                                                        <div className="p-2 bg-white/80 rounded-lg border border-ink/20">
                                                            <span className="text-ink-muted block">Email:</span>
                                                            <strong className="text-ink truncate block" title={testResult.profile.email}>
                                                                {testResult.profile.email || '-'}
                                                            </strong>
                                                        </div>
                                                        <div className="p-2 bg-white/80 rounded-lg border border-ink/20">
                                                            <span className="text-ink-muted block">Saldo Akun:</span>
                                                            <strong className="text-emerald-700">
                                                                {testResult.profile.formatted_balance || `Rp ${Number(testResult.profile.commission_balance ?? testResult.profile.balance ?? 0).toLocaleString('id-ID')}`}
                                                            </strong>
                                                        </div>
                                                        <div className="p-2 bg-white/80 rounded-lg border border-ink/20">
                                                            <span className="text-ink-muted block">Status:</span>
                                                            <span className="inline-block px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-black border border-emerald-300">
                                                                {testResult.profile.status || 'ACTIVE'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Card 3: Webhook Callback URL Information */}
                            <div className="sketch-card bg-paper-dark p-5 sm:p-6 rounded-3xl border-2 border-ink shadow-sketch space-y-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-sketch-sky text-ink border border-ink shadow-sketch-xs">
                                        WEBHOOK CALLBACK LISTENER
                                    </span>
                                </div>
                                <h4 className="text-base font-black text-ink">
                                    URL Callback Notifikasi Otomatis
                                </h4>
                                <p className="text-xs text-ink-muted leading-relaxed">
                                    Pasang URL berikut pada kolom <strong className="text-ink">Webhook URL</strong> di profil Reseller Maitri Project Anda. Server Maitri akan mengirimkan webhook HTTP POST saat status pembayaran QRIS berubah atau pesanan selesai.
                                </p>

                                <div className="flex flex-col sm:flex-row items-stretch gap-2 pt-1">
                                    <input
                                        type="text"
                                        readOnly
                                        value={callbackUrl || (typeof window !== 'undefined' ? `${window.location.origin}/api/h2h/callback` : '/api/h2h/callback')}
                                        className="sketch-input flex-1 px-3.5 py-2.5 rounded-xl border-2 border-ink font-mono text-xs font-bold bg-white text-ink select-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const urlToCopy = callbackUrl || `${window.location.origin}/api/h2h/callback`;
                                            navigator.clipboard.writeText(urlToCopy);
                                            setCopiedCallback(true);
                                            setTimeout(() => setCopiedCallback(false), 2000);
                                        }}
                                        className="sketch-btn px-4 py-2.5 bg-brand-accent text-ink font-bold text-xs rounded-xl border-2 border-ink shadow-sketch-xs flex items-center justify-center gap-1.5 shrink-0 active:scale-95 transition-all"
                                    >
                                        {copiedCallback ? <Check className="w-4 h-4 text-ink" /> : <Copy className="w-4 h-4" />}
                                        <span>{copiedCallback ? 'URL Disalin!' : 'Salin Webhook URL'}</span>
                                    </button>
                                </div>

                                <div className="pt-3 border-t border-dashed border-ink/20 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px]">
                                    <div className="p-2.5 bg-white rounded-xl border border-ink/20">
                                        <span className="font-mono font-bold text-emerald-700 block">1. payment.success</span>
                                        <p className="text-ink-muted mt-0.5">Pembeli melunasi pembayaran QRIS Paydisini.</p>
                                    </div>
                                    <div className="p-2.5 bg-white rounded-xl border border-ink/20">
                                        <span className="font-mono font-bold text-rose-700 block">2. payment.expired</span>
                                        <p className="text-ink-muted mt-0.5">Batas waktu bayar QRIS telah habis atau dibatalkan.</p>
                                    </div>
                                    <div className="p-2.5 bg-white rounded-xl border border-ink/20">
                                        <span className="font-mono font-bold text-brand block">3. topup.completed</span>
                                        <p className="text-ink-muted mt-0.5">Diamond/produk sukses masuk (SN) atau refund bila gagal.</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}

                    {/* 4. SUBMIT ACTION BAR */}
                    <div className="sketch-card bg-paper p-4 rounded-2xl border-2 border-ink shadow-sketch flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-xs font-bold text-ink-muted">
                            <AlertCircle className="w-4 h-4 text-brand" />
                            <span>Perubahan akan langsung aktif untuk seluruh pengunjung website.</span>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="sketch-btn px-6 py-2.5 bg-brand hover:bg-brand-hover text-white font-black text-xs rounded-xl border-2 border-ink shadow-sketch-xs flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" />
                            <span>{processing ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
                        </button>
                    </div>

                </form>

            </div>
        </AdminLayout>
    );
}
