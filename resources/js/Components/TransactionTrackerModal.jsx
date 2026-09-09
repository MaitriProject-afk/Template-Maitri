import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { 
    X, 
    Search, 
    CheckCircle2, 
    Clock, 
    ReceiptText, 
    ArrowRight, 
    ShieldCheck 
} from 'lucide-react';

export default function TransactionTrackerModal({ isOpen, onClose }) {
    const { site } = usePage().props;
    const contactWhatsapp = site?.contact_whatsapp || '081234567890';
    const waNumber = contactWhatsapp.replace(/[^0-9]/g, '');
    const waUrl = waNumber.startsWith('0') ? `https://wa.me/62${waNumber.slice(1)}` : `https://wa.me/${waNumber}`;

    const [invoiceCode, setInvoiceCode] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [isSearching, setIsSearching] = useState(false);

    if (!isOpen) return null;

    const handleSearch = (e) => {
        e.preventDefault();
        setIsSearching(true);
        setTimeout(() => {
            setIsSearching(false);
            setSearchResult({
                code: invoiceCode || 'MP-892104',
                product: 'Mobile Legends: Bang Bang',
                nominal: 'Weekly Diamond Pass',
                total: 'Rp 27.500',
                status: 'SUCCESS',
                date: '09 Sep 2026, 07:15 WIB',
                target: '123849182 (2024)',
                payment: 'QRIS Instan'
            });
        }, 600);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-xs">
            <div className="relative w-full max-w-lg bg-white sketch-card p-6 sm:p-7">
                
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1.5 rounded-lg border-2 border-ink bg-paper hover:bg-paper-dark text-ink shadow-sketch-xs"
                    title="Tutup"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Modal Title */}
                <div className="flex items-center gap-2.5 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-sketch-sky border-2 border-ink shadow-sketch-xs flex items-center justify-center text-ink">
                        <ReceiptText className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-ink">
                            Lacak Status Pesanan
                        </h2>
                        <p className="text-xs text-ink-muted">
                            Cek status pengiriman diamond atau voucher Anda secara real-time.
                        </p>
                    </div>
                </div>

                {/* Search Form */}
                <form onSubmit={handleSearch} className="mb-5">
                    <label className="block text-xs font-bold text-ink mb-1.5">
                        Nomor Invoice / Kode Transaksi
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            required
                            value={invoiceCode}
                            onChange={(e) => setInvoiceCode(e.target.value)}
                            placeholder="Contoh: MP-892104"
                            className="flex-1 px-3.5 py-2.5 bg-paper border-2 border-ink rounded-xl text-sm font-mono font-bold focus:ring-0 focus:border-ink shadow-sketch-xs"
                        />
                        <button
                            type="submit"
                            disabled={isSearching}
                            className="sketch-btn px-4 py-2.5 bg-brand-accent text-ink font-bold text-sm rounded-xl flex items-center gap-1.5 shrink-0"
                        >
                            <Search className="w-4 h-4" />
                            <span>{isSearching ? 'Mencari...' : 'Cek'}</span>
                        </button>
                    </div>
                </form>

                {/* Sample / Simulated Result */}
                {searchResult && (
                    <div className="p-4 rounded-xl bg-paper-grid border-2 border-ink shadow-sketch-xs space-y-3">
                        <div className="flex items-center justify-between border-b-2 border-dashed border-ink/20 pb-2">
                            <span className="text-xs font-mono font-bold text-ink">
                                {searchResult.code}
                            </span>
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold font-mono px-2 py-0.5 rounded bg-green-200 text-green-900 border border-green-700">
                                <CheckCircle2 className="w-3 h-3 text-green-700" />
                                {searchResult.status}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                                <span className="text-ink-muted block">Produk:</span>
                                <span className="font-bold text-ink">{searchResult.product}</span>
                            </div>
                            <div>
                                <span className="text-ink-muted block">Item:</span>
                                <span className="font-bold text-ink">{searchResult.nominal}</span>
                            </div>
                            <div>
                                <span className="text-ink-muted block">ID Akun Tujuan:</span>
                                <span className="font-mono font-bold text-ink">{searchResult.target}</span>
                            </div>
                            <div>
                                <span className="text-ink-muted block">Total Bayar:</span>
                                <span className="font-mono font-bold text-ink">{searchResult.total}</span>
                            </div>
                        </div>

                        <div className="pt-2 border-t border-ink/10 flex items-center justify-between text-[11px] text-ink-muted">
                            <span>Metode: {searchResult.payment}</span>
                            <span>{searchResult.date}</span>
                        </div>
                    </div>
                )}

                {/* Quick Hint */}
                <div className="mt-5 text-center text-xs text-ink-muted font-medium">
                    Butuh bantuan kendala transaksi? Hubungi CS WhatsApp di{' '}
                    <a href={waUrl} target="_blank" rel="noreferrer" className="text-ink font-bold underline">
                        {contactWhatsapp}
                    </a>
                </div>

            </div>
        </div>
    );
}
