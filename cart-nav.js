/**
 * TAVROO Atelier - Global Cart Navigation Badge Synchronization
 * Keeps the top-right cart badge in sync across all pages and storage events.
 */
(function() {
    const CART_STORAGE_KEY = 'tavro_lookbook_cart_v1';

    function getCartItemCount() {
        try {
            const raw = localStorage.getItem(CART_STORAGE_KEY);
            if (!raw) return 0;
            const items = JSON.parse(raw);
            if (!Array.isArray(items)) return 0;
            return items.reduce((sum, item) => sum + (parseInt(item.qty, 10) || 1), 0);
        } catch (e) {
            return 0;
        }
    }

    function syncCartBadges() {
        const count = getCartItemCount();
        const badges = document.querySelectorAll('.cart-count-badge, #cartCountBadge');
        badges.forEach(badge => {
            badge.textContent = count;
            badge.setAttribute('aria-label', `${count} items in bag`);
        });

        const bannerCount = document.getElementById('bannerCartCount');
        if (bannerCount) bannerCount.textContent = count;
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', syncCartBadges);
    } else {
        syncCartBadges();
    }

    // Listen for storage changes across tabs and custom in-page updates
    window.addEventListener('storage', (e) => {
        if (e.key === CART_STORAGE_KEY || !e.key) {
            syncCartBadges();
        }
    });

    window.addEventListener('cart-updated', syncCartBadges);

    // Export helper to window for explicit calls
    window.tavroSyncCartBadges = syncCartBadges;
})();
