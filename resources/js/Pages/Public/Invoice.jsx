import React, { useState, useEffect, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { QRCodeSVG } from 'qrcode.react';
import { 
    CheckCircle2, 
    Clock, 
    XCircle, 
    AlertTriangle, 
    Copy, 
    Check, 
    ExternalLink, 
    RefreshCw, 
    MessageCircle, 
    Download, 
    ShieldCheck, 
    ChevronRight,
    ArrowLeft,
    Sparkles
} from 'lucide-react';
import axios from 'axios';

export default function Invoice({ auth, transaction: initialTransaction, adminPhone }) {
    const [trx, setTrx] = useState(initialTransaction);
    const [copiedField, setCopiedField] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [timeLeftSeconds, setTimeLeftSeconds] = useState(0);
    const qrRef = useRef(null);

    // Hitung sisa waktu mundur (countdown) berdasarkan expired_at
    useEffect(() => {
        if (!trx.expired_at || trx.is_paid || trx.is_expired) {
            return;
        }

        const calculateTimeLeft = () => {
            const expTime = new Date(trx.expired_at).getTime();
            const now = new Date().getTime();
            const diff = Math.max(0, Math.floor((expTime - now) / 1000));
            setTimeLeftSeconds(diff);

            if (diff === 0 && !trx.is_expired) {
                setTrx(prev => ({ ...prev, is_expired: true, payment_status: 'EXPIRED' }));
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(timer);
    }, [trx.expired_at, trx.is_paid, trx.is_expired]);

    // Format timer menit : detik
    const formatCountdown = (secs) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    // Auto-polling status ke endpoint /invoice/{invoice_code}/status
    useEffect(() => {
        // Berhenti polling jika transaksi sudah selesai, gagal, atau kadaluarsa
        if (trx.is_completed || trx.is_failed || trx.is_expired) {
            return;
        }

        const pollStatus = async () => {
            try {
                const res = await axios.get(route('invoice.status', { invoice_code: trx.invoice_code }));
                if (res.data && res.data.success) {
                    const data = res.data;
                    setTrx(prev => ({
                        ...prev,
                        maitri_invoice: data.maitri_invoice || prev.maitri_invoice,
                        payment_status: data.payment_status,
                        topup_status: data.topup_status,
                        is_paid: data.is_paid,
                        is_expired: data.is_expired,
                        is_completed: data.is_completed,
                        is_failed: data.is_failed,
                        sn: data.sn || prev.sn,
                        payment_message: data.payment_message || prev.payment_message,
                        topup_message: data.topup_message || prev.topup_message,
                        paid_at_formatted: data.paid_at ? new Date(data.paid_at).toLocaleString('id-ID') + ' WIB' : prev.paid_at_formatted,
                        completed_at_formatted: data.completed_at ? new Date(data.completed_at).toLocaleString('id-ID') + ' WIB' : prev.completed_at_formatted,
                    }));
                }
            } catch (err) {
                console.error('Auto-poll invoice status error:', err);
            }
        };

        const interval = setInterval(pollStatus, 3500);
        return () => clearInterval(interval);
    }, [trx.invoice_code, trx.is_completed, trx.is_failed, trx.is_expired]);

    // Manual Refresh handler
    const handleManualRefresh = async () => {
        setIsRefreshing(true);
        try {
            const res = await axios.get(route('invoice.status', { invoice_code: trx.invoice_code }), {
                params: { sync: 1 }
            });
            if (res.data && res.data.success) {
                const data = res.data;
                setTrx(prev => ({
                    ...prev,
                    maitri_invoice: data.maitri_invoice || prev.maitri_invoice,
                    payment_status: data.payment_status,
                    topup_status: data.topup_status,
                    is_paid: data.is_paid,
                    is_expired: data.is_expired,
                    is_completed: data.is_completed,
                    is_failed: data.is_failed,
                    sn: data.sn || prev.sn,
                    payment_message: data.payment_message || prev.payment_message,
                    topup_message: data.topup_message || prev.topup_message,
                    paid_at_formatted: data.paid_at ? new Date(data.paid_at).toLocaleString('id-ID') + ' WIB' : prev.paid_at_formatted,
                    completed_at_formatted: data.completed_at ? new Date(data.completed_at).toLocaleString('id-ID') + ' WIB' : prev.completed_at_formatted,
                }));
            }
        } catch (err) {
            alert('Gagal memeriksa status terkini: ' + (err.response?.data?.message || err.message));
        } finally {
            setTimeout(() => setIsRefreshing(false), 500);
        }
    };

    // Copy to clipboard helper
    const handleCopy = (text, fieldName) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopiedField(fieldName);
        setTimeout(() => setCopiedField(null), 2500);
    };

    // Download QR Code image
    const handleDownloadQR = () => {
        const svgElement = document.getElementById('qris-svg-code');
        if (!svgElement) return;

        const svgData = new XMLSerializer().serializeToString(svgElement);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            canvas.width = img.width + 40;
            canvas.height = img.height + 40;
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 20, 20);

            const pngFile = canvas.toDataURL('image/png');
            const downloadLink = document.createElement('a');
            downloadLink.download = `QRIS-${trx.invoice_code}.png`;
            downloadLink.href = pngFile;
            downloadLink.click();
        };

        img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    };

    // URL Chat Admin WhatsApp jika pesanan gagal
    const whatsappClean = (adminPhone || '').replace(/\D/g, '');
    const complaintMessage = encodeURIComponent(
        `Halo Admin Maitri, saya ingin melaporkan kendala pesanan:\n` +
        `- No Invoice: ${trx.invoice_code}\n` +
        `- Produk: ${trx.product_name}\n` +
        `- Target Tujuan: ${trx.customer_no}\n` +
        `- Status Pengisian: GAGAL\n` +
        `- Keterangan Error: ${trx.topup_message || 'Pengisian gagal diproses oleh sistem'}\n\n` +
        `Mohon bantuannya ya admin. Terima kasih!`
    );
    const waChatUrl = `https://wa.me/${whatsappClean}?text=${complaintMessage}`;

    return (
        <MainLayout auth={auth}>
            <Head title={`Invoice #${trx.invoice_code} - Maitri Top Up`} />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
                {/* Back Link */}
                <div className="mb-4">
                    <Link 
                        href={trx.product_slug ? route('product.detail', { slug: trx.product_slug }) : route('home')} 
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-ink-muted hover:text-ink transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Kembali ke Halaman Produk
                    </Link>
                </div>

                {/* Main Card Container */}
                <div className="sketch-card bg-paper-light border-3 border-ink rounded-3xl p-5 sm:p-8 shadow-sketch-lg relative overflow-hidden">
                    
                    {/* Header: Title & Refresh Button */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-ink/15">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[11px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded bg-brand/15 text-brand-dark border border-brand/30">
                                    INVOICE RESMI
                                </span>
                                <span className="text-xs text-ink-muted font-mono">
                                    {trx.created_at}
                                </span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight flex items-center gap-2">
                                <span>Tagihan #{trx.invoice_code}</span>
                                <button
                                    onClick={() => handleCopy(trx.invoice_code, 'inv')}
                                    title="Salin Nomor Invoice"
                                    className="p-1 rounded-lg hover:bg-paper-dark text-ink-muted hover:text-ink transition-colors"
                                >
                                    {copiedField === 'inv' ? (
                                        <Check className="w-4 h-4 text-emerald-600" />
                                    ) : (
                                        <Copy className="w-4 h-4" />
                                    )}
                                </button>
                            </h1>
                        </div>

                        {/* Status Checker Button */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleManualRefresh}
                                disabled={isRefreshing}
                                className="sketch-btn inline-flex items-center gap-2 px-3.5 py-2 bg-white text-ink text-xs font-black rounded-xl border-2 border-ink shadow-sketch-xs hover:bg-paper-dark disabled:opacity-60"
                            >
                                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                                {isRefreshing ? 'Mengecek...' : 'Cek Status'}
                            </button>
                        </div>
                    </div>

                    {/* STATUS BANNER */}
                    <div className="my-6">
                        {/* 1. STATUS: WAITING PAYMENT / UNPAID */}
                        {!trx.is_paid && !trx.is_expired && (
                            <div className="p-4 sm:p-5 bg-amber-50 border-2 border-amber-300 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                                <div className="flex items-start gap-3.5">
                                    <div className="w-10 h-10 rounded-xl bg-amber-400 border-2 border-ink flex items-center justify-center text-ink shrink-0 shadow-sketch-xs">
                                        <Clock className="w-5 h-5 animate-pulse" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-black text-ink text-sm sm:text-base">
                                                Menunggu Pembayaran QRIS
                                            </span>
                                            <span className="bg-amber-200 text-amber-900 border border-amber-400 font-mono text-[10px] font-bold px-2 py-0.5 rounded-full">
                                                UNPAID
                                            </span>
                                        </div>
                                        <p className="text-xs text-ink-muted mt-0.5 leading-relaxed">
                                            Silakan selesaikan scan kode QRIS menggunakan e-wallet atau m-banking Anda sebelum batas waktu habis.
                                        </p>
                                    </div>
                                </div>

                                {/* Countdown Display */}
                                <div className="bg-white border-2 border-ink rounded-xl px-4 py-2.5 text-center sm:text-right shrink-0 shadow-sketch-xs">
                                    <span className="text-[10px] uppercase font-bold tracking-wider text-ink-muted block">
                                        Sisa Waktu Pembayaran
                                    </span>
                                    <span className="font-mono font-black text-xl sm:text-2xl text-rose-600 tracking-tight">
                                        {formatCountdown(timeLeftSeconds)}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* 2. STATUS: EXPIRED */}
                        {trx.is_expired && (
                            <div className="p-4 sm:p-5 bg-rose-50 border-2 border-rose-300 rounded-2xl flex items-start gap-3.5 shadow-sm">
                                <div className="w-10 h-10 rounded-xl bg-rose-500 border-2 border-ink flex items-center justify-center text-white shrink-0 shadow-sketch-xs">
                                    <XCircle className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-black text-rose-900 text-sm sm:text-base">
                                            Batas Waktu Pembayaran Kadaluarsa
                                        </span>
                                        <span className="bg-rose-200 text-rose-900 border border-rose-400 font-mono text-[10px] font-bold px-2 py-0.5 rounded-full">
                                            EXPIRED
                                        </span>
                                    </div>
                                    <p className="text-xs text-rose-800 mt-1 leading-relaxed">
                                        Transaksi ini telah dibatalkan otomatis karena melebihi batas waktu 30 menit. Kode QRIS tidak dapat digunakan lagi.
                                    </p>
                                    {trx.payment_message && (
                                        <div className="mt-2 text-xs font-mono bg-white/70 p-2 rounded-lg border border-rose-200 text-rose-900">
                                            <strong>Pesan Webhook:</strong> "{trx.payment_message}"
                                        </div>
                                    )}
                                    <div className="mt-3">
                                        <Link
                                            href={trx.product_slug ? route('product.detail', { slug: trx.product_slug }) : route('home')}
                                            className="sketch-btn inline-flex items-center gap-1.5 px-4 py-2 bg-brand text-white text-xs font-black rounded-xl border-2 border-ink shadow-sketch-xs hover:bg-brand-hover"
                                        >
                                            Buat Pesanan Baru
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 3. STATUS: PAID & PROCESSING (Tahap 1 Sukses) */}
                        {trx.is_paid && !trx.is_completed && !trx.is_failed && (
                            <div className="p-4 sm:p-5 bg-sky-50 border-2 border-sky-300 rounded-2xl flex items-start gap-3.5 shadow-sm">
                                <div className="w-10 h-10 rounded-xl bg-sky-500 border-2 border-ink flex items-center justify-center text-white shrink-0 shadow-sketch-xs">
                                    <RefreshCw className="w-5 h-5 animate-spin" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-black text-sky-900 text-sm sm:text-base">
                                            Sudah Dibayar &bull; Pesanan Sedang Diproses
                                        </span>
                                        <span className="bg-sky-200 text-sky-900 border border-sky-400 font-mono text-[10px] font-bold px-2 py-0.5 rounded-full">
                                            PROCESSING
                                        </span>
                                    </div>
                                    <p className="text-xs text-sky-800 mt-1 leading-relaxed">
                                        Pembayaran QRIS telah berhasil diverifikasi oleh sistem! Pesanan Anda sedang otomatis dikirimkan ke server penyedia (1-3 detik).
                                    </p>
                                    {trx.payment_message && (
                                        <div className="mt-2 text-xs font-mono bg-white/80 p-2 rounded-lg border border-sky-200 text-sky-900">
                                            <strong>Pesan Webhook:</strong> "{trx.payment_message}"
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* 4. STATUS: TOPUP SUCCESS (Tahap 2 Selesai Sukses) */}
                        {trx.is_completed && (
                            <div className="p-4 sm:p-5 bg-emerald-50 border-2 border-emerald-400 rounded-2xl flex items-start gap-3.5 shadow-sm">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500 border-2 border-ink flex items-center justify-center text-white shrink-0 shadow-sketch-xs">
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-black text-emerald-950 text-sm sm:text-base">
                                            Pesanan Sukses &bull; Berhasil Terisi!
                                        </span>
                                        <span className="bg-emerald-200 text-emerald-950 border border-emerald-500 font-mono text-[10px] font-bold px-2 py-0.5 rounded-full">
                                            SUCCESS
                                        </span>
                                    </div>
                                    <p className="text-xs text-emerald-900 mt-1 leading-relaxed">
                                        Hore! Item produk telah berhasil masuk ke akun/nomor target Anda secara instan.
                                    </p>
                                    
                                    {/* Serial Number Box */}
                                    {trx.sn && (
                                        <div className="mt-3 p-3 bg-white border-2 border-emerald-300 rounded-xl flex items-center justify-between gap-2 shadow-sm">
                                            <div>
                                                <span className="text-[10px] font-bold text-ink-muted uppercase block">
                                                    Nomor Seri / SN Penyedia:
                                                </span>
                                                <span className="font-mono font-black text-sm text-ink break-all select-all">
                                                    {trx.sn}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => handleCopy(trx.sn, 'sn')}
                                                className="sketch-btn px-2.5 py-1.5 bg-emerald-100 text-emerald-900 text-xs font-bold rounded-lg border border-emerald-400 hover:bg-emerald-200"
                                            >
                                                {copiedField === 'sn' ? 'Disalin!' : 'Salin SN'}
                                            </button>
                                        </div>
                                    )}

                                    {trx.topup_message && (
                                        <div className="mt-2 text-xs font-mono bg-white/80 p-2 rounded-lg border border-emerald-200 text-emerald-900">
                                            <strong>Keterangan Provider:</strong> "{trx.topup_message}"
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* 5. STATUS: TOPUP FAILED (Tahap 2 Gagal) */}
                        {trx.is_failed && (
                            <div className="p-4 sm:p-5 bg-red-50 border-2 border-red-400 rounded-2xl flex items-start gap-3.5 shadow-sm">
                                <div className="w-10 h-10 rounded-xl bg-red-600 border-2 border-ink flex items-center justify-center text-white shrink-0 shadow-sketch-xs">
                                    <AlertTriangle className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-black text-red-950 text-sm sm:text-base">
                                            Pesanan Gagal Diproses oleh Provider
                                        </span>
                                        <span className="bg-red-200 text-red-950 border border-red-400 font-mono text-[10px] font-bold px-2 py-0.5 rounded-full">
                                            FAILED
                                        </span>
                                    </div>
                                    <p className="text-xs text-red-900 mt-1 leading-relaxed">
                                        Pengisian produk mengalami kendala dari pihak penyedia atau data tujuan tidak valid. Jangan khawatir, dana transaksi Anda aman.
                                    </p>

                                    {/* Webhook Error Message */}
                                    {trx.topup_message && (
                                        <div className="mt-2 text-xs font-mono bg-white p-2.5 rounded-xl border-2 border-red-300 text-red-900">
                                            <strong>Keterangan Error dari Webhook:</strong>
                                            <div className="mt-0.5 font-bold">"{trx.topup_message}"</div>
                                        </div>
                                    )}

                                    {/* Action Buttons: Chat Admin */}
                                    <div className="mt-4 flex flex-wrap items-center gap-2.5">
                                        <a
                                            href={waChatUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="sketch-btn inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white text-xs font-black rounded-xl border-2 border-ink shadow-sketch hover:bg-emerald-700"
                                        >
                                            <MessageCircle className="w-4 h-4" />
                                            Chat Admin / Laporkan ke CS WhatsApp
                                        </a>

                                        <Link
                                            href={trx.product_slug ? route('product.detail', { slug: trx.product_slug }) : route('home')}
                                            className="sketch-btn px-4 py-2.5 bg-white text-ink text-xs font-bold rounded-xl border-2 border-ink shadow-sketch-xs hover:bg-paper-dark"
                                        >
                                            Pesan Ulang
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* CONDITIONAL LAYOUT: QRIS (Jika UNPAID & belum expired) & DETAIL PESANAN */}
                    {(!trx.is_paid && !trx.is_expired) ? (
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                            
                            {/* LEFT COLUMN: QRIS SCANNER */}
                            <div className="md:col-span-5 flex flex-col items-center">
                                <div className="w-full bg-white border-3 border-ink rounded-2xl p-5 shadow-sketch text-center">
                                    
                                    {/* Header Brand QRIS */}
                                    <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-ink text-xs font-black font-mono">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-rose-600 font-black tracking-tight text-base">QRIS</span>
                                            <span className="text-[9px] bg-ink text-white px-1.5 py-0.5 rounded font-mono">
                                                OTOMATIS
                                            </span>
                                        </div>
                                        <span className="text-[10px] text-ink-muted">PAYDISINI RESMI</span>
                                    </div>

                                    {/* QR Code Frame */}
                                    <div className="p-3 bg-paper-light border-2 border-ink rounded-xl inline-block my-2 relative">
                                        {trx.qr_content && (
                                            <div ref={qrRef} className="bg-white p-2 rounded-lg">
                                                <QRCodeSVG
                                                    id="qris-svg-code"
                                                    value={trx.qr_content}
                                                    size={200}
                                                    level="M"
                                                    includeMargin={true}
                                                    className="w-48 h-48 sm:w-52 sm:h-52 mx-auto"
                                                />
                                            </div>
                                        )}

                                        {/* Watermark/NMID */}
                                        <p className="text-[9px] font-mono text-ink-muted mt-2">
                                            NMID: ID10200391823910 &bull; VERIFIED
                                        </p>
                                    </div>

                                    {/* Total Price Under QR */}
                                    <div className="mt-3 pt-3 border-t-2 border-dashed border-ink/20">
                                        <span className="text-[11px] font-medium text-ink-muted block">
                                            Total Pembayaran:
                                        </span>
                                        <span className="text-2xl font-mono font-black text-brand tracking-tight">
                                            {trx.formatted_total_payment}
                                        </span>
                                    </div>

                                    {/* Action Buttons for QR */}
                                    <div className="mt-4 space-y-2">
                                        {trx.qr_content && (
                                            <button
                                                type="button"
                                                onClick={handleDownloadQR}
                                                className="sketch-btn w-full py-2 bg-brand text-white text-xs font-black rounded-xl border-2 border-ink shadow-sketch-xs hover:bg-brand-hover flex items-center justify-center gap-1.5"
                                            >
                                                <Download className="w-3.5 h-3.5" />
                                                Unduh QR Code Image
                                            </button>
                                        )}

                                        {trx.checkout_url && (
                                            <a
                                                href={trx.checkout_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="sketch-btn w-full py-2 bg-white text-ink text-xs font-bold rounded-xl border-2 border-ink shadow-sketch-xs hover:bg-paper-dark flex items-center justify-center gap-1.5"
                                            >
                                                <ExternalLink className="w-3.5 h-3.5" />
                                                Buka Halaman Checkout
                                            </a>
                                        )}
                                    </div>

                                    {/* Payment Methods Accepted */}
                                    <div className="mt-4 pt-3 border-t border-ink/10 text-[10px] text-ink-muted leading-tight">
                                        Dukung semua e-wallet (GoPay, OVO, DANA, ShopeePay, LinkAja) dan Mobile Banking (BCA, Mandiri, BRI, BNI, Jago, dll).
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT COLUMN: ORDER DETAILS & BREAKDOWN */}
                            <div className="md:col-span-7 space-y-4">
                                
                                {/* Product Info Card */}
                                <div className="bg-white border-3 border-ink rounded-2xl p-5 shadow-sketch">
                                    <h3 className="text-xs font-black uppercase tracking-wider text-ink-muted mb-3 pb-2 border-b-2 border-ink/10 flex items-center gap-1.5">
                                        <Sparkles className="w-3.5 h-3.5 text-brand" />
                                        Detail Produk & Layanan
                                    </h3>

                                    <div className="flex items-center gap-3.5 mb-4">
                                        {trx.product_thumbnail ? (
                                            <img
                                                src={trx.product_thumbnail}
                                                alt={trx.product_name}
                                                className="w-14 h-14 object-cover rounded-xl border-2 border-ink shadow-sketch-xs shrink-0"
                                            />
                                        ) : (
                                            <div className="w-14 h-14 rounded-xl bg-brand/10 border-2 border-ink flex items-center justify-center font-black text-brand text-lg shrink-0">
                                                {trx.product_name?.substring(0, 2).toUpperCase()}
                                            </div>
                                        )}

                                        <div>
                                            <h4 className="font-black text-ink text-base leading-tight">
                                                {trx.product_name}
                                            </h4>
                                            <span className="inline-block mt-1 text-xs font-mono font-bold bg-paper-dark px-2 py-0.5 rounded border border-ink/20 text-ink">
                                                {trx.item_name || 'Nominal Resmi'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Detail Specifications List */}
                                    <div className="space-y-2 text-xs divide-y divide-ink/10">
                                        <div className="flex justify-between items-center pt-2">
                                            <span className="text-ink-muted">Target Tujuan (ID/No HP):</span>
                                            <span className="font-mono font-black text-ink select-all text-sm bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                                                {trx.customer_no}
                                            </span>
                                        </div>

                                        {trx.customer_whatsapp && (
                                            <div className="flex justify-between items-center pt-2">
                                                <span className="text-ink-muted">No. WhatsApp Pembeli:</span>
                                                <span className="font-mono font-bold text-ink">{trx.customer_whatsapp}</span>
                                            </div>
                                        )}

                                        <div className="flex justify-between items-center pt-2">
                                            <span className="text-ink-muted">Metode Pembayaran:</span>
                                            <span className="font-bold text-ink">QRIS Real-Time (Semua E-Wallet & Bank)</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Financial Price Breakdown Card */}
                                <div className="bg-white border-3 border-ink rounded-2xl p-5 shadow-sketch">
                                    <h3 className="text-xs font-black uppercase tracking-wider text-ink-muted mb-3 pb-2 border-b-2 border-ink/10 flex items-center gap-1.5">
                                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                        Rincian Tagihan Pembayaran
                                    </h3>

                                    <div className="space-y-2.5 text-xs">
                                        <div className="flex justify-between items-center">
                                            <span className="text-ink-muted">Harga Produk:</span>
                                            <span className="font-mono font-bold text-ink">{trx.formatted_reseller_price}</span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span className="text-ink-muted">Biaya Layanan & Admin QRIS:</span>
                                            <span className="font-mono font-bold text-ink">{trx.formatted_admin_fee}</span>
                                        </div>

                                        <div className="pt-3 border-t-2 border-ink flex justify-between items-center">
                                            <div>
                                                <span className="font-black text-ink text-sm block">Total Bayar:</span>
                                                <span className="text-[10px] text-ink-muted">Tepat sesuai nominal QR</span>
                                            </div>
                                            <span className="font-mono font-black text-brand text-xl">
                                                {trx.formatted_total_payment}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Riwayat Waktu Transaksi */}
                                <div className="bg-paper-dark/60 border-2 border-ink/20 rounded-xl p-4 text-[11px] font-mono text-ink-muted space-y-1">
                                    <div>&bull; Dibuat pada: <strong className="text-ink">{trx.created_at}</strong></div>
                                    {trx.paid_at_formatted && (
                                        <div>&bull; Dibayar pada: <strong className="text-emerald-700">{trx.paid_at_formatted}</strong></div>
                                    )}
                                    {trx.completed_at_formatted && (
                                        <div>&bull; Selesai pada: <strong className="text-emerald-700">{trx.completed_at_formatted}</strong></div>
                                    )}
                                    {trx.expired_at_formatted && !trx.is_paid && (
                                        <div>&bull; Kadaluarsa pada: <strong className="text-rose-700">{trx.expired_at_formatted}</strong></div>
                                    )}
                                </div>

                            </div>
                        </div>
                    ) : (
                        /* KETIKA SUDAH SELESAI / DIBAYAR / EXPIRED: QRIS DIHILANGKAN, TAMPILAN MELEBAR RAPI 2 KOLOM */
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                            
                            {/* Card 1: Detail Produk & Target */}
                            <div className="bg-white border-3 border-ink rounded-2xl p-5 sm:p-6 shadow-sketch space-y-4">
                                <h3 className="text-xs font-black uppercase tracking-wider text-ink-muted pb-2 border-b-2 border-ink/10 flex items-center gap-1.5">
                                    <Sparkles className="w-3.5 h-3.5 text-brand" />
                                    Detail Produk & Layanan
                                </h3>

                                <div className="flex items-center gap-3.5">
                                    {trx.product_thumbnail ? (
                                        <img
                                            src={trx.product_thumbnail}
                                            alt={trx.product_name}
                                            className="w-16 h-16 object-cover rounded-xl border-2 border-ink shadow-sketch-xs shrink-0"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 rounded-xl bg-brand/10 border-2 border-ink flex items-center justify-center font-black text-brand text-xl shrink-0">
                                            {trx.product_name?.substring(0, 2).toUpperCase()}
                                        </div>
                                    )}

                                    <div>
                                        <h4 className="font-black text-ink text-base sm:text-lg leading-tight">
                                            {trx.product_name}
                                        </h4>
                                        <span className="inline-block mt-1 text-xs font-mono font-bold bg-paper-dark px-2.5 py-0.5 rounded border border-ink/20 text-ink">
                                            {trx.item_name || 'Nominal Resmi'}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-2.5 text-xs divide-y divide-ink/10 pt-2">
                                    <div className="flex justify-between items-center pt-2">
                                        <span className="text-ink-muted font-medium">Target Tujuan (ID/No HP):</span>
                                        <span className="font-mono font-black text-ink select-all text-sm bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-300">
                                            {trx.customer_no}
                                        </span>
                                    </div>

                                    {trx.customer_whatsapp && (
                                        <div className="flex justify-between items-center pt-2.5">
                                            <span className="text-ink-muted font-medium">No. WhatsApp Pembeli:</span>
                                            <span className="font-mono font-bold text-ink">{trx.customer_whatsapp}</span>
                                        </div>
                                    )}

                                    <div className="flex justify-between items-center pt-2.5">
                                        <span className="text-ink-muted font-medium">Metode Pembayaran:</span>
                                        <span className="font-bold text-ink">QRIS Real-Time</span>
                                    </div>
                                </div>

                                {/* Riwayat Waktu Transaksi */}
                                <div className="bg-paper-dark/60 border-2 border-ink/20 rounded-xl p-3.5 text-[11px] font-mono text-ink-muted space-y-1 mt-4">
                                    <div>&bull; Dibuat pada: <strong className="text-ink">{trx.created_at}</strong></div>
                                    {trx.paid_at_formatted && (
                                        <div>&bull; Dibayar pada: <strong className="text-emerald-700">{trx.paid_at_formatted}</strong></div>
                                    )}
                                    {trx.completed_at_formatted && (
                                        <div>&bull; Selesai pada: <strong className="text-emerald-700">{trx.completed_at_formatted}</strong></div>
                                    )}
                                    {trx.expired_at_formatted && !trx.is_paid && (
                                        <div>&bull; Kadaluarsa pada: <strong className="text-rose-700">{trx.expired_at_formatted}</strong></div>
                                    )}
                                </div>
                            </div>

                            {/* Card 2: Rincian Tagihan Pembayaran */}
                            <div className="bg-white border-3 border-ink rounded-2xl p-5 sm:p-6 shadow-sketch space-y-4">
                                <h3 className="text-xs font-black uppercase tracking-wider text-ink-muted pb-2 border-b-2 border-ink/10 flex items-center gap-1.5">
                                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                    Rincian Tagihan Pembayaran
                                </h3>

                                <div className="space-y-3 text-xs">
                                    <div className="flex justify-between items-center">
                                        <span className="text-ink-muted">Harga Produk:</span>
                                        <span className="font-mono font-bold text-ink">{trx.formatted_reseller_price}</span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-ink-muted">Biaya Layanan & Admin QRIS:</span>
                                        <span className="font-mono font-bold text-ink">{trx.formatted_admin_fee}</span>
                                    </div>

                                    <div className="pt-3 border-t-2 border-ink flex justify-between items-center">
                                        <div>
                                            <span className="font-black text-ink text-sm block">Total Tagihan:</span>
                                            <span className="text-[10px] text-ink-muted">Nominal lunas</span>
                                        </div>
                                        <span className="font-mono font-black text-brand text-2xl">
                                            {trx.formatted_total_payment}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                    <span>
                                        {trx.is_paid ? 'Pembayaran telah lunas diverifikasi otomatis.' : 'Sesi pembayaran QRIS telah ditutup.'}
                                    </span>
                                </div>
                            </div>

                        </div>
                    )}

                </div>
            </div>
        </MainLayout>
    );
}
