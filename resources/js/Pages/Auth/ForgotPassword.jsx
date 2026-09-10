import React, { useState, useEffect } from 'react';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import InputError from '@/Components/InputError';
import { 
    Mail, 
    Lock, 
    Eye, 
    EyeOff, 
    ArrowRight, 
    ArrowLeft,
    Sparkles, 
    ShieldCheck, 
    KeyRound,
    CheckCircle2,
    RotateCcw,
    AlertCircle,
    Check,
    Clock
} from 'lucide-react';

export default function ForgotPassword({ status, sessionEmail, sessionStep, sessionToken, auth }) {
    const { site } = usePage().props;
    const siteName = site?.site_name || 'Maitri Project';

    // Current step: 1 (Email) | 2 (Verify OTP) | 3 (New Password)
    const [step, setStep] = useState(sessionStep ? Math.max(1, sessionStep) : 1);
    const [activeEmail, setActiveEmail] = useState(sessionEmail || '');
    const [resetToken, setResetToken] = useState(sessionToken || '');
    const [cooldown, setCooldown] = useState(0);

    // Sync from server props if updated, but NEVER downgrade to step 1 on validation errors
    useEffect(() => {
        if (sessionStep && sessionStep > step) {
            setStep(sessionStep);
        }
        if (sessionEmail) {
            setActiveEmail(sessionEmail);
            otpForm.setData('email', sessionEmail);
            passwordForm.setData('email', sessionEmail);
        }
        if (sessionToken) {
            setResetToken(sessionToken);
            passwordForm.setData('token', sessionToken);
        }
    }, [sessionStep, sessionEmail, sessionToken]);

    // Resend cooldown timer
    useEffect(() => {
        let timer;
        if (cooldown > 0) {
            timer = setInterval(() => setCooldown((c) => c - 1), 1000);
        }
        return () => clearInterval(timer);
    }, [cooldown]);

    // Form 1: Request OTP
    const emailForm = useForm({
        email: activeEmail || '',
    });

    // Form 2: Verify OTP
    const otpForm = useForm({
        email: activeEmail || '',
        code: '',
    });

    // Form 3: Set New Password
    const passwordForm = useForm({
        token: resetToken || '',
        email: activeEmail || '',
        password: '',
        password_confirmation: '',
    });

    // Auto-maintain step 2 if code errors exist
    useEffect(() => {
        if (otpForm.errors?.code) {
            setStep(2);
        }
    }, [otpForm.errors]);

    // Auto-maintain step 3 if password errors exist
    useEffect(() => {
        if (passwordForm.errors?.password || passwordForm.errors?.password_confirmation || passwordForm.errors?.token) {
            setStep(3);
        }
    }, [passwordForm.errors]);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // 1. Submit Request OTP
    const handleSendOtp = (e) => {
        e.preventDefault();
        emailForm.post(route('password.email'), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setActiveEmail(emailForm.data.email);
                otpForm.setData('email', emailForm.data.email);
                passwordForm.setData('email', emailForm.data.email);
                setStep(2);
                setCooldown(60);
            },
        });
    };

    // 2. Submit Verify OTP
    const handleVerifyOtp = (e) => {
        e.preventDefault();
        otpForm.setData('email', activeEmail);
        otpForm.post(route('password.verify-code'), {
            preserveScroll: true,
            preserveState: true,
            onError: () => {
                setStep(2);
            },
            onSuccess: (page) => {
                const token = page.props?.sessionToken || sessionToken;
                if (token) {
                    setResetToken(token);
                    passwordForm.setData('token', token);
                }
                setStep(3);
            },
        });
    };

    // 2b. Resend OTP
    const handleResendOtp = () => {
        if (cooldown > 0) return;
        emailForm.setData('email', activeEmail);
        emailForm.post(route('password.resend-code'), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setCooldown(60);
            },
        });
    };

    // Restart process back to step 1
    const handleRestart = () => {
        router.post(route('password.restart'), {}, {
            preserveScroll: true,
            onSuccess: () => {
                setStep(1);
                setActiveEmail('');
                setResetToken('');
                emailForm.reset();
                otpForm.reset();
                passwordForm.reset();
            },
        });
    };

    // 3. Submit New Password
    const handleResetPassword = (e) => {
        e.preventDefault();
        passwordForm.setData({
            token: resetToken || passwordForm.data.token,
            email: activeEmail,
            password: passwordForm.data.password,
            password_confirmation: passwordForm.data.password_confirmation,
        });
        passwordForm.post(route('password.store'), {
            preserveScroll: true,
            preserveState: true,
            onError: () => {
                setStep(3);
            },
        });
    };

    return (
        <MainLayout
            auth={auth}
            title={`Lupa Kata Sandi — ${siteName}`}
            description={`Pulihkan akses akun ${siteName} Anda dengan kode verifikasi OTP aman melalui email.`}
            activeTab="profil"
        >
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                    
                    {/* LEFT COLUMN: Steps & Security Guarantee */}
                    <div className="lg:col-span-5 sketch-card bg-paper-grid p-6 sm:p-8 rounded-3xl border-2 border-ink shadow-sketch relative overflow-hidden">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-brand-subtle text-brand-navy border-2 border-ink shadow-sketch-xs text-xs font-mono font-bold">
                                <ShieldCheck className="w-3.5 h-3.5 text-brand" /> KEAMANAN AKUN
                            </span>
                        </div>

                        <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight leading-snug">
                            Pemulihan Kata Sandi Aman & Cepat.
                        </h1>
                        <p className="text-xs sm:text-sm text-ink-muted mt-2.5 leading-relaxed">
                            Ikuti 3 tahapan verifikasi di samping untuk memperbarui kata sandi akun Anda dengan perlindungan enkripsi penuh.
                        </p>

                        <div className="my-6 border-t-2 border-dashed border-ink/20"></div>

                        {/* Step Indicators */}
                        <div className="space-y-4">
                            {/* Step 1 Indicator */}
                            <div className="flex items-start gap-3.5">
                                <div className={`w-8 h-8 rounded-xl border-2 border-ink shadow-sketch-xs flex items-center justify-center font-black text-xs shrink-0 mt-0.5 ${
                                    step >= 1 ? 'bg-brand text-white' : 'bg-white text-ink-muted'
                                }`}>
                                    {step > 1 ? <Check className="w-4 h-4 stroke-[3]" /> : '1'}
                                </div>
                                <div>
                                    <h2 className="text-xs sm:text-sm font-black text-ink">
                                        Masukkan Alamat Email
                                    </h2>
                                    <p className="text-[11px] sm:text-xs text-ink-muted mt-0.5 leading-relaxed">
                                        Ketikkan email terdaftar untuk menerima kode verifikasi OTP.
                                    </p>
                                </div>
                            </div>

                            {/* Step 2 Indicator */}
                            <div className="flex items-start gap-3.5">
                                <div className={`w-8 h-8 rounded-xl border-2 border-ink shadow-sketch-xs flex items-center justify-center font-black text-xs shrink-0 mt-0.5 ${
                                    step >= 2 ? 'bg-brand text-white' : 'bg-white text-ink-muted'
                                }`}>
                                    {step > 2 ? <Check className="w-4 h-4 stroke-[3]" /> : '2'}
                                </div>
                                <div>
                                    <h2 className="text-xs sm:text-sm font-black text-ink">
                                        Input Kode Verifikasi Acak (OTP)
                                    </h2>
                                    <p className="text-[11px] sm:text-xs text-ink-muted mt-0.5 leading-relaxed">
                                        6 digit kode acak dikirimkan langsung ke kotak masuk email Anda.
                                    </p>
                                </div>
                            </div>

                            {/* Step 3 Indicator */}
                            <div className="flex items-start gap-3.5">
                                <div className={`w-8 h-8 rounded-xl border-2 border-ink shadow-sketch-xs flex items-center justify-center font-black text-xs shrink-0 mt-0.5 ${
                                    step >= 3 ? 'bg-brand text-white' : 'bg-white text-ink-muted'
                                }`}>
                                    3
                                </div>
                                <div>
                                    <h2 className="text-xs sm:text-sm font-black text-ink">
                                        Buat Kata Sandi Baru
                                    </h2>
                                    <p className="text-[11px] sm:text-xs text-ink-muted mt-0.5 leading-relaxed">
                                        Tetapkan kata sandi baru yang kuat lalu langsung masuk ke akun.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Security Notice */}
                        <div className="mt-8 p-3.5 rounded-2xl bg-white border-2 border-ink shadow-sketch-xs flex items-start gap-2.5 text-[11px] font-bold text-ink">
                            <AlertCircle className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                            <span className="leading-snug">
                                Sistem kami dilindungi pembatasan percobaan salah maksimal 5 kali untuk memastikan akun Anda tetap aman dari pembobolan.
                            </span>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Interactive Form Container */}
                    <div className="lg:col-span-7 sketch-card bg-white p-6 sm:p-8 rounded-3xl border-2 border-ink shadow-sketch">
                        
                        {/* Status Message */}
                        {status && (
                            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-900 shadow-sketch-xs flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                                <p className="text-xs font-bold text-emerald-950 leading-relaxed">
                                    {status}
                                </p>
                            </div>
                        )}

                        {/* ========================================================
                            STEP 1: INPUT ALAMAT EMAIL
                        ======================================================== */}
                        {step === 1 && (
                            <div className="space-y-6 animate-in fade-in duration-200">
                                <div>
                                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-brand-subtle text-brand-navy border border-ink shadow-sketch-xs">
                                        LANGKAH 1 DARI 3
                                    </span>
                                    <h2 className="text-xl sm:text-2xl font-black text-ink tracking-tight mt-2">
                                        Lupa Kata Sandi Akun?
                                    </h2>
                                    <p className="text-xs sm:text-sm text-ink-muted mt-1 leading-relaxed">
                                        Jangan khawatir! Masukkan alamat email akun Anda. Sistem akan mengirimkan kode verifikasi 6-digit untuk mereset kata sandi Anda.
                                    </p>
                                </div>

                                <form onSubmit={handleSendOtp} className="space-y-5">
                                    <div>
                                        <label 
                                            htmlFor="email" 
                                            className="block text-xs font-mono font-bold uppercase tracking-wider text-ink mb-1.5"
                                        >
                                            ALAMAT EMAIL AKUN
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-muted">
                                                <Mail className="w-4 h-4" />
                                            </div>
                                            <input
                                                id="email"
                                                type="email"
                                                name="email"
                                                value={emailForm.data.email}
                                                onChange={(e) => emailForm.setData('email', e.target.value)}
                                                placeholder="nama@emailanda.com"
                                                autoComplete="email"
                                                required
                                                className="w-full pl-10 pr-4 py-3 bg-white border-2 border-ink rounded-xl shadow-sketch-xs focus:ring-0 focus:border-brand text-xs sm:text-sm font-semibold placeholder:text-ink-muted/50 transition-all"
                                            />
                                        </div>
                                        <InputError message={emailForm.errors.email} className="mt-1.5 text-xs font-bold text-red-600" />
                                    </div>

                                    <div className="pt-2">
                                        <button
                                            type="submit"
                                            disabled={emailForm.processing}
                                            className="sketch-btn w-full py-3.5 px-4 bg-brand text-white font-black text-xs sm:text-sm rounded-xl border-2 border-ink shadow-sketch hover:bg-brand-hover active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                                        >
                                            <Sparkles className="w-4 h-4" />
                                            <span>{emailForm.processing ? 'Mengirim Kode Verifikasi...' : 'Kirim Kode Verifikasi'}</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="text-center pt-3 border-t-2 border-dashed border-ink/10">
                                        <Link
                                            href={route('login')}
                                            className="inline-flex items-center gap-1.5 text-xs font-bold text-ink-muted hover:text-brand transition-colors"
                                        >
                                            <ArrowLeft className="w-3.5 h-3.5" />
                                            <span>Kembali ke Halaman Masuk</span>
                                        </Link>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* ========================================================
                            STEP 2: INPUT KODE VERIFIKASI (OTP 6-DIGIT)
                        ======================================================== */}
                        {step === 2 && (
                            <div className="space-y-6 animate-in fade-in duration-200">
                                <div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-sketch-sky text-ink border border-ink shadow-sketch-xs">
                                            LANGKAH 2 DARI 3
                                        </span>
                                        <button
                                            type="button"
                                            onClick={handleRestart}
                                            className="text-xs font-bold text-ink hover:text-brand underline flex items-center gap-1"
                                        >
                                            <RotateCcw className="w-3 h-3" />
                                            <span>Ganti Email</span>
                                        </button>
                                    </div>
                                    <h2 className="text-xl sm:text-2xl font-black text-ink tracking-tight mt-2">
                                        Masukkan Kode Verifikasi
                                    </h2>
                                    <p className="text-xs sm:text-sm text-ink-muted mt-1 leading-relaxed">
                                        Sistem telah mengirimkan 6 digit kode OTP rahasia ke <strong className="text-ink">{activeEmail}</strong>. Masukkan kode tersebut di bawah ini:
                                    </p>
                                </div>

                                <form onSubmit={handleVerifyOtp} className="space-y-5">
                                    <div>
                                        <label 
                                            htmlFor="otp_code" 
                                            className="block text-xs font-mono font-bold uppercase tracking-wider text-ink mb-1.5"
                                        >
                                            KODE OTP (6 DIGIT ANGKA)
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-muted">
                                                <KeyRound className="w-4 h-4" />
                                            </div>
                                            <input
                                                id="otp_code"
                                                type="text"
                                                inputMode="numeric"
                                                pattern="[0-9]*"
                                                maxLength={6}
                                                value={otpForm.data.code}
                                                onChange={(e) => {
                                                    const val = e.target.value.replace(/\D/g, '');
                                                    otpForm.setData('code', val);
                                                }}
                                                placeholder="123456"
                                                required
                                                autoFocus
                                                className="w-full pl-10 pr-4 py-3 bg-paper-dark border-2 border-ink rounded-xl shadow-sketch-xs focus:ring-0 focus:border-brand text-center font-mono text-xl sm:text-2xl font-black tracking-[0.4em] text-ink placeholder:text-ink-muted/30 placeholder:tracking-normal transition-all"
                                            />
                                        </div>
                                        <div className="flex items-center justify-between text-[11px] text-ink-muted mt-2 font-medium">
                                            <span>Masa berlaku kode: <strong>15 Menit</strong></span>
                                            <span>Batas salah: <strong>Maks 5x</strong></span>
                                        </div>
                                        <InputError message={otpForm.errors.code} className="mt-1.5 text-xs font-bold text-red-600" />
                                    </div>

                                    {/* Resend OTP Row */}
                                    <div className="p-3 rounded-xl bg-paper border border-ink/20 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
                                        <span className="text-ink-muted">Belum menerima email?</span>
                                        {cooldown > 0 ? (
                                            <span className="font-mono font-bold text-ink-muted flex items-center gap-1.5">
                                                <Clock className="w-3.5 h-3.5" />
                                                Kirim ulang dalam {cooldown}s
                                            </span>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={handleResendOtp}
                                                disabled={emailForm.processing}
                                                className="font-bold text-brand hover:text-brand-hover underline active:scale-95 transition-all"
                                            >
                                                Kirim Ulang Kode Sekarang
                                            </button>
                                        )}
                                    </div>

                                    <div className="pt-2">
                                        <button
                                            type="submit"
                                            disabled={otpForm.processing || otpForm.data.code.length !== 6}
                                            className="sketch-btn w-full py-3.5 px-4 bg-brand text-white font-black text-xs sm:text-sm rounded-xl border-2 border-ink shadow-sketch hover:bg-brand-hover active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            <ShieldCheck className="w-4 h-4" />
                                            <span>{otpForm.processing ? 'Memverifikasi Kode...' : 'Konfirmasi & Lanjutkan'}</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* ========================================================
                            STEP 3: BUAT KATA SANDI BARU
                        ======================================================== */}
                        {step === 3 && (
                            <div className="space-y-6 animate-in fade-in duration-200">
                                <div>
                                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-sketch-yellow text-ink border border-ink shadow-sketch-xs">
                                        LANGKAH 3 DARI 3
                                    </span>
                                    <h2 className="text-xl sm:text-2xl font-black text-ink tracking-tight mt-2">
                                        Buat Kata Sandi Baru
                                    </h2>
                                    <p className="text-xs sm:text-sm text-ink-muted mt-1 leading-relaxed">
                                        Verifikasi identitas akun Anda berhasil. Silakan buat kata sandi baru untuk akun <strong className="text-ink">{activeEmail}</strong>:
                                    </p>
                                </div>

                                <form onSubmit={handleResetPassword} className="space-y-5">
                                    {/* Kata Sandi Baru */}
                                    <div>
                                        <label 
                                            htmlFor="password" 
                                            className="block text-xs font-mono font-bold uppercase tracking-wider text-ink mb-1.5"
                                        >
                                            KATA SANDI BARU
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-muted">
                                                <Lock className="w-4 h-4" />
                                            </div>
                                            <input
                                                id="password"
                                                type={showPassword ? 'text' : 'password'}
                                                name="password"
                                                value={passwordForm.data.password}
                                                onChange={(e) => passwordForm.setData('password', e.target.value)}
                                                placeholder="Minimal 8 karakter"
                                                autoComplete="new-password"
                                                required
                                                autoFocus
                                                className="w-full pl-10 pr-11 py-3 bg-white border-2 border-ink rounded-xl shadow-sketch-xs focus:ring-0 focus:border-brand text-xs sm:text-sm font-semibold placeholder:text-ink-muted/50 transition-all"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-ink-muted hover:text-ink transition-colors"
                                            >
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                        <InputError message={passwordForm.errors.password} className="mt-1.5 text-xs font-bold text-red-600" />
                                    </div>

                                    {/* Konfirmasi Kata Sandi */}
                                    <div>
                                        <label 
                                            htmlFor="password_confirmation" 
                                            className="block text-xs font-mono font-bold uppercase tracking-wider text-ink mb-1.5"
                                        >
                                            ULANGI KATA SANDI BARU
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-muted">
                                                <Lock className="w-4 h-4" />
                                            </div>
                                            <input
                                                id="password_confirmation"
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                name="password_confirmation"
                                                value={passwordForm.data.password_confirmation}
                                                onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                                placeholder="Ulangi kata sandi di atas"
                                                autoComplete="new-password"
                                                required
                                                className="w-full pl-10 pr-11 py-3 bg-white border-2 border-ink rounded-xl shadow-sketch-xs focus:ring-0 focus:border-brand text-xs sm:text-sm font-semibold placeholder:text-ink-muted/50 transition-all"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-ink-muted hover:text-ink transition-colors"
                                            >
                                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                        <InputError message={passwordForm.errors.password_confirmation} className="mt-1.5 text-xs font-bold text-red-600" />
                                        <InputError message={passwordForm.errors.email} className="mt-1.5 text-xs font-bold text-red-600" />
                                    </div>

                                    <div className="pt-2">
                                        <button
                                            type="submit"
                                            disabled={passwordForm.processing}
                                            className="sketch-btn w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm rounded-xl border-2 border-ink shadow-sketch active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                                        >
                                            <Check className="w-4 h-4 stroke-[3]" />
                                            <span>{passwordForm.processing ? 'Menyimpan Kata Sandi...' : 'Simpan & Perbarui Kata Sandi'}</span>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
