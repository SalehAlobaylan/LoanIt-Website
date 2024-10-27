import { api } from './api.js';

async function createLoan(partyPhoneNumber, role, title, amount, date, notes) {
    try {
        const userId = api.getUserId();
        const data = await api.post(`/user/${userId}/loans`, {
            partyPhoneNumber, role, title, amount, date, notes
        })

        window.location.href = './home-page.html';

    } catch (error) {
        console.error('Loan creation error:', error.message);
    }
}

document.getElementById('loan-form')?.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const partyPhoneNumber = '966' + document.getElementById('partyPhoneNumber').value.trim().slice(-9);
    const role = document.getElementById('role').value.trim();
    const title = document.getElementById('title').value.trim();
    const amount = parseFloat(document.getElementById('amount').value); // Convert to number
    const date = document.getElementById('date').value.trim();
    const notes = document.getElementById('notes').value.trim();

    // Client-side validation for amount
    if (isNaN(amount) || amount <= 0 || amount > 10000000000) {
        Swal.fire({
            icon: 'error',
            title: 'Invalid amount',
            text: 'Please enter a valid amount'
        });
        return;
    }

    createLoan(partyPhoneNumber, role, title, amount, date, notes);
});

async function getAllLoans() {
    try {
        const userId = api.getUserId();
        const data = await api.get(`/user/${userId}/loans`);
    } catch (error) {
        console.error('Error getting loans:', error.message);
    }
}

export { getAllLoans };