/**
 * ===================================================================
 * SURYA SUPER SPECIALITY HOSPITAL - CORE JAVASCRIPT
 * ===================================================================
 * A production-grade script handling:
 * 1. Smart Glass Header (Scroll Detection)
 * 2. Dark/Light Theme Engine with Persistence
 * 3. Off-Canvas Mobile Navigation
 * 4. Precision Smooth Scrolling (Compensates for fixed header)
 * 5. "Apple-style" Reveal Animations (Expanded for Blog/Wiki)
 * 6. Desktop "Drag-to-Scroll" for Doctor Cards
 * ===================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // --- CONFIGURATION ---
    const CONFIG = {
        scrollThreshold: 20,    // px to scroll before header changes
        headerOffset: 90,       // px offset for smooth scrolling
        animThreshold: 0.15,    // Intersection Observer threshold
        dragSpeed: 2            // Multiplier for drag scrolling
    };

    // --- DOM ELEMENTS ---
    const DOM = {
        html: document.documentElement,
        body: document.body,
        header: document.querySelector('.glass-header'),
        mobileToggle: document.querySelector('.mobile-toggle'),
        mobileClose: document.querySelector('.mobile-close'),
        mobileMenu: document.querySelector('.mobile-menu'),
        overlay: document.querySelector('.mobile-menu-overlay'),
        themeBtn: document.querySelector('#theme-toggle'),
        themeIconLight: document.querySelector('.theme-icon-light'),
        themeIconDark: document.querySelector('.theme-icon-dark'),
        scrollContainer: document.querySelector('.doctor-scroll-snap'),
        scrollIndicator: document.querySelector('.scroll-down-indicator'),
        // Expanded selectors to include Blog, Authors, and Article elements
        reveals: document.querySelectorAll(
            '.hero-content, .image-card-glass, .stat-item, .bento-card, .doctor-profile-card, ' + 
            '.section-heading, .blog-card, .article-content, .author-card, .myth-fact-container'
        )
    };

    /* ===================================================================
       1. THEME ENGINE (Dark / Light Mode)
       =================================================================== */
    const initTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        const systemPref = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        const currentTheme = savedTheme || systemPref;
        applyTheme(currentTheme);
    };

    const applyTheme = (theme) => {
        DOM.html.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        updateThemeIcons(theme);
    };

    const updateThemeIcons = (theme) => {
        if (!DOM.themeIconDark || !DOM.themeIconLight) return;
        
        if (theme === 'dark') {
            DOM.themeIconLight.style.display = 'none';
            DOM.themeIconDark.style.display = 'block';
        } else {
            DOM.themeIconLight.style.display = 'block';
            DOM.themeIconDark.style.display = 'none';
        }
    };

    if (DOM.themeBtn) {
        DOM.themeBtn.addEventListener('click', () => {
            const current = DOM.html.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            
            // Animation for button
            DOM.themeBtn.style.transform = 'rotate(180deg)';
            setTimeout(() => DOM.themeBtn.style.transform = 'rotate(0deg)', 300);
            
            applyTheme(next);
        });
    }

    /* ===================================================================
       2. PRECISION SMOOTH SCROLL
       =================================================================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - CONFIG.headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });

                if (DOM.mobileMenu && DOM.mobileMenu.classList.contains('active')) {
                    toggleMenu(true);
                }
            }
        });
    });

    /* ===================================================================
       3. NAVIGATION (Mobile Off-Canvas)
       =================================================================== */
    const toggleMenu = (forceClose = false) => {
        if (!DOM.mobileMenu) return;
        
        const isOpen = DOM.mobileMenu.classList.contains('active');
        const shouldOpen = forceClose ? false : !isOpen;

        if (shouldOpen) {
            DOM.mobileMenu.classList.add('active');
            DOM.overlay.classList.add('active');
            DOM.body.style.overflow = 'hidden';
            DOM.mobileToggle.setAttribute('aria-expanded', 'true');
        } else {
            DOM.mobileMenu.classList.remove('active');
            DOM.overlay.classList.remove('active');
            DOM.body.style.overflow = '';
            DOM.mobileToggle.setAttribute('aria-expanded', 'false');
        }
    };

    if (DOM.mobileToggle) DOM.mobileToggle.addEventListener('click', () => toggleMenu());
    if (DOM.mobileClose) DOM.mobileClose.addEventListener('click', () => toggleMenu(true));
    if (DOM.overlay) DOM.overlay.addEventListener('click', () => toggleMenu(true));

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && DOM.mobileMenu && DOM.mobileMenu.classList.contains('active')) {
            toggleMenu(true);
        }
    });

    /* ===================================================================
       4. SCROLL EFFECTS
       =================================================================== */
    const handleScroll = () => {
        const scrollY = window.scrollY;
        
        // Glass Header Transition
        if (DOM.header) {
            if (scrollY > CONFIG.scrollThreshold) {
                DOM.header.classList.add('scrolled');
            } else {
                DOM.header.classList.remove('scrolled');
            }
        }

        // Hide "Scroll Down" Indicator
        if (DOM.scrollIndicator) {
            if (scrollY > 100) {
                DOM.scrollIndicator.style.opacity = '0';
                DOM.scrollIndicator.style.transition = 'opacity 0.5s ease';
            } else {
                DOM.scrollIndicator.style.opacity = '0.8';
            }
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    /* ===================================================================
       5. REVEAL ANIMATIONS
       =================================================================== */
    const style = document.createElement('style');
    style.innerHTML = `
        .reveal-hidden { opacity: 0; transform: translateY(30px); transition: all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1); will-change: opacity, transform; }
        .reveal-visible { opacity: 1; transform: translateY(0); }
    `;
    document.head.appendChild(style);

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                entry.target.classList.remove('reveal-hidden');
                observer.unobserve(entry.target); 
            }
        });
    }, { rootMargin: '0px 0px -50px 0px', threshold: CONFIG.animThreshold });

    DOM.reveals.forEach(el => {
        el.classList.add('reveal-hidden');
        revealObserver.observe(el);
    });

    /* ===================================================================
       6. DRAG-TO-SCROLL (Doctors)
       =================================================================== */
    if (DOM.scrollContainer) {
        let isDown = false;
        let startX;
        let scrollLeft;

        DOM.scrollContainer.addEventListener('mousedown', (e) => {
            isDown = true;
            DOM.scrollContainer.style.cursor = 'grabbing';
            startX = e.pageX - DOM.scrollContainer.offsetLeft;
            scrollLeft = DOM.scrollContainer.scrollLeft;
            e.preventDefault();
        });

        const stopDrag = () => {
            isDown = false;
            DOM.scrollContainer.style.cursor = 'grab';
        };

        DOM.scrollContainer.addEventListener('mouseleave', stopDrag);
        DOM.scrollContainer.addEventListener('mouseup', stopDrag);

        DOM.scrollContainer.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - DOM.scrollContainer.offsetLeft;
            const walk = (x - startX) * CONFIG.dragSpeed;
            DOM.scrollContainer.scrollLeft = scrollLeft - walk;
        });
        
        DOM.scrollContainer.style.cursor = 'grab';
    }

    /* ===================================================================
       7. ACTIVE LINK HIGHLIGHTER (Safe for Subpages)
       =================================================================== */
    const highlightNav = () => {
        // Only run on larger screens and if we have scroll-spy sections
        if (window.innerWidth <= 768) return;
        
        const sections = document.querySelectorAll('section[id]');
        // If no ID sections exist (e.g. on blog page), exit to preserve static active state
        if (sections.length === 0) return;

        const navLinks = document.querySelectorAll('.nav-link');
        let currentId = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= (sectionTop - (window.innerHeight / 3))) {
                currentId = section.getAttribute('id');
            }
        });

        if (currentId) {
            navLinks.forEach(link => {
                const href = link.getAttribute('href');
                // Only modify hash links that match the current page structure
                if (href.startsWith('#')) {
                    link.classList.remove('active');
                    if (href === '#' + currentId) {
                        link.classList.add('active');
                    }
                }
            });
        }
    };
    window.addEventListener('scroll', highlightNav, { passive: true });

    /* ===================================================================
       8. INITIALIZATION
       =================================================================== */
    const yearEl = document.querySelector('#current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    initTheme();
    handleScroll();
    
    console.log('Surya Hospital Site: System Active');
});