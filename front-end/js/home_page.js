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

async function getAllLoans() {
    try {
        const userId = api.getUserId();  // Get current user's ID
        const response = await api.get(`/user/${userId}/loans`);
        const loans = response.data; 
        const loanList = document.getElementById('loan-list');

        loanList.innerHTML = '';

        loans.forEach(loan => {
            const { _id, title, ownerId, ownerName, partyId, partyName, role, status, totalPaid, totalAmount, date } = loan;

            const otherPartyName = (userId === ownerId) ? partyName : ownerName;

            const userRole = (userId === partyId) ? role : (role === 'BORROWER' ? 'LENDER' : 'BORROWER');

            const formattedDate = new Date(date).toLocaleDateString('en-GB');

            const progressPercentage = ((amount / totalAmount) * 100).toFixed(1);

            const isActive = status === 'ACTIVE';
            const cardColor = userRole === 'BORROWER' ? 'borrower' : 'lender';

            const loanCard = `
                <div class="card my-2">
                    <div class="card-body card-${isActive ? cardColor : cardColor}">
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

            loanList.insertAdjacentHTML('beforeend', loanCard);
        });

    } catch (error) {
        console.error('Error getting loans:', error.message);
    }
}

window.onload = getAllLoans;
