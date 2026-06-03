// js/auth.js

const USERS_KEY = 'epower_users';
const CURRENT_USER_KEY = 'epower_currentUser';

function getUsers() {
    try {
        return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    } catch {
        return [];
    }
}

function registerUser(name, email, phone, address, password) {
    const users = getUsers();
    if (users.find(u => u.email === email)) {
        return { success: false, message: 'Email already registered.' };
    }
    const newUser = { id: 'usr_' + Date.now(), name, email, phone, address, password, registeredAt: new Date().toISOString() };
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    return { success: true, user: newUser };
}

function loginUser(email, password) {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
        return { success: true, user };
    }
    return { success: false, message: 'Invalid email or password.' };
}

function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
    } catch {
        return null;
    }
}

function logoutUser() {
    localStorage.removeItem(CURRENT_USER_KEY);
}

window.EpowerAuth = {
    getUsers,
    registerUser,
    loginUser,
    getCurrentUser,
    logoutUser
};
