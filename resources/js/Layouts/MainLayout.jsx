import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import BottomNav from '../Components/BottomNav';
import TransactionTrackerModal from '../Components/TransactionTrackerModal';
import SearchModal from '../Components/SearchModal';
import { CATALOG_PRODUCTS } from '../data/catalogData';

/**
 * MainLayout
 * Unified layout component providing consistent Header (Navbar + Ticker),
 * Footer, Mobile BottomNav, and shared Modals across all public pages.
 */
export default function MainLayout({
    children,
    auth,
    title,
    description = 'Layanan top up game online & PPOB tercepat, termurah, dan 100% legal di Indonesia dengan gaya sketchbook modern.',
    activeTab = 'home',
    searchQuery = '',
    onSearchChange,
    onSelectProduct,
    isTrackerOpen: externalTrackerOpen,
    setIsTrackerOpen: externalSetIsTrackerOpen,
    stickyBar = null,
}) {
    const pageProps = usePage()?.props || {};
    const effectiveAuth = auth || pageProps.auth;

    const [internalTrackerOpen, setInternalTrackerOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const isTrackingOpen = externalTrackerOpen !== undefined ? externalTrackerOpen : internalTrackerOpen;
    const setIsTrackingOpen = externalSetIsTrackerOpen || setInternalTrackerOpen;

    const handleMobileTabChange = (tab) => {
        if (tab === 'home') {
            if (window.location.pathname === '/') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                router.visit('/');
            }
        } else if (tab === 'katalog') {
            if (window.location.pathname === '/katalog') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                router.visit('/katalog');
            }
        } else if (tab === 'transaksi') {
            setIsTrackingOpen(true);
        }
    };

    return (
        <>
            {title && (
                <Head>
                    <title>{title}</title>
                    {description && <meta name="description" content={description} />}
                </Head>
            )}

            <div className={`min-h-screen bg-paper text-ink flex flex-col selection:bg-brand-accent selection:text-ink md:pb-0 ${
                stickyBar ? 'pb-36' : 'pb-24'
            }`}>
                {/* 1. Unified Header Navbar & Announcement Bar */}
                <Navbar
                    searchQuery={searchQuery}
                    onSearchChange={onSearchChange}
                    onOpenSearch={() => setIsSearchOpen(true)}
                    onOpenTracking={() => setIsTrackingOpen(true)}
                    auth={effectiveAuth}
                    activeTab={activeTab}
                />

                {/* 2. Main Body Content */}
                <main className="flex-1 w-full">
                    {children}
                </main>

                {/* 3. Unified Footer */}
                <Footer />

                {/* 4. Unified Android-style Mobile Bottom Navbar */}
                <BottomNav
                    activeTab={activeTab}
                    onTabChange={handleMobileTabChange}
                    onOpenSearch={() => setIsSearchOpen(true)}
                    auth={effectiveAuth}
                    stickyBar={stickyBar}
                />

                {/* 5. Unified Modals */}
                <TransactionTrackerModal
                    isOpen={isTrackingOpen}
                    onClose={() => setIsTrackingOpen(false)}
                />

                <SearchModal
                    isOpen={isSearchOpen}
                    onClose={() => setIsSearchOpen(false)}
                    products={CATALOG_PRODUCTS}
                    onSelectProduct={(product) => {
                        setIsSearchOpen(false);
                        if (onSelectProduct) {
                            onSelectProduct(product);
                        } else if (product?.slug) {
                            router.visit(`/product/${product.slug}`);
                        } else {
                            router.visit(`/katalog?search=${encodeURIComponent(product.name)}`);
                        }
                    }}
                />
            </div>
        </>
    );
}
