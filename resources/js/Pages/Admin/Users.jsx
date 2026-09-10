import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import axios from 'axios';
import { 
    Users, 
    ShieldCheck, 
    ShieldAlert, 
    Crown, 
    Search, 
    Filter, 
    RotateCcw, 
    RefreshCw, 
    CheckCircle2, 
    AlertCircle, 
    Phone, 
    Mail, 
    Calendar, 
    ShoppingBag, 
    Check, 
    Copy, 
    UserCheck,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

export default function UsersPage({ auth, users, filters, metrics }) {
    const currentAdminId = auth?.user?.id;
    const [search, setSearch] = useState(filters.search || '');
    const [roleFilter, setRoleFilter] = useState(filters.role || 'all');
    const [loadingUserId, setLoadingUserId] = useState(null);
    const [notification, setNotification] = useState(null);
    const [copiedKey, setCopiedKey] = useState(null);

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        router.get(route('admin.users.index'), {
            search: search.trim(),
            role: roleFilter,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleResetFilter = () => {
        setSearch('');
        setRoleFilter('all');
        router.get(route('admin.users.index'), {}, {
            preserveState: true,
            replace: true,
        });
    };

    const handleCopy = (text, key) => {
        navigator.clipboard.writeText(text);
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 2000);
    };

    const handleRoleChange = async (targetUser, newRole) => {
        const isPromoting = newRole === 'admin';
        const confirmMsg = isPromoting
            ? `Konfirmasi: Apakah Anda yakin ingin mempromosikan "${targetUser.name}" (${targetUser.email}) menjadi ADMINISTRATOR?\n\nPengguna ini akan memiliki akses penuh ke Admin Control Center.`
            : `Konfirmasi: Apakah Anda yakin ingin mencabut hak akses Administrator dari "${targetUser.name}"?\n\nPengguna ini akan kembali menjadi user biasa.`;

        if (!window.confirm(confirmMsg)) {
            return;
        }

        setLoadingUserId(targetUser.id);
        setNotification(null);

        try {
            const response = await axios.post(`/admin/users/${targetUser.id}/role`, {
                role: newRole,
            });

            if (response.data && response.data.success) {
                setNotification({
                    type: 'success',
                    message: response.data.message || 'Role pengguna berhasil diperbarui!',
                });
                router.reload({ only: ['users', 'metrics'] });
            } else {
                setNotification({
                    type: 'error',
                    message: response.data.message || 'Gagal mengubah role pengguna.',
                });
            }
        } catch (error) {
            setNotification({
                type: 'error',
                message: error.response?.data?.message || 'Terjadi kesalahan saat mengubah role pengguna.',
            });
        } finally {
            setLoadingUserId(null);
            setTimeout(() => setNotification(null), 6000);
        }
    };

    return (
        <AdminLayout auth={auth} title="Kelola Pengguna" activeMenu="users">
            <div className="space-y-6">

                {/* 1. Header Banner & Actions */}
                <div className="sketch-card bg-white p-5 sm:p-6 rounded-3xl border-2 border-ink shadow-sketch flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-brand-subtle text-brand-navy border border-ink shadow-sketch-xs">
                                👥 KELOLA PENGGUNA
                            </span>
                            <span className="text-xs font-mono text-ink-muted font-bold">
                                • Hak Akses & Role Management
                            </span>
                        </div>
                        <h1 className="text-xl sm:text-2xl font-black text-ink tracking-tight">
                            Daftar Seluruh Pengguna
                        </h1>
                        <p className="text-xs sm:text-sm text-ink-muted mt-0.5 font-medium">
                            Pantau data seluruh user terdaftar, aktivitas transaksi, dan promosikan user biasa menjadi Administrator.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            type="button"
                            onClick={() => router.reload({ only: ['users', 'metrics'] })}
                            className="sketch-btn px-4 py-2 bg-paper hover:bg-paper-dark text-ink font-bold text-xs rounded-xl border-2 border-ink shadow-sketch-xs flex items-center gap-1.5 transition-all"
                            title="Segarkan Data"
                        >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>Refresh Data</span>
                        </button>
                    </div>
                </div>

                {/* Toast Notification */}
                {notification && (
                    <div className={`p-4 rounded-2xl border-2 shadow-sketch-xs flex items-center justify-between gap-3 text-xs font-bold animate-in fade-in ${
                        notification.type === 'success'
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                            : 'bg-rose-50 border-rose-500 text-rose-900'
                    }`}>
                        <div className="flex items-center gap-2">
                            {notification.type === 'success' ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            ) : (
                                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                            )}
                            <span>{notification.message}</span>
                        </div>
                        <button 
                            type="button" 
                            onClick={() => setNotification(null)}
                            className="p-1 rounded hover:bg-black/10 text-ink"
                        >
                            ✕
                        </button>
                    </div>
                )}

                {/* 2. KPI Summary Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <div className="sketch-card bg-paper-grid p-4 rounded-2xl border-2 border-ink shadow-sketch-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono uppercase text-ink-muted font-bold">
                                TOTAL PENGGUNA
                            </span>
                            <div className="w-7 h-7 rounded-lg bg-sky-100 border border-ink flex items-center justify-center text-sky-700">
                                <Users className="w-3.5 h-3.5" />
                            </div>
                        </div>
                        <div className="text-xl sm:text-2xl font-black font-mono text-ink mt-1">
                            {metrics?.total_users || 0}
                        </div>
                        <span className="text-[10px] text-ink-muted mt-0.5 block">Akun terdaftar</span>
                    </div>

                    <div className="sketch-card bg-paper-grid p-4 rounded-2xl border-2 border-ink shadow-sketch-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono uppercase text-amber-700 font-bold">
                                ADMINISTRATOR
                            </span>
                            <div className="w-7 h-7 rounded-lg bg-amber-100 border border-ink flex items-center justify-center text-amber-700">
                                <Crown className="w-3.5 h-3.5" />
                            </div>
                        </div>
                        <div className="text-xl sm:text-2xl font-black font-mono text-amber-700 mt-1">
                            {metrics?.total_admins || 0}
                        </div>
                        <span className="text-[10px] text-ink-muted mt-0.5 block">Akses dashboard penuh</span>
                    </div>

                    <div className="sketch-card bg-paper-grid p-4 rounded-2xl border-2 border-ink shadow-sketch-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono uppercase text-ink-muted font-bold">
                                USER BIASA
                            </span>
                            <div className="w-7 h-7 rounded-lg bg-emerald-100 border border-ink flex items-center justify-center text-emerald-700">
                                <UserCheck className="w-3.5 h-3.5" />
                            </div>
                        </div>
                        <div className="text-xl sm:text-2xl font-black font-mono text-emerald-700 mt-1">
                            {metrics?.total_regular_users || 0}
                        </div>
                        <span className="text-[10px] text-ink-muted mt-0.5 block">Member pembeli</span>
                    </div>

                    <div className="sketch-card bg-paper-grid p-4 rounded-2xl border-2 border-ink shadow-sketch-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono uppercase text-ink-muted font-bold">
                                MEMBER BARU HARI INI
                            </span>
                            <div className="w-7 h-7 rounded-lg bg-brand-subtle border border-ink flex items-center justify-center text-brand">
                                <Calendar className="w-3.5 h-3.5" />
                            </div>
                        </div>
                        <div className="text-xl sm:text-2xl font-black font-mono text-brand mt-1">
                            {metrics?.new_users_today || 0}
                        </div>
                        <span className="text-[10px] text-ink-muted mt-0.5 block">Registrasi hari ini</span>
                    </div>
                </div>

                {/* 3. Search & Filter Bar */}
                <div className="sketch-card bg-white p-4 sm:p-5 rounded-2xl border-2 border-ink shadow-sketch">
                    <form onSubmit={handleFilterSubmit} className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
                        <div className="relative flex-1">
                            <Search className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari nama pengguna, email, atau nomor telepon..."
                                className="w-full pl-10 pr-4 py-2 bg-paper border-2 border-ink rounded-xl text-xs sm:text-sm font-semibold focus:ring-0 focus:border-ink shadow-sketch-xs placeholder:text-ink-muted/70"
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            {/* Role filter */}
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="px-3 py-2 bg-white border-2 border-ink rounded-xl text-xs font-bold font-mono focus:ring-0 focus:border-ink shadow-sketch-xs"
                            >
                                <option value="all">Semua Role</option>
                                <option value="admin">👑 Administrator (Admin)</option>
                                <option value="user">👤 User Biasa (Member)</option>
                            </select>

                            <button
                                type="submit"
                                className="sketch-btn px-4 py-2 bg-brand text-white font-bold text-xs rounded-xl border-2 border-ink shadow-sketch-xs flex items-center gap-1.5 hover:bg-brand-hover"
                            >
                                <Filter className="w-3.5 h-3.5" />
                                <span>Filter</span>
                            </button>

                            {(search || roleFilter !== 'all') && (
                                <button
                                    type="button"
                                    onClick={handleResetFilter}
                                    className="sketch-btn px-3 py-2 bg-paper-dark hover:bg-white text-ink font-bold text-xs rounded-xl border-2 border-ink shadow-sketch-xs flex items-center gap-1"
                                    title="Reset Filter"
                                >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                    <span>Reset</span>
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* 4. Users List Container */}
                <div className="sketch-card bg-white p-4 sm:p-6 rounded-3xl border-2 border-ink shadow-sketch space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b-2 border-ink/10">
                        <div className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-brand" />
                            <h2 className="text-base sm:text-lg font-black text-ink">
                                Daftar Pengguna ({users?.total || 0})
                            </h2>
                        </div>
                        <span className="text-[11px] font-mono text-ink-muted">
                            Halaman {users?.current_page || 1} dari {users?.last_page || 1}
                        </span>
                    </div>

                    {/* DESKTOP TABLE VIEW (hidden on mobile, visible on md and up) */}
                    <div className="hidden md:block overflow-x-auto no-scrollbar">
                        <table className="w-full text-left text-xs font-medium">
                            <thead className="bg-paper-dark text-ink font-mono font-bold uppercase border-y-2 border-ink text-[11px]">
                                <tr>
                                    <th className="py-3 px-3">Pengguna</th>
                                    <th className="py-3 px-3">No. WhatsApp / HP</th>
                                    <th className="py-3 px-3">Role & Hak Akses</th>
                                    <th className="py-3 px-3">Riwayat Belanja</th>
                                    <th className="py-3 px-3">Terdaftar</th>
                                    <th className="py-3 px-3 text-right">Aksi Role</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-ink/10">
                                {users?.data?.length > 0 ? (
                                    users.data.map((u) => {
                                        const isSelf = u.id === currentAdminId;
                                        const isLoading = loadingUserId === u.id;
                                        const initial = (u.name || 'U').charAt(0).toUpperCase();

                                        return (
                                            <tr key={u.id} className="hover:bg-brand-subtle/20 transition-colors">
                                                {/* User Info */}
                                                <td className="py-3.5 px-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-9 h-9 rounded-xl border-2 border-ink shadow-sketch-xs flex items-center justify-center font-mono font-black text-xs shrink-0 ${
                                                            u.is_admin 
                                                                ? 'bg-amber-100 text-amber-900 border-amber-500' 
                                                                : 'bg-brand-subtle text-brand-navy'
                                                        }`}>
                                                            {initial}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="flex items-center gap-1.5">
                                                                <span className="font-bold text-ink truncate max-w-[170px]">{u.name}</span>
                                                                {isSelf && (
                                                                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-400">
                                                                        Anda
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-1 text-[11px] text-ink-muted font-mono mt-0.5">
                                                                <Mail className="w-3 h-3 shrink-0" />
                                                                <span className="truncate max-w-[190px]">{u.email}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Phone / WA */}
                                                <td className="py-3.5 px-3 font-mono">
                                                    {u.phone ? (
                                                        <div className="flex items-center gap-1 text-ink font-bold text-xs">
                                                            <Phone className="w-3 h-3 text-emerald-600 shrink-0" />
                                                            <span>{u.phone}</span>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleCopy(u.phone, `p-${u.id}`)}
                                                                className="text-ink-muted hover:text-ink ml-1"
                                                                title="Salin Nomor"
                                                            >
                                                                {copiedKey === `p-${u.id}` ? (
                                                                    <Check className="w-3 h-3 text-emerald-600" />
                                                                ) : (
                                                                    <Copy className="w-3 h-3" />
                                                                )}
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <span className="text-ink-muted text-[11px] italic">- Belum diisi -</span>
                                                    )}
                                                </td>

                                                {/* Role Badge */}
                                                <td className="py-3.5 px-3">
                                                    {u.is_admin ? (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-black bg-amber-100 text-amber-900 border-2 border-amber-500 shadow-sketch-xs">
                                                            <Crown className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                                                            <span>ADMINISTRATOR</span>
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-sky-50 text-sky-800 border border-sky-400">
                                                            <UserCheck className="w-3.5 h-3.5 text-sky-600" />
                                                            <span>USER BIASA</span>
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Transaction Stats */}
                                                <td className="py-3.5 px-3">
                                                    <div className="font-mono text-xs font-black text-brand">
                                                        {u.formatted_total_spent}
                                                    </div>
                                                    <span className="text-[10px] text-ink-muted font-mono block">
                                                        {u.transactions_count} transaksi berhasil
                                                    </span>
                                                </td>

                                                {/* Registered Date */}
                                                <td className="py-3.5 px-3 font-mono text-[11px] text-ink-muted">
                                                    {u.registered_date}
                                                </td>

                                                {/* Actions */}
                                                <td className="py-3.5 px-3 text-right">
                                                    {isSelf ? (
                                                        <span className="text-[11px] font-mono text-ink-muted italic px-2 py-1 bg-paper rounded-lg border border-ink/20 inline-block">
                                                            Akun Anda Sendiri
                                                        </span>
                                                    ) : u.is_admin ? (
                                                        <button
                                                            type="button"
                                                            disabled={isLoading}
                                                            onClick={() => handleRoleChange(u, 'user')}
                                                            className="sketch-btn px-2.5 py-1.5 bg-paper hover:bg-rose-50 text-rose-700 font-bold text-[11px] rounded-lg border border-rose-400 inline-flex items-center gap-1 shadow-sketch-xs transition-all disabled:opacity-50"
                                                            title="Turunkan role menjadi user biasa"
                                                        >
                                                            <RotateCcw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                                                            <span>{isLoading ? 'Memproses...' : 'Cabut Admin'}</span>
                                                        </button>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            disabled={isLoading}
                                                            onClick={() => handleRoleChange(u, 'admin')}
                                                            className="sketch-btn px-3 py-1.5 bg-brand hover:bg-brand-hover text-white font-bold text-[11px] rounded-lg border border-ink inline-flex items-center gap-1.5 shadow-sketch-xs transition-all disabled:opacity-50"
                                                            title="Promosikan user ini menjadi Administrator"
                                                        >
                                                            <Crown className={`w-3.5 h-3.5 text-amber-300 ${isLoading ? 'animate-spin' : ''}`} />
                                                            <span>{isLoading ? 'Memproses...' : 'Jadikan Admin'}</span>
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="py-10 text-center text-ink-muted">
                                            <Users className="w-8 h-8 mx-auto mb-2 text-ink-muted/50" />
                                            <p className="font-bold text-ink">Tidak ada pengguna ditemukan.</p>
                                            <p className="text-xs mt-0.5">Coba sesuaikan kata kunci pencarian atau reset filter.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* MOBILE CARD VIEW (md:hidden - Layout Khusus Mobile) */}
                    <div className="md:hidden space-y-3.5">
                        {users?.data?.length > 0 ? (
                            users.data.map((u) => {
                                const isSelf = u.id === currentAdminId;
                                const isLoading = loadingUserId === u.id;
                                const initial = (u.name || 'U').charAt(0).toUpperCase();

                                return (
                                    <div
                                        key={u.id}
                                        className={`p-4 rounded-2xl border-2 shadow-sketch-xs space-y-3 transition-all ${
                                            u.is_admin 
                                                ? 'bg-amber-50/40 border-amber-400' 
                                                : 'bg-paper-grid border-ink'
                                        }`}
                                    >
                                        {/* Baris Atas: Profil & Role Badge */}
                                        <div className="flex items-start justify-between gap-2 border-b border-ink/15 pb-3">
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                <div className={`w-10 h-10 rounded-xl border-2 border-ink shadow-sketch-xs flex items-center justify-center font-mono font-black text-sm shrink-0 ${
                                                    u.is_admin ? 'bg-amber-200 text-amber-900' : 'bg-white text-ink'
                                                }`}>
                                                    {initial}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-1.5 flex-wrap">
                                                        <h3 className="font-black text-xs text-ink truncate">{u.name}</h3>
                                                        {isSelf && (
                                                            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-400">
                                                                Anda
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-[11px] text-ink-muted font-mono truncate">{u.email}</p>
                                                </div>
                                            </div>

                                            <div>
                                                {u.is_admin ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-500 shrink-0">
                                                        <Crown className="w-3 h-3 text-amber-600" />
                                                        ADMIN
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-100 text-sky-800 border border-sky-400 shrink-0">
                                                        USER
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Baris Detail Kontak & Belanja */}
                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            <div className="p-2 bg-white rounded-xl border border-ink/15">
                                                <span className="text-[10px] text-ink-muted block font-mono">No. Telepon / WA</span>
                                                <span className="font-mono font-bold text-ink truncate block">
                                                    {u.phone || '-'}
                                                </span>
                                            </div>
                                            <div className="p-2 bg-white rounded-xl border border-ink/15">
                                                <span className="text-[10px] text-ink-muted block font-mono">Total Belanja</span>
                                                <span className="font-mono font-black text-brand truncate block">
                                                    {u.formatted_total_spent}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="text-[10px] text-ink-muted font-mono flex items-center justify-between pt-1">
                                            <span>Terdaftar: {u.registered_date}</span>
                                            <span>{u.transactions_count} pesanan</span>
                                        </div>

                                        {/* Tombol Aksi Role Mobile */}
                                        {!isSelf && (
                                            <div className="pt-2 border-t border-ink/15">
                                                {u.is_admin ? (
                                                    <button
                                                        type="button"
                                                        disabled={isLoading}
                                                        onClick={() => handleRoleChange(u, 'user')}
                                                        className="sketch-btn w-full py-2 bg-paper hover:bg-rose-50 text-rose-700 font-bold text-xs rounded-xl border border-rose-400 flex items-center justify-center gap-1.5 shadow-sketch-xs"
                                                    >
                                                        <RotateCcw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                                                        <span>{isLoading ? 'Memproses...' : 'Cabut Akses Administrator'}</span>
                                                    </button>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        disabled={isLoading}
                                                        onClick={() => handleRoleChange(u, 'admin')}
                                                        className="sketch-btn w-full py-2 bg-brand hover:bg-brand-hover text-white font-black text-xs rounded-xl border border-ink flex items-center justify-center gap-1.5 shadow-sketch-xs"
                                                    >
                                                        <Crown className={`w-4 h-4 text-amber-300 ${isLoading ? 'animate-spin' : ''}`} />
                                                        <span>{isLoading ? 'Memproses...' : 'Jadikan Administrator'}</span>
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <div className="py-8 text-center text-ink-muted sketch-card p-6 bg-paper-grid">
                                <Users className="w-8 h-8 mx-auto mb-2 text-ink-muted/50" />
                                <p className="font-bold text-ink">Tidak ada pengguna ditemukan.</p>
                                <p className="text-xs mt-0.5">Coba ubah filter pencarian Anda.</p>
                            </div>
                        )}
                    </div>

                    {/* 5. Pagination */}
                    {users?.links?.length > 3 && (
                        <div className="pt-4 border-t-2 border-ink/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                            <span className="text-xs font-mono text-ink-muted">
                                Menampilkan {users.from || 0} - {users.to || 0} dari {users.total || 0} pengguna
                            </span>

                            <div className="flex items-center gap-1 flex-wrap justify-center">
                                {users.links.map((link, idx) => {
                                    if (!link.url) {
                                        return (
                                            <span
                                                key={idx}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                className="px-3 py-1.5 text-xs font-mono text-ink-muted/50 border border-ink/10 rounded-lg bg-paper-dark"
                                            />
                                        );
                                    }

                                    return (
                                        <Link
                                            key={idx}
                                            href={link.url}
                                            preserveState
                                            preserveScroll
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg border border-ink transition-all shadow-sketch-xs ${
                                                link.active
                                                    ? 'bg-brand text-white border-brand'
                                                    : 'bg-white hover:bg-paper-dark text-ink'
                                            }`}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    )}

                </div>

            </div>
        </AdminLayout>
    );
}
