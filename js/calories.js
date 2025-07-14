// Calories calculation functionality

// Calories data for different activities
const caloriesData = {
    running: 10, // calories per minute
    exercises: {
        'віджимання': 0.5, // calories per rep
        'присідання': 0.4,
        'підтягування': 0.8,
        'планка': 5, // calories per minute
        'скручування': 0.3,
        'випади': 0.6,
        'берпі': 1.2,
        'стрибки': 0.4,
        'default': 0.5 // default calories per rep/minute
    }
};

export function calculateExerciseCalories(exercise) {
    const exerciseName = exercise.name.toLowerCase();
    let caloriesPerUnit = caloriesData.exercises.default;
    
    // Find matching exercise in calories data
    for (const [key, value] of Object.entries(caloriesData.exercises)) {
        if (exerciseName.includes(key)) {
            caloriesPerUnit = value;
            break;
        }
    }
    
    let totalCalories = 0;
    
    // Calculate based on reps and sets
    if (exercise.reps > 0 && exercise.sets > 0) {
        totalCalories += exercise.reps * exercise.sets * caloriesPerUnit;
    } else if (exercise.reps > 0) {
        totalCalories += exercise.reps * caloriesPerUnit;
    }
    
    // Add time-based calories (for exercises like planks)
    if (exercise.time > 0) {
        const timeCalories = exercise.time * (caloriesData.exercises.планка || 5);
        totalCalories += timeCalories;
    }
    
    return Math.round(totalCalories);
}

export function calculateRunningCalories(minutes) {
    return Math.round(minutes * caloriesData.running);
}