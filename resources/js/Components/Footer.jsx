import React from 'react';
import { usePage } from '@inertiajs/react';
import { Gamepad2, ShieldCheck, Heart, MessageCircle, Mail, MapPin } from 'lucide-react';

const PAYMENT_CHANNELS = [
    'QRIS Realtime', 'BCA VA', 'Mandiri VA', 'BRI VA', 'BNI VA', 
    'DANA', 'GoPay', 'OVO', 'ShopeePay', 'Alfamart', 'Indomaret'
];

export default function Footer() {
    const { site } = usePage().props;
    const siteName = site?.site_name || 'Maitri Project';
    const sitePrefix = site?.brand_logo_text_prefix || 'MAITRI';
    const siteSuffix = site?.brand_logo_text_suffix || 'TOPUP';
    const siteTagline = site?.site_tagline || 'Sketsa Top Up Game & PPOB Terpercaya';
    const siteDescription = site?.site_description || 'Platform penyedia layanan top up game online, voucher digital, dan pembayaran tagihan PPOB otomatis 24 jam dengan harga termurah dan 100% legal di Indonesia.';
    const contactEmail = site?.contact_email || 'support@maitriproject.my.id';
    const contactWhatsapp = site?.contact_whatsapp || '081234567890';
    const copyright = site?.footer_copyright || `${siteName}. All rights reserved.`;

    // Clean phone number for wa.me
    const waNumber = contactWhatsapp.replace(/[^0-9]/g, '');
    const waUrl = waNumber.startsWith('0') ? `https://wa.me/62${waNumber.slice(1)}` : `https://wa.me/${waNumber}`;

    return (
        <footer className="bg-paper-dark border-t-2 border-ink pt-12 pb-28 md:pb-12 text-ink">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Main Footer Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b-2 border-dashed border-ink/20">
                    
                    {/* Brand Info (5 cols) */}
                    <div className="md:col-span-5 space-y-4">
                        <div className="flex items-center gap-2.5">
                            <div className="w-10 h-10 bg-brand-accent rounded-xl border-2 border-ink shadow-sketch-xs flex items-center justify-center">
                                <Gamepad2 className="w-5 h-5 text-ink stroke-[2.5]" />
                            </div>
                            <div>
                                <span className="font-black text-xl text-ink tracking-tight uppercase">
                                    {sitePrefix}<span className="text-brand-hover">{siteSuffix}</span>
                                </span>
                                <p className="text-[11px] font-sketch text-ink-muted -mt-0.5 font-bold">
                                    {siteTagline}
                                </p>
                            </div>
                        </div>

                        <p className="text-xs sm:text-sm text-ink-muted leading-relaxed max-w-sm">
                            {siteDescription}
                        </p>

                        <div className="flex items-center gap-3 pt-1">
                            <a
                                href={waUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="sketch-btn px-3 py-1.5 bg-brand-accent text-ink text-xs font-bold rounded-lg inline-flex items-center gap-1.5"
                            >
                                <MessageCircle className="w-4 h-4" />
                                <span>WhatsApp CS</span>
                            </a>
                            <a
                                href={`mailto:${contactEmail}`}
                                className="sketch-btn px-3 py-1.5 bg-white text-ink text-xs font-bold rounded-lg inline-flex items-center gap-1.5"
                            >
                                <Mail className="w-4 h-4" />
                                <span>Email Bantuan</span>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links (3 cols) */}
                    <div className="md:col-span-3 space-y-3">
                        <h4 className="text-sm font-extrabold text-ink font-mono uppercase tracking-wider">
                            Tautan Penting
                        </h4>
                        <ul className="space-y-2 text-xs font-medium text-ink-muted">
                            <li>
                                <a href="#katalog" className="hover:text-ink hover:underline">
                                    Katalog Semua Game
                                </a>
                            </li>
                            <li>
                                <a href="#katalog" className="hover:text-ink hover:underline">
                                    Voucher Game & Digital
                                </a>
                            </li>
                            <li>
                                <a href="#katalog" className="hover:text-ink hover:underline">
                                    Paket Data & Pulsa All Operator
                                </a>
                            </li>
                            <li>
                                <a href="#katalog" className="hover:text-ink hover:underline">
                                    Token Listrik PLN Bebas Admin
                                </a>
                            </li>
                            <li>
                                <a href="/style-guide" className="hover:text-ink hover:underline font-bold text-ink flex items-center gap-1">
                                    <span>🎨 Style Guide Desain</span>
                                </a>
                            </li>
                            <li>
                                <a href="/docs/h2h" className="hover:text-ink hover:underline">
                                    Integrasi API Reseller H2H
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Payment Channels (4 cols) */}
                    <div className="md:col-span-4 space-y-3">
                        <h4 className="text-sm font-extrabold text-ink font-mono uppercase tracking-wider">
                            Metode Pembayaran Resmi
                        </h4>
                        <p className="text-xs text-ink-muted">
                            Pembayaran otomatis terverifikasi secara instan:
                        </p>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                            {PAYMENT_CHANNELS.map((channel, i) => (
                                <span
                                    key={i}
                                    className="px-2 py-1 bg-white border border-ink text-[11px] font-mono font-bold rounded shadow-sketch-xs"
                                >
                                    {channel}
                                </span>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-ink-muted">
                    <div className="flex items-center gap-1">
                        <span>© {new Date().getFullYear()} {copyright} Dibuat dengan</span>
                        <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
                        <span>di Indonesia.</span>
                    </div>
                    <div className="flex items-center gap-4 text-[11px]">
                        <span className="hover:underline cursor-pointer">Kebijakan Privasi</span>
                        <span>•</span>
                        <span className="hover:underline cursor-pointer">Syarat & Ketentuan</span>
                        <span>•</span>
                        <span className="hover:underline cursor-pointer">Sitemap</span>
                    </div>
                </div>

            </div>
        </footer>
    );
}
