/**
 * TAVROO STUDIO - Customer Reviews / Testimonials Carousel
 * Handles smooth auto-scrolling, touch swiping, and arrow navigation.
 */
document.addEventListener('DOMContentLoaded', () => {
    initReviewsCarousel();
});

function initReviewsCarousel() {
    const sections = document.querySelectorAll('.customer-reviews-section');
    sections.forEach(section => {
        const track = section.querySelector('.reviews-track');
        const prevBtn = section.querySelector('.reviews-nav-btn.prev-btn');
        const nextBtn = section.querySelector('.reviews-nav-btn.next-btn');
        const dots = section.querySelectorAll('.reviews-dot');
        const cards = section.querySelectorAll('.review-card');

        if (!track || cards.length === 0) return;

        let currentIndex = 0;
        let isHovered = false;
        let autoScrollInterval = null;

        function getCardWidth() {
            const firstCard = cards[0];
            const gap = parseFloat(window.getComputedStyle(track).gap) || 24;
            return firstCard.offsetWidth + gap;
        }

        function scrollToCard(index, smooth = true) {
            const maxIndex = cards.length - 1;
            currentIndex = Math.max(0, Math.min(index, maxIndex));
            const cardWidth = getCardWidth();
            track.scrollTo({
                left: currentIndex * cardWidth,
                behavior: smooth ? 'smooth' : 'auto'
            });
            updateDots();
        }

        function updateDots() {
            const cardWidth = getCardWidth();
            if (cardWidth <= 0) return;
            const activeIdx = Math.round(track.scrollLeft / cardWidth);
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === activeIdx);
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                const cardWidth = getCardWidth();
                const activeIdx = Math.round(track.scrollLeft / cardWidth);
                scrollToCard(activeIdx - 1);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const cardWidth = getCardWidth();
                const activeIdx = Math.round(track.scrollLeft / cardWidth);
                scrollToCard(activeIdx + 1);
            });
        }

        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                scrollToCard(i);
            });
        });

        // Track scroll event to update active dot with debouncing
        let scrollTimer = null;
        track.addEventListener('scroll', () => {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(updateDots, 60);
        }, { passive: true });

        // Auto-scroll loop: smooth interval rotation
        function startAutoScroll() {
            stopAutoScroll();
            autoScrollInterval = setInterval(() => {
                if (isHovered) return;
                const cardWidth = getCardWidth();
                if (cardWidth <= 0) return;
                const activeIdx = Math.round(track.scrollLeft / cardWidth);
                const maxScroll = track.scrollWidth - track.clientWidth - 10;
                
                if (track.scrollLeft >= maxScroll || activeIdx >= cards.length - 1) {
                    scrollToCard(0);
                } else {
                    scrollToCard(activeIdx + 1);
                }
            }, 5500);
        }

        function stopAutoScroll() {
            if (autoScrollInterval) {
                clearInterval(autoScrollInterval);
                autoScrollInterval = null;
            }
        }

        // Pause auto-scroll on hover or touch interaction
        section.addEventListener('mouseenter', () => { isHovered = true; });
        section.addEventListener('mouseleave', () => { isHovered = false; });
        track.addEventListener('touchstart', () => { isHovered = true; }, { passive: true });
        track.addEventListener('touchend', () => {
            setTimeout(() => { isHovered = false; }, 2500);
        }, { passive: true });

        startAutoScroll();
    });
}
