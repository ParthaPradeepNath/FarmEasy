import translations from './translations.js';

// Language Management
class LanguageManager {
    constructor() {
        this.currentLang = localStorage.getItem('preferredLanguage') || 'en';
        this.translations = translations;
        this.init();
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
        this.updateContent();
    }

    updateContent() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.dataset.i18n;
            if (this.translations[this.currentLang] && this.translations[this.currentLang][key]) {
                element.textContent = this.translations[this.currentLang][key];
            }
        });

        // Update dynamic content
        this.updateDynamicContent();
    }

    updateDynamicContent() {
        // Update navigation links
        document.querySelectorAll('.nav-links a').forEach(link => {
            const key = link.getAttribute('data-nav-key');
            if (key && this.translations[this.currentLang][key]) {
                link.textContent = this.translations[this.currentLang][key];
            }
        });

        // Update buttons
        document.querySelectorAll('.auth-buttons button').forEach(button => {
            const key = button.getAttribute('data-btn-key');
            if (key && this.translations[this.currentLang][key]) {
                button.textContent = this.translations[this.currentLang][key];
            }
        });

        // Update research papers
        const loadMoreBtn = document.getElementById('load-more-research');
        if (loadMoreBtn) {
            loadMoreBtn.textContent = this.translations[this.currentLang].loadMore;
        }
    }

    getText(key) {
        return this.translations[this.currentLang][key] || key;
    }
}

// Research Papers API Integration with Language Support
class ResearchPapersAPI {
    constructor(languageManager) {
        this.languageManager = languageManager;
        this.page = 1;
        this.isLoading = false;
        this.hasMore = true;
        this.container = document.getElementById('research-papers-container');
        this.loadMoreBtn = document.getElementById('load-more-research');
        
        // Initialize event listeners
        if (this.loadMoreBtn) {
            this.loadMoreBtn.addEventListener('click', () => this.loadMorePapers());
        }
        
        // Initialize paper view links
        document.addEventListener('click', (e) => {
            if (e.target.closest('.download-link')) {
                e.preventDefault();
                const doi = e.target.closest('.download-link').dataset.doi;
                if (doi) {
                    this.viewPaper(doi);
                }
            }
        });

        // Initial load
        this.loadMorePapers();
    }

    async fetchPapers() {
        try {
            // Using Crossref API as an example
            const response = await fetch(`https://api.crossref.org/works?query=flood+prediction+agriculture&select=DOI,title,author,published-print,abstract&rows=5&offset=${(this.page - 1) * 5}`);
            const data = await response.json();
            return data.message.items;
        } catch (error) {
            console.error('Error fetching papers:', error);
            return [];
        }
    }

    async loadMorePapers() {
        if (this.isLoading || !this.hasMore) return;

        this.isLoading = true;
        this.loadMoreBtn.textContent = 'Loading...';

        const papers = await this.fetchPapers();
        
        if (papers.length === 0) {
            this.hasMore = false;
            this.loadMoreBtn.style.display = 'none';
            this.isLoading = false;
            return;
        }

        papers.forEach(paper => {
            this.renderPaper(paper);
        });

        this.page++;
        this.isLoading = false;
        this.loadMoreBtn.textContent = 'Load More Papers';
    }

    renderPaper(paper) {
        const date = paper['published-print']?.['date-parts']?.[0]?.[0] || 'N/A';
        const authors = paper.author?.[0]?.given + ' ' + paper.author?.[0]?.family || 'Unknown Author';
        const institution = paper.author?.[0]?.affiliation?.[0]?.name || 'Institution N/A';

        const paperHTML = `
            <div class="research-item">
                <span class="research-date">${date}</span>
                <div class="research-content">
                    <h3>${paper.title[0]}</h3>
                    <p>${paper.abstract || 'Abstract not available.'}</p>
                    <div class="research-tags">
                        <span class="research-tag">${this.languageManager.getText('researchStudies')}</span>
                        <span class="research-tag">${this.languageManager.getText('floodManagement')}</span>
                    </div>
                    <div class="research-meta">
                        <span><i class="fas fa-user"></i> ${authors}</span>
                        <span><i class="fas fa-university"></i> ${institution}</span>
                    </div>
                    <a href="#" class="download-link" data-doi="${paper.DOI}">
                        <i class="fas fa-file-pdf"></i> ${this.languageManager.getText('viewFullPaper')}
                    </a>
                </div>
            </div>
        `;

        this.container.insertAdjacentHTML('beforeend', paperHTML);
    }

    async viewPaper(doi) {
        try {
            // Using Unpaywall API to find open access versions
            const response = await fetch(`https://api.unpaywall.org/v2/${doi}?email=your-email@example.com`);
            const data = await response.json();
            
            const openAccessUrl = data.best_oa_location?.url_for_pdf || data.best_oa_location?.url;
            
            if (openAccessUrl) {
                window.open(openAccessUrl, '_blank');
            } else {
                // Fallback to DOI resolver
                window.open(`https://doi.org/${doi}`, '_blank');
            }
        } catch (error) {
            console.error('Error accessing paper:', error);
            // Fallback to DOI resolver
            window.open(`https://doi.org/${doi}`, '_blank');
        }
    }
}

// Initialize FAQ functionality with language support
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const toggleBtn = item.querySelector('.toggle-btn');
        
        question.addEventListener('click', () => {
            // Get the current state
            const isActive = item.classList.contains('active');
            
            // Close other open FAQs
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    const otherBtn = otherItem.querySelector('.toggle-btn i');
                    otherAnswer.style.height = '0';
                    otherAnswer.style.opacity = '0';
                    otherBtn.className = 'fas fa-plus';
                }
            });
            
            // Toggle current FAQ
            item.classList.toggle('active');
            
            // Set the height based on content
            if (!isActive) {
                answer.style.height = answer.scrollHeight + 'px';
                answer.style.opacity = '1';
                toggleBtn.querySelector('i').className = 'fas fa-minus';
            } else {
                answer.style.height = '0';
                answer.style.opacity = '0';
                toggleBtn.querySelector('i').className = 'fas fa-plus';
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (item.classList.contains('active')) {
                answer.style.height = answer.scrollHeight + 'px';
            }
        });
    });
}

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const languageManager = new LanguageManager();
    const researchPapersAPI = new ResearchPapersAPI(languageManager);
    
    // Initialize FAQ
    initFAQ();
    
    // Smooth scroll to sections
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            const section = document.getElementById(category);
            if (section) {
                section.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Animation on scroll functionality
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.category-card, .resource-card, .research-item, .faq-item');
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            
            if (elementTop < window.innerHeight && elementBottom > 0) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    // Set initial state for animations
    const elements = document.querySelectorAll('.category-card, .resource-card, .research-item, .faq-item');
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Run animation on load and scroll
    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);
}); 