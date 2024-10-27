import { api } from './api.js';
function presentError(error) {
    if (error.message) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message
        });
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'An error occurred. Please try again later.'
        });
    }
}
async function createTransaction(userId, loanId, type, amount, date, notes) {
    try {
        const data = await api.post(`/user/${userId}/loans/${loanId}/transactions`, {
            type, amount, date, notes
        })
        return data.data
    } catch (error) {
        presentError(error);
    }
}

async function getAllTransactions(userId, loanId) {
    try {
        const data = await api.get(`/user/${userId}/loans/${loanId}/transactions`);
       
        return data.data;
    } catch (error) {
        presentError(error);
    }
}

async function deleteTransaction(userId, loanId, transactionId) {
    try {
        const data = await api.delete(`/user/${userId}/loans/${loanId}/transactions/${transactionId}`);
        return data.status == 204;
    } catch (error) {
        presentError(error);
    }
}  

export const transactions = {
    createTransaction,
    getAllTransactions,
    deleteTransaction
};
