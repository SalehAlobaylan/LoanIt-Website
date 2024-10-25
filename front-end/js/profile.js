import { api } from './api.js';

document.addEventListener('DOMContentLoaded', function() {
    api.requireAuth(); 

});

const signout = document.getElementById('signout');
if (signout) {
    signout.addEventListener('click', function(event) {
        event.preventDefault();
        api.logout();
    });
}
async function getAllAnalytics(userId) {
    try {
        const response = await api.get(`/analytics/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error getting analytics:', error.message);
        return null;
    }
}

async function loadProfile() {
    const userId = api.getUserId();
    const analytics = await getAllAnalytics(userId);

    if (!analytics) {
        return;
    }

    // Update analytics numbers
    document.getElementById('total-loans').innerText = analytics.totalLoans || 0;
    document.getElementById('total-owe').innerText = analytics.totalOwed || 0;
    document.getElementById('total-owed').innerText = analytics.totalOwing || 0;

    // Update the donut chart dynamically
    const totalOwedPercent = analytics.totalOwed > 0 ? (analytics.totalOwed / (analytics.totalOwed + analytics.totalOwing)) * 100 : 0;
    const totalOwingPercent = analytics.totalOwing > 0 ? (analytics.totalOwing / (analytics.totalOwed + analytics.totalOwing)) * 100 : 0;

    // Set chart values
    document.querySelector('.donut-chart .chart-center').innerText = `${analytics.totalOwed + analytics.totalOwing} SAR`;

    const owedCircle = document.querySelector('.donut-chart .owed-circle');
    const owingCircle = document.querySelector('.donut-chart .owing-circle');

    owedCircle.setAttribute('stroke-dasharray', `${totalOwedPercent} 100`);
    owingCircle.setAttribute('stroke-dasharray', `${totalOwingPercent} 100`);
    owingCircle.setAttribute('stroke-dashoffset', `-${totalOwedPercent}`);

    // Add any animations or additional interactions as necessary
}



window.onload = loadProfile;


// Toggle edit mode for the profile fields
document.addEventListener('DOMContentLoaded', () => {
    const editButton = document.querySelector('.edit-btn');
    const inputs = document.querySelectorAll('.form-group input');
    
    editButton.addEventListener('click', () => {
        // Toggle between readonly and editable for all inputs
        inputs.forEach(input => {
            input.toggleAttribute('readonly');
            if (!input.hasAttribute('readonly')) {
                input.focus();
            }
        });

        // Change button state between "Edit" and "Save"
        if (editButton.innerText === '✎') {
            editButton.innerText = 'Save';
        } else {
            editButton.innerText = '✎';
            saveProfileChanges();
        }
    });

    // Load the profile data when the page loads
    loadUserProfile();
});

// Function to save the changes made to the profile
async function saveProfileChanges() {
    const userId = api.getUserId();
    const updatedUsername = document.querySelector('input[type="text"]').value;
    const updatedEmail = document.querySelector('input[type="email"]').value;

    try {
        const response = await api.patch(`/user/${userId}`, {
            fullName: updatedUsername,
            email: updatedEmail
        });

        if (response.status === 204) {
            Swal.fire({
                icon: 'success',
                title: 'Profile updated successfully',
                showConfirmButton: false,
                timer: 1500
            });

            const user = api.getUser();
            user.fullName = updatedUsername;
            user.email = updatedEmail;
            localStorage.setItem('user', JSON.stringify(user));

        }
    } catch (error) {
        console.error('Error updating profile:', error.message);
        Swal.fire({
            icon: 'error',
            title: 'Failed to update profile',
            text: error.message
        });
    }
}

// Function to load the user profile and fill the form
async function loadUserProfile() {
    try {
        const user = api.getUser();

        if (user) {
            document.querySelector('input[type="text"]').value = user.fullName || 'Username';
            document.querySelector('input[type="email"]').value = user.email || 'yourEmail@gmail.com';
        }
    } catch (error) {
        console.error('Error loading user profile:', error.message);
    }
}