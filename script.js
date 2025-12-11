/**
 * ===================================================================
 * SURYA SUPER SPECIALITY HOSPITAL - CORE JAVASCRIPT
 * ===================================================================
 * A portfolio-quality script handling:
 * 1. Smart Glass Header (Scroll Detection)
 * 2. Dark/Light Theme Engine with Persistence
 * 3. Off-Canvas Mobile Navigation
 * 4. Language Toggle (English <-> Hindi Subdirectory)
 * 5. "Apple-style" Reveal Animations
 * 6. Desktop "Drag-to-Scroll" for Horizontal Lists
 * ===================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // --- CONFIGURATION ---
    const CONFIG = {
        scrollThreshold: 20,    // px to scroll before header changes
        animThreshold: 0.15,    // Intersection Observer threshold
        dragSpeed: 2            // Multiplier for desktop drag scrolling
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
        langBtn: document.querySelector('#lang-toggle'),
        langText: document.querySelector('.lang-code'),
        scrollContainer: document.querySelector('.doctor-scroll-snap'),
        reveals: document.querySelectorAll('.hero-content, .image-card-glass, .stat-item, .bento-card, .doctor-profile-card, .section-heading, .blog-content')
    };

    /* ===================================================================
       1. THEME ENGINE (Dark / Light Mode)
       =================================================================== */
    const initTheme = () => {
        // Check LocalStorage or System Preference
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
            
            // Subtle rotation animation for the button
            DOM.themeBtn.style.transform = 'rotate(180deg)';
            DOM.themeBtn.style.transition = 'transform 0.3s ease';
            setTimeout(() => DOM.themeBtn.style.transform = 'rotate(0deg)', 300);
            
            applyTheme(next);
        });
    }

    /* ===================================================================
       2. LANGUAGE TOGGLE (Folder Redirection Logic)
       =================================================================== */
    if (DOM.langBtn && DOM.langText) {
        // Detect if we are in the Hindi folder
        const currentPath = window.location.pathname;
        const isHindi = currentPath.includes('/hi/');

        // Set Button Text: If in Hindi, button says "EN" (Switch to English)
        DOM.langText.textContent = isHindi ? 'EN' : 'HI';

        DOM.langBtn.addEventListener('click', () => {
            if (isHindi) {
                // SWITCH TO ENGLISH: Remove '/hi/' from path
                // Example: /hi/doctors.html -> /doctors.html
                const newPath = currentPath.replace('/hi', '');
                window.location.href = newPath || '/'; 
            } else {
                // SWITCH TO HINDI: Add '/hi' to path
                // Handle root path edge case (e.g., suryahospital.com/)
                let pathSegment = currentPath;
                if (pathSegment === '/' || pathSegment === '') {
                    pathSegment = '/index.html';
                }
                // Check if path starts with slash to prevent double slash errors
                if (!pathSegment.startsWith('/')) pathSegment = '/' + pathSegment;
                
                window.location.href = '/hi' + pathSegment;
            }
        });
    }

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
            DOM.body.style.overflow = 'hidden'; // Lock scroll
            DOM.mobileToggle.setAttribute('aria-expanded', 'true');
        } else {
            DOM.mobileMenu.classList.remove('active');
            DOM.overlay.classList.remove('active');
            DOM.body.style.overflow = ''; // Unlock scroll
            DOM.mobileToggle.setAttribute('aria-expanded', 'false');
        }
    };

    if (DOM.mobileToggle) DOM.mobileToggle.addEventListener('click', () => toggleMenu());
    if (DOM.mobileClose) DOM.mobileClose.addEventListener('click', () => toggleMenu(true));
    if (DOM.overlay) DOM.overlay.addEventListener('click', () => toggleMenu(true));

    // Close menu when clicking a link inside it
    document.querySelectorAll('.mobile-links a').forEach(link => {
        link.addEventListener('click', () => toggleMenu(true));
    });

    // Escape key closes menu
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && DOM.mobileMenu && DOM.mobileMenu.classList.contains('active')) {
            toggleMenu(true);
        }
    });

    /* ===================================================================
       4. SCROLL EFFECTS (Glass Header)
       =================================================================== */
    const handleScroll = () => {
        const scrollY = window.scrollY;
        if (DOM.header) {
            if (scrollY > CONFIG.scrollThreshold) {
                DOM.header.classList.add('scrolled');
            } else {
                DOM.header.classList.remove('scrolled');
            }
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    /* ===================================================================
       5. REVEAL ANIMATIONS (Intersection Observer)
       =================================================================== */
    // Inject dynamic styles for animation classes
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
                observer.unobserve(entry.target); // Animate only once
            }
        });
    }, { rootMargin: '0px 0px -50px 0px', threshold: CONFIG.animThreshold });

    DOM.reveals.forEach(el => {
        el.classList.add('reveal-hidden');
        revealObserver.observe(el);
    });

    /* ===================================================================
       6. DRAG-TO-SCROLL (Desktop UX for Doctor Cards)
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
        
        // Initial cursor style
        DOM.scrollContainer.style.cursor = 'grab';
    }

    /* ===================================================================
       7. UTILITIES & INITIALIZATION
       =================================================================== */
    
    // Auto-update Footer Year
    const yearEl = document.querySelector('#current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Active Link Highlighter
    const highlightNav = () => {
        if (window.innerWidth <= 768) return; // Desktop only
        
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        let currentId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= (sectionTop - 150)) {
                currentId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(currentId) && currentId !== '') {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', highlightNav, { passive: true });

    // Initialize System
    initTheme();
    handleScroll();
    
    console.log('Surya Hospital Site: Initialized successfully.');
});