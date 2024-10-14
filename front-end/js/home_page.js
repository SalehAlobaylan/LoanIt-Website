import { api } from './api.js';
// import { getAllLoans } from './loans.js';

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

async function getAllLoans() {
    try {
        const userId = api.getUserId();
        const response = await api.get(`/user/${userId}/loans`);
        const loans = response.data; // assuming the API response has loans in the 'data' key

        // Get the container where loan cards will be inserted
        const loanList = document.getElementById('loan-list');

        // Clear any existing loans (if reloading)
        loanList.innerHTML = '';

        // Loop through the loans and create HTML for each loan
        loans.forEach(loan => {
            const { _id, title, partyName, role, status, amount, date, notes } = loan;

            // Format date
            const formattedDate = new Date(date).toLocaleDateString('en-GB');

            // Create a loan card dynamically
            const loanCard = `
                <div class="card my-2">
                    <div style="border-left: 1rem solid ${status === 'ACTIVE' ? 'green' : status === 'PENDING' ? 'orange' : 'red'}; border-radius: 1rem;" class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h5 class="card-title">${title}</h5>
                                <p class="card-subtitle text-muted">${partyName}</p>
                            </div>
                            <div>
                                <img style="transform: rotate(180deg); padding-left: 5px;" src="./resources/triangle-fill.svg" alt="">
                                <span class="badge ${status === 'ACTIVE' ? 'bg-warning' : 'bg-secondary'} rounded-pill">${status}</span>
                            </div>
                        </div>
                        <div class="progress my-2">
                            <div class="progress-bar bg-danger" style="width: ${amount}%;"></div>
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
