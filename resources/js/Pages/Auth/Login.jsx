import React, { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import InputError from '@/Components/InputError';
import { 
    Mail, 
    Lock, 
    Eye, 
    EyeOff, 
    LogIn, 
    ArrowRight, 
    Sparkles, 
    Zap, 
    ReceiptText, 
    ShieldCheck 
} from 'lucide-react';

export default function Login({ status, canResetPassword, auth }) {
    const { site } = usePage().props;
    const siteName = site?.site_name || 'Maitri Project';
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <MainLayout
            auth={auth}
            title={`Masuk ke Akun — ${siteName}`}
            description={`Masuk ke akun ${siteName} untuk kelola saldo, pantau transaksi real-time, dan nikmati promo member.`}
            activeTab="profil"
        >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                    
                    {/* LEFT COLUMN: Feature & Benefits Banner Card (Sketchbook Paper-Grid) */}
                    <div className="lg:col-span-5 sketch-card bg-paper-grid p-6 sm:p-8 rounded-3xl border-2 border-ink shadow-sketch relative overflow-hidden">
                        {/* Platform Badge */}
                        <div className="flex items-center gap-2 mb-4">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-brand-subtle text-brand-navy border-2 border-ink shadow-sketch-xs text-xs font-mono font-bold">
                                <Sparkles className="w-3.5 h-3.5 text-brand" /> Platform Top-Up Game #1
                            </span>
                        </div>

                        {/* Heading & Subtitle */}
                        <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight leading-snug">
                            Masuk & Nikmati Kemudahan Top-Up Instan.
                        </h1>
                        <p className="text-xs sm:text-sm text-ink-muted mt-2.5 leading-relaxed">
                            Kelola saldo akun, pantau riwayat transaksi real-time, dan nikmati promo khusus member terdaftar.
                        </p>

                        {/* Dashed Separator */}
                        <div className="my-6 border-t-2 border-dashed border-ink/20"></div>

                        {/* 3 Feature Items */}
                        <div className="space-y-4">
                            {/* Feature 1 */}
                            <div className="flex items-start gap-3.5">
                                <div className="w-10 h-10 rounded-xl bg-brand-subtle text-brand-navy border-2 border-ink shadow-sketch-xs flex items-center justify-center shrink-0 mt-0.5">
                                    <Zap className="w-5 h-5 text-brand stroke-[2.5]" />
                                </div>
                                <div>
                                    <h2 className="text-xs sm:text-sm font-black text-ink">
                                        Proses 1–3 Detik
                                    </h2>
                                    <p className="text-[11px] sm:text-xs text-ink-muted mt-0.5 leading-relaxed">
                                        Sistem polling otomatis 24/7 tanpa perlu konfirmasi manual.
                                    </p>
                                </div>
                            </div>

                            {/* Feature 2 */}
                            <div className="flex items-start gap-3.5">
                                <div className="w-10 h-10 rounded-xl bg-brand-subtle text-brand-navy border-2 border-ink shadow-sketch-xs flex items-center justify-center shrink-0 mt-0.5">
                                    <ReceiptText className="w-5 h-5 text-brand stroke-[2.5]" />
                                </div>
                                <div>
                                    <h2 className="text-xs sm:text-sm font-black text-ink">
                                        Riwayat & Struk Digital
                                    </h2>
                                    <p className="text-[11px] sm:text-xs text-ink-muted mt-0.5 leading-relaxed">
                                        Bukti transaksi tersimpan rapi & dapat diunduh kapan saja.
                                    </p>
                                </div>
                            </div>

                            {/* Feature 3 */}
                            <div className="flex items-start gap-3.5">
                                <div className="w-10 h-10 rounded-xl bg-brand-subtle text-brand-navy border-2 border-ink shadow-sketch-xs flex items-center justify-center shrink-0 mt-0.5">
                                    <ShieldCheck className="w-5 h-5 text-brand stroke-[2.5]" />
                                </div>
                                <div>
                                    <h2 className="text-xs sm:text-sm font-black text-ink">
                                        100% Legal & Garansi
                                    </h2>
                                    <p className="text-[11px] sm:text-xs text-ink-muted mt-0.5 leading-relaxed">
                                        Voucher resmi developer game terpercaya.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Form Card (White Sketch Surface) */}
                    <div className="lg:col-span-7 sketch-card bg-white p-6 sm:p-8 rounded-3xl border-2 border-ink shadow-sketch">
                        
                        {/* Form Header with Login Icon Badge */}
                        <div className="flex items-start justify-between gap-4 pb-5 border-b-2 border-ink/10">
                            <div>
                                <h2 className="text-2xl font-black text-ink tracking-tight">
                                    Masuk ke Akun
                                </h2>
                                <p className="text-xs sm:text-sm text-ink-muted mt-1">
                                    Masukkan email & kata sandi Anda.
                                </p>
                            </div>
                            <div className="w-11 h-11 rounded-xl bg-brand-subtle text-brand-navy border-2 border-ink shadow-sketch-xs flex items-center justify-center shrink-0">
                                <LogIn className="w-5 h-5 stroke-[2.5]" />
                            </div>
                        </div>

                        {/* Status Message (e.g. Password Reset) */}
                        {status && (
                            <div className="mt-4 p-3 rounded-xl bg-brand-subtle border-2 border-ink shadow-sketch-xs text-xs font-bold text-brand-navy">
                                {status}
                            </div>
                        )}

                        {/* Main Login Form */}
                        <form onSubmit={submit} className="mt-6 space-y-4">
                            
                            {/* ALAMAT EMAIL */}
                            <div>
                                <label 
                                    htmlFor="email" 
                                    className="block text-xs font-mono font-bold uppercase tracking-wider text-ink"
                                >
                                    ALAMAT EMAIL
                                </label>
                                <div className="relative mt-1.5">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-muted">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="nama@email.com"
                                        autoComplete="username"
                                        required
                                        className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white border-2 border-ink rounded-xl shadow-sketch-xs focus:ring-0 focus:border-brand text-xs sm:text-sm font-semibold placeholder:text-ink-muted/50 transition-all"
                                    />
                                </div>
                                <InputError message={errors.email} className="mt-1.5 text-xs font-bold text-red-600" />
                            </div>

                            {/* KATA SANDI */}
                            <div>
                                <label 
                                    htmlFor="password" 
                                    className="block text-xs font-mono font-bold uppercase tracking-wider text-ink"
                                >
                                    KATA SANDI
                                </label>
                                <div className="relative mt-1.5">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-muted">
                                        <Lock className="w-4 h-4" />
                                    </div>
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="••••••••"
                                        autoComplete="current-password"
                                        required
                                        className="w-full pl-10 pr-11 py-2.5 sm:py-3 bg-white border-2 border-ink rounded-xl shadow-sketch-xs focus:ring-0 focus:border-brand text-xs sm:text-sm font-semibold placeholder:text-ink-muted/50 transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-ink-muted hover:text-ink transition-colors"
                                        title={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                <InputError message={errors.password} className="mt-1.5 text-xs font-bold text-red-600" />
                            </div>

                            {/* Remember Me & Forgot Password Row */}
                            <div className="flex items-center justify-between pt-1 text-xs">
                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="w-4 h-4 rounded border-2 border-ink text-brand focus:ring-0 focus:ring-offset-0 shadow-sketch-xs cursor-pointer"
                                    />
                                    <span className="font-bold text-ink">
                                        Ingat Saya
                                    </span>
                                </label>

                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="font-bold text-ink underline hover:text-brand transition-colors font-sans"
                                    >
                                        Lupa kata sandi?
                                    </Link>
                                )}
                            </div>

                            {/* Submit Button (Masuk Sekarang) */}
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="sketch-btn w-full py-3 sm:py-3.5 px-4 bg-brand text-white font-black text-xs sm:text-sm rounded-xl border-2 border-ink shadow-sketch hover:bg-brand-hover active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                                >
                                    <span>{processing ? 'Memproses...' : 'Masuk Sekarang'}</span>
                                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                                </button>
                            </div>

                            {/* Divider "atau" */}
                            <div className="relative my-5 text-center">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t-2 border-ink/10"></div>
                                </div>
                                <span className="relative px-3 bg-white text-[11px] font-mono font-bold text-ink-muted uppercase">
                                    atau
                                </span>
                            </div>

                            {/* Masuk dengan Google */}
                            <button
                                type="button"
                                onClick={() => alert('Fitur Masuk dengan Google akan segera hadir!')}
                                className="w-full py-2.5 sm:py-3 px-4 bg-white text-ink font-bold text-xs sm:text-sm rounded-xl border-2 border-ink shadow-sketch-xs hover:bg-paper-dark hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2.5"
                            >
                                <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                                </svg>
                                <span>Masuk dengan Google</span>
                            </button>

                            {/* Register Prompt */}
                            <div className="text-center pt-3">
                                <p className="text-xs text-ink-muted font-medium">
                                    Belum memiliki akun?{' '}
                                    <Link
                                        href={route('register')}
                                        className="font-bold text-brand hover:underline underline-offset-2 ml-1"
                                    >
                                        Daftar Akun Baru
                                    </Link>
                                </p>
                            </div>

                        </form>
                    </div>

                </div>
            </div>
        </MainLayout>
    );
}
