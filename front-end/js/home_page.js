import { api } from './api.js';
import { getAllLoans } from './loans.js';

document.addEventListener('DOMContentLoaded', function() {
    api.requireAuth(); // Redirect to login if the user is not authenticated
});


// id signout

const signout = document.getElementById('signout');
if (signout) {
    signout.addEventListener('click', function(event) {
        event.preventDefault();
        api.logout();
    });
}

getAllLoans();
