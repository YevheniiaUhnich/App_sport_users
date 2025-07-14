// Exercise management functionality
import { exercises, users, currentUser, setExercises } from './state.js';
import { saveToStorage } from './storage.js';
import { showNotification } from './notifications.js';
import { updateStats } from './stats.js';
import { calculateExerciseCalories } from './calories.js';

// Exercise form functionality
export function showAddForm() {
    const form = document.getElementById('addForm');
    form.classList.add('active');
    document.getElementById('exerciseName').focus();
}

export function hideAddForm() {
    const form = document.getElementById('addForm');
    form.classList.remove('active');
    clearForm();
}

function clearForm() {
    document.getElementById('exerciseName').value = '';
    document.getElementById('exerciseReps').value = '';
    document.getElementById('exerciseSets').value = '';
    document.getElementById('exerciseTime').value = '';
}

export function addExercise() {
    const nameInput = document.getElementById('exerciseName');
    const repsInput = document.getElementById('exerciseReps');
    const setsInput = document.getElementById('exerciseSets');
    const timeInput = document.getElementById('exerciseTime');
    
    const name = nameInput.value.trim();
    const reps = parseInt(repsInput.value) || 0;
    const sets = parseInt(setsInput.value) || 0;
    const time = parseInt(timeInput.value) || 0;
    
    if (name && (reps > 0 || sets > 0 || time > 0)) {
        const exercise = {
            id: Date.now(),
            name: name,
            reps: reps,
            sets: sets,
            time: time,
            completed: false,
            date: new Date().toLocaleDateString('uk-UA', { 
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric' 
            })
        };
        
        exercises.push(exercise);
        
        // Save to current user
        if (users[currentUser]) {
            users[currentUser].exercises = exercises;
        }
        
        saveToStorage();
        renderExercises();
        updateStats();
        hideAddForm();
        
        showNotification('Вправу додано! 💪');
    } else {
        showNotification('Заповніть назву та принаймні одне поле (рази/серії/час)!', 'error');
    }
}

export function deleteExercise(id) {
    if (confirm('Ви впевнені, що хочете видалити цю вправу?')) {
        setExercises(exercises.filter(exercise => exercise.id !== id));
        
        // Save to current user
        if (users[currentUser]) {
            users[currentUser].exercises = exercises;
        }
        
        saveToStorage();
        renderExercises();
        updateStats();
        showNotification('Вправу видалено!');
    }
}

export function editExercise(id) {
    const exercise = exercises.find(ex => ex.id === id);
    if (!exercise) return;
    
    // Hide any existing edit forms
    document.querySelectorAll('.edit-form').forEach(form => form.remove());
    
    // Find the exercise card
    const exerciseCard = document.querySelector(`[data-exercise-id="${id}"]`);
    if (!exerciseCard) return;
    
    // Create edit form
    const editForm = document.createElement('div');
    editForm.className = 'edit-form';
    editForm.innerHTML = `
        <div class="edit-form-content">
            <input type="text" id="editName${id}" value="${exercise.name}" placeholder="Назва вправи" />
            <div class="edit-form-row">
                <input type="number" id="editReps${id}" value="${exercise.reps || ''}" placeholder="Рази" min="0" />
                <input type="number" id="editSets${id}" value="${exercise.sets || ''}" placeholder="Серії" min="0" />
                <input type="number" id="editTime${id}" value="${exercise.time || ''}" placeholder="Час (хв)" min="0" />
            </div>
            <div class="edit-form-actions">
                <button class="btn-save" onclick="saveExerciseEdit(${id})">Зберегти</button>
                <button class="btn-cancel" onclick="cancelExerciseEdit(${id})">Скасувати</button>
            </div>
        </div>
    `;
    
    // Insert edit form after the exercise card
    exerciseCard.insertAdjacentElement('afterend', editForm);
    
    // Focus on name input
    document.getElementById(`editName${id}`).focus();
    
    // Add slide down animation
    editForm.style.animation = 'slideDown 0.3s ease';
}

export function saveExerciseEdit(id) {
    const exercise = exercises.find(ex => ex.id === id);
    if (!exercise) return;
    
    const nameInput = document.getElementById(`editName${id}`);
    const repsInput = document.getElementById(`editReps${id}`);
    const setsInput = document.getElementById(`editSets${id}`);
    const timeInput = document.getElementById(`editTime${id}`);
    
    const name = nameInput.value.trim();
    const reps = parseInt(repsInput.value) || 0;
    const sets = parseInt(setsInput.value) || 0;
    const time = parseInt(timeInput.value) || 0;
    
    if (name && (reps > 0 || sets > 0 || time > 0)) {
        exercise.name = name;
        exercise.reps = reps;
        exercise.sets = sets;
        exercise.time = time;
        
        // Save to current user
        if (users[currentUser]) {
            users[currentUser].exercises = exercises;
        }
        
        saveToStorage();
        renderExercises();
        updateStats();
        
        showNotification('Вправу оновлено! ✏️');
    } else {
        showNotification('Заповніть назву та принаймні одне поле (рази/серії/час)!', 'error');
    }
}

export function cancelExerciseEdit(id) {
    const editForm = document.querySelector('.edit-form');
    if (editForm) {
        editForm.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => {
            editForm.remove();
        }, 300);
    }
}

export function completeExercise(id) {
    const exercise = exercises.find(ex => ex.id === id);
    if (exercise) {
        exercise.completed = !exercise.completed;
        
        // Save to current user
        if (users[currentUser]) {
            users[currentUser].exercises = exercises;
        }
        
        saveToStorage();
        renderExercises();
        updateStats();
        
        if (exercise.completed) {
            const calories = calculateExerciseCalories(exercise);
            showNotification(`Вправу виконано! ✅ Спалено ${calories} калорій`);
        } else {
            showNotification('Вправу позначено як невиконану');
        }
    }
}

// Rendering functions
export function renderExercises() {
    const container = document.getElementById('exercisesList');
    container.innerHTML = '';
    
    exercises.forEach(exercise => {
        const exerciseElement = createExerciseElement(exercise);
        container.appendChild(exerciseElement);
    });
}

function createExerciseElement(exercise) {
    const div = document.createElement('div');
    div.className = `exercise-card ${exercise.completed ? 'completed' : ''}`;
    div.setAttribute('data-exercise-id', exercise.id);
    
    // Create exercise details string
    const details = [];
    if (exercise.reps > 0) details.push(`${exercise.reps} разів`);
    if (exercise.sets > 0) details.push(`${exercise.sets} серій`);
    if (exercise.time > 0) details.push(`${exercise.time} хв`);
    const detailsText = details.join(' • ');
    
    // Calculate calories
    const calories = calculateExerciseCalories(exercise);
    
    div.innerHTML = `
        <div class="exercise-info">
            <div class="exercise-main">
                <span class="exercise-name ${exercise.completed ? 'completed' : ''}">${exercise.name}</span>
                <span class="exercise-details">${detailsText}</span>
                <span class="exercise-calories">🔥 ${calories} калорій</span>
                <span class="exercise-date">📅 ${exercise.date}</span>
            </div>
        </div>
        <div class="exercise-actions">
            <button class="btn-complete" onclick="completeExercise(${exercise.id})" title="Позначити як виконано">
                ${exercise.completed ? '✓' : '○'}
            </button>
            <button class="btn-edit" onclick="editExercise(${exercise.id})" title="Редагувати">
                ✏️
            </button>
            <button class="btn-delete" onclick="deleteExercise(${exercise.id})" title="Видалити">
                ✕
            </button>
        </div>
    `;
    
    // Add completed styling
    if (exercise.completed) {
        div.style.opacity = '0.7';
        div.style.border = '2px solid #00ff88';
        const nameSpan = div.querySelector('.exercise-name');
        nameSpan.style.textDecoration = 'line-through';
        nameSpan.style.color = '#00ff88';
    }
    
    return div;
}