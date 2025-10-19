/**
 * ===================================================================
 * JAVASCRIPT FOR SURYA HEALTH - MODERN HOSPITAL WEBSITE
 * ===================================================================
 * This script handles:
 * 1. Mobile Navigation Toggle, Class Application, and Scroll Lock
 * 2. Sticky Header Appearance on Scroll
 * 3. Smooth Scrolling for all Anchor Links
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

    // Note: The back-to-top button is not in the current HTML,
    // but this selector is ready for if one is added in the future.
    const backToTopButton = document.querySelector('.back-to-top');

    // --- Functions ---

    /**
     * Toggles the mobile navigation menu open and closed.
     * Applies the 'is-open' class to the navigation element (mobileNav)
     * and the 'nav-open' class to the body.
     */
    const toggleMobileNav = () => {
        const isCurrentlyOpen = navToggle.getAttribute('aria-expanded') === 'true';
        const newState = !isCurrentlyOpen;

        navToggle.setAttribute('aria-expanded', newState);
        document.body.classList.toggle('nav-open', newState);

        if (mobileNav) {
            mobileNav.classList.toggle('is-open', newState);
        }
    };

    /**
     * Closes the mobile navigation programmatically.
     * Useful for cleanup functions like the smooth scrolling handler or escape key.
     */
    const closeMobileNav = () => {
        if (navToggle.getAttribute('aria-expanded') === 'true') {
            navToggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('nav-open');
            if (mobileNav) {
                mobileNav.classList.remove('is-open');
            }
        }
    };

    /**
     * Optimized handler for all scroll-related events.
     * Adds a class to the header for styling (scrolling effect).
     */
    const handleScroll = () => {
        const scrollPosition = window.scrollY;
        const scrollThreshold = 100; // Pixels to scroll before changing header style

        if (header) {
            header.classList.toggle('scrolled', scrollPosition > scrollThreshold);
        }

        if (backToTopButton) {
            backToTopButton.classList.toggle('visible', scrollPosition > 300);
        }
    };

    /**
     * Sets up smooth scrolling for all on-page anchor links.
     * Closes the mobile navigation immediately after a link is clicked.
     */
    const setupSmoothScrolling = () => {
        allAnchorLinks.forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');

                // Ignore links that don't start with '#' or are just '#'
                if (!targetId || targetId.length <= 1 || !targetId.startsWith('#')) return;

                e.preventDefault();
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    // Close the mobile navigation immediately on click
                    closeMobileNav();

                    // Delay the scroll slightly to allow the menu to animate out
                    setTimeout(() => {
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }, 100); // Small delay for a smoother visual effect
                }
            });
        });
    };

    /**
     * Adds an accessibility feature to close the mobile navigation
     * if the user presses the 'Escape' key.
     * @param {KeyboardEvent} e - The keyboard event object.
     */
    const handleEscapeKey = (e) => {
        if (e.key === 'Escape') {
            closeMobileNav();
        }
    };


    // --- Event Listeners ---

    // Toggle mobile navigation on button click
    if (navToggle) {
        navToggle.addEventListener('click', toggleMobileNav);
    }

    // Handle scroll events efficiently (passive: true improves performance)
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Handle keyboard events for accessibility
    document.addEventListener('keydown', handleEscapeKey);

    // --- Initializations ---
    setupSmoothScrolling();

    // Run scroll handler once on load to correctly set header state
    // in case the page is reloaded at a scrolled position.
    handleScroll();

    console.log("Surya Health JS successfully initialized.");
});