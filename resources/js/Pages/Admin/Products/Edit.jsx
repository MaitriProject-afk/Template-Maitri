import React, { useState, useMemo, useEffect } from 'react';
import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    ArrowLeft, 
    ExternalLink, 
    Layers, 
    Package, 
    Plus, 
    Edit, 
    Trash2, 
    Check, 
    Search, 
    DollarSign, 
    Tag, 
    Sparkles, 
    Clock, 
    AlertCircle, 
    Zap,
    HelpCircle,
    Eye,
    Save,
    X,
    Filter,
    ArrowUpDown
} from 'lucide-react';

export default function ProductEdit({ auth, product, categories = [], h2hSkus = [] }) {
    const { flash } = usePage().props;

    // Get active tab from URL query params or default to 'items'
    const queryParams = new URLSearchParams(window.location.search);
    const initialTab = queryParams.get('tab') === 'product' ? 'product' : 'items';
    const [activeTab, setActiveTab] = useState(initialTab);

    // ==========================================
    // SECTION 1: PARENT PRODUCT EDIT FORM
    // ==========================================
    const { 
        data: productForm, 
        setData: setProductForm, 
        put: putProduct, 
        processing: productProcessing, 
        errors: productErrors 
    } = useForm({
        category_id: product.category_id || '',
        sub_category_id: product.sub_category_id || '',
        name: product.name || '',
        slug: product.slug || '',
        brand: product.brand || '',
        thumbnail: product.thumbnail || '',
        banner: product.banner || '',
        description: product.description || '',
        input_type: product.input_type || 'id_zone',
        input_label: product.input_label || 'User ID',
        input_placeholder: product.input_placeholder || 'Masukkan User ID',
        has_zone_id: Boolean(product.has_zone_id),
        zone_label: product.zone_label || 'Zone ID',
        zone_placeholder: product.zone_placeholder || 'Cth: 2019',
        server_options: product.server_options || null,
        sort_order: product.sort_order ?? 0,
        is_active: Boolean(product.is_active),
    });

    // Subcategories available for selected category
    const availableSubCategories = useMemo(() => {
        if (!productForm.category_id) return [];
        const cat = categories.find((c) => String(c.id) === String(productForm.category_id));
        return cat?.sub_categories || [];
    }, [categories, productForm.category_id]);

    const handleProductSubmit = (e) => {
        e.preventDefault();
        putProduct(route('admin.products.update', product.id));
    };

    // ==========================================
    // SECTION 2: ITEM FORM (ADD / EDIT)
    // ==========================================
    const [isItemFormOpen, setIsItemFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [skuSearch, setSkuSearch] = useState('');

    const initialItemData = {
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
    };

    const [itemFormData, setItemFormData] = useState(initialItemData);

    const openCreateItem = () => {
        setEditingItem(null);
        setItemFormData({
            ...initialItemData,
            sort_order: (product.items?.length || 0) + 1,
        });
        setSkuSearch('');
        setIsItemFormOpen(true);
    };

    const openEditItem = (item) => {
        setEditingItem(item);
        setItemFormData({
            buyer_sku_code: item.buyer_sku_code || '',
            name: item.name,
            category_group: item.category_group || 'Umum',
            h2h_price: item.h2h_price || 0,
            profit_type: item.profit_type || 'fixed',
            profit_value: item.profit_value || 0,
            price: item.price || 0,
            status: item.status || 'AVAILABLE',
            sort_order: item.sort_order || 0,
            is_active: Boolean(item.is_active),
        });
        setSkuSearch('');
        setIsItemFormOpen(true);
    };

    // Filter H2H SKUs for the item combobox
    const filteredSkus = useMemo(() => {
        if (!skuSearch.trim()) return h2hSkus.slice(0, 30);
        const q = skuSearch.toLowerCase();
        return h2hSkus.filter(
            (s) =>
                s.buyer_sku_code?.toLowerCase().includes(q) ||
                s.product_name?.toLowerCase().includes(q) ||
                s.brand?.toLowerCase().includes(q)
        ).slice(0, 30);
    }, [h2hSkus, skuSearch]);

    // When SKU is selected from list
    const handleSelectSku = (sku) => {
        const h2hPrice = sku.h2h_price || 0;
        const profitType = itemFormData.profit_type;
        const profitVal = Number(itemFormData.profit_value || 0);
        let computed = h2hPrice;

        if (profitType === 'percent') {
            computed = Math.round(h2hPrice + h2hPrice * (profitVal / 100));
        } else {
            computed = h2hPrice + profitVal;
        }

        setItemFormData({
            ...itemFormData,
            buyer_sku_code: sku.buyer_sku_code,
            name: itemFormData.name || sku.product_name,
            h2h_price: h2hPrice,
            price: computed,
            status: sku.status || 'AVAILABLE',
        });
    };

    // Recalculate price when profit settings change
    const handleProfitChange = (type, val) => {
        const h2hPrice = Number(itemFormData.h2h_price || 0);
        const numericVal = Number(val || 0);
        let computed = h2hPrice;

        if (type === 'percent') {
            computed = Math.round(h2hPrice + h2hPrice * (numericVal / 100));
        } else {
            computed = h2hPrice + numericVal;
        }

        setItemFormData({
            ...itemFormData,
            profit_type: type,
            profit_value: val,
            price: computed,
        });
    };

    const handleSaveItem = (e) => {
        e.preventDefault();
        if (editingItem) {
            router.put(route('admin.products.items.update', editingItem.id), itemFormData, {
                onSuccess: () => {
                    setIsItemFormOpen(false);
                    setEditingItem(null);
                },
            });
        } else {
            router.post(route('admin.products.items.store', product.id), itemFormData, {
                onSuccess: () => {
                    setIsItemFormOpen(false);
                    setItemFormData(initialItemData);
                },
            });
        }
    };

    const handleDeleteItem = (itemId, itemName) => {
        if (confirm(`Hapus item nominal '${itemName}'?`)) {
            router.delete(route('admin.products.items.destroy', itemId));
        }
    };

    // Filter items in the list
    const [itemSearchFilter, setItemSearchFilter] = useState('');
    const [itemGroupFilter, setItemGroupFilter] = useState('all');

    const uniqueItemGroups = useMemo(() => {
        const groups = (product.items || []).map((it) => it.category_group || 'Umum');
        return ['all', ...Array.from(new Set(groups))];
    }, [product.items]);

    const displayedItems = useMemo(() => {
        return (product.items || []).filter((it) => {
            const matchesSearch =
                !itemSearchFilter.trim() ||
                it.name?.toLowerCase().includes(itemSearchFilter.toLowerCase()) ||
                it.buyer_sku_code?.toLowerCase().includes(itemSearchFilter.toLowerCase());
            const matchesGroup =
                itemGroupFilter === 'all' || (it.category_group || 'Umum') === itemGroupFilter;
            return matchesSearch && matchesGroup;
        });
    }, [product.items, itemSearchFilter, itemGroupFilter]);

    const formatRp = (num) => 'Rp ' + Number(num || 0).toLocaleString('id-ID');

    return (
        <AdminLayout auth={auth} title={`Kelola ${product.name}`} activeMenu="products">
            <Head title={`Kelola ${product.name} - Admin Panel`} />

            <div className="space-y-6 max-w-7xl mx-auto pb-12">
                {/* TOP BREADCRUMB & ACTIONS */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-bold text-ink-muted mb-1.5">
                            <Link href="/admin/products" className="hover:text-brand flex items-center gap-1">
                                <ArrowLeft className="w-3.5 h-3.5" />
                                <span>Daftar Produk</span>
                            </Link>
                            <span>/</span>
                            <span className="text-ink truncate max-w-[200px]">{product.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl border-2 border-ink bg-brand-subtle flex items-center justify-center font-black text-brand-navy shadow-sketch-xs shrink-0 overflow-hidden">
                                {product.thumbnail ? (
                                    <img src={product.thumbnail} alt="" className="w-full h-full object-contain" />
                                ) : (
                                    <Package className="w-5 h-5" />
                                )}
                            </div>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-black text-ink tracking-tight flex items-center gap-2">
                                    <span>{product.name}</span>
                                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border border-ink ${
                                        product.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                    }`}>
                                        {product.is_active ? 'Aktif' : 'Nonaktif'}
                                    </span>
                                </h1>
                                <p className="text-xs text-ink-muted mt-0.5">
                                    Slug: <code className="font-mono bg-paper-dark px-1.5 py-0.5 rounded text-ink">/product/{product.slug}</code>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <a
                            href={`/product/${product.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="sketch-btn px-3.5 py-2 bg-white text-ink border-2 border-ink rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sketch-xs hover:bg-brand-subtle"
                        >
                            <ExternalLink className="w-3.5 h-3.5 text-brand" />
                            <span>Lihat di Website</span>
                        </a>
                        <Link
                            href="/admin/products"
                            className="sketch-btn px-4 py-2 bg-paper-dark text-ink border-2 border-ink rounded-xl text-xs font-bold shadow-sketch-xs hover:bg-paper"
                        >
                            Kembali
                        </Link>
                    </div>
                </div>

                {/* TABS SELECTOR */}
                <div className="flex items-center gap-2 border-b-2 border-ink/10 pb-1">
                    <button
                        type="button"
                        onClick={() => setActiveTab('items')}
                        className={`px-5 py-2.5 rounded-2xl text-xs font-bold border-2 transition-all flex items-center gap-2 ${
                            activeTab === 'items'
                                ? 'bg-brand text-white border-ink shadow-sketch scale-102 font-black'
                                : 'bg-white text-ink border-ink/40 hover:border-ink hover:bg-brand-subtle/30 shadow-sketch-xs'
                        }`}
                    >
                        <Sparkles className="w-4 h-4" />
                        <span>Daftar Item & Denominasi</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                            activeTab === 'items' ? 'bg-white/20 text-white' : 'bg-brand-subtle text-brand-navy'
                        }`}>
                            {product.items?.length || 0}
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('product')}
                        className={`px-5 py-2.5 rounded-2xl text-xs font-bold border-2 transition-all flex items-center gap-2 ${
                            activeTab === 'product'
                                ? 'bg-brand text-white border-ink shadow-sketch scale-102 font-black'
                                : 'bg-white text-ink border-ink/40 hover:border-ink hover:bg-brand-subtle/30 shadow-sketch-xs'
                        }`}
                    >
                        <Edit className="w-4 h-4" />
                        <span>Informasi Produk Induk</span>
                    </button>
                </div>

                {/* ============================================================ */}
                {/* TAB 1: KELOLA ITEM & DENOMINASI */}
                {/* ============================================================ */}
                {activeTab === 'items' && (
                    <div className="space-y-6">
                        {/* ITEM CONTROLS HEADER */}
                        <div className="sketch-card bg-white p-4 sm:p-5 rounded-3xl border-2 border-ink shadow-sketch flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-base sm:text-lg font-black text-ink">
                                    Item / Denominasi Produk
                                </h2>
                                <p className="text-xs text-ink-muted mt-0.5">
                                    Kelola daftar nominal voucher/item, hubungkan SKU H2H, dan tentukan margin laba.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={openCreateItem}
                                className="sketch-btn px-4 py-2.5 bg-brand text-white border-2 border-ink rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-sketch hover:brightness-110 active:scale-98 shrink-0"
                            >
                                <Plus className="w-4 h-4 stroke-[3]" />
                                <span>Tambah Item Baru</span>
                            </button>
                        </div>

                        {/* INLINE ITEM FORM DRAWER / CARD (When open) */}
                        {isItemFormOpen && (
                            <form
                                onSubmit={handleSaveItem}
                                className="sketch-card bg-paper-light p-5 sm:p-6 rounded-3xl border-3 border-brand shadow-sketch space-y-5 animate-in fade-in duration-200"
                            >
                                <div className="flex items-center justify-between pb-3 border-b-2 border-ink/10">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-xl bg-brand text-white border-2 border-ink shadow-sketch-xs flex items-center justify-center font-bold text-xs">
                                            {editingItem ? <Edit className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                        </div>
                                        <div>
                                            <h3 className="text-base font-black text-ink">
                                                {editingItem ? `Edit Item: ${editingItem.name}` : 'Tambah Item Nominal Baru'}
                                            </h3>
                                            <p className="text-xs text-ink-muted">
                                                Lengkapi data item dan atur keuntungan dari harga API H2H
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setIsItemFormOpen(false)}
                                        className="p-1.5 rounded-xl border-2 border-ink bg-white hover:bg-rose-50 text-ink shadow-sketch-xs"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {/* Left: SKU Selection & Item Details */}
                                    <div className="space-y-4">
                                        {/* SKU H2H Selector */}
                                        <div>
                                            <label className="block text-xs font-mono font-bold text-ink mb-1.5 flex items-center justify-between">
                                                <span>PILIH DARI SKU H2H (OPSIONAL)</span>
                                                <span className="text-[10px] text-brand">Auto-fill harga modal</span>
                                            </label>
                                            <div className="space-y-2">
                                                <input
                                                    type="text"
                                                    value={skuSearch}
                                                    onChange={(e) => setSkuSearch(e.target.value)}
                                                    placeholder="Cari SKU code, nama, atau brand H2H..."
                                                    className="w-full px-3 py-2 bg-white border-2 border-ink rounded-xl text-xs font-semibold shadow-sketch-xs focus:ring-0 focus:border-brand"
                                                />
                                                <div className="max-h-36 overflow-y-auto border-2 border-ink/20 rounded-xl bg-white divide-y divide-ink/10 text-xs">
                                                    {filteredSkus.map((sku) => (
                                                        <button
                                                            key={sku.buyer_sku_code}
                                                            type="button"
                                                            onClick={() => handleSelectSku(sku)}
                                                            className={`w-full text-left px-3 py-2 hover:bg-brand-subtle/30 flex items-center justify-between transition-colors ${
                                                                itemFormData.buyer_sku_code === sku.buyer_sku_code
                                                                    ? 'bg-brand-subtle font-bold text-brand-navy'
                                                                    : ''
                                                            }`}
                                                        >
                                                            <div className="min-w-0 pr-2">
                                                                <span className="font-mono font-bold text-ink mr-2">
                                                                    {sku.buyer_sku_code}
                                                                </span>
                                                                <span className="text-ink-muted truncate">
                                                                    {sku.product_name}
                                                                </span>
                                                            </div>
                                                            <span className="font-mono font-bold text-emerald-700 shrink-0">
                                                                {formatRp(sku.h2h_price)}
                                                            </span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* SKU Code (Direct/Custom) */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs font-mono font-bold text-ink mb-1">
                                                    KODE SKU H2H
                                                </label>
                                                <input
                                                    type="text"
                                                    value={itemFormData.buyer_sku_code}
                                                    onChange={(e) => setItemFormData({ ...itemFormData, buyer_sku_code: e.target.value })}
                                                    placeholder="Cth: ML-86"
                                                    className="w-full px-3 py-2 bg-white border-2 border-ink rounded-xl text-xs font-mono font-bold shadow-sketch-xs focus:ring-0 focus:border-brand"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-mono font-bold text-ink mb-1">
                                                    GRUP TAB / KATEGORI
                                                </label>
                                                <input
                                                    type="text"
                                                    value={itemFormData.category_group}
                                                    onChange={(e) => setItemFormData({ ...itemFormData, category_group: e.target.value })}
                                                    placeholder="Cth: Diamonds, Promo, Umum"
                                                    className="w-full px-3 py-2 bg-white border-2 border-ink rounded-xl text-xs font-semibold shadow-sketch-xs focus:ring-0 focus:border-brand"
                                                />
                                            </div>
                                        </div>

                                        {/* Item Name */}
                                        <div>
                                            <label className="block text-xs font-mono font-bold text-ink mb-1">
                                                NAMA ITEM / DENOMINASI *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={itemFormData.name}
                                                onChange={(e) => setItemFormData({ ...itemFormData, name: e.target.value })}
                                                placeholder="Cth: 86 Diamonds (+10 Bonus)"
                                                className="w-full px-3 py-2 bg-white border-2 border-ink rounded-xl text-xs font-bold shadow-sketch-xs focus:ring-0 focus:border-brand"
                                            />
                                        </div>
                                    </div>

                                    {/* Right: Price & Profit Calculation */}
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-3">
                                            {/* Harga Modal H2H */}
                                            <div>
                                                <label className="block text-xs font-mono font-bold text-ink mb-1">
                                                    HARGA MODAL (H2H)
                                                </label>
                                                <div className="relative">
                                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs font-bold text-ink-muted">
                                                        Rp
                                                    </span>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={itemFormData.h2h_price}
                                                        onChange={(e) => {
                                                            const val = Number(e.target.value);
                                                            const profitVal = Number(itemFormData.profit_value || 0);
                                                            const newPrice = itemFormData.profit_type === 'percent'
                                                                ? Math.round(val + val * (profitVal / 100))
                                                                : val + profitVal;
                                                            setItemFormData({
                                                                ...itemFormData,
                                                                h2h_price: val,
                                                                price: newPrice,
                                                            });
                                                        }}
                                                        className="w-full pl-9 pr-3 py-2 bg-white border-2 border-ink rounded-xl text-xs font-mono font-bold shadow-sketch-xs focus:ring-0 focus:border-brand"
                                                    />
                                                </div>
                                            </div>

                                            {/* Status */}
                                            <div>
                                                <label className="block text-xs font-mono font-bold text-ink mb-1">
                                                    STATUS STOK
                                                </label>
                                                <select
                                                    value={itemFormData.status}
                                                    onChange={(e) => setItemFormData({ ...itemFormData, status: e.target.value })}
                                                    className="w-full px-3 py-2 bg-white border-2 border-ink rounded-xl text-xs font-bold shadow-sketch-xs focus:ring-0 focus:border-brand"
                                                >
                                                    <option value="AVAILABLE">AVAILABLE (Tersedia)</option>
                                                    <option value="EMPTY">EMPTY (Stok Habis)</option>
                                                    <option value="MAINTENANCE">MAINTENANCE (Gangguan)</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Profit / Margin Controls */}
                                        <div className="p-4 bg-white border-2 border-ink rounded-2xl shadow-sketch-xs space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-mono font-black text-ink">
                                                    PENGATURAN KEUNTUNGAN (MARGIN)
                                                </span>
                                                {/* Toggle Fixed vs Percent */}
                                                <div className="flex items-center gap-1 bg-paper border border-ink p-0.5 rounded-lg text-[10px] font-bold">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleProfitChange('fixed', itemFormData.profit_value)}
                                                        className={`px-2.5 py-1 rounded transition-colors ${
                                                            itemFormData.profit_type === 'fixed'
                                                                ? 'bg-brand text-white shadow-xs'
                                                                : 'text-ink hover:text-brand'
                                                        }`}
                                                    >
                                                        Tetap (Rp)
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleProfitChange('percent', itemFormData.profit_value)}
                                                        className={`px-2.5 py-1 rounded transition-colors ${
                                                            itemFormData.profit_type === 'percent'
                                                                ? 'bg-brand text-white shadow-xs'
                                                                : 'text-ink hover:text-brand'
                                                        }`}
                                                    >
                                                        Persen (%)
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3 items-center">
                                                <div>
                                                    <label className="block text-[11px] font-bold text-ink-muted mb-1">
                                                        Nilai Untung ({itemFormData.profit_type === 'fixed' ? 'Rp' : '%'})
                                                    </label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={itemFormData.profit_value}
                                                        onChange={(e) => handleProfitChange(itemFormData.profit_type, e.target.value)}
                                                        placeholder={itemFormData.profit_type === 'fixed' ? 'Cth: 2000' : 'Cth: 5'}
                                                        className="w-full px-3 py-2 bg-paper-light border-2 border-ink rounded-xl text-xs font-mono font-bold shadow-sketch-xs focus:ring-0 focus:border-brand"
                                                    />
                                                </div>

                                                <div className="p-3 rounded-xl bg-emerald-50 border-2 border-emerald-600/30">
                                                    <p className="text-[10px] font-mono font-bold text-emerald-800 uppercase">
                                                        Harga Jual Akhir
                                                    </p>
                                                    <p className="text-base font-mono font-black text-emerald-700 leading-tight mt-0.5">
                                                        {formatRp(itemFormData.price)}
                                                    </p>
                                                    <p className="text-[10px] text-emerald-800/80 mt-0.5">
                                                        Modal {formatRp(itemFormData.h2h_price)} +{' '}
                                                        {itemFormData.profit_type === 'fixed'
                                                            ? formatRp(itemFormData.profit_value)
                                                            : `${itemFormData.profit_value}%`}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Sort order & Active Checkbox */}
                                        <div className="flex items-center justify-between gap-4 pt-1">
                                            <div className="flex items-center gap-2">
                                                <label className="text-xs font-mono font-bold text-ink">Urutan:</label>
                                                <input
                                                    type="number"
                                                    value={itemFormData.sort_order}
                                                    onChange={(e) => setItemFormData({ ...itemFormData, sort_order: Number(e.target.value) })}
                                                    className="w-16 px-2 py-1 bg-white border-2 border-ink rounded-lg text-xs font-mono font-bold"
                                                />
                                            </div>

                                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                                <input
                                                    type="checkbox"
                                                    checked={itemFormData.is_active}
                                                    onChange={(e) => setItemFormData({ ...itemFormData, is_active: e.target.checked })}
                                                    className="w-4 h-4 rounded border-2 border-ink text-brand focus:ring-0"
                                                />
                                                <span className="text-xs font-bold text-ink">Tampilkan di Web</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-2.5 pt-3 border-t-2 border-ink/10">
                                    <button
                                        type="button"
                                        onClick={() => setIsItemFormOpen(false)}
                                        className="sketch-btn px-4 py-2 bg-white text-ink border-2 border-ink rounded-xl text-xs font-bold shadow-sketch-xs hover:bg-paper"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        className="sketch-btn px-5 py-2 bg-brand text-white border-2 border-ink rounded-xl text-xs font-black shadow-sketch hover:brightness-110 flex items-center gap-1.5"
                                    >
                                        <Save className="w-4 h-4 stroke-[2.5]" />
                                        <span>{editingItem ? 'Simpan Perubahan Item' : 'Tambahkan Item'}</span>
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* ITEMS LIST TABLE / CARD CONTAINER */}
                        <div className="sketch-card bg-white rounded-3xl border-2 border-ink shadow-sketch overflow-hidden">
                            {/* Filter bar */}
                            <div className="p-4 bg-paper-light border-b-2 border-ink/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                                <div className="relative w-full sm:w-64">
                                    <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
                                    <input
                                        type="text"
                                        value={itemSearchFilter}
                                        onChange={(e) => setItemSearchFilter(e.target.value)}
                                        placeholder="Cari item atau SKU..."
                                        className="w-full pl-9 pr-3 py-1.5 bg-white border-2 border-ink rounded-xl text-xs font-semibold shadow-sketch-xs focus:ring-0 focus:border-brand"
                                    />
                                </div>

                                {/* Group Filter tabs */}
                                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar py-1">
                                    {uniqueItemGroups.map((group) => (
                                        <button
                                            key={group}
                                            type="button"
                                            onClick={() => setItemGroupFilter(group)}
                                            className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors shrink-0 ${
                                                itemGroupFilter === group
                                                    ? 'bg-brand text-white border-ink shadow-sketch-xs'
                                                    : 'bg-white text-ink border-ink/30 hover:border-ink'
                                            }`}
                                        >
                                            {group === 'all' ? 'Semua Grup' : group}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Item list content */}
                            {displayedItems.length === 0 ? (
                                <div className="text-center py-16 px-4">
                                    <Package className="w-12 h-12 text-ink-muted mx-auto mb-2 opacity-40" />
                                    <p className="font-bold text-sm text-ink">Belum ada item untuk produk ini</p>
                                    <p className="text-xs text-ink-muted mt-1 max-w-sm mx-auto">
                                        Tambahkan item pertama Anda agar pelanggan dapat memilih nominal dan melakukan pembelian.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={openCreateItem}
                                        className="sketch-btn mt-4 px-4 py-2 bg-brand text-white border-2 border-ink rounded-xl text-xs font-bold shadow-sketch-xs inline-flex items-center gap-1.5"
                                    >
                                        <Plus className="w-4 h-4 stroke-[3]" />
                                        <span>Tambah Item Pertama</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs border-collapse">
                                        <thead>
                                            <tr className="bg-paper-light border-b-2 border-ink/20 font-mono text-[11px] text-ink font-black uppercase tracking-wider">
                                                <th className="py-3 px-4">Item & Denominasi</th>
                                                <th className="py-3 px-4">Grup</th>
                                                <th className="py-3 px-4">SKU H2H</th>
                                                <th className="py-3 px-4 text-right">Modal H2H</th>
                                                <th className="py-3 px-4 text-right">Laba</th>
                                                <th className="py-3 px-4 text-right">Harga Jual</th>
                                                <th className="py-3 px-4 text-center">Status</th>
                                                <th className="py-3 px-4 text-right">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-ink/10 font-medium">
                                            {displayedItems.map((item) => (
                                                <tr key={item.id} className="hover:bg-brand-subtle/20 transition-colors">
                                                    <td className="py-3.5 px-4">
                                                        <div className="font-black text-ink text-xs sm:text-sm">
                                                            {item.name}
                                                        </div>
                                                        <div className="text-[10px] text-ink-muted font-mono mt-0.5">
                                                            Urutan: #{item.sort_order}
                                                        </div>
                                                    </td>
                                                    <td className="py-3.5 px-4">
                                                        <span className="px-2 py-0.5 rounded bg-paper-dark border border-ink font-mono text-[10px] font-bold text-ink">
                                                            {item.category_group || 'Umum'}
                                                        </span>
                                                    </td>
                                                    <td className="py-3.5 px-4">
                                                        {item.buyer_sku_code ? (
                                                            <span className="font-mono font-bold text-brand bg-brand-subtle/50 px-2 py-0.5 rounded border border-brand/40">
                                                                {item.buyer_sku_code}
                                                            </span>
                                                        ) : (
                                                            <span className="text-ink-muted text-[10px] font-mono">
                                                                (Manual)
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="py-3.5 px-4 text-right font-mono font-bold text-ink">
                                                        {formatRp(item.h2h_price)}
                                                    </td>
                                                    <td className="py-3.5 px-4 text-right">
                                                        <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-300 text-[11px]">
                                                            +{item.profit_type === 'percent'
                                                                ? `${item.profit_value}%`
                                                                : formatRp(item.profit_value)}
                                                        </span>
                                                    </td>
                                                    <td className="py-3.5 px-4 text-right font-mono font-black text-sm text-brand">
                                                        {formatRp(item.price)}
                                                    </td>
                                                    <td className="py-3.5 px-4 text-center">
                                                        <span className={`inline-block px-2 py-0.5 rounded-full font-mono text-[10px] font-bold border ${
                                                            item.status === 'AVAILABLE'
                                                                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                                                : item.status === 'EMPTY'
                                                                ? 'bg-rose-100 text-rose-800 border-rose-300'
                                                                : 'bg-amber-100 text-amber-800 border-amber-300'
                                                        }`}>
                                                            {item.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-3.5 px-4 text-right">
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            <button
                                                                type="button"
                                                                onClick={() => openEditItem(item)}
                                                                className="p-1.5 rounded-lg border border-ink bg-white hover:bg-brand-subtle text-ink shadow-sketch-xs"
                                                                title="Edit Item"
                                                            >
                                                                <Edit className="w-3.5 h-3.5" />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleDeleteItem(item.id, item.name)}
                                                                className="p-1.5 rounded-lg border border-ink bg-white hover:bg-rose-100 text-rose-700 shadow-sketch-xs"
                                                                title="Hapus Item"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ============================================================ */}
                {/* TAB 2: PENGATURAN PRODUK INDUK */}
                {/* ============================================================ */}
                {activeTab === 'product' && (
                    <form onSubmit={handleProductSubmit} className="space-y-6">
                        <div className="sketch-card bg-white p-5 sm:p-7 rounded-3xl border-2 border-ink shadow-sketch space-y-6">
                            <div className="border-b-2 border-ink/10 pb-4">
                                <h2 className="text-base sm:text-lg font-black text-ink">
                                    Informasi Dasar Produk
                                </h2>
                                <p className="text-xs text-ink-muted mt-0.5">
                                    Atur nama, kategori, brand/publisher, dan link tampilan produk.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* Nama Produk */}
                                <div>
                                    <label className="block text-xs font-mono font-bold text-ink mb-1.5">
                                        NAMA PRODUK *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={productForm.name}
                                        onChange={(e) => setProductForm('name', e.target.value)}
                                        placeholder="Cth: Mobile Legends: Bang Bang"
                                        className="w-full px-4 py-2.5 bg-white border-2 border-ink rounded-xl text-xs sm:text-sm font-bold shadow-sketch-xs focus:ring-0 focus:border-brand"
                                    />
                                    {productErrors.name && (
                                        <p className="text-xs text-rose-600 font-bold mt-1">{productErrors.name}</p>
                                    )}
                                </div>

                                {/* Slug */}
                                <div>
                                    <label className="block text-xs font-mono font-bold text-ink mb-1.5">
                                        SLUG URL *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={productForm.slug}
                                        onChange={(e) => setProductForm('slug', e.target.value)}
                                        placeholder="Cth: mobile-legends"
                                        className="w-full px-4 py-2.5 bg-white border-2 border-ink rounded-xl text-xs sm:text-sm font-mono font-bold shadow-sketch-xs focus:ring-0 focus:border-brand"
                                    />
                                    {productErrors.slug && (
                                        <p className="text-xs text-rose-600 font-bold mt-1">{productErrors.slug}</p>
                                    )}
                                </div>

                                {/* Kategori */}
                                <div>
                                    <label className="block text-xs font-mono font-bold text-ink mb-1.5">
                                        KATEGORI INDUK *
                                    </label>
                                    <select
                                        required
                                        value={productForm.category_id}
                                        onChange={(e) => {
                                            setProductForm({
                                                ...productForm,
                                                category_id: e.target.value,
                                                sub_category_id: '',
                                            });
                                        }}
                                        className="w-full px-4 py-2.5 bg-white border-2 border-ink rounded-xl text-xs sm:text-sm font-bold shadow-sketch-xs focus:ring-0 focus:border-brand"
                                    >
                                        <option value="">-- Pilih Kategori --</option>
                                        {categories.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                    {productErrors.category_id && (
                                        <p className="text-xs text-rose-600 font-bold mt-1">{productErrors.category_id}</p>
                                    )}
                                </div>

                                {/* Subkategori (Opsional) */}
                                <div>
                                    <label className="block text-xs font-mono font-bold text-ink mb-1.5 flex items-center justify-between">
                                        <span>SUBKATEGORI (OPSIONAL)</span>
                                        <span className="text-[10px] text-ink-muted">Bisa dikosongkan</span>
                                    </label>
                                    <select
                                        value={productForm.sub_category_id}
                                        onChange={(e) => setProductForm('sub_category_id', e.target.value)}
                                        className="w-full px-4 py-2.5 bg-white border-2 border-ink rounded-xl text-xs sm:text-sm font-bold shadow-sketch-xs focus:ring-0 focus:border-brand"
                                    >
                                        <option value="">-- Tanpa Subkategori (Langsung Kategori) --</option>
                                        {availableSubCategories.map((sc) => (
                                            <option key={sc.id} value={sc.id}>
                                                {sc.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Brand / Publisher */}
                                <div>
                                    <label className="block text-xs font-mono font-bold text-ink mb-1.5">
                                        BRAND / PUBLISHER
                                    </label>
                                    <input
                                        type="text"
                                        value={productForm.brand}
                                        onChange={(e) => setProductForm('brand', e.target.value)}
                                        placeholder="Cth: Moonton, Garena, Telkomsel"
                                        className="w-full px-4 py-2.5 bg-white border-2 border-ink rounded-xl text-xs sm:text-sm font-semibold shadow-sketch-xs focus:ring-0 focus:border-brand"
                                    />
                                </div>

                                {/* Tipe Input Pengguna */}
                                <div>
                                    <label className="block text-xs font-mono font-bold text-ink mb-1.5">
                                        FORMAT FORM TUJUAN (INPUT TYPE) *
                                    </label>
                                    <select
                                        value={productForm.input_type}
                                        onChange={(e) => setProductForm('input_type', e.target.value)}
                                        className="w-full px-4 py-2.5 bg-white border-2 border-ink rounded-xl text-xs sm:text-sm font-bold shadow-sketch-xs focus:ring-0 focus:border-brand"
                                    >
                                        <option value="id_zone">User ID & Zone ID (Cth: Mobile Legends)</option>
                                        <option value="single_id">User ID Saja (Cth: Free Fire, Valorant)</option>
                                        <option value="phone">Nomor Telepon (Cth: Pulsa, Paket Data, PLN)</option>
                                        <option value="server_select">User ID & Pilihan Server (Cth: Genshin Impact)</option>
                                    </select>
                                </div>
                            </div>

                            {/* Label & Placeholder Configuration */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-paper-light border-2 border-ink/20 rounded-2xl">
                                <div>
                                    <label className="block text-xs font-mono font-bold text-ink mb-1">
                                        LABEL FIELD INPUT UTAMA
                                    </label>
                                    <input
                                        type="text"
                                        value={productForm.input_label}
                                        onChange={(e) => setProductForm('input_label', e.target.value)}
                                        placeholder="Cth: User ID / Nomor HP"
                                        className="w-full px-3 py-2 bg-white border-2 border-ink rounded-xl text-xs font-semibold shadow-sketch-xs"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-mono font-bold text-ink mb-1">
                                        PLACEHOLDER FIELD INPUT UTAMA
                                    </label>
                                    <input
                                        type="text"
                                        value={productForm.input_placeholder}
                                        onChange={(e) => setProductForm('input_placeholder', e.target.value)}
                                        placeholder="Cth: Masukkan User ID Akun"
                                        className="w-full px-3 py-2 bg-white border-2 border-ink rounded-xl text-xs font-semibold shadow-sketch-xs"
                                    />
                                </div>
                            </div>

                            {/* Thumbnail & Banner Image URLs */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-xs font-mono font-bold text-ink mb-1.5">
                                        THUMBNAIL IMAGE URL
                                    </label>
                                    <input
                                        type="text"
                                        value={productForm.thumbnail}
                                        onChange={(e) => setProductForm('thumbnail', e.target.value)}
                                        placeholder="https://... atau /images/..."
                                        className="w-full px-4 py-2 bg-white border-2 border-ink rounded-xl text-xs font-mono shadow-sketch-xs"
                                    />
                                    {productForm.thumbnail && (
                                        <div className="mt-2 w-16 h-16 rounded-xl border-2 border-ink bg-paper p-1 shadow-sketch-xs overflow-hidden">
                                            <img src={productForm.thumbnail} alt="Preview" className="w-full h-full object-contain" />
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-mono font-bold text-ink mb-1.5">
                                        BANNER IMAGE URL
                                    </label>
                                    <input
                                        type="text"
                                        value={productForm.banner}
                                        onChange={(e) => setProductForm('banner', e.target.value)}
                                        placeholder="https://... atau /images/..."
                                        className="w-full px-4 py-2 bg-white border-2 border-ink rounded-xl text-xs font-mono shadow-sketch-xs"
                                    />
                                </div>
                            </div>

                            {/* Deskripsi */}
                            <div>
                                <label className="block text-xs font-mono font-bold text-ink mb-1.5">
                                    DESKRIPSI & CARA PEMESANAN
                                </label>
                                <textarea
                                    rows={4}
                                    value={productForm.description}
                                    onChange={(e) => setProductForm('description', e.target.value)}
                                    placeholder="Petunjuk pembelian, format pengisian ID akun, atau catatan layanan..."
                                    className="w-full px-4 py-2.5 bg-white border-2 border-ink rounded-xl text-xs sm:text-sm font-semibold shadow-sketch-xs focus:ring-0 focus:border-brand"
                                />
                            </div>

                            {/* Sort order & Active */}
                            <div className="flex items-center justify-between gap-4 pt-3 border-t-2 border-ink/10">
                                <div className="flex items-center gap-2">
                                    <label className="text-xs font-mono font-bold text-ink">Urutan Tampilan:</label>
                                    <input
                                        type="number"
                                        value={productForm.sort_order}
                                        onChange={(e) => setProductForm('sort_order', Number(e.target.value))}
                                        className="w-20 px-3 py-1.5 bg-white border-2 border-ink rounded-xl text-xs font-mono font-bold shadow-sketch-xs"
                                    />
                                </div>

                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={productForm.is_active}
                                        onChange={(e) => setProductForm('is_active', e.target.checked)}
                                        className="w-5 h-5 rounded border-2 border-ink text-brand focus:ring-0"
                                    />
                                    <span className="text-xs sm:text-sm font-black text-ink">
                                        Status Aktif (Tampilkan Produk)
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* SAVE PRODUCT BUTTON */}
                        <div className="flex items-center justify-end gap-3">
                            <Link
                                href="/admin/products"
                                className="sketch-btn px-5 py-2.5 bg-white text-ink border-2 border-ink rounded-xl text-xs font-bold shadow-sketch-xs hover:bg-paper"
                            >
                                Kembali
                            </Link>
                            <button
                                type="submit"
                                disabled={productProcessing}
                                className="sketch-btn px-6 py-2.5 bg-brand text-white border-2 border-ink rounded-xl text-xs sm:text-sm font-black shadow-sketch hover:brightness-110 flex items-center gap-2 disabled:opacity-50"
                            >
                                <Save className="w-4 h-4 stroke-[2.5]" />
                                <span>{productProcessing ? 'Menyimpan...' : 'Simpan Perubahan Produk'}</span>
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </AdminLayout>
    );
}
