// Utility functions

export function updateCurrentDate() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    
    const dateString = now.toLocaleDateString('uk-UA', options);
    document.getElementById('currentDate').textContent = dateString;
}

export function formatDate(date) {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
}

export function getDateString(daysAgo = 0) {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return formatDate(date);
}

// Counter animation function
export function animateCounter(element, start, end, duration = 800, suffix = '') {
    const startTime = performance.now();
    const range = end - start;
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.round(start + (range * easeOutQuart));
        
        element.textContent = current + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = end + suffix; // Ensure final value is exact
        }
    }
    
    requestAnimationFrame(updateCounter);
}