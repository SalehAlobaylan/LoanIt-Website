import { sign } from "crypto";

const BASE_URL = window.location.origin.includes('127.0.0.1') || window.location.origin.includes('localhost')
    ? 'http://localhost:5010' // Development API URL (e.g., running locally)
    : "https://apiloanit.saudmt.com";  // Use current domain for production/staging
console.log(BASE_URL)
const iconMap = {
    LOCK: 'error',
    SERVER: 'error',
    FORM: 'warning',
    INFO: 'info',
    USER: 'warning',
    CLOCK: 'info',
    LOAN: 'warning',
    TRANSACTION: 'warning',
    WARNING: 'warning',
    // CUSTOM_ICON: 'https://example.com/path/to/custom-icon.png'  
};

function isAuthenticated() {
    const user = getUser();
    return user !== null && user._id && user.token;
}

function requireAuth() {
    if (!isAuthenticated()) {
        logout();
    }
}

function getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

function getToken() {
    const user = getUser();
    return user ? user.token : null;
}

function getUserId() {
    const user = getUser();
    return user ? user._id : null;
}

function getHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    const token = getToken();

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return headers
}

function loadSweetAlert() {
    return new Promise((resolve, reject) => {
        if (window.Swal) {
            resolve();
        } else {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11';
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Failed to load SweetAlert'));
            document.head.appendChild(script);
        }
    })
}

async function showErrorAlert(code, message, icon) {
    await loadSweetAlert();
    const swalIcon = iconMap[icon] || 'error';
    Swal.fire({
        icon: swalIcon,
        title: message
    })
}

async function request(endpoint, { method = 'GET', body = null } = {}) {
    const url = `${BASE_URL}${endpoint}`;
    const options = {
        method,
        headers: getHeaders()
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(url, options);
        const data = await response.json();

        if (response.status === 401 && isAuthenticated()) {
            logout();
        }

        if (!response.ok) {
            const { code, message, icon } = data.error;
            showErrorAlert(code, message, icon);
            throw new Error(message || 'An error occurred');
        }

        return data;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}


function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

export const api = {
    get: (endpoint, isProtected = true) => request(endpoint, { method: 'GET', isProtected }),
    post: (endpoint, body, isProtected = true) => request(endpoint, { method: 'POST', body, isProtected }),
    put: (endpoint, body, isProtected = true) => request(endpoint, { method: 'PUT', body, isProtected }),
    delete: (endpoint, isProtected = true) => request(endpoint, { method: 'DELETE', isProtected }),
    requireAuth,
    isAuthenticated,
    logout,
    getUserId,
};
