// Statistics functionality
import { exercises, runningHistory } from './state.js';
import { calculateExerciseCalories, calculateRunningCalories } from './calories.js';
import { getDateString, animateCounter } from './utils.js';

// Statistics with counter animation and calories
export function updateStats() {
    const totalExercisesElement = document.getElementById('totalExercises');
    const totalTimeElement = document.getElementById('totalTime');
    const totalRepsElement = document.getElementById('totalReps');
    const totalSetsElement = document.getElementById('totalSets');
    const totalCaloriesElement = document.getElementById('totalCalories');
    
    // Count only completed exercises
    const completedExercises = exercises.filter(ex => ex.completed);
    
    // Total completed exercises count
    const totalExercisesCount = completedExercises.length;
    
    // Total time from completed exercises
    const totalExerciseTime = completedExercises.reduce((sum, ex) => sum + (ex.time || 0), 0);
    
    // Total reps from completed exercises
    const totalReps = completedExercises.reduce((sum, ex) => sum + (ex.reps || 0), 0);
    
    // Total sets from completed exercises
    const totalSets = completedExercises.reduce((sum, ex) => sum + (ex.sets || 0), 0);
    
    // Calculate total calories
    const exerciseCalories = completedExercises.reduce((sum, ex) => sum + calculateExerciseCalories(ex), 0);
    const today = getDateString();
    const todayRunningTime = runningHistory[today] || 0;
    const runningCalories = calculateRunningCalories(todayRunningTime);
    const totalCalories = exerciseCalories + runningCalories;
    
    // Add running time to total time
    const grandTotalTime = totalExerciseTime + todayRunningTime;
    
    // Add running to total exercises if performed today
    const grandTotalExercises = totalExercisesCount + (todayRunningTime > 0 ? 1 : 0);
    
    // Get current values for animation
    const currentExercises = parseInt(totalExercisesElement.textContent) || 0;
    const currentTimeText = totalTimeElement.textContent || '0 хв';
    const currentTime = parseInt(currentTimeText.replace(' хв', '')) || 0;
    const currentReps = parseInt(totalRepsElement.textContent) || 0;
    const currentSets = parseInt(totalSetsElement.textContent) || 0;
    const currentCaloriesText = totalCaloriesElement.textContent || '0 ккал';
    const currentCalories = parseInt(currentCaloriesText.replace(' ккал', '')) || 0;
    
    // Only animate if values changed
    if (currentExercises !== grandTotalExercises) {
        animateCounter(totalExercisesElement, currentExercises, grandTotalExercises, 800);
    }
    
    if (currentTime !== grandTotalTime) {
        animateCounter(totalTimeElement, currentTime, grandTotalTime, 800, ' хв');
    }
    
    if (currentReps !== totalReps) {
        animateCounter(totalRepsElement, currentReps, totalReps, 800);
    }
    
    if (currentSets !== totalSets) {
        animateCounter(totalSetsElement, currentSets, totalSets, 800);
    }
    
    if (currentCalories !== totalCalories) {
        animateCounter(totalCaloriesElement, currentCalories, totalCalories, 800, ' ккал');
    }
    
    // Add pulse effect to stat cards when values change
    if (currentExercises !== grandTotalExercises || currentTime !== grandTotalTime || 
        currentReps !== totalReps || currentSets !== totalSets || currentCalories !== totalCalories) {
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach(card => {
            card.style.animation = 'none';
            card.offsetHeight; // Trigger reflow
            card.style.animation = 'statPulse 0.6s ease-out';
        });
        
        // Add glow effect to numbers
        const statValues = document.querySelectorAll('.stat-value');
        statValues.forEach(value => {
            value.classList.add('counting');
            setTimeout(() => {
                value.classList.remove('counting');
            }, 800);
        });
    }
}