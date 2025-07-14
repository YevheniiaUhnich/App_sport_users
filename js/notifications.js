// Notification system

export function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Styling
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#ff4444' : '#00ff88'};
        color: #0a0a0a;
        padding: 15px 20px;
        border-radius: 10px;
        font-weight: 600;
        z-index: 1000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 4 seconds (longer for calories info)
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translateY(0);
            max-height: 200px;
        }
        to {
            opacity: 0;
            transform: translateY(-20px);
            max-height: 0;
        }
    }
    
    @keyframes statPulse {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
            border-color: #00ffff;
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
        }
        100% {
            transform: scale(1);
        }
    }
    
    .stat-value {
        transition: color 0.3s ease;
    }
    
    .stat-card:hover .stat-value {
        color: #00ff88 !important;
        text-shadow: 0 0 10px #00ff88;
    }
    
    .stat-value.counting {
        animation: numberGlow 0.8s ease-out;
    }
    
    @keyframes numberGlow {
        0% {
            text-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
        }
        50% {
            text-shadow: 0 0 20px rgba(0, 255, 255, 0.8), 0 0 30px rgba(0, 255, 255, 0.6);
        }
        100% {
            text-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
        }
    }
`;
document.head.appendChild(style);