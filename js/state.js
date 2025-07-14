// Application state management
export let exercises = [];
export let runningTime = 0;
export let runningHistory = {}; // Store running data by date
export let currentUser = 'default';
export let users = {};

// State setters
export function setExercises(newExercises) {
    exercises = newExercises;
}

export function setRunningHistory(newHistory) {
    runningHistory = newHistory;
}

export function setCurrentUser(userId) {
    currentUser = userId;
}

export function setUsers(newUsers) {
    users = newUsers;
}

export function setRunningTime(time) {
    runningTime = time;
}

// State getters
export function getCurrentUserData() {
    return users[currentUser] || null;
}

export function getAllUsers() {
    return users;
}