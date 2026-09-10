import React, { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import InputError from '@/Components/InputError';
import { 
    Lock, 
    Eye, 
    EyeOff, 
    ShieldCheck, 
    Check, 
    Mail 
} from 'lucide-react';

export default function ResetPassword({ token, email, auth }) {
    const { site } = usePage().props;
    const siteName = site?.site_name || 'Maitri Project';

    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <MainLayout
            auth={auth}
            title={`Buat Kata Sandi Baru — ${siteName}`}
            description={`Buat kata sandi baru untuk akun ${siteName} Anda.`}
            activeTab="profil"
        >
            <div className="max-w-md mx-auto px-4 py-8 sm:py-16">
                <div className="sketch-card bg-white p-6 sm:p-8 rounded-3xl border-2 border-ink shadow-sketch space-y-6">
                    <div>
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-sketch-yellow text-ink border border-ink shadow-sketch-xs">
                            LANGKAH TERAKHIR
                        </span>
                        <h1 className="text-xl sm:text-2xl font-black text-ink tracking-tight mt-2">
                            Buat Kata Sandi Baru
                        </h1>
                        <p className="text-xs sm:text-sm text-ink-muted mt-1 leading-relaxed">
                            Silakan masukkan kata sandi baru yang aman untuk akun Anda.
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        {/* Email Read-only */}
                        <div>
                            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-ink mb-1.5">
                                ALAMAT EMAIL
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-muted">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <input
                                    type="email"
                                    value={data.email}
                                    readOnly
                                    className="w-full pl-10 pr-4 py-2.5 bg-paper-dark border-2 border-ink rounded-xl shadow-sketch-xs text-xs font-mono font-bold text-ink cursor-not-allowed select-all"
                                />
                            </div>
                            <InputError message={errors.email} className="mt-1 text-xs font-bold text-red-600" />
                        </div>

                        {/* Password Baru */}
                        <div>
                            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-ink mb-1.5">
                                KATA SANDI BARU
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-muted">
                                    <Lock className="w-4 h-4" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Minimal 8 karakter"
                                    required
                                    autoFocus
                                    className="w-full pl-10 pr-11 py-2.5 bg-white border-2 border-ink rounded-xl shadow-sketch-xs focus:ring-0 focus:border-brand text-xs sm:text-sm font-semibold placeholder:text-ink-muted/50 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-ink-muted hover:text-ink transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            <InputError message={errors.password} className="mt-1 text-xs font-bold text-red-600" />
                        </div>

                        {/* Konfirmasi Password */}
                        <div>
                            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-ink mb-1.5">
                                KONFIRMASI KATA SANDI
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-muted">
                                    <Lock className="w-4 h-4" />
                                </div>
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    placeholder="Ulangi kata sandi baru"
                                    required
                                    className="w-full pl-10 pr-11 py-2.5 bg-white border-2 border-ink rounded-xl shadow-sketch-xs focus:ring-0 focus:border-brand text-xs sm:text-sm font-semibold placeholder:text-ink-muted/50 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-ink-muted hover:text-ink transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            <InputError message={errors.password_confirmation} className="mt-1 text-xs font-bold text-red-600" />
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="sketch-btn w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm rounded-xl border-2 border-ink shadow-sketch active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                            >
                                <Check className="w-4 h-4 stroke-[3]" />
                                <span>{processing ? 'Menyimpan...' : 'Simpan Kata Sandi Baru'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </MainLayout>
    );
}
