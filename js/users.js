// User management functionality
import { users, currentUser, exercises, runningHistory, setCurrentUser, setExercises, setRunningHistory } from './state.js';
import { saveToStorage } from './storage.js';
import { showNotification } from './notifications.js';
import { renderExercises } from './exercises.js';
import { updateStats } from './stats.js';
import { drawRunningChart } from './running.js';

export function createUser() {
    const userName = prompt('Введіть ім\'я нового користувача:');
    if (userName && userName.trim()) {
        const userId = userName.trim().toLowerCase().replace(/\s+/g, '_');
        if (!users[userId]) {
            users[userId] = {
                name: userName.trim(),
                exercises: [],
                runningHistory: {},
                createdAt: new Date().toISOString()
            };
            setCurrentUser(userId);
            setExercises([]);
            setRunningHistory({});
            saveToStorage();
            renderUserSelector();
            renderExercises();
            updateStats();
            drawRunningChart();
            showNotification(`Користувача "${userName}" створено! 👤`);
        } else {
            showNotification('Користувач з таким іменем вже існує!', 'error');
        }
    }
}

export function switchUser(userId) {
    if (users[userId]) {
        // Save current user data
        if (users[currentUser]) {
            users[currentUser].exercises = exercises;
            users[currentUser].runningHistory = runningHistory;
        }
        
        // Switch to new user
        setCurrentUser(userId);
        setExercises(users[currentUser].exercises || []);
        setRunningHistory(users[currentUser].runningHistory || {});
        
        saveToStorage();
        renderExercises();
        updateStats();
        drawRunningChart();
        
        showNotification(`Переключено на користувача "${users[currentUser].name}" 🔄`);
    }
}

export function deleteUser(userId) {
    if (userId === 'default') {
        showNotification('Неможливо видалити основного користувача!', 'error');
        return;
    }
    
    if (confirm(`Ви впевнені, що хочете видалити користувача "${users[userId].name}"? Всі дані будуть втрачені!`)) {
        delete users[userId];
        
        // Switch to default user if current user was deleted
        if (currentUser === userId) {
            setCurrentUser('default');
            setExercises(users[currentUser]?.exercises || []);
            setRunningHistory(users[currentUser]?.runningHistory || {});
        }
        
        saveToStorage();
        renderUserSelector();
        renderExercises();
        updateStats();
        drawRunningChart();
        
        showNotification('Користувача видалено! 🗑️');
    }
}

export function renderUserSelector() {
    const container = document.getElementById('userSelector');
    const currentUserName = users[currentUser]?.name || 'Основний користувач';
    
    const userOptions = Object.keys(users).map(userId => {
        const user = users[userId];
        const isActive = userId === currentUser;
        return `
            <div class="user-option ${isActive ? 'active' : ''}" onclick="switchUser('${userId}')">
                <span class="user-name">${user.name}</span>
                ${userId !== 'default' ? `<button class="btn-delete-user" onclick="event.stopPropagation(); deleteUser('${userId}')" title="Видалити користувача">✕</button>` : ''}
            </div>
        `;
    }).join('');
    
    container.innerHTML = `
        <div class="user-selector-header">
            <span class="current-user">👤 ${currentUserName}</span>
            <button class="btn-add-user" onclick="createUser()" title="Додати користувача">+ Користувач</button>
        </div>
        <div class="user-dropdown" id="userDropdown">
            ${userOptions}
        </div>
    `;
}

export function toggleUserDropdown() {
    const dropdown = document.getElementById('userDropdown');
    dropdown.classList.toggle('active');
}