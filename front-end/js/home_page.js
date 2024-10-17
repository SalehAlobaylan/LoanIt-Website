import { api } from './api.js';
// import { getAllLoans } from './loans.js';

document.addEventListener('DOMContentLoaded', function() {            // comment this function to pass auth for testing
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
