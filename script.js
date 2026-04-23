
'use strict';


const EMAILJS_CONFIG = {
    publicKey:  typeof CONFIG !== 'undefined' ? CONFIG.emailjs.publicKey  : null,
    serviceId:  typeof CONFIG !== 'undefined' ? CONFIG.emailjs.serviceId  : null,
    templateId: typeof CONFIG !== 'undefined' ? CONFIG.emailjs.templateId : null
};

const state = {
    isMenuOpen:     false,
    isDarkMode:     false,
    currentSection: 'home',
    emailjsReady:   false
};

// ========== UTILITIES ==========
const throttle = (func, limit) => {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};


const DOM = {
    hamburger:   document.querySelector('.hamburger'),
    navMenu:     document.querySelector('.nav-menu'),
    navLinks:    document.querySelectorAll('.nav-link'),
    navbar:      document.querySelector('.navbar'),
    sections:    document.querySelectorAll('section'),
    contactForm: document.getElementById('contactForm'),
    heroTitle:   document.querySelector('.hero-title'),
    loader:      document.querySelector('.loader'),
    yearElement: document.querySelector('.current-year'),
    logo:        document.querySelector('.logo')
};

// ========== EMAILJS INIT ==========
const initEmailJS = () => {
    if (typeof emailjs === 'undefined') {
        console.warn('⚠️ EmailJS SDK not loaded.');
        return;
    }

    if (
        !EMAILJS_CONFIG.publicKey  ||
        !EMAILJS_CONFIG.serviceId  ||
        !EMAILJS_CONFIG.templateId ||
        EMAILJS_CONFIG.publicKey  === 'YOUR_EMAILJS_PUBLIC_KEY'  ||
        EMAILJS_CONFIG.serviceId  === 'YOUR_EMAILJS_SERVICE_ID'  ||
        EMAILJS_CONFIG.templateId === 'YOUR_EMAILJS_TEMPLATE_ID'
    ) {
        console.warn('⚠️ EmailJS not configured. Create config.js with your real keys.');
        return;
    }

    emailjs.init(EMAILJS_CONFIG.publicKey);
    state.emailjsReady = true
};

// ========== LOADER ==========
const initLoader = () => {
    window.addEventListener('load', () => {
        if (DOM.loader) {
            setTimeout(() => {
                DOM.loader.style.opacity = '0';
                setTimeout(() => {
                    DOM.loader.style.display = 'none';
                    document.body.classList.add('loaded');
                }, 500);
            }, 800);
        }
    });
};

// ========== NAVIGATION ==========
const initNavigation = () => {
    if (DOM.hamburger && DOM.navMenu) {
        DOM.hamburger.addEventListener('click', toggleMenu);
    }

    DOM.navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            closeMenu();
            handleSmoothScroll(e, link);
        });
    });

    document.addEventListener('click', (e) => {
        if (
            state.isMenuOpen &&
            !DOM.navMenu.contains(e.target) &&
            !DOM.hamburger.contains(e.target)
        ) {
            closeMenu();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && state.isMenuOpen) closeMenu();
    });
};

const toggleMenu = () => {
    state.isMenuOpen = !state.isMenuOpen;
    DOM.navMenu.classList.toggle('active');
    DOM.hamburger.classList.toggle('active');
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
            window.scrollTo({
                top:      target.offsetTop - navbarHeight,
                behavior: 'smooth'
            });
        }
    }
};

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => handleSmoothScroll(e, anchor));
});

// ========== NAVBAR SCROLL ==========
const handleNavbarScroll = () => {
    if (!DOM.navbar) return;
    DOM.navbar.classList.toggle('scrolled', window.scrollY > 50);
};

window.addEventListener('scroll', throttle(handleNavbarScroll, 100));

// ========== ACTIVE NAV LINK ==========
const updateActiveNavLink = () => {
    let current = 'home';

    DOM.sections.forEach(section => {
        const sectionTop    = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (
            window.pageYOffset + 200 >= sectionTop &&
            window.pageYOffset + 200 <  sectionTop + sectionHeight
        ) {
            current = section.getAttribute('id') || 'home';
        }
    });

    if (current !== state.currentSection) {
        state.currentSection = current;
        DOM.navLinks.forEach(link => {
            link.classList.toggle(
                'active',
                link.getAttribute('href') === `#${current}`
            );
        });
    }
};

window.addEventListener('scroll', throttle(updateActiveNavLink, 100));

// ========== TYPING EFFECT ==========
const initTypingEffect = () => {
    if (!DOM.heroTitle) return;

    const text = DOM.heroTitle.innerHTML;
    DOM.heroTitle.innerHTML     = '';
    DOM.heroTitle.style.opacity = '1';

    let i     = 0;
    let isTag = false;
    let tag   = '';

    const typeWriter = () => {
        if (i < text.length) {
            const char = text.charAt(i);
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
            setTimeout(() => {
                DOM.heroTitle.classList.remove('typing-cursor');
            }, 1500);
        }
    };

    setTimeout(typeWriter, 1200);
};

// ========== SCROLL ANIMATIONS ==========
const initScrollAnimations = () => {
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity   = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold:  0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    DOM.sections.forEach(section => {
        section.style.opacity    = '0';
        section.style.transform  = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        sectionObserver.observe(section);
    });

    const elementObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                elementObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.fade-in, .slide-up').forEach(el => {
        elementObserver.observe(el);
    });
};

// ========== CONTACT FORM ==========
const initContactForm = () => {
    if (!DOM.contactForm) return;

    const fields = {
        name:    DOM.contactForm.querySelector('#name'),
        email:   DOM.contactForm.querySelector('#email'),
        subject: DOM.contactForm.querySelector('#subject'),
        message: DOM.contactForm.querySelector('#message')
    };

    const validateEmail = (email) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const showError = (input, message) => {
        const group = input.closest('.form-group');
        group.classList.add('error');
        let errorEl = group.querySelector('.error-message');
        if (!errorEl) {
            errorEl               = document.createElement('span');
            errorEl.className     = 'error-message';
            errorEl.style.cssText = `
                color:      var(--color-danger);
                font-size:  var(--font-sm);
                margin-top: 4px;
                display:    block;
            `;
            group.appendChild(errorEl);
        }
        errorEl.textContent = message;
    };

    const clearError = (input) => {
        const group   = input.closest('.form-group');
        group.classList.remove('error');
        const errorEl = group.querySelector('.error-message');
        if (errorEl) errorEl.remove();
    };

    Object.values(fields).forEach(input => {
        if (!input) return;
        input.addEventListener('blur', () => {
            if (!input.value.trim()) {
                showError(input, 'This field is required');
            } else if (input.type === 'email' && !validateEmail(input.value)) {
                showError(input, 'Please enter a valid email');
            } else {
                clearError(input);
            }
        });
        input.addEventListener('input', () => clearError(input));
    });

    // ---- Form Submit ----
    DOM.contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        let isValid = true;

        if (!fields.name.value.trim()) {
            showError(fields.name, 'Name is required');
            isValid = false;
        }
        if (!fields.email.value.trim()) {
            showError(fields.email, 'Email is required');
            isValid = false;
        } else if (!validateEmail(fields.email.value)) {
            showError(fields.email, 'Please enter a valid email');
            isValid = false;
        }
        if (!fields.subject.value.trim()) {
            showError(fields.subject, 'Subject is required');
            isValid = false;
        }
        if (!fields.message.value.trim()) {
            showError(fields.message, 'Message is required');
            isValid = false;
        }

        if (!isValid) return;

        if (!state.emailjsReady) {
            showNotification(
                'error',
                '❌ Email service not configured. Contact me at aithanihitesh5@gmail.com'
            );
            return;
        }

        const submitBtn    = DOM.contactForm.querySelector('.submit-btn');
        const originalHTML = submitBtn.innerHTML;

        submitBtn.innerHTML     = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled      = true;
        submitBtn.style.opacity = '0.8';

        try {
            const templateParams = {
                from_name:  fields.name.value.trim(),
                from_email: fields.email.value.trim(),
                subject:    fields.subject.value.trim(),
                message:    fields.message.value.trim(),
                reply_to:   fields.email.value.trim()
            };

            console.log('Sending with params:', templateParams);

            await emailjs.send(
                EMAILJS_CONFIG.serviceId,
                EMAILJS_CONFIG.templateId,
                templateParams
            );

            // SUCCESS
            showNotification(
                'success',
                `✅ Thank you ${fields.name.value.trim()}! Message sent successfully. I will reply soon.`
            );

            submitBtn.innerHTML        = '<i class="fas fa-check"></i> Message Sent!';
            submitBtn.style.background = 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)';
            submitBtn.style.opacity    = '1';

            DOM.contactForm.reset();

            setTimeout(() => {
                submitBtn.innerHTML        = originalHTML;
                submitBtn.disabled         = false;
                submitBtn.style.background = '';
                submitBtn.style.opacity    = '1';
            }, 3000);

        } catch (error) {
            console.error('EmailJS Send Error:', error);
            console.error('Error status:', error.status);
            console.error('Error text:', error.text);

            showNotification(
                'error',
                '❌ Failed to send. Please email me at aithanihitesh5@gmail.com'
            );

            submitBtn.innerHTML     = originalHTML;
            submitBtn.disabled      = false;
            submitBtn.style.opacity = '1';
        }
    });
};

// ========== NOTIFICATIONS ==========
const showNotification = (type, message) => {
    const existing = document.querySelector('.portfolio-notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = 'portfolio-notification';
    notification.style.cssText = `
        position:      fixed;
        top:           100px;
        right:         20px;
        padding:       16px 24px;
        background:    ${
            type === 'success'
            ? 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)'
            : 'linear-gradient(135deg, #d63031 0%, #e17055 100%)'
        };
        color:         white;
        border-radius: 12px;
        box-shadow:    0 10px 30px rgba(0,0,0,0.2);
        z-index:       9999;
        max-width:     400px;
        min-width:     280px;
        animation:     slideInRight 0.3s ease;
        font-size:     14px;
        font-weight:   500;
        line-height:   1.5;
    `;
    notification.innerHTML = `
        <div style="display:flex; align-items:flex-start; gap:12px;">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"
               style="font-size:20px; flex-shrink:0; margin-top:1px;"></i>
            <span>${message}</span>
        </div>
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
};

const notifStyle = document.createElement('style');
notifStyle.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(440px); opacity: 0; }
        to   { transform: translateX(0);     opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0);     opacity: 1; }
        to   { transform: translateX(440px); opacity: 0; }
    }
`;
document.head.appendChild(notifStyle);

// ========== COPY TO CLIPBOARD ==========
const copyToClipboard = async (text, button) => {
    try {
        await navigator.clipboard.writeText(text);
        const originalHTML      = button.innerHTML;
        button.innerHTML        = '<i class="fas fa-check"></i> Copied!';
        button.style.background = 'var(--color-success)';
        button.style.color      = 'white';
        setTimeout(() => {
            button.innerHTML        = originalHTML;
            button.style.background = '';
            button.style.color      = '';
        }, 2000);
    } catch (err) {
        const textarea         = document.createElement('textarea');
        textarea.value         = text;
        textarea.style.cssText = 'position:fixed; opacity:0; pointer-events:none;';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            showNotification('success', '✅ Copied to clipboard!');
        } catch {
            showNotification('error', '❌ Failed to copy. Please copy manually.');
        }
        document.body.removeChild(textarea);
    }
};

// ✅ Updated email address
window.copyEmail = (btn) => copyToClipboard('aithanihitesh5@gmail.com', btn);
window.copyPhone = (btn) => copyToClipboard('+919313329309', btn);

// ========== SCROLL TO TOP ==========
const initScrollToTop = () => {
    const btn = document.createElement('button');
    btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    btn.setAttribute('aria-label', 'Scroll to top');
    btn.style.cssText = `
        position:        fixed;
        bottom:          30px;
        right:           30px;
        width:           48px;
        height:          48px;
        background:      linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color:           white;
        border:          none;
        border-radius:   50%;
        font-size:       18px;
        cursor:          pointer;
        opacity:         0;
        visibility:      hidden;
        transition:      opacity 0.3s ease, visibility 0.3s ease;
        z-index:         1030;
        box-shadow:      0 4px 15px rgba(102,126,234,0.4);
        display:         flex;
        align-items:     center;
        justify-content: center;
    `;
    document.body.appendChild(btn);

    window.addEventListener('scroll', throttle(() => {
        const visible        = window.pageYOffset > 300;
        btn.style.opacity    = visible ? '1' : '0';
        btn.style.visibility = visible ? 'visible' : 'hidden';
    }, 100));

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
};

// ========== DARK MODE ==========
const initDarkMode = () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    state.isDarkMode = savedTheme === 'dark';

    const toggle = document.createElement('button');
    toggle.setAttribute('aria-label', 'Toggle dark mode');
    toggle.innerHTML     = `<i class="fas fa-${state.isDarkMode ? 'sun' : 'moon'}"></i>`;
    toggle.style.cssText = `
        position:        fixed;
        bottom:          90px;
        right:           30px;
        width:           48px;
        height:          48px;
        background:      var(--bg-primary);
        border:          2px solid var(--color-gray-300);
        border-radius:   50%;
        font-size:       18px;
        cursor:          pointer;
        transition:      background 0.3s ease, color 0.3s ease;
        z-index:         1030;
        box-shadow:      0 4px 15px rgba(0,0,0,0.1);
        display:         flex;
        align-items:     center;
        justify-content: center;
        color:           var(--text-primary);
    `;
    document.body.appendChild(toggle);

    toggle.addEventListener('click', () => {
        state.isDarkMode = !state.isDarkMode;
        const newTheme   = state.isDarkMode ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        toggle.innerHTML = `<i class="fas fa-${state.isDarkMode ? 'sun' : 'moon'}"></i>`;
    });
};

// ========== SECURE EXTERNAL LINKS ==========
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

// ========== EASTER EGG ==========
const initEasterEgg = () => {
    if (!DOM.logo) return;
    let clickCount = 0;
    let resetTimer;

    DOM.logo.addEventListener('click', () => {
        clickCount++;
        clearTimeout(resetTimer);
        resetTimer = setTimeout(() => { clickCount = 0; }, 2000);
        if (clickCount === 5) {
            createConfetti();
            showNotification('success', '🎉 Easter egg found! You are curious!');
            clickCount = 0;
        }
    });
};

const createConfetti = () => {
    const colors = ['#667eea', '#764ba2', '#f5576c', '#00b894', '#fdcb6e'];
    for (let i = 0; i < 40; i++) {
        const el = document.createElement('div');
        el.style.cssText = `
            position:       fixed;
            width:          10px;
            height:         10px;
            background:     ${colors[Math.floor(Math.random() * colors.length)]};
            top:            50%;
            left:           50%;
            border-radius:  50%;
            pointer-events: none;
            z-index:        9999;
        `;
        document.body.appendChild(el);
        const angle = (Math.PI * 2 * i) / 40;
        const speed = 4 + Math.random() * 4;
        const vx    = Math.cos(angle) * speed;
        const vy    = Math.sin(angle) * speed;
        let x = 0, y = 0, opacity = 1;
        const animate = () => {
            x       += vx;
            y       += vy + 1.5;
            opacity -= 0.018;
            el.style.transform = `translate(${x}px, ${y}px)`;
            el.style.opacity   = opacity;
            if (opacity > 0) requestAnimationFrame(animate);
            else el.remove();
        };
        requestAnimationFrame(animate);
    }
};

// ========== CONNECTION STATUS ==========
const initConnectionStatus = () => {
    window.addEventListener('online',  () => showNotification('success', '✅ You are back online!'));
    window.addEventListener('offline', () => showNotification('error',   '❌ You are offline.'));
};

// ========== ERROR HANDLING ==========
const initErrorHandling = () => {
    window.addEventListener('error',              (e) => console.error('Error:',   e.error));
    window.addEventListener('unhandledrejection', (e) => console.error('Promise:', e.reason));
};

// ========== INIT ==========
const init = () => {

    initEmailJS();
    initLoader();
    initNavigation();
    initTypingEffect();
    initScrollAnimations();
    initContactForm();
    initScrollToTop();
    initDarkMode();
    initEasterEgg();
    initConnectionStatus();
    secureExternalLinks();
    updateYear();
    initErrorHandling();

};

// ========== DOM READY ==========
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ========== GLOBAL EXPORTS ==========
window.portfolioFunctions = {
    copyEmail:        window.copyEmail,
    copyPhone:        window.copyPhone,
    showNotification: showNotification
};

/* ============================================
   END OF SCRIPT
   ============================================ */