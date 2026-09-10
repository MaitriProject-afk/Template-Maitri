import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import { 
    X, 
    Search, 
    CheckCircle2, 
    Clock, 
    ReceiptText, 
    ArrowRight, 
    AlertCircle, 
    ExternalLink,
    XCircle,
    Copy,
    Check,
    Gamepad2
} from 'lucide-react';

export default function TransactionTrackerModal({ isOpen, onClose }) {
    const { site } = usePage().props;
    const contactWhatsapp = site?.contact_whatsapp || '081234567890';
    const waNumber = contactWhatsapp.replace(/[^0-9]/g, '');
    const waUrl = waNumber.startsWith('0') ? `https://wa.me/62${waNumber.slice(1)}` : `https://wa.me/${waNumber}`;

    const [invoiceCode, setInvoiceCode] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [copiedSn, setCopiedSn] = useState(false);

    if (!isOpen) return null;

    const handleSearch = async (e) => {
        e.preventDefault();
        const trimmed = invoiceCode.trim();
        if (!trimmed) return;

        setIsSearching(true);
        setErrorMessage('');
        setSearchResult(null);

        try {
            const response = await axios.post('/order/track', {
                invoice_code: trimmed,
            });

            if (response.data && response.data.success) {
                setSearchResult(response.data.data);
            } else {
                setErrorMessage(response.data?.message || 'Pesanan tidak ditemukan.');
            }
        } catch (error) {
            const msg = error.response?.data?.message || 'Pesanan dengan kode invoice tersebut tidak ditemukan dalam sistem kami.';
            setErrorMessage(msg);
        } finally {
            setIsSearching(false);
        }
    };

    const handleCopySn = (text) => {
        navigator.clipboard.writeText(text);
        setCopiedSn(true);
        setTimeout(() => setCopiedSn(false), 2000);
    };

    const getPaymentBadge = (status) => {
        switch (status) {
            case 'PAID':
                return (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-500">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        LUNAS
                    </span>
                );
            case 'UNPAID':
                return (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-500">
                        <Clock className="w-3 h-3 text-amber-600" />
                        BELUM BAYAR
                    </span>
                );
            case 'EXPIRED':
                return (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold font-mono px-2 py-0.5 rounded bg-gray-100 text-gray-700 border border-gray-400">
                        <XCircle className="w-3 h-3 text-gray-500" />
                        KADALUARSA
                    </span>
                );
            case 'FAILED':
                return (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold font-mono px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-500">
                        <AlertCircle className="w-3 h-3 text-rose-600" />
                        GAGAL
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-paper-dark border border-ink">
                        {status}
                    </span>
                );
        }
    };

    const getTopupBadge = (status) => {
        switch (status) {
            case 'SUCCESS':
                return (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-500">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        TOP UP SUKSES
                    </span>
                );
            case 'PROCESSING':
                return (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold font-mono px-2 py-0.5 rounded bg-sky-100 text-sky-800 border border-sky-500">
                        <Clock className="w-3 h-3 text-sky-600 animate-spin" />
                        DIPROSES
                    </span>
                );
            case 'WAITING':
                return (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-400">
                        <Clock className="w-3 h-3 text-amber-600" />
                        MENUNGGU
                    </span>
                );
            case 'FAILED':
                return (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold font-mono px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-500">
                        <AlertCircle className="w-3 h-3 text-rose-600" />
                        TOP UP GAGAL
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-paper-dark border border-ink">
                        {status}
                    </span>
                );
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="relative w-full max-w-lg bg-white sketch-card p-6 sm:p-7 max-h-[90vh] overflow-y-auto">
                
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1.5 rounded-lg border-2 border-ink bg-paper hover:bg-paper-dark text-ink shadow-sketch-xs transition-transform active:scale-95"
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
                            Cek status pengiriman diamond atau pulsa Anda secara real-time.
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
                            placeholder="Contoh: INV-2026..."
                            className="flex-1 px-3.5 py-2.5 bg-paper border-2 border-ink rounded-xl text-xs sm:text-sm font-mono font-bold focus:ring-0 focus:border-ink shadow-sketch-xs"
                        />
                        <button
                            type="submit"
                            disabled={isSearching}
                            className="sketch-btn px-4 py-2.5 bg-brand-accent text-ink font-black text-xs sm:text-sm rounded-xl flex items-center gap-1.5 shrink-0 hover:bg-brand-accent/80 transition-all disabled:opacity-50"
                        >
                            <Search className="w-4 h-4" />
                            <span>{isSearching ? 'Mencari...' : 'Lacak'}</span>
                        </button>
                    </div>
                </form>

                {/* Error Message */}
                {errorMessage && (
                    <div className="p-3.5 rounded-xl bg-rose-50 border-2 border-rose-400 text-rose-800 text-xs font-semibold flex items-start gap-2 mb-4 animate-in fade-in">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <div>
                            <p className="font-bold">Pesanan Tidak Ditemukan</p>
                            <p className="text-[11px] mt-0.5 text-rose-700">{errorMessage}</p>
                        </div>
                    </div>
                )}

                {/* Real Search Result */}
                {searchResult && (
                    <div className="p-4 rounded-2xl bg-paper-grid border-2 border-ink shadow-sketch-xs space-y-3 animate-in fade-in duration-200">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-dashed border-ink/20 pb-2.5">
                            <span className="text-xs font-mono font-black text-ink">
                                {searchResult.invoice_code}
                            </span>
                            <div className="flex items-center gap-1.5">
                                {getPaymentBadge(searchResult.payment_status)}
                                {getTopupBadge(searchResult.topup_status)}
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl border-2 border-ink bg-white overflow-hidden shrink-0 flex items-center justify-center">
                                {searchResult.product_thumbnail ? (
                                    <img 
                                        src={searchResult.product_thumbnail} 
                                        alt={searchResult.product_name} 
                                        className="w-full h-full object-cover" 
                                    />
                                ) : (
                                    <Gamepad2 className="w-6 h-6 text-brand" />
                                )}
                            </div>
                            <div>
                                <h4 className="font-black text-xs sm:text-sm text-ink">
                                    {searchResult.product_name}
                                </h4>
                                <p className="text-[11px] font-mono text-ink-muted">
                                    Tujuan: <span className="font-bold text-ink">{searchResult.customer_no}</span>
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-ink/10">
                            <div>
                                <span className="text-ink-muted block text-[10px] uppercase font-mono">Total Bayar:</span>
                                <span className="font-black font-mono text-brand text-sm">
                                    {searchResult.formatted_total_payment}
                                </span>
                            </div>
                            <div>
                                <span className="text-ink-muted block text-[10px] uppercase font-mono">Waktu Pesan:</span>
                                <span className="font-medium text-ink text-[11px] font-mono">
                                    {searchResult.created_at}
                                </span>
                            </div>
                        </div>

                        {/* SN / Voucher Display */}
                        {searchResult.sn && (
                            <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between text-xs font-mono">
                                <div className="truncate mr-2">
                                    <span className="text-emerald-900 font-bold block text-[10px]">SN / TOKEN:</span>
                                    <span className="text-ink font-black">{searchResult.sn}</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleCopySn(searchResult.sn)}
                                    className="p-1 rounded bg-white border border-emerald-400 text-emerald-800 text-[11px] font-bold flex items-center gap-1 shrink-0"
                                >
                                    {copiedSn ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                                    <span>{copiedSn ? 'Tersalin' : 'Salin'}</span>
                                </button>
                            </div>
                        )}

                        {/* Status Message from Webhook/H2H */}
                        {(searchResult.topup_message || searchResult.payment_message) && (
                            <div className="p-2.5 bg-paper rounded-xl border border-ink/20 text-[11px] text-ink-muted leading-relaxed">
                                <span className="font-bold text-ink block">Keterangan:</span>
                                {searchResult.topup_message || searchResult.payment_message}
                            </div>
                        )}

                        {/* Action Link to Full Invoice */}
                        <div className="pt-2">
                            <a
                                href={searchResult.invoice_url}
                                className="sketch-btn w-full py-2.5 bg-brand text-white font-black text-xs sm:text-sm rounded-xl border-2 border-ink shadow-sketch-xs inline-flex items-center justify-center gap-2 hover:bg-brand-hover transition-all"
                            >
                                <span>Buka Halaman Invoice Lengkap</span>
                                <ExternalLink className="w-4 h-4" />
                            </a>
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
