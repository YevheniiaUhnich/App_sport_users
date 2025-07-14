// Keyboard shortcuts and event handlers
import { showAddForm, hideAddForm, addExercise } from './exercises.js';
import { toggleUserDropdown } from './users.js';

export function initializeKeyboardShortcuts() {
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl + N to add new exercise
        if (e.ctrlKey && e.key === 'n') {
            e.preventDefault();
            showAddForm();
        }
        
        // Escape to close form
        if (e.key === 'Escape') {
            hideAddForm();
            // Close user dropdown
            const dropdown = document.getElementById('userDropdown');
            if (dropdown) {
                dropdown.classList.remove('active');
            }
        }
        
        // Enter to save when in form
        if (e.key === 'Enter' && document.getElementById('addForm').classList.contains('active')) {
            if (e.target.id === 'exerciseName' || e.target.id === 'exerciseReps' || 
                e.target.id === 'exerciseSets' || e.target.id === 'exerciseTime') {
                addExercise();
            }
        }
        
        // Ctrl + U to toggle user dropdown
        if (e.ctrlKey && e.key === 'u') {
            e.preventDefault();
            toggleUserDropdown();
        }
    });

    // Click outside to close dropdown
    document.addEventListener('click', function(e) {
        const dropdown = document.getElementById('userDropdown');
        const userSelector = document.getElementById('userSelector');
        
        if (dropdown && userSelector && !userSelector.contains(e.target)) {
            dropdown.classList.remove('active');
        }
    });
}