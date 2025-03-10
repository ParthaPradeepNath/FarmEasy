import translations from './translations.js';

export class LanguageManager {
    constructor() {
        this.currentLang = localStorage.getItem('preferredLanguage') || 'en';
        this.translations = translations;
        this.init();
        
        // Set HTML lang attribute
        document.documentElement.lang = this.currentLang;
    }

    init() {
        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            languageSelect.value = this.currentLang;
            languageSelect.addEventListener('change', (e) => {
                this.setLanguage(e.target.value);
            });
        }
        this.updateContent();
    }

    setLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('preferredLanguage', lang);
        document.documentElement.lang = lang;
        this.updateContent();

        // Dispatch event for components that need to know about language changes
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
    }

    updateContent() {
        // Update all elements with data-i18n attribute
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.dataset.i18n;
            if (this.translations[this.currentLang]?.[key]) {
                element.textContent = this.translations[this.currentLang][key];
            }
        });

        // Update all elements with data-i18n-placeholder attribute
        const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
        placeholders.forEach(element => {
            const key = element.dataset.i18nPlaceholder;
            if (this.translations[this.currentLang]?.[key]) {
                element.placeholder = this.translations[this.currentLang][key];
            }
        });

        // Update navigation links
        document.querySelectorAll('[data-nav-key]').forEach(link => {
            const key = link.getAttribute('data-nav-key');
            if (this.translations[this.currentLang]?.[key]) {
                link.textContent = this.translations[this.currentLang][key];
            }
        });

        // Update buttons
        document.querySelectorAll('[data-btn-key]').forEach(button => {
            const key = button.getAttribute('data-btn-key');
            if (this.translations[this.currentLang]?.[key]) {
                button.textContent = this.translations[this.currentLang][key];
            }
        });

        // Update meta tags
        document.querySelectorAll('[data-i18n-meta]').forEach(meta => {
            const key = meta.getAttribute('data-i18n-meta');
            if (this.translations[this.currentLang]?.[key]) {
                meta.setAttribute('content', this.translations[this.currentLang][key]);
            }
        });

        this.updateDynamicContent();
    }

    updateDynamicContent() {
        // Update dynamic elements that might be added after initial load
        const event = new CustomEvent('updateDynamicTranslations', {
            detail: { language: this.currentLang }
        });
        window.dispatchEvent(event);
    }

    getText(key) {
        return this.translations[this.currentLang]?.[key] || key;
    }

    getFormattedText(key, replacements) {
        let text = this.getText(key);
        if (replacements) {
            Object.entries(replacements).forEach(([key, value]) => {
                text = text.replace(`{${key}}`, value);
            });
        }
        return text;
    }

    getCurrentLanguage() {
        return this.currentLang;
    }

    isRTL() {
        return ['ar', 'fa', 'he', 'ur'].includes(this.currentLang);
    }
} 