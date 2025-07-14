// Running functionality
import { runningHistory, users, currentUser, setRunningTime } from './state.js';
import { saveToStorage } from './storage.js';
import { showNotification } from './notifications.js';
import { updateStats } from './stats.js';
import { calculateRunningCalories } from './calories.js';
import { getDateString } from './utils.js';

export function completeRunning() {
    const timeInput = document.getElementById('runningTime');
    const time = parseInt(timeInput.value) || 0;
    
    if (time > 0) {
        setRunningTime(time);
        
        // Save to running history
        const today = getDateString();
        runningHistory[today] = (runningHistory[today] || 0) + time;
        
        // Save to current user
        if (users[currentUser]) {
            users[currentUser].runningHistory = runningHistory;
        }
        
        saveToStorage();
        updateStats();
        drawRunningChart();
        
        // Add completion animation
        const button = event.target;
        button.style.background = '#00ff88';
        button.innerHTML = '✓';
        
        setTimeout(() => {
            button.style.background = '';
            button.innerHTML = '✓';
        }, 1000);
        
        const calories = calculateRunningCalories(time);
        showNotification(`Біг виконано! 🏃‍♂️ Спалено ${calories} калорій`);
        timeInput.value = ''; // Clear input after completion
    } else {
        showNotification('Введіть час виконання!', 'error');
    }
}

// Running chart functionality
export function drawRunningChart() {
    const canvas = document.getElementById('runningChart');
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Get last 7 days data
    const chartData = [];
    const labels = [];
    
    for (let i = 6; i >= 0; i--) {
        const dateStr = getDateString(i);
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        chartData.push(runningHistory[dateStr] || 0);
        labels.push(date.toLocaleDateString('uk-UA', { weekday: 'short' }));
    }
    
    // Chart dimensions
    const padding = 40;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;
    const maxValue = Math.max(...chartData, 30); // Minimum scale of 30 minutes
    
    // Draw grid lines
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    
    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(padding + chartWidth, y);
        ctx.stroke();
        
        // Y-axis labels
        ctx.fillStyle = '#888888';
        ctx.font = '12px Segoe UI';
        ctx.textAlign = 'right';
        const value = Math.round(maxValue - (maxValue / 5) * i);
        ctx.fillText(value + ' хв', padding - 10, y + 4);
    }
    
    // Vertical grid lines and X-axis labels
    for (let i = 0; i < 7; i++) {
        const x = padding + (chartWidth / 6) * i;
        ctx.beginPath();
        ctx.moveTo(x, padding);
        ctx.lineTo(x, padding + chartHeight);
        ctx.stroke();
        
        // X-axis labels
        ctx.fillStyle = '#888888';
        ctx.font = '12px Segoe UI';
        ctx.textAlign = 'center';
        ctx.fillText(labels[i], x, padding + chartHeight + 20);
    }
    
    // Draw chart line
    if (chartData.some(value => value > 0)) {
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        let firstPoint = true;
        for (let i = 0; i < chartData.length; i++) {
            const x = padding + (chartWidth / 6) * i;
            const y = padding + chartHeight - (chartData[i] / maxValue) * chartHeight;
            
            if (firstPoint) {
                ctx.moveTo(x, y);
                firstPoint = false;
            } else {
                ctx.lineTo(x, y);
            }
            
            // Draw data points
            ctx.fillStyle = '#00ffff';
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();
        }
        
        ctx.stroke();
    }
    
    // Chart title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px Segoe UI';
    ctx.textAlign = 'center';
    ctx.fillText('Хвилини бігу за останні 7 днів', canvas.width / 2, 20);
}