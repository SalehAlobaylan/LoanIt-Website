import { api } from './api.js';

async function register(fullName, phoneNumber, email, password) {
    try {
        const data = await api.post('/auth/register', { fullName, phoneNumber, email, password });

        localStorage.setItem('token', data.token); // If the API returns a token
        localStorage.setItem('user', JSON.stringify(data.user));
        
        window.Swal.fire({
            icon: 'success',
            title: 'Registration Successful!',
            confirmButtonText: 'OK'
        }).then(() => {
            window.location.href = '/home_page.html';
        });

    } catch (error) {
        console.log(error.message);
    }
}

const registerForm = document.getElementById('register-form');
if (registerForm) {
    registerForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const fullName = document.getElementById('fullName').value.trim();
        const phoneNumber = document.getElementById('phoneNumber').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        console.log('fullName:', fullName);
        console.log('phoneNumber:', phoneNumber);
        console.log('email:', email);
        console.log('password', password);
        register(fullName, phoneNumber, email, password);
    });
}

async function loginUser(phoneNumber, password) {
    try {
        const data = await api.post('/auth/login', { phoneNumber, password });
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.href = '/home_page.html';
    } catch (error) {
        console.error(error.message);
    }
}

const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const phoneNumber = document.getElementById('phoneNumber').value.trim();
        const password = document.getElementById('password').value.trim();

        loginUser(phoneNumber, password);
    });
}