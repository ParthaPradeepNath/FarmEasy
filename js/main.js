import { LanguageManager } from './languageManager.js';

// Initialize language manager
const languageManager = new LanguageManager();

// Handle RTL layout
function updateRTLLayout() {
    const isRTL = languageManager.isRTL();
    document.body.dir = isRTL ? 'rtl' : 'ltr';
    document.body.classList.toggle('rtl', isRTL);
}

// Initialize navigation
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    // Handle navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Handle mobile menu
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuBtn.setAttribute('aria-expanded', 
                mobileMenuBtn.getAttribute('aria-expanded') === 'true' ? 'false' : 'true'
            );
        });
    }
}

// Handle smooth scrolling
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Initialize animations
function initAnimations() {
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.animate-on-scroll');
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            
            if (elementTop < window.innerHeight && elementBottom > 0) {
                element.classList.add('animated');
            }
        });
    };

    // Run on load
    animateOnScroll();
    
    // Run on scroll
    window.addEventListener('scroll', animateOnScroll);
}

// Handle language changes
window.addEventListener('languageChanged', (e) => {
    updateRTLLayout();
    // Update page title
    document.title = languageManager.getText('pageTitle');
});

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    updateRTLLayout();
    initNavigation();
    initSmoothScroll();
    initAnimations();
});

// Form validation and handling for contact form
const contactForm = document.querySelector('#contact-form');
if (contactForm) {
    // Create message elements
    const messageContainer = document.createElement('div');
    messageContainer.className = 'form-message';
    contactForm.insertBefore(messageContainer, contactForm.firstChild);

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());
        
        // Basic validation
        if (!data.name || !data.email || !data.subject || !data.message) {
            showMessage('Please fill in all fields', 'error');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showMessage('Please enter a valid email address', 'error');
            return;
        }

        try {
            // Here you would typically send the data to your server
            // For demonstration, we'll simulate a successful submission
            await simulateFormSubmission(data);
            
            showMessage('Message sent successfully! We will get back to you soon.', 'success');
            contactForm.reset();
        } catch (error) {
            showMessage('Failed to send message. Please try again later.', 'error');
        }
    });
}

// Function to show form messages
function showMessage(message, type) {
    const messageContainer = document.querySelector('.form-message');
    if (messageContainer) {
        messageContainer.textContent = message;
        messageContainer.className = `form-message ${type}`;
        
        // Hide message after 5 seconds
        setTimeout(() => {
            messageContainer.style.display = 'none';
        }, 5000);
    }
}

// Simulate form submission (replace with actual API call)
function simulateFormSubmission(data) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Form submitted with data:', data);
            resolve();
        }, 1000);
    });
}

// Add mobile menu button to navbar
const navContainer = document.querySelector('.nav-container');
if (navContainer && !document.querySelector('.mobile-menu-btn')) {
    const mobileBtn = document.createElement('button');
    mobileBtn.className = 'mobile-menu-btn';
    mobileBtn.innerHTML = '<i class="fas fa-bars"></i>';
    navContainer.appendChild(mobileBtn);
    
    mobileBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('active') && 
        !e.target.closest('.nav-links') && 
        !e.target.closest('.mobile-menu-btn')) {
        navLinks.classList.remove('active');
    }
}); 