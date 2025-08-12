// Portfolio Website JavaScript - Fixed Version
class Portfolio {
    constructor() {
        this.init();
    }

    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeComponents();
            });
        } else {
            this.initializeComponents();
        }
    }

    initializeComponents() {
        this.setupThemeToggle();
        this.setupMobileMenu();
        this.setupSmoothScrolling();
        this.setupScrollAnimations();
        this.setupFormValidation();
        this.setupBackToTop();
        this.setupActiveNavigation();
        this.loadTheme();
        this.animateOnLoad();
    }

    // Theme Toggle Functionality
    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;
        
        themeToggle.addEventListener('click', (e) => {
            e.preventDefault();
            const html = document.documentElement;
            const currentTheme = html.getAttribute('data-color-scheme') || 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            html.setAttribute('data-color-scheme', newTheme);
            this.updateThemeIcon(newTheme);
            this.saveTheme(newTheme);
        });
    }

    updateThemeIcon(theme) {
        const themeIcon = document.querySelector('.theme-toggle__icon');
        if (themeIcon) {
            themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
    }

    saveTheme(theme) {
        try {
            localStorage.setItem('portfolio-theme', theme);
        } catch (e) {
            console.log('Theme preference could not be saved');
        }
    }

    loadTheme() {
        let savedTheme = 'light';
        
        try {
            savedTheme = localStorage.getItem('portfolio-theme') || 'light';
        } catch (e) {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                savedTheme = 'dark';
            }
        }
        
        document.documentElement.setAttribute('data-color-scheme', savedTheme);
        this.updateThemeIcon(savedTheme);
    }

    // Mobile Menu Functionality
    setupMobileMenu() {
        const hamburger = document.getElementById('navHamburger');
        const menu = document.getElementById('navMenu');
        
        if (!hamburger || !menu) return;
        
        hamburger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            hamburger.classList.toggle('active');
            menu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav__link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                menu.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !menu.contains(e.target)) {
                hamburger.classList.remove('active');
                menu.classList.remove('active');
            }
        });
    }

    // Smooth Scrolling Navigation - Fixed
    setupSmoothScrolling() {
        const smoothScroll = (targetId) => {
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        };

        // Navigation links
        const navLinks = document.querySelectorAll('.nav__link[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                if (targetId && targetId !== '#') {
                    smoothScroll(targetId);
                }
            });
        });

        // Hero scroll indicator
        const scrollIndicator = document.querySelector('.scroll-indicator[href^="#"]');
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = scrollIndicator.getAttribute('href');
                if (targetId && targetId !== '#') {
                    smoothScroll(targetId);
                }
            });
        }

        // Hero action buttons
        const heroButtons = document.querySelectorAll('.hero__actions a[href^="#"]');
        heroButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = button.getAttribute('href');
                if (targetId && targetId !== '#') {
                    smoothScroll(targetId);
                }
            });
        });
    }

    // Scroll Animations using Intersection Observer
    setupScrollAnimations() {
        if (!('IntersectionObserver' in window)) return;

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Observe all sections
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            observer.observe(section);
        });
    }

    // Form Validation and Submission - Fixed
    setupFormValidation() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Clear previous errors
            this.clearAllFormErrors();
            
            if (this.validateForm()) {
                this.submitForm();
            }
        });

        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });
    }

    validateForm() {
        const form = document.getElementById('contactForm');
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        const errorElement = document.getElementById(`${fieldName}Error`);
        
        if (!errorElement) return true;
        
        let isValid = true;
        let errorMessage = '';

        // Check if field is empty
        if (!value) {
            errorMessage = `${this.capitalize(fieldName)} is required`;
            isValid = false;
        } else {
            // Specific validation rules
            switch (fieldName) {
                case 'email':
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(value)) {
                        errorMessage = 'Please enter a valid email address';
                        isValid = false;
                    }
                    break;
                case 'name':
                    if (value.length < 2) {
                        errorMessage = 'Name must be at least 2 characters long';
                        isValid = false;
                    }
                    break;
                case 'subject':
                    if (value.length < 3) {
                        errorMessage = 'Subject must be at least 3 characters long';
                        isValid = false;
                    }
                    break;
                case 'message':
                    if (value.length < 10) {
                        errorMessage = 'Message must be at least 10 characters long';
                        isValid = false;
                    }
                    break;
            }
        }

        // Show/hide error message
        if (!isValid) {
            errorElement.textContent = errorMessage;
            errorElement.classList.add('visible');
            field.classList.add('error');
        } else {
            errorElement.classList.remove('visible');
            field.classList.remove('error');
        }

        return isValid;
    }

    clearFieldError(field) {
        const fieldName = field.name;
        const errorElement = document.getElementById(`${fieldName}Error`);
        if (errorElement) {
            errorElement.classList.remove('visible');
        }
        field.classList.remove('error');
    }

    clearAllFormErrors() {
        const errorElements = document.querySelectorAll('.form-error');
        errorElements.forEach(error => {
            error.classList.remove('visible');
        });
        
        const inputs = document.querySelectorAll('.form-control');
        inputs.forEach(input => {
            input.classList.remove('error');
        });
    }

    async submitForm() {
        const form = document.getElementById('contactForm');
        const formSuccess = document.getElementById('formSuccess');
        const submitButton = form.querySelector('button[type="submit"]');
        
        // Show loading state
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;

        try {
            // Simulate form submission
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Show success message
            formSuccess.classList.remove('hidden');
            formSuccess.classList.add('visible');
            form.reset();
            
            // Hide success message after 5 seconds
            setTimeout(() => {
                formSuccess.classList.add('hidden');
                formSuccess.classList.remove('visible');
            }, 5000);
            
        } catch (error) {
            console.error('Form submission error:', error);
            alert('There was an error sending your message. Please try again.');
        } finally {
            // Reset button state
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    }

    // Back to Top Button
    setupBackToTop() {
        const backToTopButton = document.getElementById('backToTop');
        if (!backToTopButton) return;

        // Show/hide button based on scroll position
        const toggleBackToTop = () => {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        };

        window.addEventListener('scroll', toggleBackToTop);
        toggleBackToTop(); // Check initial state

        // Scroll to top functionality
        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Active Navigation Link Highlighting
    setupActiveNavigation() {
        if (!('IntersectionObserver' in window)) return;

        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav__link');

        const observerOptions = {
            threshold: 0.3,
            rootMargin: '-80px 0px -80px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    
                    // Remove active class from all links
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                    });
                    
                    // Add active class to current section link
                    const activeLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);
                    if (activeLink) {
                        activeLink.classList.add('active');
                    }
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            observer.observe(section);
        });
    }

    // Initial page load animations
    animateOnLoad() {
        // Add initial load animation to hero elements
        const heroElements = [
            '.hero__title',
            '.hero__subtitle', 
            '.hero__tagline',
            '.hero__actions',
            '.hero__avatar'
        ];

        heroElements.forEach((selector, index) => {
            const element = document.querySelector(selector);
            if (element) {
                setTimeout(() => {
                    element.style.opacity = '0';
                    element.style.transform = 'translateY(20px)';
                    element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
                    
                    requestAnimationFrame(() => {
                        element.style.opacity = '1';
                        element.style.transform = 'translateY(0)';
                    });
                }, index * 150);
            }
        });
    }

    // Utility function
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

// Initialize the portfolio
let portfolio;

// Ensure proper initialization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        portfolio = new Portfolio();
    });
} else {
    portfolio = new Portfolio();
}

// Handle page load
window.addEventListener('load', () => {
    document.body.classList.remove('loading');
    
    // Ensure all sections are visible initially for animation
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.opacity = '1';
        section.style.transform = 'translateY(0)';
    });
});

// Handle keyboard navigation
document.addEventListener('keydown', (e) => {
    // ESC key closes mobile menu
    if (e.key === 'Escape') {
        const hamburger = document.getElementById('navHamburger');
        const menu = document.getElementById('navMenu');
        
        if (hamburger && menu && hamburger.classList.contains('active')) {
            hamburger.classList.remove('active');
            menu.classList.remove('active');
        }
    }
});

// Smooth scroll polyfill for older browsers
if (!('scrollBehavior' in document.documentElement.style)) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/gh/iamdustan/smoothscroll@master/src/smoothscroll.js';
    document.head.appendChild(script);
}

// Add loading protection
document.body.classList.add('loading');

// Add CSS for better loading and error states
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    .loading * {
        transition-duration: 0s !important;
        animation-duration: 0s !important;
    }
    
    .form-control.error {
        border-color: var(--color-error);
    }
    
    .form-error {
        display: none;
        color: var(--color-error);
        font-size: var(--font-size-sm);
        margin-top: var(--space-4);
    }
    
    .form-error.visible {
        display: block;
    }
    
    .form-success {
        background: rgba(var(--color-success-rgb), 0.1);
        border: 1px solid rgba(var(--color-success-rgb), 0.3);
        color: var(--color-success);
        padding: var(--space-16);
        border-radius: var(--radius-base);
        margin-top: var(--space-16);
        text-align: center;
        display: none;
    }
    
    .form-success.visible {
        display: block;
    }
`;
document.head.appendChild(additionalStyles);