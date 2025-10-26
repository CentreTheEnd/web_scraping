// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    const mainContent = document.getElementById('main-content');
    const navLinks = document.querySelectorAll('.nav-link');
    const startBtn = document.querySelector('.start-btn');
    const learningBtn = document.querySelector('.start-learning-btn')
    const heroSection = document.getElementById('hero');
    const mainNav = document.getElementById('main-nav');
    const inspectSubNav = document.getElementById('inspect-sub-nav');
    const logo = document.querySelector('.logo');
    const homeLinks = document.querySelectorAll('.home-link, .inspect-home-link');
    
    // Section metadata
    const sectionMetadata = {
        intro: {
            icon: 'fas fa-home',
            title: 'Web Scraping Mastery Course',
            file: 'sections/intro.html'
        },
        cheerio: {
            icon: 'fab fa-node-js',
            title: 'Cheerio - HTML Parsing & Data Extraction',
            file: 'sections/cheerio.html'
        },
        inspect: {
            icon: 'fas fa-search',
            title: 'Inspection Tools - Analyze HTTP Traffic',
            file: 'sections/inspect.html'
        },
        reqable: {
            icon: 'fas fa-network-wired',
            title: 'Reqable - Advanced HTTP Debugging',
            file: 'sections/reqable.html'
        },
        proxypin: {
            icon: 'fas fa-shield-alt',
            title: 'ProxyPin - Modern Proxy Tool',
            file: 'sections/proxypin.html'
        },
        'chrome-console': {
            icon: 'fab fa-chrome',
            title: 'Chrome Console - Browser DevTools',
            file: 'sections/chrome-console.html'
        },
        http: {
            icon: 'fas fa-exchange-alt',
            title: 'HTTP - Requests, Responses & Tools',
            file: 'sections/http.html'
        }
    };
    
    // Function to show/hide navigation based on current section
    function updateNavigation(sectionId) {
        // Hide all navigations first
        mainNav.style.display = 'none';
        inspectSubNav.style.display = 'none';
        
        // Show appropriate navigation
        if (sectionId === 'home') {
            // Show hero, hide main nav
            heroSection.classList.add('active');
            mainNav.style.display = 'none';
        } else if (['reqable', 'proxypin', 'chrome-console'].includes(sectionId)) {
            // Show inspect sub nav for tool sections
            inspectSubNav.style.display = 'block';
        } else if (sectionId !== 'home') {
            // Show main nav for other sections
            mainNav.style.display = 'block';
        }
    }
    
    // Function to create section HTML
    function createSectionHTML(sectionId, sectionData, content) {
        return `
            <section id="${sectionId}">
                <div class="section-icon">
                    <i class="${sectionData.icon}"></i>
                </div>
                <h2>${sectionData.title}</h2>
                ${content}
            </section>
        `;
    }
    
    // Function to show a specific section
    function showSection(sectionId) {
        // Hide all sections including hero
        document.querySelectorAll('main section').forEach(section => {
            section.classList.remove('active');
        });
        heroSection.classList.remove('active');
        
        // Update navigation based on section
        updateNavigation(sectionId);
        
        // If home section, just show hero and return
        if (sectionId === 'home') {
            heroSection.classList.add('active');
            return;
        }
        
        // Get section metadata
        const sectionData = sectionMetadata[sectionId];
        if (!sectionData) return;
        
        // Show loading indicator
        mainContent.innerHTML = '<p>Loading...</p>';
        
        // Fetch section content
        fetch(sectionData.file)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(content => {
                // Create and display the section
                const sectionHTML = createSectionHTML(sectionId, sectionData, content);
                mainContent.innerHTML = sectionHTML;
                
                // Add event listeners for tool cards in inspect section
                if (sectionId === 'inspect') {
                    setTimeout(() => {
                        document.querySelectorAll('.course-card').forEach(card => {
                            card.addEventListener('click', function() {
                                const target = this.getAttribute('data-target');
                                if (target) {
                                    showSection(target);
                                }
                            });
                        });
                    }, 100);
                }
                
                // Show the section
                const targetSection = document.getElementById(sectionId);
                if (targetSection) {
                    targetSection.classList.add('active');
                }
                
                // Update active button in appropriate navigation
                const currentNav = ['reqable', 'proxypin', 'chrome-console'].includes(sectionId) ? 
                    inspectSubNav : mainNav;
                
                if (currentNav) {
                    currentNav.querySelectorAll('.nav-link').forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('data-target') === sectionId) {
                            link.classList.add('active');
                        }
                    });
                }
                
                // Scroll to top of the section
                if (targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            })
            .catch(error => {
                console.error('Error loading section:', error);
                mainContent.innerHTML = `<p>Error loading section: ${error.message}</p>`;
            });
    }
    
    // Add click event to navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-target');
            showSection(targetSection);
        });
    });
    
    // Add click event to sub navigation links
    document.querySelectorAll('.sub-nav .nav-link').forEach(link => {
        link.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-target');
            showSection(targetSection);
        });
    });
    
    // Add click event to footer links
    document.querySelectorAll('.footer-links a[data-target]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = this.getAttribute('data-target');
            showSection(targetSection);
        });
    });
    
    // Start learning button - show inspect section
    if (startBtn) {
        startBtn.addEventListener('click', function() {
            showSection('intro');
        });
    }

    if (learningBtn) {
        learningBtn.addEventListener('click', function() {
            showSection('http');
        });
    }
    
    // Logo click - go home
    if (logo) {
        logo.addEventListener('click', function() {
            showSection('home');
        });
    }
    
    // Home links click - go home
    homeLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (this.classList.contains('inspect-home-link')) {
                showSection('inspect');
            } else {
                showSection('home');
            }
        });
    });
    
    // Show hero section by default
    showSection('home');
});
