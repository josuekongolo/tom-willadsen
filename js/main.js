/**
 * Tom Willadsen Mur og Flis, Snekkeri
 * Main JavaScript File
 */

(function() {
    'use strict';

    // ==========================================================================
    // DOM Elements
    // ==========================================================================
    const header = document.querySelector('.header');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const scrollTopBtn = document.querySelector('.scroll-top');
    const contactForm = document.getElementById('contact-form');

    // ==========================================================================
    // Header Scroll Effect
    // ==========================================================================
    function handleHeaderScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    // ==========================================================================
    // Mobile Menu Toggle
    // ==========================================================================
    function toggleMobileMenu() {
        mobileMenuToggle.classList.toggle('active');
        mobileNav.classList.toggle('active');
        document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    }

    function closeMobileMenu() {
        mobileMenuToggle.classList.remove('active');
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
    }

    // ==========================================================================
    // Scroll to Top
    // ==========================================================================
    function handleScrollTopVisibility() {
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    }

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // ==========================================================================
    // Smooth Scroll for Anchor Links
    // ==========================================================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    const headerHeight = header.offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Close mobile menu if open
                    closeMobileMenu();
                }
            });
        });
    }

    // ==========================================================================
    // Contact Form Handling
    // ==========================================================================
    async function handleFormSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;

        // Get form data
        const formData = {
            name: form.querySelector('#name').value.trim(),
            email: form.querySelector('#email').value.trim(),
            phone: form.querySelector('#phone').value.trim(),
            address: form.querySelector('#address')?.value.trim() || '',
            projectType: form.querySelector('#projectType').value,
            description: form.querySelector('#description').value.trim(),
            wantSiteVisit: form.querySelector('#siteVisit')?.checked || false
        };

        // Basic validation
        if (!formData.name || !formData.email || !formData.phone || !formData.description) {
            showFormMessage('error', 'Vennligst fyll ut alle påkrevde felt.');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            showFormMessage('error', 'Vennligst skriv inn en gyldig e-postadresse.');
            return;
        }

        // Phone validation (Norwegian format)
        const phoneRegex = /^(\+47)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{3}$|^\d{8}$/;
        const cleanPhone = formData.phone.replace(/[\s-]/g, '');
        if (!phoneRegex.test(formData.phone) && cleanPhone.length < 8) {
            showFormMessage('error', 'Vennligst skriv inn et gyldig telefonnummer.');
            return;
        }

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <svg class="spinner" width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <style>.spinner{animation:rotate 1s linear infinite}@keyframes rotate{100%{transform:rotate(360deg)}}</style>
                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="50 50"/>
            </svg>
            Sender...
        `;

        try {
            // In production, this would send to your backend/Resend API
            // For now, we'll simulate the submission
            await simulateFormSubmission(formData);

            // Show success message
            showFormMessage('success', 'Takk for din henvendelse! Jeg vil kontakte deg så snart som mulig, vanligvis innen én arbeidsdag.');

            // Reset form
            form.reset();

        } catch (error) {
            console.error('Form submission error:', error);
            showFormMessage('error', 'Beklager, noe gikk galt. Vennligst prøv igjen eller ring meg direkte.');
        } finally {
            // Reset button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    }

    // Simulate form submission (replace with actual API call in production)
    function simulateFormSubmission(data) {
        return new Promise((resolve) => {
            console.log('Form data submitted:', data);
            setTimeout(resolve, 1500);
        });
    }

    // Show form message (success or error)
    function showFormMessage(type, message) {
        // Remove any existing message
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `form-message form-message--${type}`;

        const icon = type === 'success'
            ? '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>'
            : '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>';

        messageEl.innerHTML = `${icon}<p>${message}</p>`;

        // Insert at top of form
        const form = document.getElementById('contact-form');
        if (form) {
            form.insertBefore(messageEl, form.firstChild);

            // Scroll to message
            messageEl.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Auto-remove success message after 10 seconds
            if (type === 'success') {
                setTimeout(() => {
                    messageEl.remove();
                }, 10000);
            }
        }
    }

    // ==========================================================================
    // Intersection Observer for Animations
    // ==========================================================================
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.service-card, .benefit-item, .value-card, .service-block');

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('fade-in');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            animatedElements.forEach(el => {
                el.style.opacity = '0';
                observer.observe(el);
            });
        } else {
            // Fallback for browsers without IntersectionObserver
            animatedElements.forEach(el => {
                el.classList.add('fade-in');
            });
        }
    }

    // ==========================================================================
    // Active Navigation Link
    // ==========================================================================
    function setActiveNavLink() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav__link, .mobile-nav__link');

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (currentPath.endsWith(href) ||
                (currentPath === '/' && href === 'index.html') ||
                (currentPath.endsWith('/') && href === 'index.html')) {
                link.classList.add('active');
            }
        });
    }

    // ==========================================================================
    // Lazy Loading Images
    // ==========================================================================
    function initLazyLoading() {
        const lazyImages = document.querySelectorAll('img[data-src]');

        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                });
            }, {
                rootMargin: '100px 0px'
            });

            lazyImages.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback
            lazyImages.forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        }
    }

    // ==========================================================================
    // Click to Call Enhancement (Mobile)
    // ==========================================================================
    function initClickToCall() {
        const phoneLinks = document.querySelectorAll('a[href^="tel:"]');

        phoneLinks.forEach(link => {
            link.addEventListener('click', function() {
                // Analytics tracking could go here
                console.log('Phone call initiated');
            });
        });
    }

    // ==========================================================================
    // Form Field Focus Effects
    // ==========================================================================
    function initFormEffects() {
        const formControls = document.querySelectorAll('.form-control');

        formControls.forEach(control => {
            control.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });

            control.addEventListener('blur', function() {
                this.parentElement.classList.remove('focused');
                if (this.value.trim()) {
                    this.parentElement.classList.add('has-value');
                } else {
                    this.parentElement.classList.remove('has-value');
                }
            });
        });
    }

    // ==========================================================================
    // Initialize Everything
    // ==========================================================================
    function init() {
        // Header scroll effect
        if (header) {
            window.addEventListener('scroll', handleHeaderScroll, { passive: true });
            handleHeaderScroll(); // Check initial state
        }

        // Mobile menu
        if (mobileMenuToggle && mobileNav) {
            mobileMenuToggle.addEventListener('click', toggleMobileMenu);

            // Close menu when clicking on links
            const mobileLinks = mobileNav.querySelectorAll('a');
            mobileLinks.forEach(link => {
                link.addEventListener('click', closeMobileMenu);
            });

            // Close menu on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
                    closeMobileMenu();
                }
            });
        }

        // Scroll to top button
        if (scrollTopBtn) {
            window.addEventListener('scroll', handleScrollTopVisibility, { passive: true });
            scrollTopBtn.addEventListener('click', scrollToTop);
            handleScrollTopVisibility(); // Check initial state
        }

        // Smooth scroll
        initSmoothScroll();

        // Contact form
        if (contactForm) {
            contactForm.addEventListener('submit', handleFormSubmit);
            initFormEffects();
        }

        // Animations
        initScrollAnimations();

        // Active nav link
        setActiveNavLink();

        // Lazy loading
        initLazyLoading();

        // Click to call
        initClickToCall();

        // Log that the site is ready
        console.log('Tom Willadsen website initialized');
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
