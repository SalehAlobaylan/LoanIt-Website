import { api } from './api.js';


let loans = [];

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

const sortElements = document.querySelectorAll('[data-sort]');
sortElements.forEach(element => {
    element.addEventListener('click', sortLoans);
});

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
function renderLoanCard(loan, userId, index = 0) {
    const { _id, title, ownerId, ownerName, partyId, partyName, role, status, totalPaid, totalAmount, date } = loan;

    const otherPartyName = (userId === ownerId) ? partyName : ownerName;  // to check if the the userid is me or my other party
    const userRole = (userId === partyId) ? role : (role === 'BORROWER' ? 'LENDER' : 'BORROWER');
    const formattedDate = new Date(date).toLocaleDateString('en-GB');
    const progressPercentage = ((totalPaid / totalAmount) * 100).toFixed(1);

    const statusColor = getStatusColor(status);
    const cardClass = status === 'PENDING' ? 'card-disabled' : (userRole === 'BORROWER' ? 'card-borrower' : 'card-lender');
    const progressBarColor = userRole === 'BORROWER' ? 'progress-bar-lender' : 'progress-bar-lender';

    const animationDelay = `${index * 0.1}s`; // 0.1 seconds delay between each card

    return `
    <div class="card-wrapper my-2 fade-in slide-in" style="animation-delay: ${animationDelay};">
        <div class="left-border-indicator ${cardClass}-indicator"></div>  <!-- New border element -->
        <div class="card">
            <div class="card-body">
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
                <p style="color: var(--text-secondary-color);">Initiated ${formattedDate}</p>
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
            <div class="card-body-note d-flex justify-content-between">
                <div class="d-flex flex-column justify-content-center">
                    <span class="badge ${notification.badgeClass} mb-2" style="max-width: 80px; text-align: center;">${notification.type}</span>
                    <p style="color: var(--text-color);">${notification.message}</p>
                </div>
                <div class="d-flex flex-column justify-content-between align-items-center">
                    <button class="btn btn-success mb-2 rounded-pill w-100" style="background-color: #32CD32; color: white; border: none;">Accept</button>
                    <button class="btn btn-danger rounded-pill w-100" style="background: linear-gradient(45deg, #ff416c, #ff4b2b); color: white; border: none;">Reject</button>
                </div>
            </div>
        `;

        const acceptButton = notificationCard.querySelector('.btn-success');
        const rejectButton = notificationCard.querySelector('.btn-danger');

        acceptButton.addEventListener('click', () => handleLoanAction(notification.loanId, 'ACTIVE', notificationCard, loan));
        rejectButton.addEventListener('click', () => handleLoanAction(notification.loanId, 'REJECTED', notificationCard));

        notificationList.appendChild(notificationCard);
    });
}


async function handleLoanAction(loanId, status, notificationCard, loan = null) {
    const userId = api.getUserId(); 
    console.log(`Updating loan ID: ${loanId}, Status: ${status}`);  // Debugging log

    const response = await api.patch(`/user/${userId}/loans/${loanId}`, { status })

    if (response.status === 204) {
        Swal.fire({
            icon: 'success',
            title: `Loan ${status.toLowerCase()}ed successfully`
        })

        notificationCard.remove();

        if (status === 'ACTIVE') {
            loan.status = 'ACTIVE';
            const loanCardHTML = renderLoanCard(loan, userId);
            const loanList = document.getElementById('loan-list');
            loanList.insertAdjacentHTML('afterbegin', loanCardHTML);
        }
    }
}

function presentShowHiddenLoans() {
    if (loans.some(loan => loan.isHidden)) {
        const createButton = document.getElementById('modal-container');
        
        // Inject raw HTML
        createButton.insertAdjacentHTML('beforeend', `
            <button id="toggle-hidden-loans" class="btn" style="color: var(--text-secondary-color); width: 100%; margin: 20px 0px;">Show hidden loans</button>
            <div id="hidden-loans-list" class="card-container" style="display: none;"></div>
        `);
        
        // Add click event listener to the button
        document.getElementById('toggle-hidden-loans').addEventListener('click', toggleHiddenLoans);
    }
}

function toggleHiddenLoans() {
    const hiddenLoanList = document.getElementById('hidden-loans-list');
    const toggleButton = document.getElementById('toggle-hidden-loans');
    const userId = api.getUserId();
    
    if (hiddenLoanList.style.display === 'none') {
        hiddenLoanList.innerHTML = loans
            .filter(loan => loan.isHidden)
            .map((loan, index) => renderLoanCard(loan, userId, index))
            .join(''); // Generate loan cards and inject them
        hiddenLoanList.style.display = 'block';
        toggleButton.innerHTML = 'Hide hidden loans';
    } else {
        hiddenLoanList.style.display = 'none';
        toggleButton.innerHTML = 'Show hidden loans';
    }
}

// Main function to fetch loans and render them
async function getAllLoans() { // todo: rename it to getLoansPage
    try {
        const userId = api.getUserId();  // Get current user's ID
        const response = await api.get(`/user/${userId}/loans`);

        loans = response.data;
        loans.sort((a, b) => {
            return  b.totalAmount - a.totalAmount;
        })
        const loanList = document.getElementById('loan-list');
        let hasNotifications = false;

        loanList.innerHTML = ''; // Clear existing loans

        presentShowHiddenLoans();

        loans.forEach((loan, index) => {

            if(loan.isHidden == false){
                const loanCardHTML = renderLoanCard(loan, userId, index);
                loanList.insertAdjacentHTML('beforeend', loanCardHTML);
            }

            if(userId === loan.partyId && loan.status === "PENDING") {
                hasNotifications = true;
                loadNotifications(loan); // have to add attribute 
            } 
        });
        
        if (!hasNotifications) {
            const notificationList = document.getElementById('notification-list');
            if (notificationList) {
                notificationList.innerHTML = '<p class="text-center" style="color: var(--text-secondary-color); margin: 50px 0px;">No new notifications</p>';
            }
        }

    } catch (error) {
        console.error('Error getting loans:', error.message);
    }
}

function sortLoans(e) {
    const userId = api.getUserId(); 
    const sortType = e.target.getAttribute('data-sort');
    let order = e.target.getAttribute('data-order') || 'asc';

    if (sortType == 'amount' || sortType == 'date') {
        order = order === 'asc' ? 'desc' : 'asc';
        e.target.setAttribute('data-order', order);
        const icon = e.target.querySelector('i');
        icon.className = order === 'asc' ? 'bi bi-arrow-up-circle me-2' : 'bi bi-arrow-down-circle me-2';;
    }

    switch (sortType) {
        case 'amount':
            loans.sort((a, b) => {
                return order === 'asc' ? a.totalAmount - b.totalAmount : b.totalAmount - a.totalAmount;
            })
            break;
        case 'date':
            loans.sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                return order === 'asc' ? dateA - dateB : dateB - dateA;
            })
            break;
        case 'status':
            const statusOrder = ['OVERDUE', 'ACTIVE', 'PENDING', 'SETTLED', 'REJECTED'];
            loans.sort((a, b) => {
                const statusA = statusOrder.indexOf(a.status);
                const statusB = statusOrder.indexOf(b.status);
                return order === 'asc' ? statusA - statusB : statusB - statusA;
            })
            break;
        default:
            break;
    }

    const loanList = document.getElementById('loan-list');
    loanList.innerHTML = ''; // Clear existing loans
    loans.forEach((loan, index) => {
        console.log(index)
        const loanCardHTML = renderLoanCard(loan, userId, index);
        loanList.insertAdjacentHTML('beforeend', loanCardHTML);

        if(userId === loan.partyId && loan.status === "PENDING") {
            hasNotifications = true;
            loadNotifications(loan); // have to add attribute 
        } 
    });
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}

// Call getAllLoans on page load
window.onload = getAllLoans;
