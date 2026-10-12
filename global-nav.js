/**
 * TAVROO STUDIO - Global Slide-Out Navigation Drawer
 * Enables top-right menu toggle button & full-site navigation drawer across all devices.
 */
(function() {
    const DRAWER_HTML = `
    <div class="nav-drawer-backdrop" id="navDrawerBackdrop" aria-hidden="true"></div>
    <aside class="nav-slide-drawer" id="globalNavDrawer" aria-label="Site Navigation Menu" aria-hidden="true">
        <div class="nav-drawer-header">
            <div class="nav-drawer-brand">
                <span class="nav-drawer-kicker">&#10022; TAVROO ATELIER</span>
                <span class="nav-drawer-tagline">WEAR YOUR POINT OF VIEW</span>
            </div>
            <button type="button" class="nav-drawer-close-btn" id="navDrawerCloseBtn" aria-label="Close Navigation Menu">&times;</button>
        </div>

        <div class="nav-drawer-body">
            <div class="nav-drawer-section-label">All Website Pages</div>
            <nav class="nav-drawer-links" aria-label="Drawer Links">
                <a href="index.html" class="nav-drawer-link">
                    <span class="drawer-link-num">01</span>
                    <span class="drawer-link-title">Home</span>
                    <span class="drawer-link-arrow">&rarr;</span>
                </a>
                <a href="catalog.html" class="nav-drawer-link">
                    <span class="drawer-link-num">02</span>
                    <span class="drawer-link-title">Look Book Catalog</span>
                    <span class="drawer-link-arrow">&rarr;</span>
                </a>
                <a href="pair-your-look.html" class="nav-drawer-link">
                    <span class="drawer-link-num">03</span>
                    <span class="drawer-link-title">Pair Your Look / Partner Shoes</span>
                    <span class="drawer-link-arrow">&rarr;</span>
                </a>
                <a href="showcase.html" class="nav-drawer-link">
                    <span class="drawer-link-num">04</span>
                    <span class="drawer-link-title">AI Dressing Studio &#10022;</span>
                    <span class="drawer-link-arrow">&rarr;</span>
                </a>
                <a href="index.html#community" class="nav-drawer-link">
                    <span class="drawer-link-num">05</span>
                    <span class="drawer-link-title">Styled By You (UGC Gallery)</span>
                    <span class="drawer-link-arrow">&rarr;</span>
                </a>
                <a href="catalog.html#community-reviews" class="nav-drawer-link">
                    <span class="drawer-link-num">06</span>
                    <span class="drawer-link-title">Reviews / Feedback</span>
                    <span class="drawer-link-arrow">&rarr;</span>
                </a>
                <a href="about.html" class="nav-drawer-link">
                    <span class="drawer-link-num">07</span>
                    <span class="drawer-link-title">About Us</span>
                    <span class="drawer-link-arrow">&rarr;</span>
                </a>
                <a href="about.html#contact" class="nav-drawer-link">
                    <span class="drawer-link-num">08</span>
                    <span class="drawer-link-title">Contact / Support</span>
                    <span class="drawer-link-arrow">&rarr;</span>
                </a>
            </nav>

            <div class="nav-drawer-section-label" style="margin-top: 1.5rem;">Curated Departments</div>
            <div class="nav-drawer-sublinks">
                <a href="torso-collection.html">Tops & Graphic Tees</a>
                <a href="legs-collection.html">Denim & Baggy Pants</a>
                <a href="headwear-collection.html">Headwear & Caps</a>
                <a href="footwear-collection.html">Footwear & Sneakers</a>
                <a href="cart.html">Shopping Bag</a>
            </div>
        </div>

        <div class="nav-drawer-footer">
            <div class="drawer-atelier-info">
                <p><strong>TAVROO Atelier HQ &middot; Bangalore</strong></p>
                <p>Direct Concierge: <a href="tel:+918049008287">+91 80 4900 8287</a></p>
                <p>Cash on Delivery across all Indian Metros</p>
            </div>
            <a href="catalog.html" class="btn-primary drawer-cta-btn">Explore Full Collection &rarr;</a>
        </div>
    </aside>
    `;

    function initNavDrawer() {
        // 1. Ensure drawer elements exist in DOM
        let drawer = document.getElementById('globalNavDrawer');
        let backdrop = document.getElementById('navDrawerBackdrop');

        if (!drawer || !backdrop) {
            const container = document.createElement('div');
            container.innerHTML = DRAWER_HTML;
            while (container.firstChild) {
                document.body.appendChild(container.firstChild);
            }
            drawer = document.getElementById('globalNavDrawer');
            backdrop = document.getElementById('navDrawerBackdrop');
        }

        // 2. Ensure menu toggle buttons exist in the navbar if not present
        const nav = document.querySelector('.glass-nav');
        if (nav && !document.querySelector('.nav-menu-btn')) {
            const menuBtn = document.createElement('button');
            menuBtn.type = 'button';
            menuBtn.className = 'nav-menu-btn';
            menuBtn.id = 'navMenuBtn';
            menuBtn.setAttribute('aria-label', 'Open Navigation Menu');
            menuBtn.setAttribute('aria-expanded', 'false');
            menuBtn.setAttribute('aria-controls', 'globalNavDrawer');
            menuBtn.innerHTML = `
                <span class="nav-menu-bars">
                    <span></span>
                    <span></span>
                    <span></span>
                </span>
                <span class="nav-menu-label">Menu</span>
            `;

            const rightContainer = nav.querySelector('.nav-actions-wrap') || nav.querySelector('.nav-right-container');
            if (rightContainer) {
                rightContainer.appendChild(menuBtn);
            } else {
                nav.appendChild(menuBtn);
            }
        }

        const closeBtn = document.getElementById('navDrawerCloseBtn');
        const menuButtons = document.querySelectorAll('.nav-menu-btn, #navMenuBtn, .mobile-menu-btn, #mobileMenuBtn');

        function openDrawer() {
            if (!drawer) return;
            drawer.classList.add('open');
            if (backdrop) backdrop.classList.add('open');
            drawer.setAttribute('aria-hidden', 'false');
            if (backdrop) backdrop.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            menuButtons.forEach(btn => {
                btn.classList.add('active');
                btn.setAttribute('aria-expanded', 'true');
            });
        }

        function closeDrawer() {
            if (!drawer) return;
            drawer.classList.remove('open');
            if (backdrop) backdrop.classList.remove('open');
            drawer.setAttribute('aria-hidden', 'true');
            if (backdrop) backdrop.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            menuButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-expanded', 'false');
            });
        }

        menuButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (drawer.classList.contains('open')) {
                    closeDrawer();
                } else {
                    openDrawer();
                }
            });
        });

        if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
        if (backdrop) backdrop.addEventListener('click', closeDrawer);

        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && drawer && drawer.classList.contains('open')) {
                closeDrawer();
            }
        });

        // Close when clicking internal links, handling same-page anchor jumps
        if (drawer) {
            drawer.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', (e) => {
                    const href = link.getAttribute('href');
                    if (!href) return;

                    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

                    if (href.startsWith('#')) {
                        e.preventDefault();
                        closeDrawer();
                        const targetEl = document.querySelector(href);
                        if (targetEl) {
                            targetEl.scrollIntoView({ behavior: 'smooth' });
                        }
                    } else if (href.includes('#')) {
                        const parts = href.split('#');
                        const targetPage = parts[0];
                        const targetHash = parts[1];

                        if (targetPage === currentPage || (currentPage === '' && targetPage === 'index.html')) {
                            e.preventDefault();
                            closeDrawer();
                            const targetEl = document.getElementById(targetHash);
                            if (targetEl) {
                                targetEl.scrollIntoView({ behavior: 'smooth' });
                            }
                        } else {
                            closeDrawer();
                        }
                    } else {
                        closeDrawer();
                    }
                });
            });

            // Mark active page in drawer based on current URL
            const currentPath = window.location.pathname.split('/').pop() || 'index.html';
            drawer.querySelectorAll('.nav-drawer-link').forEach(link => {
                const linkHref = link.getAttribute('href');
                if (linkHref === currentPath) {
                    link.classList.add('active');
                }
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNavDrawer);
    } else {
        initNavDrawer();
    }
})();
