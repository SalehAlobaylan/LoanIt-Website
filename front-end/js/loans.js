import { api } from './api.js';

async function createLoan(partyPhoneNumber, role, title, amount, date, notes) {
    try {
        const userId = api.getUserId();
        const data = await api.post(`/user/${userId}/loans`, {
            partyPhoneNumber, role, title, amount, date, notes
        })
        console.log(data)

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
    const amount = document.getElementById('amount').value.trim();
    const date = document.getElementById('date').value.trim();
    const notes = document.getElementById('notes').value.trim();
    createLoan(partyPhoneNumber, role, title, amount, date, notes);
})

async function getAllLoans() {
    try {
        const userId = api.getUserId();
        const data = await api.get(`/user/${userId}/loans`);
        console.log(data);
    } catch (error) {
        console.error('Error getting loans:', error.message);
    }
}

export { getAllLoans };