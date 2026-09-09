// Helper data and dynamic resolver for Product Detail Page

export const DETAILED_PRODUCTS = {
    'indosat': {
        id: 2,
        name: 'Indosat',
        fullName: 'Pulsa Reguler Indosat Ooredoo',
        slug: 'indosat',
        brandType: 'indosat',
        category: 'Pulsa Reguler',
        publisher: 'Indosat Ooredoo',
        badge: '⚡ Proses 1-3 Detik',
        inputType: 'phone',
        inputLabel: 'Nomor Handphone Indosat',
        inputPlaceholder: 'Cth: 085712345678',
        inputHelp: 'Nomor berlaku: 0814, 0815, 0816, 0855, 0856, 0857, 0858',
        description: '🔋 Pulsa Reguler Indosat\nIsi ulang pulsa cepat & otomatis. Pulsa masuk dalam 3–15 detik, menambah masa aktif nomor Anda.\n\n📱 Nomor Berlaku: 0814, 0815, 0816, 0855, 0856, 0857, 0858\n⚡ Kecepatan: 3–15 detik setelah pembayaran\n📅 Manfaat: Tambah masa aktif, bisa untuk SMS, telpon, beli paket\n✍️ Format Nomor:\nKetik 08xxxxxxxxxx (tanpa +62, spasi, atau tanda hubung)\n✅ Contoh: 08571xxxxxx',
        categories: ['Semua', 'Promo', 'Reguler'],
        items: [
            { id: 1273, name: 'Indosat 5.000 Promo', price: 7188, category: 'Promo', badge: '⚡ Promo' },
            { id: 1255, name: 'Indosat 5.000', price: 7188, category: 'Reguler', badge: 'Reguler' },
            { id: 1274, name: 'Indosat 10.000 Promo', price: 12138, category: 'Promo', badge: '⚡ Promo' },
            { id: 1256, name: 'Indosat 10.000', price: 12138, category: 'Reguler', badge: 'Reguler' },
            { id: 1275, name: 'Indosat 15.000 Promo', price: 15855, category: 'Promo', badge: '⚡ Promo' },
            { id: 1257, name: 'Indosat 15.000', price: 16350, category: 'Reguler', badge: 'Reguler' },
            { id: 1276, name: 'Indosat 20.000 Promo', price: 20394, category: 'Promo', badge: '⚡ Promo' },
            { id: 1258, name: 'Indosat 20.000', price: 21424, category: 'Reguler', badge: 'Reguler' },
            { id: 1277, name: 'Indosat 25.000 Promo', price: 26002, category: 'Promo', badge: '⚡ Promo' },
            { id: 1259, name: 'Indosat 25.000', price: 26523, category: 'Reguler', badge: 'Reguler' },
            { id: 1260, name: 'Indosat 50.000', price: 51521, category: 'Reguler', badge: '🔥 Terlaris' },
            { id: 1261, name: 'Indosat 60.000', price: 61718, category: 'Reguler', badge: 'Reguler' },
            { id: 1262, name: 'Indosat 70.000', price: 71915, category: 'Reguler', badge: 'Reguler' },
            { id: 1263, name: 'Indosat 80.000', price: 82112, category: 'Reguler', badge: 'Reguler' },
            { id: 1264, name: 'Indosat 90.000', price: 92309, category: 'Reguler', badge: 'Reguler' },
            { id: 1265, name: 'Indosat 100.000', price: 102506, category: 'Reguler', badge: '⭐ Pilihan' },
            { id: 1266, name: 'Indosat 150.000', price: 153491, category: 'Reguler', badge: 'Reguler' },
            { id: 1267, name: 'Indosat 200.000', price: 204476, category: 'Reguler', badge: 'Reguler' },
            { id: 1268, name: 'Indosat 250.000', price: 255977, category: 'Reguler', badge: 'Reguler' },
            { id: 1269, name: 'Indosat 300.000', price: 306446, category: 'Reguler', badge: 'Reguler' },
            { id: 1270, name: 'Indosat 400.000', price: 408416, category: 'Reguler', badge: 'Reguler' },
            { id: 1271, name: 'Indosat 500.000', price: 510386, category: 'Reguler', badge: 'Reguler' },
            { id: 1272, name: 'Indosat 1.000.000', price: 1022297, category: 'Reguler', badge: 'Sultan' },
        ]
    },
    'pulsa-indosat': {
        alias: 'indosat'
    },
    'telkomsel': {
        id: 1,
        name: 'Telkomsel',
        fullName: 'Pulsa Reguler Telkomsel',
        slug: 'telkomsel',
        brandType: 'telkomsel',
        category: 'Pulsa Reguler',
        publisher: 'Telkomsel',
        badge: '⚡ Proses 1-3 Detik',
        inputType: 'phone',
        inputLabel: 'Nomor Handphone Telkomsel',
        inputPlaceholder: 'Cth: 081234567890',
        inputHelp: 'Nomor berlaku: 0811, 0812, 0813, 0821, 0822, 0823, 0851, 0852, 0853',
        description: '🔋 Pulsa Reguler Telkomsel\nIsi ulang pulsa cepat & otomatis. Menambah masa aktif SimPATI, Kartu As, dan By.U.\n⚡ Kecepatan: 3–15 detik setelah pembayaran.',
        categories: ['Semua', 'Promo', 'Reguler'],
        items: [
            { id: 201, name: 'Telkomsel 5.000 Promo', price: 6150, category: 'Promo', badge: '⚡ Promo' },
            { id: 202, name: 'Telkomsel 10.000 Promo', price: 11250, category: 'Promo', badge: '⚡ Promo' },
            { id: 203, name: 'Telkomsel 15.000', price: 15800, category: 'Reguler', badge: 'Reguler' },
            { id: 204, name: 'Telkomsel 20.000 Promo', price: 20800, category: 'Promo', badge: '⚡ Promo' },
            { id: 205, name: 'Telkomsel 25.000', price: 25900, category: 'Reguler', badge: 'Reguler' },
            { id: 206, name: 'Telkomsel 50.000', price: 50850, category: 'Reguler', badge: '🔥 Terlaris' },
            { id: 207, name: 'Telkomsel 100.000', price: 100500, category: 'Reguler', badge: '⭐ Pilihan' },
            { id: 208, name: 'Telkomsel 150.000', price: 151000, category: 'Reguler', badge: 'Reguler' },
            { id: 209, name: 'Telkomsel 200.000', price: 201500, category: 'Reguler', badge: 'Reguler' },
        ]
    },
    'pulsa-telkomsel': { alias: 'telkomsel' },
    'mobile-legends': {
        id: 10,
        name: 'Mobile Legends',
        fullName: 'Mobile Legends: Bang Bang',
        slug: 'mobile-legends',
        brandType: 'mlbb',
        category: 'Games',
        publisher: 'Moonton',
        badge: '🔥 Top Seller',
        inputType: 'game_user_zone',
        inputLabel: 'User ID & Server ID',
        inputPlaceholder: 'Cth: 12345678',
        inputPlaceholder2: 'Cth: 2019',
        inputHelp: 'Format: User ID (Zone ID). Contoh di profil game: 12345678 (2019)',
        description: '⚔️ Top Up Diamond Mobile Legends Resmi & Legal Moonton.\nProses otomatis 1-3 detik langsung masuk ke akun Mobile Legends kamu.\n100% Aman & Terpercaya!',
        categories: ['Semua', 'Membership', 'Diamonds', 'Bonus'],
        items: [
            { id: 301, name: 'Weekly Diamond Pass', price: 27500, category: 'Membership', badge: '🔥 Paling Laris' },
            { id: 302, name: 'Twilight Pass', price: 145000, category: 'Membership', badge: 'Spesial' },
            { id: 303, name: '86 Diamonds (+8 Bonus)', price: 19800, category: 'Diamonds', badge: '⚡ 1 Detik' },
            { id: 304, name: '172 Diamonds (+16 Bonus)', price: 39500, category: 'Diamonds', badge: '⚡ 1 Detik' },
            { id: 305, name: '257 Diamonds (+23 Bonus)', price: 58000, category: 'Diamonds', badge: 'Promo' },
            { id: 306, name: '344 Diamonds (+32 Bonus)', price: 78500, category: 'Diamonds', badge: '⚡ 1 Detik' },
            { id: 307, name: '429 Diamonds (+39 Bonus)', price: 98000, category: 'Diamonds', badge: 'Populer' },
            { id: 308, name: '706 Diamonds (+70 Bonus)', price: 156000, category: 'Diamonds', badge: '🔥 Best Value' },
            { id: 309, name: '1050 Diamonds (+105 Bonus)', price: 235000, category: 'Bonus', badge: 'Bonus' },
            { id: 310, name: '2195 Diamonds (+220 Bonus)', price: 475000, category: 'Bonus', badge: 'Sultan' },
            { id: 311, name: '3688 Diamonds (+370 Bonus)', price: 795000, category: 'Bonus', badge: 'Sultan' },
        ]
    },
    'free-fire': {
        id: 11,
        name: 'Free Fire MAX',
        fullName: 'Free Fire & Free Fire MAX',
        slug: 'free-fire',
        brandType: 'ff',
        category: 'Games',
        publisher: 'Garena',
        badge: '⚡ Instan 1 Detik',
        inputType: 'single_id',
        inputLabel: 'Player ID Free Fire',
        inputPlaceholder: 'Cth: 1234567890',
        inputHelp: 'Buka profil game Free Fire untuk menyalin Player ID kamu.',
        description: '🔥 Top Up Diamond Free Fire Legal Garena.\nCukup masukkan Player ID, diamond otomatis masuk seketika!',
        categories: ['Semua', 'Membership', 'Diamonds'],
        items: [
            { id: 401, name: 'Membership Mingguan', price: 29000, category: 'Membership', badge: 'Hemat' },
            { id: 402, name: 'Membership Bulanan', price: 89000, category: 'Membership', badge: 'Spesial' },
            { id: 403, name: '100 Diamonds', price: 14500, category: 'Diamonds', badge: '⚡ 1 Detik' },
            { id: 404, name: '140 Diamonds', price: 19800, category: 'Diamonds', badge: '⚡ 1 Detik' },
            { id: 405, name: '355 Diamonds', price: 47500, category: 'Diamonds', badge: '🔥 Terlaris' },
            { id: 406, name: '720 Diamonds', price: 95000, category: 'Diamonds', badge: 'Best Value' },
            { id: 407, name: '1440 Diamonds', price: 190000, category: 'Diamonds', badge: 'Sultan' },
        ]
    },
    'genshin-impact': {
        id: 12,
        name: 'Genshin Impact',
        fullName: 'Genshin Impact (Genesis Crystals)',
        slug: 'genshin-impact',
        brandType: 'genshin',
        category: 'Games',
        publisher: 'HoYoverse',
        badge: '💎 Promo',
        inputType: 'game_user_server',
        inputLabel: 'UID & Server Genshin',
        inputPlaceholder: 'Cth: 812345678',
        serverOptions: ['Asia', 'America', 'Europe', 'TW/HK/MO'],
        inputHelp: 'Buka menu Paimon untuk melihat UID kamu di pojok kanan bawah.',
        description: '✨ Top Up Blessing of the Welkin Moon & Genesis Crystals resmi HoYoverse.',
        categories: ['Semua', 'Blessing', 'Genesis Crystals'],
        items: [
            { id: 501, name: 'Blessing of the Welkin Moon', price: 79000, category: 'Blessing', badge: '🔥 Paling Laris' },
            { id: 502, name: '60 Genesis Crystals', price: 15500, category: 'Genesis Crystals', badge: '⚡ Instan' },
            { id: 503, name: '300+30 Genesis Crystals', price: 75000, category: 'Genesis Crystals', badge: 'Populer' },
            { id: 504, name: '980+110 Genesis Crystals', price: 235000, category: 'Genesis Crystals', badge: 'Bonus' },
            { id: 505, name: '1980+260 Genesis Crystals', price: 475000, category: 'Genesis Crystals', badge: 'Bonus' },
        ]
    },
    'pln': {
        id: 13,
        name: 'Listrik PLN',
        fullName: 'Token Listrik Prabayar PLN',
        slug: 'pln',
        brandType: 'pln',
        category: 'Listrik PLN',
        publisher: 'PT PLN (Persero)',
        badge: '⚡ 24 Jam Nonstop',
        inputType: 'phone',
        inputLabel: 'Nomor Meter / ID Pelanggan PLN',
        inputPlaceholder: 'Cth: 14123456789 atau 52123456789',
        inputHelp: 'Masukkan 11-12 digit Nomor Meter atau ID Pelanggan PLN Anda.',
        description: '💡 Beli Token Listrik PLN Prabayar 24 Jam Otomatis.\nNomor token 20 digit langsung muncul di layar dan dikirim ke WhatsApp/Email.',
        categories: ['Semua', 'Token Prabayar'],
        items: [
            { id: 601, name: 'Token PLN 20.000', price: 20500, category: 'Token Prabayar', badge: '⚡ Instan' },
            { id: 602, name: 'Token PLN 50.000', price: 50500, category: 'Token Prabayar', badge: '🔥 Terlaris' },
            { id: 603, name: 'Token PLN 100.000', price: 100500, category: 'Token Prabayar', badge: 'Pilihan' },
            { id: 604, name: 'Token PLN 200.000', price: 200500, category: 'Token Prabayar', badge: 'Hemat' },
            { id: 605, name: 'Token PLN 500.000', price: 500500, category: 'Token Prabayar', badge: 'Besar' },
            { id: 606, name: 'Token PLN 1.000.000', price: 1000500, category: 'Token Prabayar', badge: 'Besar' },
        ]
    }
};

/**
 * Resolve product details dynamically by slug or product name
 */
export function getProductDetailBySlug(slug) {
    if (!slug) return DETAILED_PRODUCTS['indosat'];

    const normalizedSlug = slug.toLowerCase().trim();

    // Check direct match
    if (DETAILED_PRODUCTS[normalizedSlug]) {
        const item = DETAILED_PRODUCTS[normalizedSlug];
        if (item.alias) return DETAILED_PRODUCTS[item.alias];
        return item;
    }

    // Check partial slug matching (e.g. 'pulsa-indosat' -> 'indosat')
    for (const key of Object.keys(DETAILED_PRODUCTS)) {
        if (normalizedSlug.includes(key) || key.includes(normalizedSlug)) {
            const item = DETAILED_PRODUCTS[key];
            if (item.alias) return DETAILED_PRODUCTS[item.alias];
            return item;
        }
    }

    // Dynamic fallback for any slug from catalog
    const formattedName = normalizedSlug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    const isGame = normalizedSlug.includes('game') || normalizedSlug.includes('legends') || normalizedSlug.includes('fire') || normalizedSlug.includes('impact') || normalizedSlug.includes('valorant');

    return {
        id: 999,
        name: formattedName,
        fullName: `${formattedName} Top Up Otomatis`,
        slug: normalizedSlug,
        brandType: normalizedSlug.replace(/[^a-z]/g, ''),
        category: isGame ? 'Games' : 'Pulsa & Digital',
        publisher: 'Maitri Official',
        badge: '⚡ Proses 1-3 Detik',
        inputType: isGame ? 'game_user_zone' : 'phone',
        inputLabel: isGame ? 'User ID Akun' : 'Nomor Handphone / Akun',
        inputPlaceholder: isGame ? 'Cth: 12345678' : 'Cth: 081234567890',
        inputHelp: 'Pastikan data yang dimasukkan sudah benar dan valid.',
        description: `⚡ Layanan Top Up ${formattedName} Otomatis 24 Jam Nonstop.\nProses instan 1-3 detik langsung terkirim dan bergaransi resmi.`,
        categories: ['Semua', 'Promo', 'Reguler'],
        items: [
            { id: 9001, name: `${formattedName} Paket Hemat`, price: 15000, category: 'Promo', badge: '⚡ Promo' },
            { id: 9002, name: `${formattedName} Paket Standar`, price: 25000, category: 'Reguler', badge: 'Reguler' },
            { id: 9003, name: `${formattedName} Paket Favorit`, price: 50000, category: 'Reguler', badge: '🔥 Terlaris' },
            { id: 9004, name: `${formattedName} Paket Spesial`, price: 100000, category: 'Reguler', badge: '⭐ Pilihan' },
            { id: 9005, name: `${formattedName} Paket Premium`, price: 250000, category: 'Reguler', badge: 'Sultan' },
        ]
    };
}
