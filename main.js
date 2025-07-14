// Main application entry point
import { updateCurrentDate } from './js/utils.js';
import { loadFromStorage } from './js/storage.js';
import { renderUserSelector } from './js/users.js';
import { renderExercises } from './js/exercises.js';
import { updateStats } from './js/stats.js';
import { drawRunningChart } from './js/running.js';
import { initializeKeyboardShortcuts } from './js/keyboard.js';

// Import functions to make them globally available
import { 
    showAddForm, 
    hideAddForm, 
    addExercise, 
    deleteExercise, 
    editExercise, 
    saveExerciseEdit, 
    cancelExerciseEdit, 
    completeExercise 
} from './js/exercises.js';

import { 
    completeRunning 
} from './js/running.js';

import { 
    createUser, 
    switchUser, 
    deleteUser, 
    toggleUserDropdown 
} from './js/users.js';

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    updateCurrentDate();
    loadFromStorage();
    renderUserSelector();
    renderExercises();
    updateStats();
    drawRunningChart();
    initializeKeyboardShortcuts();
}

// Make functions globally available for onclick handlers
window.showAddForm = showAddForm;
window.hideAddForm = hideAddForm;
window.addExercise = addExercise;
window.deleteExercise = deleteExercise;
window.editExercise = editExercise;
window.saveExerciseEdit = saveExerciseEdit;
window.cancelExerciseEdit = cancelExerciseEdit;
window.completeExercise = completeExercise;
window.completeRunning = completeRunning;
window.createUser = createUser;
window.switchUser = switchUser;
window.deleteUser = deleteUser;
window.toggleUserDropdown = toggleUserDropdown;