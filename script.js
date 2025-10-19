/* ============================================
   ADVANCED PORTFOLIO JAVASCRIPT
   Optimized for performance & user experience
   ============================================ */

'use strict';

// ========== GLOBAL VARIABLES ==========
const state = {
    isMenuOpen: false,
    isDarkMode: false,
    isLoading: true,
    currentSection: 'home'
};

// ========== UTILITY FUNCTIONS ==========
const debounce = (func, wait = 10, immediate = true) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
};

const throttle = (func, limit) => {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// ========== DOM ELEMENTS ==========
const DOM = {
    hamburger: document.querySelector('.hamburger'),
    navMenu: document.querySelector('.nav-menu'),
    navLinks: document.querySelectorAll('.nav-link'),
    navbar: document.querySelector('.navbar'),
    sections: document.querySelectorAll('section'),
    skillCards: document.querySelectorAll('.skill-card'),
    projectCards: document.querySelectorAll('.project-card'),
    contactForm: document.getElementById('contactForm'),
    heroTitle: document.querySelector('.hero-title'),
    shapes: document.querySelectorAll('.shape'),
    loader: document.querySelector('.loader'),
    yearElement: document.querySelector('.current-year'),
    logo: document.querySelector('.logo')
};

// ========== LOADING SCREEN ==========
const initLoader = () => {
    window.addEventListener('load', () => {
        if (DOM.loader) {
            setTimeout(() => {
                DOM.loader.style.opacity = '0';
                setTimeout(() => {
                    DOM.loader.style.display = 'none';
                    document.body.classList.add('loaded');
                }, 500);
            }, 1000);
        }
    });
};

// ========== NAVIGATION MENU ==========
const initNavigation = () => {
    // Toggle mobile menu
    if (DOM.hamburger && DOM.navMenu) {
        DOM.hamburger.addEventListener('click', toggleMenu);
    }

    // Close menu when clicking nav links
    DOM.navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            closeMenu();
            handleSmoothScroll(e, link);
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (state.isMenuOpen && 
            !DOM.navMenu.contains(e.target) && 
            !DOM.hamburger.contains(e.target)) {
            closeMenu();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && state.isMenuOpen) {
            closeMenu();
        }
    });
};

const toggleMenu = () => {
    state.isMenuOpen = !state.isMenuOpen;
    DOM.navMenu.classList.toggle('active');
    DOM.hamburger.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = state.isMenuOpen ? 'hidden' : '';
};

const closeMenu = () => {
    state.isMenuOpen = false;
    DOM.navMenu.classList.remove('active');
    DOM.hamburger.classList.remove('active');
    document.body.style.overflow = '';
};

// ========== SMOOTH SCROLL ==========
const handleSmoothScroll = (e, element) => {
    const href = element.getAttribute('href');
    
    if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            const navbarHeight = DOM.navbar ? DOM.navbar.offsetHeight : 70;
            const targetPosition = target.offsetTop - navbarHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
};

// Initialize smooth scroll for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => handleSmoothScroll(e, anchor));
});

// ========== NAVBAR SCROLL EFFECT ==========
const handleNavbarScroll = () => {
    if (!DOM.navbar) return;
    
    if (window.scrollY > 50) {
        DOM.navbar.classList.add('scrolled');
    } else {
        DOM.navbar.classList.remove('scrolled');
    }
};

window.addEventListener('scroll', throttle(handleNavbarScroll, 100));

// ========== ACTIVE NAVIGATION LINK ==========
const updateActiveNavLink = () => {
    let current = 'home';
    
    DOM.sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const scrollPosition = window.pageYOffset + 200;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id') || 'home';
        }
    });

    if (current !== state.currentSection) {
        state.currentSection = current;
        
        DOM.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
};

window.addEventListener('scroll', throttle(updateActiveNavLink, 100));

// ========== TYPING EFFECT FOR HERO TITLE ==========
const initTypingEffect = () => {
    if (!DOM.heroTitle) return;
    
    const text = DOM.heroTitle.innerHTML;
    DOM.heroTitle.innerHTML = '';
    DOM.heroTitle.style.opacity = '1';
    
    let i = 0;
    let isTag = false;
    let tag = '';
    
    const typeWriter = () => {
        if (i < text.length) {
            let char = text.charAt(i);
            
            if (char === '<') isTag = true;
            
            if (isTag) {
                tag += char;
                if (char === '>') {
                    isTag = false;
                    DOM.heroTitle.innerHTML += tag;
                    tag = '';
                }
            } else {
                DOM.heroTitle.innerHTML += char;
            }
            
            i++;
            setTimeout(typeWriter, isTag ? 0 : 50);
        } else {
            // Remove typing cursor after completion
            setTimeout(() => {
                DOM.heroTitle.classList.remove('typing-cursor');
            }, 1000);
        }
    };
    
    // Start typing effect after loader
    setTimeout(typeWriter, 1500);
};

// ========== PARALLAX EFFECT FOR SHAPES ==========
const initParallaxEffect = () => {
    if (DOM.shapes.length === 0) return;
    
    const handleMouseMove = (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        DOM.shapes.forEach((shape, index) => {
            const speed = (index + 1) * 15;
            const xMove = (x - 0.5) * speed;
            const yMove = (y - 0.5) * speed;
            
            shape.style.transform = `translate(${xMove}px, ${yMove}px)`;
        });
    };
    
    // Only enable on desktop
    if (window.innerWidth > 768) {
        window.addEventListener('mousemove', throttle(handleMouseMove, 50));
    }
};

// ========== SKILL BARS ANIMATION ==========
const initSkillBars = () => {
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target.querySelector('.skill-progress');
                if (progressBar) {
                    const progress = progressBar.getAttribute('data-progress');
                    
                    setTimeout(() => {
                        progressBar.style.width = progress + '%';
                        
                        // Add animation class
                        entry.target.classList.add('animated');
                    }, 200);
                    
                    // Unobserve after animation
                    skillObserver.unobserve(entry.target);
                }
            }
        });
    }, observerOptions);

    DOM.skillCards.forEach(card => {
        skillObserver.observe(card);
    });
};

// ========== SCROLL ANIMATIONS ==========
const initScrollAnimations = () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Apply initial styles and observe
    DOM.sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        sectionObserver.observe(section);
    });

    // Animate fade-in, slide-up, slide-in elements
    const animateElements = document.querySelectorAll('.fade-in, .slide-up, .slide-in');
    
    const elementObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                elementObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    animateElements.forEach(element => {
        elementObserver.observe(element);
    });
};

// ========== PROJECT CARDS HOVER EFFECT ==========
const initProjectCards = () => {
    DOM.projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
};

// ========== CONTACT FORM ==========
const initContactForm = () => {
    if (!DOM.contactForm) return;
    
    const formInputs = {
        name: DOM.contactForm.querySelector('#name'),
        email: DOM.contactForm.querySelector('#email'),
        subject: DOM.contactForm.querySelector('#subject'),
        message: DOM.contactForm.querySelector('#message')
    };

    // Form validation
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const showError = (input, message) => {
        const formGroup = input.closest('.form-group');
        formGroup.classList.add('error');
        
        let errorElement = formGroup.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('span');
            errorElement.className = 'error-message';
            errorElement.style.cssText = `
                color: var(--color-danger);
                font-size: var(--font-sm);
                margin-top: var(--space-xs);
                display: block;
            `;
            formGroup.appendChild(errorElement);
        }
        errorElement.textContent = message;
    };

    const clearError = (input) => {
        const formGroup = input.closest('.form-group');
        formGroup.classList.remove('error');
        const errorElement = formGroup.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    };

    // Real-time validation
    Object.values(formInputs).forEach(input => {
        if (input) {
            input.addEventListener('blur', () => {
                if (input.value.trim() === '') {
                    showError(input, 'This field is required');
                } else if (input.type === 'email' && !validateEmail(input.value)) {
                    showError(input, 'Please enter a valid email');
                } else {
                    clearError(input);
                }
            });

            input.addEventListener('input', () => {
                clearError(input);
            });
        }
    });

    // Form submission
    DOM.contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        let isValid = true;

        // Validate all fields
        if (!formInputs.name.value.trim()) {
            showError(formInputs.name, 'Name is required');
            isValid = false;
        }

        if (!formInputs.email.value.trim()) {
            showError(formInputs.email, 'Email is required');
            isValid = false;
        } else if (!validateEmail(formInputs.email.value)) {
            showError(formInputs.email, 'Please enter a valid email');
            isValid = false;
        }

        if (!formInputs.subject.value.trim()) {
            showError(formInputs.subject, 'Subject is required');
            isValid = false;
        }

        if (!formInputs.message.value.trim()) {
            showError(formInputs.message, 'Message is required');
            isValid = false;
        }

        if (!isValid) return;

        // Show loading state
        const submitBtn = DOM.contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            // Success
            showNotification('success', `Thank you, ${formInputs.name.value}! Your message has been sent successfully.`);
            
            // Reset form
            DOM.contactForm.reset();
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;

            // Log form data (replace with actual API call)
            console.log('Form Data:', {
                name: formInputs.name.value,
                email: formInputs.email.value,
                subject: formInputs.subject.value,
                message: formInputs.message.value,
                timestamp: new Date().toISOString()
            });
        }, 2000);
    });
};

// ========== NOTIFICATION SYSTEM ==========
const showNotification = (type, message) => {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: var(--space-md) var(--space-lg);
        background: ${type === 'success' ? 'var(--success-gradient)' : 'var(--color-danger)'};
        color: white;
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-xl);
        z-index: var(--z-tooltip);
        animation: slideInRight 0.3s ease;
        max-width: 400px;
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: var(--space-sm);">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
};

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ========== COPY TO CLIPBOARD ==========
const copyToClipboard = async (text, button) => {
    try {
        await navigator.clipboard.writeText(text);
        
        // Success feedback
        const originalHTML = button.innerHTML;
        const originalBg = button.style.background;
        
        button.innerHTML = '<i class="fas fa-check"></i> Copied!';
        button.style.background = 'var(--color-success)';
        button.style.color = 'white';
        
        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.style.background = originalBg;
            button.style.color = '';
        }, 2000);
        
    } catch (err) {
        console.error('Copy failed:', err);
        fallbackCopy(text);
    }
};

const fallbackCopy = (text) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.cssText = 'position: fixed; opacity: 0; pointer-events: none;';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        document.execCommand('copy');
        showNotification('success', 'Copied to clipboard!');
    } catch (err) {
        showNotification('error', 'Failed to copy. Please copy manually: ' + text);
    }
    
    document.body.removeChild(textarea);
};

// Global copy functions
window.copyEmail = function(btn) {
    copyToClipboard('hiteshsingh17077@gmail.com', btn);
};

window.copyPhone = function(btn) {
    copyToClipboard('+919313329309', btn);
};

// ========== SCROLL TO TOP BUTTON ==========
const initScrollToTop = () => {
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollTopBtn.className = 'scroll-top-btn';
    scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
    scrollTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: var(--primary-gradient);
        color: white;
        border: none;
        border-radius: var(--radius-full);
        font-size: 20px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all var(--transition-base);
        z-index: var(--z-fixed);
        box-shadow: var(--shadow-lg);
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    document.body.appendChild(scrollTopBtn);

    // Show/hide button
    const toggleScrollButton = () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.style.opacity = '1';
            scrollTopBtn.style.visibility = 'visible';
        } else {
            scrollTopBtn.style.opacity = '0';
            scrollTopBtn.style.visibility = 'hidden';
        }
    };

    window.addEventListener('scroll', throttle(toggleScrollButton, 100));

    // Scroll to top
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Hover effect
    scrollTopBtn.addEventListener('mouseenter', () => {
        scrollTopBtn.style.transform = 'scale(1.1) translateY(-5px)';
    });

    scrollTopBtn.addEventListener('mouseleave', () => {
        scrollTopBtn.style.transform = 'scale(1) translateY(0)';
    });
};

// ========== DARK MODE TOGGLE ==========
const initDarkMode = () => {
    // Check for saved theme preference or default to 'light'
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    state.isDarkMode = savedTheme === 'dark';

    // Create theme toggle button
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.setAttribute('aria-label', 'Toggle dark mode');
    themeToggle.innerHTML = `<i class="fas fa-${state.isDarkMode ? 'sun' : 'moon'}"></i>`;
    themeToggle.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: var(--bg-primary);
        border: 2px solid var(--color-gray-300);
        border-radius: var(--radius-full);
        font-size: 20px;
        cursor: pointer;
        transition: all var(--transition-base);
        z-index: var(--z-fixed);
        box-shadow: var(--shadow-lg);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--text-primary);
    `;

    document.body.appendChild(themeToggle);

    // Toggle theme
    themeToggle.addEventListener('click', () => {
        state.isDarkMode = !state.isDarkMode;
        const newTheme = state.isDarkMode ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        themeToggle.innerHTML = `<i class="fas fa-${state.isDarkMode ? 'sun' : 'moon'}"></i>`;
        
        console.log('Theme changed to:', newTheme);
    });

    // Hover effect
    themeToggle.addEventListener('mouseenter', () => {
        themeToggle.style.transform = 'scale(1.1) rotate(20deg)';
    });

    themeToggle.addEventListener('mouseleave', () => {
        themeToggle.style.transform = 'scale(1) rotate(0deg)';
    });
};

// ========== LAZY LOAD IMAGES ==========
const initLazyLoad = () => {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.src; // Trigger load
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }
};

// ========== EASTER EGG ==========
const initEasterEgg = () => {
    let clickCount = 0;
    
    if (DOM.logo) {
        DOM.logo.addEventListener('click', () => {
            clickCount++;
            
            if (clickCount === 5) {
                // Create confetti effect
                createConfetti();
                showNotification('success', '🎉 Easter egg unlocked! You found the secret!');
                clickCount = 0;
            }
            
            // Reset counter after 2 seconds
            setTimeout(() => {
                if (clickCount < 5) clickCount = 0;
            }, 2000);
        });
    }
};

const createConfetti = () => {
    const colors = ['#667eea', '#764ba2', '#f5576c', '#00b894', '#fdcb6e'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            top: 50%;
            left: 50%;
            opacity: 1;
            pointer-events: none;
            z-index: 9999;
            border-radius: 50%;
        `;
        
        document.body.appendChild(confetti);
        
        const angle = (Math.PI * 2 * i) / confettiCount;
        const velocity = 5 + Math.random() * 5;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        let x = 0, y = 0, opacity = 1;
        
        const animate = () => {
            x += vx;
            y += vy + 2; // Gravity
            opacity -= 0.02;
            
            confetti.style.transform = `translate(${x}px, ${y}px)`;
            confetti.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                confetti.remove();
            }
        };
        
        requestAnimationFrame(animate);
    }
};

// ========== ANALYTICS & TRACKING ==========
const initTracking = () => {
    // Social links tracking
    document.querySelectorAll('.social-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const platform = e.currentTarget.getAttribute('href');
            console.log('Social link clicked:', platform);
            // Add your analytics code here
            // Example: gtag('event', 'social_click', { platform });
        });
    });

    // Project links tracking
    document.querySelectorAll('.project-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const projectName = e.currentTarget.closest('.project-card')?.querySelector('.project-title')?.textContent;
            console.log('Project link clicked:', projectName);
            // Add your analytics code here
        });
    });

    // Download CV tracking
    const downloadBtn = document.querySelector('a[href*="resume"], a[href*="cv"]');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            console.log('CV Download initiated');
            // Add your analytics code here
        });
    }

    // Email link tracking
    document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
        link.addEventListener('click', () => {
            console.log('Email link clicked:', link.getAttribute('href'));
        });
    });
};

// ========== BROWSER & DEVICE DETECTION ==========
const detectEnvironment = () => {
    // Browser detection
    const userAgent = navigator.userAgent;
    let browser = 'Unknown';
    
    if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Edge')) browser = 'Edge';
    
    console.log('Browser:', browser);

    // Mobile detection
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    if (isMobile) {
        document.body.classList.add('mobile');
        console.log('Mobile device detected');
    }

    // Reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
        document.documentElement.style.setProperty('--transition-base', '0ms');
        console.log('Reduced motion preference detected');
    }

    return { browser, isMobile };
};

// ========== CONNECTION STATUS ==========
const initConnectionStatus = () => {
    window.addEventListener('online', () => {
        console.log('Connection restored');
        showNotification('success', 'You are back online!');
    });

    window.addEventListener('offline', () => {
        console.log('Connection lost');
        showNotification('error', 'You are offline. Some features may not work.');
    });
};

// ========== PAGE VISIBILITY ==========
const initPageVisibility = () => {
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            console.log('Page is hidden');
            // Pause animations or videos here
        } else {
            console.log('Page is visible');
            // Resume animations or videos here
        }
    });
};

// ========== EXTERNAL LINKS SECURITY ==========
const secureExternalLinks = () => {
    document.querySelectorAll('a[target="_blank"]').forEach(link => {
        link.setAttribute('rel', 'noopener noreferrer');
    });
};

// ========== DYNAMIC YEAR ==========
const updateYear = () => {
    if (DOM.yearElement) {
        DOM.yearElement.textContent = new Date().getFullYear();
    }
};

// ========== ERROR HANDLING ==========
const initErrorHandling = () => {
    window.addEventListener('error', (e) => {
        console.error('Global error:', e.error);
        // You can send errors to analytics here
    });

    window.addEventListener('unhandledrejection', (e) => {
        console.error('Unhandled promise rejection:', e.reason);
    });
};

// ========== PERFORMANCE MONITORING ==========
const monitorPerformance = () => {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page load time:', perfData.loadEventEnd - perfData.fetchStart, 'ms');
        });
    }
};

// ========== INITIALIZATION ==========
const init = () => {
    console.log('%c Portfolio by Hitesh Singh', 'color: #667eea; font-size: 20px; font-weight: bold;');
    console.log('%c Thanks for visiting! 🚀', 'color: #00b894; font-size: 14px;');
    console.log('%c GitHub: https://github.com/hitu1707', 'color: #333; font-size: 12px;');
    console.log('%c Instagram: https://www.instagram.com/hitu_1707_/', 'color: #e1306c; font-size: 12px;');
    console.log('%c LeetCode: https://leetcode.com/u/hitu1707/', 'color: #ffa116; font-size: 12px;');

    // Initialize all features
    initLoader();
    initNavigation();
    initTypingEffect();
    initParallaxEffect();
    initSkillBars();
    initScrollAnimations();
    initProjectCards();
    initContactForm();
    initScrollToTop();
    initDarkMode();
    initLazyLoad();
    initEasterEgg();
    initTracking();
    initConnectionStatus();
    initPageVisibility();
    secureExternalLinks();
    updateYear();
    initErrorHandling();
    monitorPerformance();
    detectEnvironment();

    console.log('%c✅ Portfolio fully initialized', 'color: #00b894; font-size: 14px; font-weight: bold;');
};

// ========== DOM READY ==========
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ========== EXPORT FUNCTIONS ==========
window.portfolioFunctions = {
    copyEmail: window.copyEmail,
    copyPhone: window.copyPhone,
    showNotification,
    copyToClipboard
};

/* ============================================
   END OF SCRIPT
   ============================================ */