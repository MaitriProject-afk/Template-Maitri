import React, { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';
import HeroBanner from '../Components/HeroBanner';
import ProductGrid from '../Components/ProductGrid';
import { MessageCircle, CheckCircle2 } from 'lucide-react';

export default function Welcome({ auth, categories = [], products = [], laravelVersion, phpVersion }) {
    const { site } = usePage().props;
    const siteName = site?.site_name || 'Maitri Project';
    const siteTagline = site?.site_tagline || 'Top Up Game & PPOB Murah, Cepat & Legal';
    const siteDescription = site?.site_description || 'Layanan top up game online (Mobile Legends, Free Fire, Genshin Impact) & PPOB tercepat, termurah, dan 100% legal di Indonesia dengan gaya sketchbook modern.';
    const contactWhatsapp = site?.contact_whatsapp || '081234567890';
    const waNumber = contactWhatsapp.replace(/[^0-9]/g, '');
    const waUrl = waNumber.startsWith('0') ? `https://wa.me/62${waNumber.slice(1)}` : `https://wa.me/${waNumber}`;

    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isTrackingOpen, setIsTrackingOpen] = useState(false);

    const handleSelectProduct = (prod) => {
        const slug = prod.slug || (prod.name ? prod.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'indosat');
        router.visit(`/product/${slug}`);
    };

    return (
        <MainLayout
            auth={auth}
            title={`${siteName} — ${siteTagline}`}
            description={siteDescription}
            activeTab="home"
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelectProduct={handleSelectProduct}
            isTrackerOpen={isTrackingOpen}
            setIsTrackerOpen={setIsTrackingOpen}
        >
                    
                    {/* 2. Hero Section (Sketchbook style) */}
                    <HeroBanner
                        onOpenTracking={() => setIsTrackingOpen(true)}
                        onSelectCategory={(cat) => {
                            setActiveCategory(cat);
                            const el = document.getElementById('katalog');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                    />

                    {/* 3. Stats Bar / Trust Badges */}
                    <section className="py-4 border-y-2 border-ink bg-white">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center divide-y md:divide-y-0 md:divide-x-2 divide-ink/10">
                                <div className="p-2">
                                    <div className="text-xl sm:text-2xl font-black font-mono text-ink">
                                        50.000+
                                    </div>
                                    <div className="text-[11px] font-sketch font-bold text-ink-muted mt-0.5">
                                        Transaksi Sukses
                                    </div>
                                </div>
                                <div className="p-2">
                                    <div className="text-xl sm:text-2xl font-black font-mono text-brand">
                                        1-3 Detik
                                    </div>
                                    <div className="text-[11px] font-sketch font-bold text-ink-muted mt-0.5">
                                        Rata-rata Proses
                                    </div>
                                </div>
                                <div className="p-2">
                                    <div className="text-xl sm:text-2xl font-black font-mono text-ink">
                                        24 / 7
                                    </div>
                                    <div className="text-[11px] font-sketch font-bold text-ink-muted mt-0.5">
                                        Layanan Tanpa Libur
                                    </div>
                                </div>
                                <div className="p-2">
                                    <div className="text-xl sm:text-2xl font-black font-mono text-ink">
                                        100% Legal
                                    </div>
                                    <div className="text-[11px] font-sketch font-bold text-ink-muted mt-0.5">
                                        Garansi Akun Aman
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 4. Product Catalog / Game Grid */}
                    <ProductGrid
                        categories={categories}
                        products={products}
                        activeCategory={activeCategory}
                        onSelectCategory={setActiveCategory}
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        onSelectProduct={handleSelectProduct}
                    />

                    {/* 5. How It Works (Sketchbook 4-Step Guide) */}
                    <section id="keunggulan" className="py-12 bg-paper-grid border-t-2 border-ink">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center max-w-xl mx-auto mb-10">
                                <span className="text-xs font-mono font-bold uppercase px-3 py-1 bg-brand-subtle text-brand-navy border-2 border-ink rounded-full shadow-sketch-xs">
                                    CARA TOP UP MUDAH
                                </span>
                                <h2 className="text-2xl sm:text-3xl font-black text-ink mt-3">
                                    Hanya 4 Langkah Kilat
                                </h2>
                                <p className="text-xs sm:text-sm text-ink-muted mt-1">
                                    Tanpa perlu registrasi rumit, kamu bisa langsung bertransaksi dalam 1 menit.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {[
                                    {
                                        step: '01',
                                        title: 'Pilih Game & Produk',
                                        desc: 'Pilih game favorit dan nominal diamond atau voucher yang diinginkan.',
                                        color: 'bg-sketch-yellow text-ink',
                                    },
                                    {
                                        step: '02',
                                        title: 'Masukkan User ID',
                                        desc: 'Isikan User ID & Server ID akun kamu secara teliti tanpa typo.',
                                        color: 'bg-sketch-sky text-ink',
                                    },
                                    {
                                        step: '03',
                                        title: 'Bayar Otomatis',
                                        desc: 'Pilih metode bayar via QRIS, E-Wallet, atau Virtual Account Bank.',
                                        color: 'bg-sketch-coral text-ink',
                                    },
                                    {
                                        step: '04',
                                        title: 'Diamond Mendarat!',
                                        desc: 'Sistem bot otomatis mengirimkan diamond dalam 1-3 detik setelah bayar.',
                                        color: 'bg-brand text-white',
                                    },
                                ].map((item, idx) => (
                                    <div 
                                        key={idx} 
                                        className="sketch-card p-5 bg-white flex flex-col justify-between"
                                    >
                                        <div>
                                            <div className={`w-10 h-10 rounded-xl ${item.color} border-2 border-ink shadow-sketch-xs font-mono font-black flex items-center justify-center text-sm mb-3`}>
                                                {item.step}
                                            </div>
                                            <h3 className="font-extrabold text-ink text-base mb-1">
                                                {item.title}
                                            </h3>
                                            <p className="text-xs text-ink-muted leading-relaxed">
                                                {item.desc}
                                            </p>
                                        </div>
                                        <div className="mt-4 pt-3 border-t border-dashed border-ink/20 flex items-center gap-1 text-[11px] font-sketch font-bold text-ink">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-brand" />
                                            <span>Mudah & Cepat</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* 6. CTA WhatsApp & Reseller Banner */}
                    <section className="py-10 bg-brand border-t-2 border-ink">
                        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="sketch-card bg-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
                                <div>
                                    <span className="text-xs font-mono font-bold uppercase px-2.5 py-0.5 rounded bg-brand-subtle text-brand-navy border border-ink">
                                        CS & RESELLER
                                    </span>
                                    <h3 className="text-xl sm:text-2xl font-black text-ink mt-2">
                                        Mau Harga Lebih Murah untuk Jualan?
                                    </h3>
                                    <p className="text-xs sm:text-sm text-ink-muted mt-1 max-w-md">
                                        Gabung jadi reseller VIP {siteName} dan dapatkan akses API H2H dengan harga distributor termurah.
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full sm:w-auto">
                                    <a
                                        href={waUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="sketch-btn px-5 py-3 bg-brand text-white hover:bg-brand-hover font-bold text-xs sm:text-sm rounded-xl inline-flex items-center justify-center gap-2"
                                    >
                                        <MessageCircle className="w-4 h-4" />
                                        <span>Hubungi Admin WA</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </section>

        </MainLayout>
    );
}
