import { api } from './api.js';

async function register(fullName, phoneNumber, email, password) {
    try {
        const data = await api.post('/auth/register', { fullName, phoneNumber, email, password });

            localStorage.setItem('token', data.token); // If the API returns a token
            localStorage.setItem('user', JSON.stringify(data));

            loginUser(phoneNumber, password);
    } catch (error) {
        console.error('Registration error:', error.message);
    }
}

document.getElementById('register-form')?.addEventListener('submit', function(event) {
    event.preventDefault();
    const fullName = document.getElementById('fullName').value.trim();
    const phoneNumber = '966' + document.getElementById('phoneNumber').value.trim().slice(-9);
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    register(fullName, phoneNumber, email, password);
});

async function loginUser(phoneNumber, password) {
    try {
        const data = await api.post('/auth/login', { phoneNumber, password });

        if (data.token) {
            localStorage.setItem('token', data.token); 
            localStorage.setItem('user', JSON.stringify(data));
            console.log('Login successful');
            window.location.href = './home-page.html';
        } else {
            throw new Error('No token received from server');
        }

    } catch (error) {
        console.error('Login error:', error.message);
    }
}

document.getElementById('login-form')?.addEventListener('submit', function(event) {
    event.preventDefault();
    const phoneNumber = '966' + document.getElementById('phoneNumber').value.trim().slice(-9);
    const password = document.getElementById('password').value.trim();
    loginUser(phoneNumber, password);
});

document.addEventListener('DOMContentLoaded', function () {
    if (api.isAuthenticated()) {
        window.location.href = 'home-page.html';
    }
})