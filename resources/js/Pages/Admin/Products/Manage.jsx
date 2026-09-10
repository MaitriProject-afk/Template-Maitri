import React, { useState, useMemo } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Package,
    Plus,
    Edit2,
    Trash2,
    Search,
    Filter,
    Layers,
    ChevronDown,
    ChevronRight,
    Sparkles,
    Tag,
    DollarSign,
    Check,
    X,
    ExternalLink,
    AlertCircle,
    Info,
    ArrowUpDown,
    CheckCircle2,
    Gamepad2,
    UploadCloud,
    Link2,
    Image as ImageIcon,
} from 'lucide-react';

export default function ProductManage({
    products = { data: [] },
    categories = [],
    h2hSkus = [],
    filters = {},
}) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState(filters.category_id || 'all');
    const [selectedSubCategoryFilter, setSelectedSubCategoryFilter] = useState(filters.sub_category_id || 'all');
    const [selectedStatusFilter, setSelectedStatusFilter] = useState(filters.status || 'all');

    // Expanded products accordion for items
    const [expandedProductIds, setExpandedProductIds] = useState(
        products.data.length > 0 ? [products.data[0].id] : []
    );

    // Parent Product Modal State
    const [productModal, setProductModal] = useState({
        isOpen: false,
        isEdit: false,
        data: {
            id: null,
            category_id: categories.length > 0 ? categories[0].id : '',
            sub_category_id: '',
            name: '',
            slug: '',
            brand: '',
            thumbnail: '',
            thumbnail_file: null,
            description: '',
            input_type: 'id_zone',
            input_label: 'User ID',
            input_placeholder: 'Masukkan User ID',
            has_zone_id: false,
            zone_label: 'Zone ID',
            zone_placeholder: 'Zone ID',
            server_options: null,
            sort_order: 0,
            is_active: true,
        },
    });
    const [productThumbTab, setProductThumbTab] = useState('upload'); // 'upload' | 'url'
    const [productFilePreview, setProductFilePreview] = useState(null);

    // Child Item Modal State
    const [itemModal, setItemModal] = useState({
        isOpen: false,
        isEdit: false,
        productId: null,
        data: {
            id: null,
            buyer_sku_code: '',
            name: '',
            category_group: 'Umum',
            h2h_price: 0,
            profit_type: 'fixed',
            profit_value: 0,
            price: 0,
            status: 'AVAILABLE',
            sort_order: 0,
            is_active: true,
        },
    });

    // Available subcategories for the product modal based on selected category
    const modalSubCategories = useMemo(() => {
        if (!productModal.data.category_id) return [];
        const cat = categories.find((c) => String(c.id) === String(productModal.data.category_id));
        return cat?.sub_categories || [];
    }, [categories, productModal.data.category_id]);

    const toggleExpand = (id) => {
        setExpandedProductIds((prev) =>
            prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]
        );
    };

    // Filter submit
    const handleFilterSubmit = (e) => {
        if (e) e.preventDefault();
        router.get(
            '/admin/products',
            {
                search: searchQuery || undefined,
                category_id: selectedCategoryFilter !== 'all' ? selectedCategoryFilter : undefined,
                sub_category_id: selectedSubCategoryFilter !== 'all' ? selectedSubCategoryFilter : undefined,
                status: selectedStatusFilter !== 'all' ? selectedStatusFilter : undefined,
            },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    };

    const handleResetFilter = () => {
        setSearchQuery('');
        setSelectedCategoryFilter('all');
        setSelectedSubCategoryFilter('all');
        setSelectedStatusFilter('all');
        router.get('/admin/products', {}, { preserveState: true, preserveScroll: true, replace: true });
    };

    // Open Add Parent Product Modal
    const openAddProduct = () => {
        const defaultCatId = categories.length > 0 ? categories[0].id : '';
        setProductFilePreview(null);
        setProductThumbTab('upload');
        setProductModal({
            isOpen: true,
            isEdit: false,
            data: {
                id: null,
                category_id: defaultCatId,
                sub_category_id: '',
                name: '',
                slug: '',
                brand: '',
                thumbnail: '',
                thumbnail_file: null,
                description: '',
                input_type: 'id_zone',
                input_label: 'User ID',
                input_placeholder: 'Masukkan User ID',
                has_zone_id: false,
                zone_label: 'Zone ID',
                zone_placeholder: 'Zone ID',
                sort_order: (products.total || 0) + 1,
                is_active: true,
            },
        });
    };

    // Open Edit Parent Product Modal
    const openEditProduct = (prod) => {
        setProductFilePreview(null);
        setProductThumbTab('upload');
        setProductModal({
            isOpen: true,
            isEdit: true,
            data: {
                id: prod.id,
                category_id: prod.category_id,
                sub_category_id: prod.sub_category_id || '',
                name: prod.name,
                slug: prod.slug,
                brand: prod.brand || '',
                thumbnail: prod.thumbnail || '',
                thumbnail_file: null,
                description: prod.description || '',
                input_type: prod.input_type || 'id_zone',
                input_label: prod.input_label || 'User ID',
                input_placeholder: prod.input_placeholder || 'Masukkan User ID',
                has_zone_id: Boolean(prod.has_zone_id),
                zone_label: prod.zone_label || 'Zone ID',
                zone_placeholder: prod.zone_placeholder || 'Zone ID',
                sort_order: prod.sort_order ?? 0,
                is_active: Boolean(prod.is_active),
            },
        });
    };

    const handleSaveProduct = (e) => {
        e.preventDefault();
        const { isEdit, data } = productModal;

        if (isEdit) {
            router.post(`/admin/products/${data.id}`, {
                ...data,
                _method: 'PUT',
            }, {
                forceFormData: true,
                onSuccess: () => {
                    setProductModal({ isOpen: false, isEdit: false, data: {} });
                    setProductFilePreview(null);
                },
            });
        } else {
            router.post('/admin/products', data, {
                forceFormData: true,
                onSuccess: () => {
                    setProductModal({ isOpen: false, isEdit: false, data: {} });
                    setProductFilePreview(null);
                },
            });
        }
    };

    const handleDeleteProduct = (prod) => {
        if (confirm(`Hapus produk "${prod.name}" beserta seluruh item di dalamnya?`)) {
            router.delete(`/admin/products/${prod.id}`);
        }
    };

    // Open Add Item Modal
    const openAddItem = (product) => {
        const nextOrder = (product.items?.length || 0) + 1;
        setItemModal({
            isOpen: true,
            isEdit: false,
            productId: product.id,
            data: {
                id: null,
                buyer_sku_code: '',
                name: '',
                category_group: 'Denominasi',
                h2h_price: 0,
                profit_type: 'fixed',
                profit_value: 1000,
                price: 1000,
                status: 'AVAILABLE',
                sort_order: nextOrder,
                is_active: true,
            },
        });
    };

    // Open Edit Item Modal
    const openEditItem = (item, productId) => {
        setItemModal({
            isOpen: true,
            isEdit: true,
            productId: productId,
            data: {
                id: item.id,
                buyer_sku_code: item.buyer_sku_code || '',
                name: item.name,
                category_group: item.category_group || 'Denominasi',
                h2h_price: item.h2h_price || 0,
                profit_type: item.profit_type || 'fixed',
                profit_value: item.profit_value || 0,
                price: item.price || 0,
                status: item.status || 'AVAILABLE',
                sort_order: item.sort_order ?? 0,
                is_active: Boolean(item.is_active),
            },
        });
    };

    // When SKU is selected from H2H list, auto-fill item details
    const handleSelectSku = (skuCode) => {
        const found = h2hSkus.find((s) => s.buyer_sku_code === skuCode);
        if (found) {
            const h2hPrice = found.h2h_price || 0;
            const profitType = itemModal.data.profit_type || 'fixed';
            const profitVal = itemModal.data.profit_value || 0;
            let computedPrice = h2hPrice;

            if (profitType === 'percent') {
                computedPrice = Math.round(h2hPrice + h2hPrice * (profitVal / 100));
            } else {
                computedPrice = h2hPrice + profitVal;
            }

            setItemModal({
                ...itemModal,
                data: {
                    ...itemModal.data,
                    buyer_sku_code: found.buyer_sku_code,
                    name: found.product_name,
                    h2h_price: h2hPrice,
                    price: computedPrice,
                    status: found.status || 'AVAILABLE',
                },
            });
        }
    };

    // Recalculate price when profit changes in item modal
    const handleProfitChange = (type, val) => {
        const h2hPrice = Number(itemModal.data.h2h_price || 0);
        const numericVal = Number(val || 0);
        let computed = h2hPrice;

        if (type === 'percent') {
            computed = Math.round(h2hPrice + h2hPrice * (numericVal / 100));
        } else {
            computed = h2hPrice + numericVal;
        }

        setItemModal({
            ...itemModal,
            data: {
                ...itemModal.data,
                profit_type: type,
                profit_value: numericVal,
                price: computed,
            },
        });
    };

    const handleSaveItem = (e) => {
        e.preventDefault();
        const { isEdit, productId, data } = itemModal;

        if (isEdit) {
            router.put(`/admin/products/items/${data.id}`, data, {
                onSuccess: () => setItemModal({ isOpen: false, isEdit: false, productId: null, data: {} }),
            });
        } else {
            router.post(`/admin/products/${productId}/items`, data, {
                onSuccess: () => setItemModal({ isOpen: false, isEdit: false, productId: null, data: {} }),
            });
        }
    };

    const handleDeleteItem = (item) => {
        if (confirm(`Hapus item nominal "${item.name}"?`)) {
            router.delete(`/admin/products/items/${item.id}`);
        }
    };

    return (
        <AdminLayout title="Kelola Produk & Item" activeMenu="products">
            <Head title="Manajemen Produk & Item — Maitri Admin" />

            <div className="space-y-6 max-w-7xl mx-auto pb-16">
                {/* 1. Header Banner */}
                <div className="sketch-card bg-paper-dark p-5 sm:p-7 rounded-3xl border-2 border-ink shadow-sketch relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-1.5 max-w-2xl">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-brand-subtle text-brand-navy border border-ink shadow-sketch-xs">
                                🎮 INDUK PRODUK & DENOMINASI ITEM
                            </span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black text-ink font-sans">
                            Manajemen Produk & Item H2H
                        </h2>
                        <p className="text-xs sm:text-sm text-ink-muted leading-relaxed font-sans">
                            Buat produk induk (Game / Layanan) yang terhubung ke Kategori & Subkategori, lalu tambahkan item denominasi dengan keuntungan (margin profit) dari API Maitri H2H.
                        </p>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                        <Link
                            href="/admin/h2h-products"
                            className="sketch-btn px-4 py-3 bg-white hover:bg-paper-dark text-ink rounded-2xl border-2 border-ink shadow-sketch font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all"
                        >
                            <Sparkles className="w-4 h-4 text-brand" />
                            <span>Lihat SKU H2H</span>
                        </Link>

                        <button
                            type="button"
                            onClick={openAddProduct}
                            className="sketch-btn px-5 py-3 bg-brand hover:bg-brand-hover text-white rounded-2xl border-2 border-ink shadow-sketch font-bold text-xs sm:text-sm flex items-center gap-2 transition-all"
                        >
                            <Plus className="w-4 h-4 stroke-[3]" />
                            <span>Tambah Produk Baru</span>
                        </button>
                    </div>
                </div>

                {/* 2. Filter Bar */}
                <div className="sketch-card bg-white p-4 sm:p-5 rounded-2xl border-2 border-ink shadow-sketch">
                    <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                        <div className="lg:col-span-2 relative">
                            <Search className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                                type="text"
                                placeholder="Cari nama produk, slug, atau brand..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="sketch-input w-full pl-9 pr-3.5 py-2 rounded-xl border-2 border-ink text-xs font-bold bg-paper-light text-ink focus:bg-white"
                            />
                        </div>

                        <div>
                            <select
                                value={selectedCategoryFilter}
                                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                                className="sketch-input w-full px-3 py-2 rounded-xl border-2 border-ink text-xs font-bold bg-paper-light text-ink focus:bg-white"
                            >
                                <option value="all">Semua Kategori</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <select
                                value={selectedStatusFilter}
                                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                                className="sketch-input w-full px-3 py-2 rounded-xl border-2 border-ink text-xs font-bold bg-paper-light text-ink focus:bg-white"
                            >
                                <option value="all">Semua Status</option>
                                <option value="active">Aktif</option>
                                <option value="inactive">Nonaktif</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                type="submit"
                                className="sketch-btn flex-1 px-3 py-2 bg-brand hover:bg-brand-hover text-white rounded-xl border-2 border-ink shadow-sketch-xs text-xs font-black flex items-center justify-center gap-1.5 transition-all"
                            >
                                <Filter className="w-3.5 h-3.5" />
                                <span>Filter</span>
                            </button>

                            {(searchQuery || selectedCategoryFilter !== 'all' || selectedStatusFilter !== 'all') && (
                                <button
                                    type="button"
                                    onClick={handleResetFilter}
                                    className="sketch-btn px-3 py-2 bg-paper-dark hover:bg-rose-50 text-ink rounded-xl border-2 border-ink shadow-sketch-xs text-xs font-bold transition-all"
                                >
                                    Reset
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* 3. Products List */}
                <div className="space-y-4">
                    {products.data && products.data.length > 0 ? (
                        products.data.map((product) => {
                            const isExpanded = expandedProductIds.includes(product.id);
                            const items = product.items || [];
                            const activeItemsCount = items.filter((i) => i.is_active).length;

                            return (
                                <div
                                    key={product.id}
                                    className="sketch-card bg-white rounded-3xl border-2 border-ink shadow-sketch overflow-hidden transition-all"
                                >
                                    {/* Parent Product Row */}
                                    <div className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b-2 border-ink/10">
                                        <div className="flex items-center gap-3.5 min-w-0">
                                            <button
                                                type="button"
                                                onClick={() => toggleExpand(product.id)}
                                                className="p-1.5 rounded-xl bg-paper-dark hover:bg-brand-subtle border-2 border-ink shadow-sketch-xs text-ink transition-transform"
                                                title={isExpanded ? 'Tutup Denominasi Item' : 'Buka Denominasi Item'}
                                            >
                                                {isExpanded ? (
                                                    <ChevronDown className="w-4 h-4" />
                                                ) : (
                                                    <ChevronRight className="w-4 h-4" />
                                                )}
                                            </button>

                                            <div className="w-12 h-12 rounded-2xl bg-brand text-white border-2 border-ink shadow-sketch-xs flex items-center justify-center font-bold text-lg shrink-0">
                                                {product.thumbnail ? (
                                                    <img
                                                        src={product.thumbnail}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover rounded-2xl"
                                                    />
                                                ) : (
                                                    <Gamepad2 className="w-6 h-6" />
                                                )}
                                            </div>

                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <Link
                                                        href={`/admin/products/${product.id}/edit`}
                                                        className="text-base sm:text-lg font-black text-ink hover:text-brand transition-colors"
                                                    >
                                                        {product.name}
                                                    </Link>
                                                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-paper-dark border border-ink text-ink-muted">
                                                        /product/{product.slug}
                                                    </span>
                                                    {!product.is_active && (
                                                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 border border-rose-300">
                                                            Nonaktif
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-2.5 mt-1 text-xs font-mono font-bold text-ink-muted flex-wrap">
                                                    <span className="px-2 py-0.5 rounded bg-brand-subtle text-brand-navy border border-ink/20">
                                                        📁 {product.category?.name || 'Tanpa Kategori'}
                                                    </span>
                                                    {product.sub_category ? (
                                                        <span className="px-2 py-0.5 rounded bg-sketch-sky text-ink border border-ink/20">
                                                            🏷️ {product.sub_category.name}
                                                        </span>
                                                    ) : (
                                                        <span className="text-[11px] text-ink-muted italic">
                                                            (Tanpa Subkategori)
                                                        </span>
                                                    )}
                                                    <span>•</span>
                                                    <span>Tipe Input: {product.input_type}</span>
                                                    <span>•</span>
                                                    <span className="text-brand font-black">
                                                        {items.length} Item ({activeItemsCount} Aktif)
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action buttons */}
                                        <div className="flex items-center gap-2 self-end lg:self-center shrink-0">
                                            <a
                                                href={`/product/${product.slug}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="p-2 rounded-xl bg-paper-dark hover:bg-white text-ink border-2 border-ink shadow-sketch-xs transition-all"
                                                title="Lihat di Web Publik"
                                            >
                                                <ExternalLink className="w-3.5 h-3.5" />
                                            </a>

                                            <Link
                                                href={`/admin/products/${product.id}/edit`}
                                                className="sketch-btn px-3.5 py-1.5 bg-brand text-white rounded-xl border-2 border-ink shadow-sketch-xs text-xs font-black flex items-center gap-1.5 transition-all hover:brightness-110"
                                                title="Kelola & Tambah Item"
                                            >
                                                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                                                <span>+ Item</span>
                                            </Link>

                                            <Link
                                                href={`/admin/products/${product.id}/edit?tab=product`}
                                                className="p-2 rounded-xl bg-white hover:bg-paper-dark text-ink border-2 border-ink shadow-sketch-xs transition-all inline-flex items-center justify-center"
                                                title="Edit Informasi Produk"
                                            >
                                                <Edit2 className="w-3.5 h-3.5" />
                                            </Link>

                                            <button
                                                type="button"
                                                onClick={() => handleDeleteProduct(product)}
                                                className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border-2 border-ink shadow-sketch-xs transition-all"
                                                title="Hapus Produk"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Denominations Child Items Accordion */}
                                    {isExpanded && (
                                        <div className="p-4 sm:p-5 bg-paper-light/50">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-xs font-mono font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
                                                    <DollarSign className="w-4 h-4 text-emerald-600" />
                                                    <span>Denominasi Item & Pengaturan Margin Profit:</span>
                                                </span>
                                                <Link
                                                    href={`/admin/products/${product.id}/edit`}
                                                    className="text-xs font-bold text-brand hover:underline font-mono flex items-center gap-1"
                                                >
                                                    <span>+ Kelola & Tambah Item</span>
                                                    <ChevronRight className="w-3 h-3" />
                                                </Link>
                                            </div>

                                            {items.length > 0 ? (
                                                <div className="overflow-x-auto rounded-2xl border-2 border-ink bg-white shadow-sketch-xs">
                                                    <table className="w-full text-left border-collapse text-xs">
                                                        <thead>
                                                            <tr className="bg-paper-dark border-b-2 border-ink font-mono uppercase font-bold text-[11px] text-ink">
                                                                <th className="py-2.5 px-3">Kode SKU</th>
                                                                <th className="py-2.5 px-3">Nama Nominal / Item</th>
                                                                <th className="py-2.5 px-3">Grup Tab</th>
                                                                <th className="py-2.5 px-3 text-right">Modal H2H</th>
                                                                <th className="py-2.5 px-3 text-center">Profit / Margin</th>
                                                                <th className="py-2.5 px-3 text-right font-black text-brand">Harga Jual Pelanggan</th>
                                                                <th className="py-2.5 px-3 text-center">Status</th>
                                                                <th className="py-2.5 px-3 text-center">Aksi</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-ink/10 font-medium">
                                                            {items.map((item) => {
                                                                const profitDisplay =
                                                                    item.profit_type === 'percent'
                                                                        ? `+${item.profit_value}%`
                                                                        : `+Rp ${Number(item.profit_value || 0).toLocaleString('id-ID')}`;

                                                                return (
                                                                    <tr key={item.id} className="hover:bg-paper-light/60 transition-colors">
                                                                        <td className="py-2.5 px-3 font-mono font-bold">
                                                                            {item.buyer_sku_code ? (
                                                                                <span className="px-1.5 py-0.5 rounded bg-paper-dark border border-ink/30 text-[11px]">
                                                                                    {item.buyer_sku_code}
                                                                                </span>
                                                                            ) : (
                                                                                <span className="text-ink-muted text-[11px]">-</span>
                                                                            )}
                                                                        </td>
                                                                        <td className="py-2.5 px-3 font-bold text-ink">
                                                                            {item.name}
                                                                        </td>
                                                                        <td className="py-2.5 px-3 font-mono text-ink-muted text-[11px]">
                                                                            {item.category_group || 'Umum'}
                                                                        </td>
                                                                        <td className="py-2.5 px-3 text-right font-mono text-ink">
                                                                            Rp {Number(item.h2h_price || 0).toLocaleString('id-ID')}
                                                                        </td>
                                                                        <td className="py-2.5 px-3 text-center font-mono">
                                                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                                                                {profitDisplay}
                                                                            </span>
                                                                        </td>
                                                                        <td className="py-2.5 px-3 text-right font-mono font-black text-brand text-xs sm:text-sm">
                                                                            Rp {Number(item.price || 0).toLocaleString('id-ID')}
                                                                        </td>
                                                                        <td className="py-2.5 px-3 text-center">
                                                                            <span
                                                                                className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                                                                                    item.status === 'AVAILABLE'
                                                                                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                                                                        : 'bg-rose-50 text-rose-800 border-rose-300'
                                                                                }`}
                                                                            >
                                                                                {item.status}
                                                                            </span>
                                                                        </td>
                                                                        <td className="py-2.5 px-3 text-center">
                                                                            <div className="flex items-center justify-center gap-1">
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => openEditItem(item, product.id)}
                                                                                    className="p-1 hover:bg-paper-dark rounded text-ink transition-colors"
                                                                                    title="Edit Item"
                                                                                >
                                                                                    <Edit2 className="w-3.5 h-3.5" />
                                                                                </button>
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => handleDeleteItem(item)}
                                                                                    className="p-1 hover:bg-rose-50 rounded text-rose-700 transition-colors"
                                                                                    title="Hapus Item"
                                                                                >
                                                                                    <Trash2 className="w-3.5 h-3.5" />
                                                                                </button>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            ) : (
                                                <div className="text-center py-6 border-2 border-dashed border-ink/20 rounded-2xl bg-white/70">
                                                    <p className="text-xs text-ink-muted">
                                                        Belum ada item nominal untuk produk ini.
                                                    </p>
                                                    <button
                                                        type="button"
                                                        onClick={() => openAddItem(product)}
                                                        className="mt-2 text-xs font-bold text-brand hover:underline font-mono"
                                                    >
                                                        + Tambah Item Nominal Pertama (Pilih dari SKU H2H)
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
                            <Package className="w-12 h-12 text-ink-muted/50 mx-auto" />
                            <h3 className="font-black text-lg text-ink">Belum Ada Produk Ditambahkan</h3>
                            <p className="text-xs sm:text-sm text-ink-muted max-w-md mx-auto leading-relaxed">
                                Anda dapat membuat produk baru sekarang. Pastikan Anda telah membuat kategori terlebih dahulu.
                            </p>
                            <button
                                type="button"
                                onClick={openAddProduct}
                                className="sketch-btn px-5 py-2.5 bg-brand text-white text-xs font-bold rounded-xl border-2 border-ink shadow-sketch-xs inline-flex items-center gap-1.5"
                            >
                                <Plus className="w-4 h-4 stroke-[3]" />
                                <span>Buat Produk Pertama</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL: Tambah / Edit Produk Induk */}
            {productModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
                    <div className="bg-white rounded-3xl border-2 border-ink shadow-sketch max-w-xl w-full p-6 my-8 space-y-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between pb-3 border-b-2 border-ink/10">
                            <h3 className="text-base font-black text-ink">
                                {productModal.isEdit ? 'Edit Produk Induk' : 'Tambah Produk Induk Baru'}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setProductModal({ isOpen: false, isEdit: false, data: {} })}
                                className="p-1 rounded-lg border border-ink text-ink hover:bg-paper-dark"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveProduct} className="space-y-4 text-xs font-semibold">
                            {/* Category & Subcategory Selection */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-ink font-bold mb-1">Kategori Utama *</label>
                                    <select
                                        required
                                        value={productModal.data.category_id || ''}
                                        onChange={(e) =>
                                            setProductModal({
                                                ...productModal,
                                                data: { ...productModal.data, category_id: e.target.value, sub_category_id: '' },
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
                                    <label className="block text-ink font-bold mb-1">
                                        Subkategori (Opsional)
                                    </label>
                                    <select
                                        value={productModal.data.sub_category_id || ''}
                                        onChange={(e) =>
                                            setProductModal({
                                                ...productModal,
                                                data: { ...productModal.data, sub_category_id: e.target.value },
                                            })
                                        }
                                        className="sketch-input w-full px-3.5 py-2 rounded-xl border-2 border-ink bg-paper-light focus:bg-white text-xs font-bold"
                                    >
                                        <option value="">-- Tanpa Subkategori (Langsung di Kategori) --</option>
                                        {modalSubCategories.map((s) => (
                                            <option key={s.id} value={s.id}>
                                                {s.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Product Name & Brand */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-ink font-bold mb-1">Nama Produk / Game *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Contoh: Mobile Legends, Free Fire, PLN"
                                        value={productModal.data.name || ''}
                                        onChange={(e) =>
                                            setProductModal({
                                                ...productModal,
                                                data: { ...productModal.data, name: e.target.value },
                                            })
                                        }
                                        className="sketch-input w-full px-3.5 py-2 rounded-xl border-2 border-ink bg-paper-light focus:bg-white text-xs font-bold"
                                    />
                                </div>

                                <div>
                                    <label className="block text-ink font-bold mb-1">Brand Provider (Opsional)</label>
                                    <input
                                        type="text"
                                        placeholder="MOBILE LEGENDS, TELKOMSEL"
                                        value={productModal.data.brand || ''}
                                        onChange={(e) =>
                                            setProductModal({
                                                ...productModal,
                                                data: { ...productModal.data, brand: e.target.value },
                                            })
                                        }
                                        className="sketch-input w-full px-3.5 py-2 rounded-xl border-2 border-ink bg-paper-light focus:bg-white text-xs font-mono"
                                    />
                                </div>
                            </div>

                            {/* Slug */}
                            <div>
                                <label className="block text-ink font-bold mb-1">Slug URL (Opsional, Otomatis)</label>
                                <input
                                    type="text"
                                    placeholder="mobile-legends, free-fire"
                                    value={productModal.data.slug || ''}
                                    onChange={(e) =>
                                        setProductModal({
                                            ...productModal,
                                            data: { ...productModal.data, slug: e.target.value },
                                        })
                                    }
                                    className="sketch-input w-full px-3.5 py-2 rounded-xl border-2 border-ink bg-paper-light focus:bg-white text-xs font-mono"
                                />
                            </div>

                            {/* Thumbnail Image (Upload or URL) */}
                            <div className="p-3 bg-paper-light border-2 border-ink/20 rounded-2xl space-y-2.5">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-ink/10 pb-2">
                                    <div>
                                        <label className="block text-ink font-bold text-xs">Thumbnail Logo / Icon</label>
                                        <span className="text-[10px] text-ink-muted">Bisa upload gambar ke public asset atau gunakan URL link.</span>
                                    </div>
                                    <div className="flex items-center gap-1 bg-white border-2 border-ink p-0.5 rounded-lg text-xs font-bold shrink-0">
                                        <button
                                            type="button"
                                            onClick={() => setProductThumbTab('upload')}
                                            className={`px-2.5 py-0.5 rounded transition-colors flex items-center gap-1 text-[11px] ${
                                                productThumbTab === 'upload'
                                                    ? 'bg-brand text-white'
                                                    : 'text-ink hover:text-brand'
                                            }`}
                                        >
                                            <UploadCloud className="w-3 h-3" />
                                            <span>Upload</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setProductThumbTab('url')}
                                            className={`px-2.5 py-0.5 rounded transition-colors flex items-center gap-1 text-[11px] ${
                                                productThumbTab === 'url'
                                                    ? 'bg-brand text-white'
                                                    : 'text-ink hover:text-brand'
                                            }`}
                                        >
                                            <Link2 className="w-3 h-3" />
                                            <span>URL Web</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex-1">
                                        {productThumbTab === 'upload' ? (
                                            <div className="space-y-1">
                                                <label className="border-2 border-dashed border-ink/30 hover:border-brand bg-white hover:bg-brand-subtle/20 rounded-xl p-2.5 flex flex-col items-center justify-center cursor-pointer transition-all text-center">
                                                    <UploadCloud className="w-5 h-5 text-brand mb-1 stroke-[2]" />
                                                    <span className="text-[11px] font-bold text-ink truncate max-w-full">
                                                        {productModal.data.thumbnail_file
                                                            ? productModal.data.thumbnail_file.name
                                                            : 'Klik untuk memilih file gambar (PNG, JPG, WEBP)'}
                                                    </span>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                setProductModal({
                                                                    ...productModal,
                                                                    data: { ...productModal.data, thumbnail_file: file },
                                                                });
                                                                setProductFilePreview(URL.createObjectURL(file));
                                                            }
                                                        }}
                                                        className="hidden"
                                                    />
                                                </label>
                                                {productModal.data.thumbnail_file && (
                                                    <div className="flex items-center justify-between text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                                        <span className="truncate">✓ {productModal.data.thumbnail_file.name}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setProductModal({
                                                                    ...productModal,
                                                                    data: { ...productModal.data, thumbnail_file: null },
                                                                });
                                                                setProductFilePreview(null);
                                                            }}
                                                            className="text-rose-600 hover:text-rose-800 font-bold ml-1"
                                                        >
                                                            Hapus
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="https://... atau /uploads/products/..."
                                                    value={productModal.data.thumbnail || ''}
                                                    onChange={(e) =>
                                                        setProductModal({
                                                            ...productModal,
                                                            data: { ...productModal.data, thumbnail: e.target.value },
                                                        })
                                                    }
                                                    className="sketch-input w-full px-3 py-1.5 rounded-xl border-2 border-ink bg-white text-xs font-mono"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Preview Icon */}
                                    <div className="w-14 h-14 rounded-xl border-2 border-ink bg-white shadow-sketch-xs overflow-hidden shrink-0 flex items-center justify-center p-1">
                                        {productFilePreview ? (
                                            <img src={productFilePreview} alt="Preview" className="w-full h-full object-contain" />
                                        ) : productModal.data.thumbnail ? (
                                            <img
                                                src={productModal.data.thumbnail}
                                                alt="Thumbnail"
                                                className="w-full h-full object-contain"
                                                onError={(e) => { e.currentTarget.style.opacity = '0.3'; }}
                                            />
                                        ) : (
                                            <ImageIcon className="w-6 h-6 text-ink-muted opacity-40" />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Input Field Configuration for Customers */}
                            <div className="p-3.5 bg-paper-light rounded-2xl border-2 border-ink/20 space-y-3">
                                <span className="font-mono font-bold text-ink uppercase text-[11px] block">
                                    ⚙️ Pengaturan Formulir Target Pelanggan:
                                </span>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-ink mb-1">Tipe Input *</label>
                                        <select
                                            value={productModal.data.input_type || 'id_zone'}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                setProductModal({
                                                    ...productModal,
                                                    data: {
                                                        ...productModal.data,
                                                        input_type: val,
                                                        has_zone_id: val === 'id_zone',
                                                        input_label: val === 'phone' ? 'target tujuan' : 'User ID',
                                                        input_placeholder: val === 'phone' ? 'Target' : 'Masukkan User ID',
                                                    },
                                                });
                                            }}
                                            className="sketch-input w-full px-3 py-2 rounded-xl border-2 border-ink bg-white text-xs font-bold"
                                        >
                                            <option value="single_id">Single ID (Player ID Free Fire dll)</option>
                                            <option value="id_zone">User ID + Zone ID (Mobile Legends)</option>
                                            <option value="phone">Nomor Telepon / Akun (Pulsa / PPOB)</option>
                                            <option value="server_select">User ID + Pilihan Server (Genshin)</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-ink mb-1">Label Input Utama *</label>
                                        <input
                                            type="text"
                                            required
                                            value={productModal.data.input_label || ''}
                                            onChange={(e) =>
                                                setProductModal({
                                                    ...productModal,
                                                    data: { ...productModal.data, input_label: e.target.value },
                                                })
                                            }
                                            className="sketch-input w-full px-3 py-2 rounded-xl border-2 border-ink bg-white text-xs font-bold"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-ink mb-1">Placeholder Input *</label>
                                        <input
                                            type="text"
                                            required
                                            value={productModal.data.input_placeholder || ''}
                                            onChange={(e) =>
                                                setProductModal({
                                                    ...productModal,
                                                    data: { ...productModal.data, input_placeholder: e.target.value },
                                                })
                                            }
                                            className="sketch-input w-full px-3 py-2 rounded-xl border-2 border-ink bg-white text-xs font-bold"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-ink font-bold mb-1">Deskripsi & Panduan Produk</label>
                                <textarea
                                    rows="3"
                                    placeholder="Tuliskan petunjuk top-up, format nomor tujuan, dan catatan layanan..."
                                    value={productModal.data.description || ''}
                                    onChange={(e) =>
                                        setProductModal({
                                            ...productModal,
                                            data: { ...productModal.data, description: e.target.value },
                                        })
                                    }
                                    className="sketch-input w-full px-3.5 py-2 rounded-xl border-2 border-ink bg-paper-light focus:bg-white text-xs font-normal"
                                ></textarea>
                            </div>

                            {/* Sort & Status */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-ink font-bold mb-1">Urutan Tampil</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={productModal.data.sort_order ?? 0}
                                        onChange={(e) =>
                                            setProductModal({
                                                ...productModal,
                                                data: { ...productModal.data, sort_order: parseInt(e.target.value) || 0 },
                                            })
                                        }
                                        className="sketch-input w-full px-3.5 py-2 rounded-xl border-2 border-ink bg-paper-light focus:bg-white text-xs font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="block text-ink font-bold mb-1">Status Produk</label>
                                    <select
                                        value={productModal.data.is_active ? '1' : '0'}
                                        onChange={(e) =>
                                            setProductModal({
                                                ...productModal,
                                                data: { ...productModal.data, is_active: e.target.value === '1' },
                                            })
                                        }
                                        className="sketch-input w-full px-3.5 py-2 rounded-xl border-2 border-ink bg-paper-light focus:bg-white text-xs font-bold"
                                    >
                                        <option value="1">Aktif (Tampil di Katalog)</option>
                                        <option value="0">Nonaktif (Sembunyikan)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t-2 border-ink/10">
                                <button
                                    type="button"
                                    onClick={() => setProductModal({ isOpen: false, isEdit: false, data: {} })}
                                    className="sketch-btn px-4 py-2 rounded-xl border-2 border-ink bg-paper-dark text-ink text-xs font-bold"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="sketch-btn px-5 py-2 rounded-xl border-2 border-ink bg-brand text-white text-xs font-black shadow-sketch-xs"
                                >
                                    {productModal.isEdit ? 'Simpan Perubahan' : 'Tambah Produk'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL: Tambah / Edit Denominasi Item */}
            {itemModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
                    <div className="bg-white rounded-3xl border-2 border-ink shadow-sketch max-w-lg w-full p-6 my-8 space-y-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between pb-3 border-b-2 border-ink/10">
                            <h3 className="text-base font-black text-ink">
                                {itemModal.isEdit ? 'Edit Denominasi Item' : 'Tambah Denominasi Item Baru'}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setItemModal({ isOpen: false, isEdit: false, productId: null, data: {} })}
                                className="p-1 rounded-lg border border-ink text-ink hover:bg-paper-dark"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveItem} className="space-y-4 text-xs font-semibold">
                            {/* Choose SKU from H2H Raw catalog */}
                            <div>
                                <label className="block text-ink font-bold mb-1">
                                    Hubungkan ke SKU Maitri H2H (Pilih Cepat)
                                </label>
                                <select
                                    value={itemModal.data.buyer_sku_code || ''}
                                    onChange={(e) => handleSelectSku(e.target.value)}
                                    className="sketch-input w-full px-3.5 py-2 rounded-xl border-2 border-ink bg-paper-light focus:bg-white text-xs font-bold font-mono"
                                >
                                    <option value="">-- Input Bebas / Tanpa SKU Otomatis --</option>
                                    {h2hSkus.map((s) => (
                                        <option key={s.buyer_sku_code} value={s.buyer_sku_code}>
                                            [{s.buyer_sku_code}] {s.product_name} - Modal: Rp {Number(s.h2h_price || 0).toLocaleString('id-ID')} ({s.status})
                                        </option>
                                    ))}
                                </select>
                                <span className="text-[10px] text-ink-muted mt-1 block">
                                    💡 Memilih SKU akan otomatis mengisi Nama, Modal H2H, dan menghitung Harga Jual sesuai profit.
                                </span>
                            </div>

                            {/* Item Name & Group */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-ink font-bold mb-1">Nama Item / Nominal *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Contoh: 86 Diamonds (+8 Bonus)"
                                        value={itemModal.data.name || ''}
                                        onChange={(e) =>
                                            setItemModal({
                                                ...itemModal,
                                                data: { ...itemModal.data, name: e.target.value },
                                            })
                                        }
                                        className="sketch-input w-full px-3.5 py-2 rounded-xl border-2 border-ink bg-paper-light focus:bg-white text-xs font-bold"
                                    />
                                </div>

                                <div>
                                    <label className="block text-ink font-bold mb-1">Grup / Tab Halaman Detail</label>
                                    <input
                                        type="text"
                                        placeholder="Diamonds, Membership, Pulsa"
                                        value={itemModal.data.category_group || ''}
                                        onChange={(e) =>
                                            setItemModal({
                                                ...itemModal,
                                                data: { ...itemModal.data, category_group: e.target.value },
                                            })
                                        }
                                        className="sketch-input w-full px-3.5 py-2 rounded-xl border-2 border-ink bg-paper-light focus:bg-white text-xs"
                                    />
                                </div>
                            </div>

                            {/* Modal Price & Profit Configuration */}
                            <div className="p-4 bg-paper-grid rounded-2xl border-2 border-ink space-y-3">
                                <span className="font-mono font-black text-ink uppercase text-[11px] block">
                                    💰 PENGATURAN HARGA MODAL & KEUNTUNGAN (PROFIT):
                                </span>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-ink mb-1">Harga Modal H2H (Rp)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={itemModal.data.h2h_price ?? 0}
                                            onChange={(e) => {
                                                const val = parseInt(e.target.value) || 0;
                                                setItemModal({
                                                    ...itemModal,
                                                    data: { ...itemModal.data, h2h_price: val },
                                                });
                                                handleProfitChange(itemModal.data.profit_type, itemModal.data.profit_value);
                                            }}
                                            className="sketch-input w-full px-3 py-2 rounded-xl border-2 border-ink bg-white text-xs font-mono font-bold"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-ink mb-1">Jenis Profit</label>
                                        <select
                                            value={itemModal.data.profit_type || 'fixed'}
                                            onChange={(e) => handleProfitChange(e.target.value, itemModal.data.profit_value)}
                                            className="sketch-input w-full px-3 py-2 rounded-xl border-2 border-ink bg-white text-xs font-bold"
                                        >
                                            <option value="fixed">Nominal Tetap (Rp)</option>
                                            <option value="percent">Persentase (%)</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-ink mb-1">Nilai Profit</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={itemModal.data.profit_value ?? 0}
                                            onChange={(e) => handleProfitChange(itemModal.data.profit_type, e.target.value)}
                                            className="sketch-input w-full px-3 py-2 rounded-xl border-2 border-ink bg-white text-xs font-mono font-bold"
                                        />
                                    </div>
                                </div>

                                {/* Calculated Final Selling Price */}
                                <div className="pt-2 border-t border-ink/20 flex items-center justify-between">
                                    <div>
                                        <span className="text-[10px] font-mono uppercase text-ink-muted font-bold block">
                                            Harga Jual Akhir ke Pelanggan:
                                        </span>
                                        <span className="text-base sm:text-lg font-black font-mono text-brand">
                                            Rp {Number(itemModal.data.price || 0).toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <label className="block text-[10px] font-mono uppercase text-ink-muted font-bold">
                                            Atau Override Manual:
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={itemModal.data.price ?? 0}
                                            onChange={(e) =>
                                                setItemModal({
                                                    ...itemModal,
                                                    data: { ...itemModal.data, price: parseInt(e.target.value) || 0, profit_value: 0 },
                                                })
                                            }
                                            className="w-32 px-2.5 py-1 rounded-lg border border-ink text-right font-mono font-bold text-xs"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Status & Sort */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-ink font-bold mb-1">Status Ketersediaan</label>
                                    <select
                                        value={itemModal.data.status || 'AVAILABLE'}
                                        onChange={(e) =>
                                            setItemModal({
                                                ...itemModal,
                                                data: { ...itemModal.data, status: e.target.value },
                                            })
                                        }
                                        className="sketch-input w-full px-3.5 py-2 rounded-xl border-2 border-ink bg-paper-light focus:bg-white text-xs font-bold"
                                    >
                                        <option value="AVAILABLE">Tersedia (AVAILABLE)</option>
                                        <option value="MAINTENANCE">Gangguan (MAINTENANCE)</option>
                                        <option value="EMPTY">Habis (EMPTY)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-ink font-bold mb-1">Status Item</label>
                                    <select
                                        value={itemModal.data.is_active ? '1' : '0'}
                                        onChange={(e) =>
                                            setItemModal({
                                                ...itemModal,
                                                data: { ...itemModal.data, is_active: e.target.value === '1' },
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
                                    onClick={() => setItemModal({ isOpen: false, isEdit: false, productId: null, data: {} })}
                                    className="sketch-btn px-4 py-2 rounded-xl border-2 border-ink bg-paper-dark text-ink text-xs font-bold"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="sketch-btn px-5 py-2 rounded-xl border-2 border-ink bg-brand text-white text-xs font-black shadow-sketch-xs"
                                >
                                    {itemModal.isEdit ? 'Simpan Perubahan Item' : 'Tambah Item'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
