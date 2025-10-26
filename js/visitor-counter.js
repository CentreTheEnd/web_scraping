// Visitor Counter System
class VisitorCounter {
    constructor() {
        this.storageKey = 'webScrapingVisitors';
        this.currentVisitorKey = 'currentVisitorId';
        this.init();
    }

    init() {
        this.ensureVisitorId();
        this.incrementCounter();
        this.displayCounterInFooter();
    }

    ensureVisitorId() {
        // Generate unique ID for current visitor if doesn't exist
        if (!localStorage.getItem(this.currentVisitorKey)) {
            const visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem(this.currentVisitorKey, visitorId);
        }
    }

    incrementCounter() {
        let visitorsData = this.getVisitorsData();
        const currentVisitorId = localStorage.getItem(this.currentVisitorKey);
        
        // Check if this visitor is already counted today
        const today = new Date().toDateString();
        if (!visitorsData.dailyVisitors[today]) {
            visitorsData.dailyVisitors[today] = new Set();
        }

        // If visitor is new today, increment counter
        if (!visitorsData.dailyVisitors[today].has(currentVisitorId)) {
            visitorsData.dailyVisitors[today].add(currentVisitorId);
            visitorsData.totalUniqueVisitors++;
            visitorsData.totalPageViews++;
            
            // Keep only last 30 days of data
            this.cleanOldData(visitorsData);
            
            this.saveVisitorsData(visitorsData);
        }
    }

    getVisitorsData() {
        const defaultData = {
            totalUniqueVisitors: 0,
            totalPageViews: 0,
            dailyVisitors: {},
            startDate: new Date().toISOString()
        };
        
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : defaultData;
        } catch (error) {
            console.error('Error reading visitors data:', error);
            return defaultData;
        }
    }

    saveVisitorsData(data) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving visitors data:', error);
        }
    }

    cleanOldData(data) {
        const today = new Date();
        const daysToKeep = 30;
        
        Object.keys(data.dailyVisitors).forEach(date => {
            const visitDate = new Date(date);
            const diffTime = today - visitDate;
            const diffDays = diffTime / (1000 * 60 * 60 * 24);
            
            if (diffDays > daysToKeep) {
                delete data.dailyVisitors[date];
            }
        });
    }

    displayCounterInFooter() {
        // Wait for footer to be available
        if (document.querySelector('footer')) {
            this.injectCounterIntoFooter();
        } else {
            // If footer doesn't exist yet, wait for DOM to load
            document.addEventListener('DOMContentLoaded', () => {
                this.injectCounterIntoFooter();
            });
        }
    }

    injectCounterIntoFooter() {
        const footer = document.querySelector('footer');
        if (!footer) return;

        // Remove existing counter if any
        const existingCounter = document.getElementById('visitor-counter');
        if (existingCounter) {
            existingCounter.remove();
        }

        // Create counter element
        const counterElement = document.createElement('div');
        counterElement.id = 'visitor-counter';
        counterElement.innerHTML = this.getCounterHTML();
        
        // Add counter to footer
        footer.appendChild(counterElement);
        
        // Add styles if not already added
        this.addCounterStyles();
    }

    getCounterHTML() {
        const data = this.getVisitorsData();
        const today = new Date().toDateString();
        const todayVisitors = data.dailyVisitors[today] ? data.dailyVisitors[today].size : 0;
        
        return `
            <div class="visitor-counter-footer">
                <div class="counter-title">
                    <i class="fas fa-chart-line"></i>
                    Website Statistics
                </div>
                <div class="counter-stats-grid">
                    <div class="footer-stat">
                        <div class="footer-stat-icon">
                            <i class="fas fa-users"></i>
                        </div>
                        <div class="footer-stat-info">
                            <div class="footer-stat-value">${data.totalUniqueVisitors}</div>
                            <div class="footer-stat-label">Total Visitors</div>
                        </div>
                    </div>
                    
                    <div class="footer-stat">
                        <div class="footer-stat-icon">
                            <i class="fas fa-calendar-day"></i>
                        </div>
                        <div class="footer-stat-info">
                            <div class="footer-stat-value">${todayVisitors}</div>
                            <div class="footer-stat-label">Today</div>
                        </div>
                    </div>
                    
                    <div class="footer-stat">
                        <div class="footer-stat-icon">
                            <i class="fas fa-eye"></i>
                        </div>
                        <div class="footer-stat-info">
                            <div class="footer-stat-value">${data.totalPageViews}</div>
                            <div class="footer-stat-label">Page Views</div>
                        </div>
                    </div>
                    
                    <div class="footer-stat">
                        <div class="footer-stat-icon">
                            <i class="fas fa-clock"></i>
                        </div>
                        <div class="footer-stat-info">
                            <div class="footer-stat-value">${this.getDaysRunning()}</div>
                            <div class="footer-stat-label">Days Running</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getDaysRunning() {
        const data = this.getVisitorsData();
        const startDate = new Date(data.startDate);
        const today = new Date();
        const diffTime = today - startDate;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }

    addCounterStyles() {
        // Only add styles once
        if (document.getElementById('visitor-counter-styles')) return;

        const styles = `
            <style id="visitor-counter-styles">
                #visitor-counter {
                    width: 100%;
                    margin-top: 2rem;
                    padding-top: 2rem;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                }

                .visitor-counter-footer {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 15px;
                    padding: 2rem;
                    margin: 1rem auto;
                    max-width: 800px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                }

                .counter-title {
                    text-align: center;
                    font-size: 1.3rem;
                    font-weight: 600;
                    margin-bottom: 1.5rem;
                    color: #50c878;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                }

                .counter-title i {
                    font-size: 1.5rem;
                }

                .counter-stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: 1.5rem;
                    justify-items: center;
                }

                .footer-stat {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem;
                    background: rgba(255, 255, 255, 0.08);
                    border-radius: 12px;
                    transition: all 0.3s ease;
                    min-width: 180px;
                }

                .footer-stat:hover {
                    background: rgba(255, 255, 255, 0.12);
                    transform: translateY(-3px);
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                }

                .footer-stat-icon {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.3rem;
                    color: white;
                }

                .footer-stat-info {
                    flex: 1;
                }

                .footer-stat-value {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #50c878;
                    line-height: 1;
                    margin-bottom: 0.3rem;
                }

                .footer-stat-label {
                    font-size: 0.8rem;
                    opacity: 0.9;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                /* Responsive Design */
                @media (max-width: 768px) {
                    .visitor-counter-footer {
                        padding: 1.5rem;
                        margin: 1rem;
                    }

                    .counter-stats-grid {
                        grid-template-columns: repeat(2, 1fr);
                        gap: 1rem;
                    }

                    .footer-stat {
                        min-width: auto;
                        padding: 0.8rem;
                    }

                    .footer-stat-icon {
                        width: 40px;
                        height: 40px;
                        font-size: 1.1rem;
                    }

                    .footer-stat-value {
                        font-size: 1.3rem;
                    }
                }

                @media (max-width: 480px) {
                    .counter-stats-grid {
                        grid-template-columns: 1fr;
                    }

                    .footer-stat {
                        justify-content: center;
                        text-align: center;
                        flex-direction: column;
                        gap: 0.5rem;
                    }

                    .footer-stat-info {
                        text-align: center;
                    }
                }

                /* Hide counter on expiration page */
                body:has(> div > div > .fa-clock) #visitor-counter {
                    display: none;
                }
            </style>
        `;
        document.head.insertAdjacentHTML('beforeend', styles);
    }

    // Method to get statistics for external use
    getStatistics() {
        const data = this.getVisitorsData();
        const today = new Date().toDateString();
        const todayVisitors = data.dailyVisitors[today] ? data.dailyVisitors[today].size : 0;
        
        return {
            totalUniqueVisitors: data.totalUniqueVisitors,
            todayVisitors: todayVisitors,
            totalPageViews: data.totalPageViews,
            startDate: data.startDate,
            daysRunning: this.getDaysRunning()
        };
    }

    // Method to reset counter (for testing)
    resetCounter() {
        localStorage.removeItem(this.storageKey);
        localStorage.removeItem(this.currentVisitorKey);
        this.init();
    }
}

// Initialize visitor counter
const visitorCounter = new VisitorCounter();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { VisitorCounter, visitorCounter };
}
