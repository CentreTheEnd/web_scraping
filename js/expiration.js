// Check if 1 hour has passed since first visit
function checkExpiration() {
    const firstVisitKey = 'firstVisitTimestamp';
    const durationHours = 1;
    const expirationTime = durationHours * 60 * 60 * 1000; // 1 hour in milliseconds (كان 24 ساعة)
    
    // Get first visit timestamp or set it if doesn't exist
    let firstVisit = localStorage.getItem(firstVisitKey);
    if (!firstVisit) {
        firstVisit = Date.now();
        localStorage.setItem(firstVisitKey, firstVisit.toString());
    } else {
        firstVisit = parseInt(firstVisit);
    }
    
    // Check if 1 hour has passed
    const currentTime = Date.now();
    const timePassed = currentTime - firstVisit;
    
    if (timePassed >= expirationTime) {
        // Website expired - show beautiful expiration message
        document.body.innerHTML = `
            <div style="
                display: flex; 
                justify-content: center; 
                align-items: center; 
                height: 100vh; 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white; 
                font-family: 'Poppins', sans-serif;
                padding: 20px;
            ">
                <div style="
                    text-align: center; 
                    padding: 3rem; 
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                    border-radius: 20px;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    max-width: 500px;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
                ">
                    <!-- Main Icon -->
                    <div style="
                        font-size: 5rem; 
                        margin-bottom: 1.5rem;
                        animation: pulse 2s infinite;
                        color: #ff6b6b;
                    ">
                        <i class="fas fa-clock"></i>
                    </div>
                    
                    <h1 style="
                        font-size: 2.5rem; 
                        margin-bottom: 1rem;
                        font-weight: 700;
                    ">
                        Demo Expired
                    </h1>
                    
                    <p style="
                        font-size: 1.2rem; 
                        margin-bottom: 2rem;
                        line-height: 1.6;
                        opacity: 0.9;
                    ">
                        This demo version has ended after 1 hour of access.
                    </p>
                    
                    <div style="
                        background: rgba(255, 255, 255, 0.1);
                        padding: 1.5rem;
                        border-radius: 15px;
                        margin-bottom: 2rem;
                        border-left: 4px solid #50c878;
                    ">
                        <p style="margin-bottom: 1rem; font-size: 1.1rem;">
                            <strong><i class="fas fa-graduation-cap"></i> Want full access?</strong>
                        </p>
                        <p style="margin: 0; opacity: 0.9;">
                            Contact the developer for complete access to the Web Scraping Course.
                        </p>
                    </div>
                    
                    <!-- Contact Options -->
                    <div style="margin-bottom: 2rem;">
                        <h3 style="margin-bottom: 1rem; font-size: 1.3rem;">
                            <i class="fas fa-comments"></i> Get in Touch
                        </h3>
                        <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
                            <div style="
                                background: rgba(255, 255, 255, 0.15);
                                padding: 1rem;
                                border-radius: 10px;
                                min-width: 120px;
                                transition: transform 0.3s;
                            " onmouseover="this.style.transform='translateY(-5px)'" 
                            onmouseout="this.style.transform='translateY(0)'">
                                <div style="font-size: 1.5rem; margin-bottom: 0.5rem; color: #ff6b6b;">
                                    <i class="fas fa-envelope"></i>
                                </div>
                                <div>Email</div>
                            </div>
                            <div style="
                                background: rgba(255, 255, 255, 0.15);
                                padding: 1rem;
                                border-radius: 10px;
                                min-width: 120px;
                                transition: transform 0.3s;
                            " onmouseover="this.style.transform='translateY(-5px)'" 
                            onmouseout="this.style.transform='translateY(0)'">
                                <div style="font-size: 1.5rem; margin-bottom: 0.5rem; color: #25d366;">
                                    <i class="fab fa-whatsapp"></i>
                                </div>
                                <div>WhatsApp</div>
                            </div>
                            <div style="
                                background: rgba(255, 255, 255, 0.15);
                                padding: 1rem;
                                border-radius: 10px;
                                min-width: 120px;
                                transition: transform 0.3s;
                            " onmouseover="this.style.transform='translateY(-5px)'" 
                            onmouseout="this.style.transform='translateY(0)'">
                                <div style="font-size: 1.5rem; margin-bottom: 0.5rem; color: #0088cc;">
                                    <i class="fab fa-telegram"></i>
                                </div>
                                <div>Telegram</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Timer Display (Optional) -->
                    <div style="
                        background: rgba(255, 255, 255, 0.05);
                        padding: 1rem;
                        border-radius: 10px;
                        margin-bottom: 1.5rem;
                        font-family: 'Courier New', monospace;
                    ">
                        <div style="font-size: 0.9rem; opacity: 0.8; margin-bottom: 0.5rem;">
                            <i class="fas fa-hourglass-end"></i> Demo Duration
                        </div>
                        <div style="font-size: 1.5rem; font-weight: bold; color: #50c878;">
                            1 Hour
                        </div>
                    </div>
                    
                    <!-- Action Button -->
                    <button onclick="location.reload()" style="
                        background: linear-gradient(45deg, #50c878, #3da865);
                        color: white;
                        border: none;
                        padding: 12px 30px;
                        border-radius: 25px;
                        font-size: 1rem;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s;
                        box-shadow: 0 5px 15px rgba(80, 200, 120, 0.3);
                        margin-bottom: 1rem;
                    " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 20px rgba(80, 200, 120, 0.4)'" 
                    onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 5px 15px rgba(80, 200, 120, 0.3)'">
                        <i class="fas fa-sync-alt"></i> Try Again
                    </button>
                    
                    <!-- Support Message -->
                    <p style="margin-top: 1rem; font-size: 0.9rem; opacity: 0.7;">
                        <i class="fas fa-life-ring"></i> Need immediate assistance? 
                        <br>Reach out for premium support.
                    </p>
                </div>
            </div>
            
            <style>
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                    100% { transform: scale(1); }
                }
                
                body {
                    margin: 0;
                    padding: 0;
                    overflow: hidden;
                }
            </style>
        `;
        return true; // Website expired
    }
    
    return false; // Website still active
}

// Export function for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { checkExpiration };
}
