/**
 * ===================================================================
 * JAVASCRIPT FOR SURYA SUPER SPECIALTY HOSPITAL
 * ===================================================================
 * This script handles:
 * 1. Mobile Navigation Toggle, Class Application, and Scroll Lock
 * 2. Sticky Header Appearance using efficient IntersectionObserver
 * 3. Instant, Smooth Scrolling for all Anchor Links
 * 4. Accessibility Enhancements (Escape key closing)
 * ===================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // --- DOM Element Selectors ---
    const header = document.querySelector('.header');
    const navToggle = document.querySelector('.header__mobile-toggle');
    const mobileNav = document.querySelector('.header__nav');
    const allAnchorLinks = document.querySelectorAll('a[href^="#"]');

    /**
     * Toggles the mobile navigation menu open and closed.
     * Manages ARIA attributes and body class for scroll lock.
     */
    const toggleMobileNav = () => {
        const isOpened = mobileNav.classList.toggle('is-open');
        navToggle.setAttribute('aria-expanded', isOpened);
        document.body.classList.toggle('nav-open', isOpened);
    };

    /**
     * Closes the mobile navigation if it's currently open.
     */
    const closeMobileNav = () => {
        if (mobileNav.classList.contains('is-open')) {
            mobileNav.classList.remove('is-open');
            navToggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('nav-open');
        }
    };

    /**
     * Sets up an IntersectionObserver to add a 'scrolled' class to the header
     * when it is no longer intersecting with a sentinel element at the top of the page.
     * This is far more performant than a scroll event listener.
     */
    const setupStickyHeader = () => {
        if (!header) return;

        // Create a sentinel element to observe
        const sentinel = document.createElement('div');
        sentinel.style.position = 'absolute';
        sentinel.style.height = '1px';
        sentinel.style.top = '50px'; // Trigger point after scrolling 50px
        sentinel.style.zIndex = '-1';
        document.body.prepend(sentinel);

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    // When the sentinel is NOT intersecting (i.e., scrolled past it)
                    header.classList.toggle('scrolled', !entry.isIntersecting);
                });
            },
            { rootMargin: '0px', threshold: 1.0 }
        );

        observer.observe(sentinel);
    };

    /**
     * Sets up instant smooth scrolling for all on-page anchor links.
     * Closes the mobile navigation immediately after a link is clicked for a responsive feel.
     */
    const setupSmoothScrolling = () => {
        allAnchorLinks.forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (!targetId || targetId.length <= 1) return;

                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    closeMobileNav(); // Close nav instantly

                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    };

    /**
     * Closes the mobile navigation when the 'Escape' key is pressed.
     */
    const handleEscapeKey = (e) => {
        if (e.key === 'Escape') {
            closeMobileNav();
        }
    };


    // --- Event Listeners ---

    if (navToggle && mobileNav) {
        navToggle.addEventListener('click', toggleMobileNav);
    }

    document.addEventListener('keydown', handleEscapeKey);


    // --- Initializations ---

    setupStickyHeader();
    setupSmoothScrolling();
});