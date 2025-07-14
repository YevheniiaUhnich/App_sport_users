// Local storage functionality
import { users, currentUser, exercises, runningHistory, setUsers, setCurrentUser, setExercises, setRunningHistory } from './state.js';

export function saveToStorage() {
    const data = {
        currentUser: currentUser,
        users: users,
        date: new Date().toDateString()
    };
    localStorage.setItem('athleteDiary', JSON.stringify(data));
}

export function loadFromStorage() {
    const saved = localStorage.getItem('athleteDiary');
    if (saved) {
        const data = JSON.parse(saved);
        
        // Load users data
        setUsers(data.users || {});
        setCurrentUser(data.currentUser || 'default');
        
        // Ensure default user exists
        if (!users.default) {
            users.default = {
                name: 'Основний користувач',
                exercises: [],
                runningHistory: {},
                createdAt: new Date().toISOString()
            };
        }
        
        // Load current user's data
        if (users[currentUser]) {
            setExercises(users[currentUser].exercises || []);
            setRunningHistory(users[currentUser].runningHistory || {});
        } else {
            // Fallback to default user
            setCurrentUser('default');
            setExercises(users[currentUser].exercises || []);
            setRunningHistory(users[currentUser].runningHistory || {});
        }
        
        const today = new Date().toDateString();
        
        // Reset daily exercises if it's a new day, but keep running history
        if (data.date !== today) {
            Object.keys(users).forEach(userId => {
                users[userId].exercises = [];
            });
            setExercises([]);
            saveToStorage();
        }
    } else {
        // Initialize with default user
        setUsers({
            default: {
                name: 'Основний користувач',
                exercises: [],
                runningHistory: {},
                createdAt: new Date().toISOString()
            }
        });
        setCurrentUser('default');
        setExercises([]);
        setRunningHistory({});
        saveToStorage();
    }
}