// Real Visitor Counter using CountAPI
class RealVisitorCounter {
    constructor() {
        this.namespace = 'web-scraping-course';
        this.visitorIdKey = 'realVisitorId';
        this.init();
    }

    async init() {
        await this.ensureVisitorId();
        await this.incrementCounters();
        await this.displayCounter();
    }

    async ensureVisitorId() {
        if (!localStorage.getItem(this.visitorIdKey)) {
            const visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem(this.visitorIdKey, visitorId);
        }
        return localStorage.getItem(this.visitorIdKey);
    }

    async incrementCounters() {
        const visitorId = localStorage.getItem(this.visitorIdKey);
        
        try {
            // Increment total visitors (unique)
            await this.hitAPI('total-visitors');
            
            // Increment total page views
            await this.hitAPI('total-views');
            
            // Increment today's visitors
            const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
            await this.hitAPI(`daily-${today}`);
            
        } catch (error) {
            console.error('Error updating counters:', error);
        }
    }

    async hitAPI(key) {
        const url = `https://api.countapi.xyz/hit/${this.namespace}/${key}`;
        const response = await fetch(url);
        return await response.json();
    }

    async getValue(key) {
        try {
            const url = `https://api.countapi.xyz/get/${this.namespace}/${key}`;
            const response = await fetch(url);
            const data = await response.json();
            return data.value || 0;
        } catch (error) {
            console.error('Error getting counter value:', error);
            return 0;
        }
    }

    async displayCounter() {
        if (document.querySelector('footer')) {
            await this.injectCounterIntoFooter();
        } else {
            document.addEventListener('DOMContentLoaded', async () => {
                await this.injectCounterIntoFooter();
            });
        }
    }

    async injectCounterIntoFooter() {
        const footer = document.querySelector('footer');
        if (!footer) return;

        const existingCounter = document.getElementById('real-visitor-counter');
        if (existingCounter) {
            existingCounter.remove();
        }

        // Get live statistics
        const totalVisitors = await this.getValue('total-visitors');
        const totalViews = await this.getValue('total-views');
        const today = new Date().toISOString().split('T')[0];
        const todayVisitors = await this.getValue(`daily-${today}`);

        const counterElement = document.createElement('div');
        counterElement.id = 'real-visitor-counter';
        counterElement.className = 'footer-column';
        counterElement.innerHTML = this.getCounterHTML(totalVisitors, todayVisitors, totalViews);
        
        const footerContent = footer.querySelector('.footer-content');
        if (footerContent) {
            footerContent.appendChild(counterElement);
        }
        
        this.addCounterStyles();
    }

    getCounterHTML(totalVisitors, todayVisitors, totalViews) {
        return `
            <h3>Live Statistics</h3>
            <ul class="footer-links">
                <li>
                    <a href="javascript:void(0)">
                        <i class="fas fa-users" style="color: #50c878;"></i>
                        Total Visitors: <strong>${this.formatNumber(totalVisitors)}</strong>
                    </a>
                </li>
                <li>
                    <a href="javascript:void(0)">
                        <i class="fas fa-calendar-day" style="color: #667eea;"></i>
                        Today: <strong>${this.formatNumber(todayVisitors)}</strong>
                    </a>
                </li>
                <li>
                    <a href="javascript:void(0)">
                        <i class="fas fa-eye" style="color: #ff6b6b;"></i>
                        Total Views: <strong>${this.formatNumber(totalViews)}</strong>
                    </a>
                </li>
                <li style="opacity: 0.7; font-style: italic;">
                    <i class="fas fa-globe" style="color: #ffd700;"></i>
                    Live Global Stats
                </li>
            </ul>
        `;
    }

    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    addCounterStyles() {
        if (document.getElementById('real-counter-styles')) return;

        const styles = `
            <style id="real-counter-styles">
                #real-visitor-counter .footer-links li {
                    border-left: 3px solid transparent;
                    transition: all 0.3s ease;
                }

                #real-visitor-counter .footer-links li:hover {
                    border-left-color: #50c878;
                    background: rgba(255, 255, 255, 0.05);
                    padding-left: 10px;
                }

                #real-visitor-counter .footer-links strong {
                    color: #50c878;
                    float: right;
                }

                #real-visitor-counter .footer-links i {
                    width: 20px;
                    text-align: center;
                    margin-right: 8px;
                }

                /* Hide counter on expiration page */
                body:has(> div > div > .fa-clock) #real-visitor-counter {
                    display: none;
                }
            </style>
        `;
        document.head.insertAdjacentHTML('beforeend', styles);
    }
}

// Initialize real visitor counter
const realVisitorCounter = new RealVisitorCounter();
