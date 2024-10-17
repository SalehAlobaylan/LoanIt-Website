import { api } from './api.js';

document.addEventListener('DOMContentLoaded', function() {
    api.requireAuth(); // Redirect to login if the user is not authenticated
});

// Handle sign out
const signout = document.getElementById('signout');
if (signout) {
    signout.addEventListener('click', function(event) {
        event.preventDefault();
        api.logout();
    });
}

async function getAllLoans() {
    try {
        const userId = api.getUserId();  // Get current user's ID
        const response = await api.get(`/user/${userId}/loans`);
        const loans = response.data; // Assuming the API response has loans in the 'data' key

        // Get the container where loan cards will be inserted
        const loanList = document.getElementById('loan-list');

        // Clear any existing loans (if reloading)
        loanList.innerHTML = '';

        // Loop through the loans and create HTML for each loan
        loans.forEach(loan => {
            const { _id, title, ownerId, ownerName, partyId, partyName, role, status, date, notes } = loan;

            // Determine the other party's name based on the current user
            const otherPartyName = (userId === ownerId) ? partyName : ownerName;

            // Determine if the user is the borrower or lender
            const userRole = (userId === partyId) ? role : (role === 'BORROWER' ? 'LENDER' : 'BORROWER');

            // Format date
            const formattedDate = new Date(date).toLocaleDateString('en-GB');

            // Create a loan card dynamically
            const loanCard = `
                <div class="card my-2">
                    <div style="border-left: 1rem solid ${status === 'ACTIVE' ? 'green' : status === 'PENDING' ? 'orange' : 'red'}; border-radius: 1rem;" class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h5 class="card-title">${title}</h5>
                                <p class="card-subtitle text-muted">${otherPartyName}</p>
                            </div>
                            <div>
                                <img style="transform: rotate(180deg); padding-left: 5px;" src="./resources/triangle-fill.svg" alt="">
                                <span class="badge ${status === 'ACTIVE' ? 'bg-warning' : 'bg-secondary'} rounded-pill">${status}</span>
                            </div>
                        </div>
                        <p class="text-muted">Initiated ${formattedDate}</p>
                    </div>
                </div>
            `;

            // Append the loan card to the loan list
            loanList.insertAdjacentHTML('beforeend', loanCard);
        });

    } catch (error) {
        console.error('Error getting loans:', error.message);
    }
}

// Call getAllLoans on page load
window.onload = getAllLoans;