import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Layers,
    Plus,
    Edit2,
    Trash2,
    Check,
    X,
    ChevronDown,
    ChevronRight,
    Sparkles,
    FolderPlus,
    Tag,
    ArrowUpDown,
    AlertCircle,
} from 'lucide-react';

export default function CategoryIndex({ categories = [] }) {
    // State for expanded categories
    const [expandedCategoryIds, setExpandedCategoryIds] = useState(
        categories.length > 0 ? [categories[0].id] : []
    );

    // Modal states
    const [categoryModal, setCategoryModal] = useState({
        isOpen: false,
        isEdit: false,
        data: { id: null, name: '', slug: '', icon: '', sort_order: 0, is_active: true },
    });

    const [subCategoryModal, setSubCategoryModal] = useState({
        isOpen: false,
        isEdit: false,
        data: { id: null, category_id: null, name: '', slug: '', sort_order: 0, is_active: true },
    });

    const toggleExpand = (id) => {
        setExpandedCategoryIds((prev) =>
            prev.includes(id) ? prev.filter((catId) => catId !== id) : [...prev, id]
        );
    };

    // Category actions
    const openAddCategory = () => {
        setCategoryModal({
            isOpen: true,
            isEdit: false,
            data: { id: null, name: '', slug: '', icon: '', sort_order: categories.length + 1, is_active: true },
        });
    };

    const openEditCategory = (cat) => {
        setCategoryModal({
            isOpen: true,
            isEdit: true,
            data: {
                id: cat.id,
                name: cat.name,
                slug: cat.slug,
                icon: cat.icon || '',
                sort_order: cat.sort_order ?? 0,
                is_active: Boolean(cat.is_active),
            },
        });
    };

    const handleSaveCategory = (e) => {
        e.preventDefault();
        const { isEdit, data } = categoryModal;

        if (isEdit) {
            router.put(`/admin/categories/${data.id}`, data, {
                onSuccess: () => setCategoryModal({ isOpen: false, isEdit: false, data: {} }),
            });
        } else {
            router.post('/admin/categories', data, {
                onSuccess: () => setCategoryModal({ isOpen: false, isEdit: false, data: {} }),
            });
        }
    };

    const handleDeleteCategory = (cat) => {
        if (confirm(`Hapus kategori "${cat.name}" beserta seluruh subkategori dan produk terkait di dalamnya?`)) {
            router.delete(`/admin/categories/${cat.id}`);
        }
    };

    // Subcategory actions
    const openAddSubCategory = (categoryId) => {
        const cat = categories.find((c) => c.id === categoryId);
        const nextOrder = (cat?.sub_categories?.length || 0) + 1;
        setSubCategoryModal({
            isOpen: true,
            isEdit: false,
            data: { id: null, category_id: categoryId, name: '', slug: '', sort_order: nextOrder, is_active: true },
        });
    };

    const openEditSubCategory = (sub) => {
        setSubCategoryModal({
            isOpen: true,
            isEdit: true,
            data: {
                id: sub.id,
                category_id: sub.category_id,
                name: sub.name,
                slug: sub.slug,
                sort_order: sub.sort_order ?? 0,
                is_active: Boolean(sub.is_active),
            },
        });
    };

    const handleSaveSubCategory = (e) => {
        e.preventDefault();
        const { isEdit, data } = subCategoryModal;

        if (isEdit) {
            router.put(`/admin/subcategories/${data.id}`, data, {
                onSuccess: () => setSubCategoryModal({ isOpen: false, isEdit: false, data: {} }),
            });
        } else {
            router.post('/admin/subcategories', data, {
                onSuccess: () => setSubCategoryModal({ isOpen: false, isEdit: false, data: {} }),
            });
        }
    };

    const handleDeleteSubCategory = (sub) => {
        if (confirm(`Hapus subkategori "${sub.name}"? Produk yang ada di subkategori ini akan tetap berada di kategori utama.`)) {
            router.delete(`/admin/subcategories/${sub.id}`);
        }
    };

    return (
        <AdminLayout title="Kelola Kategori & Subkategori" activeMenu="categories">
            <Head title="Kategori & Subkategori — Maitri Admin" />

            <div className="space-y-6 max-w-7xl mx-auto pb-16">
                {/* Header Banner */}
                <div className="sketch-card bg-paper-dark p-5 sm:p-7 rounded-3xl border-2 border-ink shadow-sketch relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-1.5 max-w-2xl">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-brand-subtle text-brand-navy border border-ink shadow-sketch-xs">
                                🗂️ HIERARKI KATALOG TOKO
                            </span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black text-ink font-sans">
                            Kategori & Subkategori Produk
                        </h2>
                        <p className="text-xs sm:text-sm text-ink-muted leading-relaxed font-sans">
                            Atur kelompok kategori utama dan subkategori di bawahnya. Produk dapat diletakkan langsung di kategori utama, atau di bawah subkategori tertentu.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={openAddCategory}
                        className="sketch-btn px-5 py-3 bg-brand hover:bg-brand-hover text-white rounded-2xl border-2 border-ink shadow-sketch font-bold text-xs sm:text-sm flex items-center gap-2 shrink-0 transition-all"
                    >
                        <Plus className="w-4 h-4 stroke-[3]" />
                        <span>Tambah Kategori Utama</span>
                    </button>
                </div>

                {/* Categories List */}
                <div className="space-y-4">
                    {categories.length > 0 ? (
                        categories.map((category) => {
                            const isExpanded = expandedCategoryIds.includes(category.id);
                            const subCount = category.sub_categories?.length || 0;
                            const prodCount = category.products_count ?? 0;

                            return (
                                <div
                                    key={category.id}
                                    className="sketch-card bg-white rounded-3xl border-2 border-ink shadow-sketch overflow-hidden transition-all"
                                >
                                    {/* Category Item Row */}
                                    <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border-b-2 border-ink/10">
                                        <div className="flex items-center gap-3.5 min-w-0">
                                            <button
                                                type="button"
                                                onClick={() => toggleExpand(category.id)}
                                                className="p-1.5 rounded-xl bg-paper-dark hover:bg-brand-subtle border-2 border-ink shadow-sketch-xs text-ink transition-transform"
                                                title={isExpanded ? 'Tutup Subkategori' : 'Buka Subkategori'}
                                            >
                                                {isExpanded ? (
                                                    <ChevronDown className="w-4 h-4" />
                                                ) : (
                                                    <ChevronRight className="w-4 h-4" />
                                                )}
                                            </button>

                                            <div className="w-10 h-10 rounded-2xl bg-brand-subtle border-2 border-ink shadow-sketch-xs flex items-center justify-center font-bold text-brand shrink-0">
                                                <Layers className="w-5 h-5" />
                                            </div>

                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h3 className="text-base sm:text-lg font-black text-ink">
                                                        {category.name}
                                                    </h3>
                                                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-paper-dark border border-ink text-ink-muted">
                                                        /{category.slug}
                                                    </span>
                                                    {!category.is_active && (
                                                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 border border-rose-300">
                                                            Nonaktif
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-3 mt-1 text-xs font-mono font-bold text-ink-muted">
                                                    <span>Urutan: #{category.sort_order}</span>
                                                    <span>•</span>
                                                    <span>{subCount} Subkategori</span>
                                                    <span>•</span>
                                                    <span className="text-brand">{prodCount} Produk</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action buttons */}
                                        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                                            <button
                                                type="button"
                                                onClick={() => openAddSubCategory(category.id)}
                                                className="sketch-btn px-3 py-1.5 bg-paper-dark hover:bg-brand-subtle text-ink rounded-xl border-2 border-ink shadow-sketch-xs text-xs font-bold flex items-center gap-1.5 transition-all"
                                            >
                                                <FolderPlus className="w-3.5 h-3.5 text-brand" />
                                                <span>+ Subkategori</span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => openEditCategory(category)}
                                                className="p-2 rounded-xl bg-white hover:bg-paper-dark text-ink border-2 border-ink shadow-sketch-xs transition-all"
                                                title="Edit Kategori"
                                            >
                                                <Edit2 className="w-3.5 h-3.5" />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => handleDeleteCategory(category)}
                                                className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border-2 border-ink shadow-sketch-xs transition-all"
                                                title="Hapus Kategori"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Subcategories Accordion Content */}
                                    {isExpanded && (
                                        <div className="p-4 sm:p-5 bg-paper-light/60">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-xs font-mono font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
                                                    <Tag className="w-3.5 h-3.5 text-brand" />
                                                    <span>Daftar Subkategori di {category.name}:</span>
                                                </span>
                                                <span className="text-[11px] font-mono text-ink-muted">
                                                    Total {subCount} Subkategori
                                                </span>
                                            </div>

                                            {category.sub_categories && category.sub_categories.length > 0 ? (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                                    {category.sub_categories.map((sub) => (
                                                        <div
                                                            key={sub.id}
                                                            className="p-3 bg-white rounded-2xl border-2 border-ink shadow-sketch-xs flex items-center justify-between gap-3 group hover:border-brand transition-colors"
                                                        >
                                                            <div className="min-w-0">
                                                                <div className="font-bold text-ink text-xs sm:text-sm truncate">
                                                                    {sub.name}
                                                                </div>
                                                                <div className="flex items-center gap-2 mt-0.5 text-[10px] font-mono text-ink-muted">
                                                                    <span>/{sub.slug}</span>
                                                                    <span>•</span>
                                                                    <span>#{sub.sort_order}</span>
                                                                    <span>•</span>
                                                                    <span className="text-brand font-bold">
                                                                        {sub.products_count ?? 0} Produk
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center gap-1 shrink-0">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => openEditSubCategory(sub)}
                                                                    className="p-1.5 rounded-lg hover:bg-paper-dark text-ink border border-transparent hover:border-ink transition-colors"
                                                                    title="Edit Subkategori"
                                                                >
                                                                    <Edit2 className="w-3 h-3" />
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleDeleteSubCategory(sub)}
                                                                    className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-700 border border-transparent hover:border-ink transition-colors"
                                                                    title="Hapus Subkategori"
                                                                >
                                                                    <Trash2 className="w-3 h-3" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-6 border-2 border-dashed border-ink/20 rounded-2xl bg-white/70">
                                                    <p className="text-xs text-ink-muted">
                                                        Kategori ini belum memiliki subkategori. Produk dapat langsung dimasukkan di kategori ini tanpa subkategori.
                                                    </p>
                                                    <button
                                                        type="button"
                                                        onClick={() => openAddSubCategory(category.id)}
                                                        className="mt-2 text-xs font-bold text-brand hover:underline font-mono"
                                                    >
                                                        + Tambah Subkategori Pertama Sekarang
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <div className="sketch-card p-12 text-center bg-white rounded-3xl border-2 border-ink shadow-sketch space-y-3">
                            <Layers className="w-12 h-12 text-ink-muted/50 mx-auto" />
                            <h3 className="font-black text-lg text-ink">Belum Ada Kategori Ditambahkan</h3>
                            <p className="text-xs sm:text-sm text-ink-muted max-w-md mx-auto leading-relaxed">
                                Klik tombol di bawah untuk membuat kategori pertama Anda (misalnya: <strong>Games</strong>, <strong>Pulsa & Data</strong>, <strong>PPOB</strong>, atau <strong>Voucher</strong>).
                            </p>
                            <button
                                type="button"
                                onClick={openAddCategory}
                                className="sketch-btn px-5 py-2.5 bg-brand text-white text-xs font-bold rounded-xl border-2 border-ink shadow-sketch-xs inline-flex items-center gap-1.5"
                            >
                                <Plus className="w-4 h-4 stroke-[3]" />
                                <span>Buat Kategori Pertama</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL: Tambah / Edit Kategori */}
            {categoryModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs animate-in fade-in duration-150">
                    <div className="bg-white rounded-3xl border-2 border-ink shadow-sketch max-w-md w-full p-6 space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b-2 border-ink/10">
                            <h3 className="text-base font-black text-ink">
                                {categoryModal.isEdit ? 'Edit Kategori Utama' : 'Tambah Kategori Utama Baru'}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setCategoryModal({ isOpen: false, isEdit: false, data: {} })}
                                className="p-1 rounded-lg border border-ink text-ink hover:bg-paper-dark"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveCategory} className="space-y-4 text-xs font-semibold">
                            <div>
                                <label className="block text-ink font-bold mb-1">Nama Kategori *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Contoh: Games, Pulsa & Data, PPOB"
                                    value={categoryModal.data.name || ''}
                                    onChange={(e) =>
                                        setCategoryModal({
                                            ...categoryModal,
                                            data: { ...categoryModal.data, name: e.target.value },
                                        })
                                    }
                                    className="sketch-input w-full px-3.5 py-2 rounded-xl border-2 border-ink bg-paper-light focus:bg-white text-xs font-bold"
                                />
                            </div>

                            <div>
                                <label className="block text-ink font-bold mb-1">Slug URL (Opsional, Otomatis)</label>
                                <input
                                    type="text"
                                    placeholder="games, pulsa-data"
                                    value={categoryModal.data.slug || ''}
                                    onChange={(e) =>
                                        setCategoryModal({
                                            ...categoryModal,
                                            data: { ...categoryModal.data, slug: e.target.value },
                                        })
                                    }
                                    className="sketch-input w-full px-3.5 py-2 rounded-xl border-2 border-ink bg-paper-light focus:bg-white text-xs font-mono"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-ink font-bold mb-1">Urutan Tampil</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={categoryModal.data.sort_order ?? 0}
                                        onChange={(e) =>
                                            setCategoryModal({
                                                ...categoryModal,
                                                data: { ...categoryModal.data, sort_order: parseInt(e.target.value) || 0 },
                                            })
                                        }
                                        className="sketch-input w-full px-3.5 py-2 rounded-xl border-2 border-ink bg-paper-light focus:bg-white text-xs font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="block text-ink font-bold mb-1">Status Kategori</label>
                                    <select
                                        value={categoryModal.data.is_active ? '1' : '0'}
                                        onChange={(e) =>
                                            setCategoryModal({
                                                ...categoryModal,
                                                data: { ...categoryModal.data, is_active: e.target.value === '1' },
                                            })
                                        }
                                        className="sketch-input w-full px-3.5 py-2 rounded-xl border-2 border-ink bg-paper-light focus:bg-white text-xs font-bold"
                                    >
                                        <option value="1">Aktif (Tampil)</option>
                                        <option value="0">Nonaktif (Sembunyikan)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t-2 border-ink/10">
                                <button
                                    type="button"
                                    onClick={() => setCategoryModal({ isOpen: false, isEdit: false, data: {} })}
                                    className="sketch-btn px-4 py-2 rounded-xl border-2 border-ink bg-paper-dark text-ink text-xs font-bold"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="sketch-btn px-4 py-2 rounded-xl border-2 border-ink bg-brand text-white text-xs font-black shadow-sketch-xs"
                                >
                                    {categoryModal.isEdit ? 'Simpan Perubahan' : 'Tambah Kategori'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL: Tambah / Edit Subkategori */}
            {subCategoryModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs animate-in fade-in duration-150">
                    <div className="bg-white rounded-3xl border-2 border-ink shadow-sketch max-w-md w-full p-6 space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b-2 border-ink/10">
                            <h3 className="text-base font-black text-ink">
                                {subCategoryModal.isEdit ? 'Edit Subkategori' : 'Tambah Subkategori Baru'}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setSubCategoryModal({ isOpen: false, isEdit: false, data: {} })}
                                className="p-1 rounded-lg border border-ink text-ink hover:bg-paper-dark"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveSubCategory} className="space-y-4 text-xs font-semibold">
                            <div>
                                <label className="block text-ink font-bold mb-1">Kategori Induk</label>
                                <select
                                    required
                                    value={subCategoryModal.data.category_id || ''}
                                    onChange={(e) =>
                                        setSubCategoryModal({
                                            ...subCategoryModal,
                                            data: { ...subCategoryModal.data, category_id: e.target.value },
                                        })
                                    }
                                    className="sketch-input w-full px-3.5 py-2 rounded-xl border-2 border-ink bg-paper-light focus:bg-white text-xs font-bold"
                                >
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-ink font-bold mb-1">Nama Subkategori *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Contoh: Mobile Games, PC Games, Pulsa Reguler"
                                    value={subCategoryModal.data.name || ''}
                                    onChange={(e) =>
                                        setSubCategoryModal({
                                            ...subCategoryModal,
                                            data: { ...subCategoryModal.data, name: e.target.value },
                                        })
                                    }
                                    className="sketch-input w-full px-3.5 py-2 rounded-xl border-2 border-ink bg-paper-light focus:bg-white text-xs font-bold"
                                />
                            </div>

                            <div>
                                <label className="block text-ink font-bold mb-1">Slug URL (Opsional, Otomatis)</label>
                                <input
                                    type="text"
                                    placeholder="mobile-games, pulsa-reguler"
                                    value={subCategoryModal.data.slug || ''}
                                    onChange={(e) =>
                                        setSubCategoryModal({
                                            ...subCategoryModal,
                                            data: { ...subCategoryModal.data, slug: e.target.value },
                                        })
                                    }
                                    className="sketch-input w-full px-3.5 py-2 rounded-xl border-2 border-ink bg-paper-light focus:bg-white text-xs font-mono"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-ink font-bold mb-1">Urutan Tampil</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={subCategoryModal.data.sort_order ?? 0}
                                        onChange={(e) =>
                                            setSubCategoryModal({
                                                ...subCategoryModal,
                                                data: { ...subCategoryModal.data, sort_order: parseInt(e.target.value) || 0 },
                                            })
                                        }
                                        className="sketch-input w-full px-3.5 py-2 rounded-xl border-2 border-ink bg-paper-light focus:bg-white text-xs font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="block text-ink font-bold mb-1">Status Subkategori</label>
                                    <select
                                        value={subCategoryModal.data.is_active ? '1' : '0'}
                                        onChange={(e) =>
                                            setSubCategoryModal({
                                                ...subCategoryModal,
                                                data: { ...subCategoryModal.data, is_active: e.target.value === '1' },
                                            })
                                        }
                                        className="sketch-input w-full px-3.5 py-2 rounded-xl border-2 border-ink bg-paper-light focus:bg-white text-xs font-bold"
                                    >
                                        <option value="1">Aktif (Tampil)</option>
                                        <option value="0">Nonaktif (Sembunyikan)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t-2 border-ink/10">
                                <button
                                    type="button"
                                    onClick={() => setSubCategoryModal({ isOpen: false, isEdit: false, data: {} })}
                                    className="sketch-btn px-4 py-2 rounded-xl border-2 border-ink bg-paper-dark text-ink text-xs font-bold"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="sketch-btn px-4 py-2 rounded-xl border-2 border-ink bg-brand text-white text-xs font-black shadow-sketch-xs"
                                >
                                    {subCategoryModal.isEdit ? 'Simpan Perubahan' : 'Tambah Subkategori'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
