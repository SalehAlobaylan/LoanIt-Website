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
    const progressBarColor = userRole === 'BORROWER' ? 'progress-bar-borrower' : 'progress-bar-lender';

    return `
    <div class="card my-2">
        <div class="card-body ${cardClass}">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h5 class="card-title" style="color: var(--text-color);">${title}</h5>
                    <p class="card-subtitle" style="color: var(--text-color);">${otherPartyName}</p>
                </div>
                <div>
                    <img style="transform: rotate(180deg); padding-left: 5px;" src="./resources/triangle-fill.svg" alt="">
                    <span class="badge rounded-pill" style="background-color: ${statusColor} !important;">${status}</span>
                </div>
            </div>
            <div class="progress my-2">
                <div class="${progressBarColor}" style="width: ${progressPercentage}%;"></div>
            </div>
            <div class="d-flex justify-content-between">
                <span style="color: var(--text-color);">${totalPaid} SAR</span>
                <span style="color: var(--text-color);">${totalAmount} SAR</span>
            </div>
            <p style="color: var(--text-color);">Initiated ${formattedDate}</p>

            <!-- Dropdown Modal for Transaction History -->
            <div class="dropdown-modal-header">
                <button class="dropdown-modal-icon-button" id="toggleButton-${_id}">
                    <div class="dropdown-modal-arrow-icon"></div>
                </button>
            </div>
            <div class="dropdown-modal-content" id="dropdownContent-${_id}">
                <div class="dropdown-modal-header">
                    <span class="dropdown-modal-title">Transactions history</span>
                    <button class="dropdown-modal-icon-button" id="addButton-${_id}">+</button>
                </div>
                <div id="transactionList-${_id}">
                    <!-- Transactions will be inserted here dynamically by JavaScript -->
                </div>
            </div>
        </div>
    </div>
`;
}


function loadNotifications(loan) {
    const notificationList = document.getElementById('notification-list');
    if (!notificationList) {
        console.error('Notification list element not found');
        return;
    }

    const otherPartyIs = loan.role === 'BORROWER' ? 'lend' : 'borrow';

    const notifications = [
        {
            loanId: loan._id,
            type: loan.role,
            message: `${loan.ownerName} has created a loan with you, ${otherPartyIs}ing you ${loan.totalAmount} SAR. The loan is awaiting your approval.`, 
            badgeClass: 'bg-warning'
        }
    ];

    notifications.forEach(notification => {
        const notificationCard = document.createElement('div');
        notificationCard.classList.add('card', 'my-2');

        notificationCard.innerHTML = `
            <div class="card-body-note d-flex justify-content-between align-items-center">
                <div>
                    <span class="badge ${notification.badgeClass}">${notification.type}</span>
                    <p>${notification.message}</p>
                </div>
                <div class="d-flex flex-column justify-content-between align-items-center">
                    <button class="btn btn-success mb-2 rounded-pill w-100" style="background-color: #32CD32; color: white; border: none;">Accept</button>
                    <button class="btn btn-danger rounded-pill w-100" style="background: linear-gradient(45deg, #ff416c, #ff4b2b); color: white; border: none;">Reject</button>
                </div>
            </div>
        `;

        const acceptButton = notificationCard.querySelector('.btn-success');
        const rejectButton = notificationCard.querySelector('.btn-danger');

        acceptButton.addEventListener('click', () => handleLoanAction(notification.loanId, 'ACTIVE'));
        rejectButton.addEventListener('click', () => handleLoanAction(notification.loanId, 'REJECTED'));

        notificationList.appendChild(notificationCard);
    });
}


function handleLoanAction(loanId, status) { // notification patching either rejecting or accepting
    const userId = api.getUserId(); 
    console.log(`Updating loan ID: ${loanId}, Status: ${status}`);  // Debugging log

    api.patch(`/user/${userId}/loans/${loanId}`, { status })
        .then(response => {
            alert(`Loan ${status === 'ACTIVE' ? 'accepted' : 'rejected'} successfully`);
        })
        .catch(error => {
            console.error('Error updating loan status:', error);
        });
}




// Main function to fetch loans and render them
async function getAllLoans() {
    try {
        const userId = api.getUserId();  // Get current user's ID
        const response = await api.get(`/user/${userId}/loans`);
        const loans = response.data;
        const loanList = document.getElementById('loan-list');
        const hasNotifications = false;

        loanList.innerHTML = ''; // Clear existing loans

        loans.forEach(loan => {
            const loanCardHTML = renderLoanCard(loan, userId);
            loanList.insertAdjacentHTML('beforeend', loanCardHTML);

            // Transaction history toggling for each loan
            const toggleButton = document.getElementById(`toggleButton-${loan._id}`);
            const dropdownContent = document.getElementById(`dropdownContent-${loan._id}`);
            const arrowIcon = toggleButton.querySelector('.arrow-icon');

            toggleButton.addEventListener('click', () => {
                const isOpen = dropdownContent.style.display === 'block';
                dropdownContent.style.display = isOpen ? 'none' : 'block';
                arrowIcon.classList.toggle('open', !isOpen);
            });

            // Add transactions modal handling (You can repeat logic from your modal)
            const addButton = document.getElementById(`addButton-${loan._id}`);
            const transactionList = document.getElementById(`transactionList-${loan._id}`);

            // Handle adding transactions similarly to your global modal logic
            addButton.addEventListener('click', () => {
                // Open modal logic
            });

            if(userId === loan.partyId && loan.status === "PENDING") {
                hasNotifications = true;
                loadNotifications(loan);
            } 
        });
        
        if (!hasNotifications) {
            const notificationList = document.getElementById('notification-list');
            if (notificationList) {
                notificationList.innerHTML = '<p class="text-center">No new notifications</p>';
            }
        }

    } catch (error) {
        console.error('Error getting loans:', error.message);
    }
}


function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}

// Call getAllLoans on page load
window.onload = getAllLoans;
