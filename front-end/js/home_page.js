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

// Helper function to determine the color based on the loan status
function getStatusColor(status) {
    const statusColors = {
        'ACTIVE': '#FFD700',      // Gold
        'SETTLED': '#32CD32',     // LimeGreen
        'PENDING': '#FF8C00',     // DarkOrange
        'OVERDUE': '#FF4500',     // OrangeRed
        'CANCELED': '#A9A9A9'     // DarkGray
    };
    return statusColors[status] || '#A9A9A9'; // Default to DarkGray if status is unknown
}

// Helper function to render a loan card
function renderLoanCard(loan, userId) {
    const { _id, title, ownerId, ownerName, partyId, partyName, role, status, totalPaid, totalAmount, date } = loan;

    const otherPartyName = (userId === ownerId) ? partyName : ownerName;
    const userRole = (userId === partyId) ? role : (role === 'BORROWER' ? 'LENDER' : 'BORROWER');
    const formattedDate = new Date(date).toLocaleDateString('en-GB');
    const progressPercentage = ((totalPaid / totalAmount) * 100).toFixed(1);

    const statusColor = getStatusColor(status);
    const cardClass = status === 'PENDING' ? 'card-disabled' : (userRole === 'BORROWER' ? 'card-borrower' : 'card-lender');

    return `
        <div class="card my-2">
            <div class="card-body ${cardClass}">
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
                <div class="progress my-2">
                    <div class="progress-bar bg-danger" style="width: ${progressPercentage}%;"></div>
                </div>
                <div class="d-flex justify-content-between">
                    <span>${totalPaid} SAR</span>
                    <span>${totalAmount} SAR</span>
                </div>
                <p class="text-muted">Initiated ${formattedDate}</p>
            </div>
        </div>
    `;
}

// Main function to fetch loans and render them
async function getAllLoans() {
    try {
        const userId = api.getUserId();  // Get current user's ID
        const response = await api.get(`/user/${userId}/loans`);
        const loans = response.data;
        const loanList = document.getElementById('loan-list');

        loanList.innerHTML = ''; // Clear existing loans

        loans.forEach(loan => {
            const loanCardHTML = renderLoanCard(loan, userId);
            loanList.insertAdjacentHTML('beforeend', loanCardHTML);
        });

    } catch (error) {
        console.error('Error getting loans:', error.message);
    }
}

// Trigger fetching loans on page load
window.onload = getAllLoans;
