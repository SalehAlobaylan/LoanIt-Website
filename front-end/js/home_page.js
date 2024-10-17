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

document.addEventListener('DOMContentLoaded', function() {
    const notificationList = document.getElementById('notification-list');
    const clearNotificationsBtn = document.getElementById('clear-notifications');

    // Example Notifications Data (loanId will be needed)
    const notifications = [
        { loanId: 1, type: 'Lend Request', message: 'Saleh Alobaylan has created a loan with you for 6450 SAR. The loan is awaiting your approval.', badgeClass: 'bg-success' },
        { loanId: 2, type: 'Borrow Request', message: 'Nawaf has created a loan with you for 3500 SAR. The loan is awaiting your approval.', badgeClass: 'bg-danger' }
    ];

    // Function to create and append notifications
    function loadNotifications() {
        notifications.forEach(notification => {
            const notificationCard = document.createElement('div');
            notificationCard.classList.add('card', 'my-2');

            notificationCard.innerHTML = `
                <div class="card-body-note d-flex justify-content-between align-items-center">
                    <div>
                        <span class="badge ${notification.badgeClass}">${notification.type}</span>
                        <p>${notification.message}</p>
                    </div>
                    <button class="btn btn-success" onclick="handleLoanAction(${notification.loanId}, 'approve')">Accept</button>
                    <button class="btn btn-danger" onclick="handleLoanAction(${notification.loanId}, 'reject')">Reject</button>
                </div>
            `;

            notificationList.appendChild(notificationCard);
        });
    }

    // Function to handle Accept/Reject action
    window.handleLoanAction = function(loanId, status) {
        const requestOptions = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
        };
        

        fetch(`/loans/${loanId}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.error('Error updating loan:', data.error);
                } else {
                    alert(`Loan has been ${status === 'approve' ? 'approved' : 'rejected'} successfully!`);
                    // Optionally, you can remove the notification after action
                    removeNotificationCard(loanId);
                }
            })
            .catch(error => console.error('Error:', error));
    }

    // Remove notification card after action
    function removeNotificationCard(loanId) {
        const notificationCards = document.querySelectorAll('.card');
        notificationCards.forEach(card => {
            if (card.innerHTML.includes(`handleLoanAction(${loanId}`)) {
                card.remove();
            }
        });
    }

    // Clear all notifications
    clearNotificationsBtn.addEventListener('click', function() {
        notificationList.innerHTML = ''; // Clear all notifications
    });

    // Load notifications when the page loads
    loadNotifications();
});


// Call getAllLoans on page load
window.onload = getAllLoans;
