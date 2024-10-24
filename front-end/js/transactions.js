import { api } from './api.js';

async function createTransaction(userId, loanId, type, amount, date, notes) {
    try {
        const data = await api.post(`/user/${userId}/loans/${loanId}/transactions`, {
            type, amount, date, notes
        })
        return data.data
    } catch (error) {
        console.error('Transaction creation error:', error.message);
    }
}

async function getAllTransactions(userId, loanId) {
    try {
        const data = await api.get(`/user/${userId}/loans/${loanId}/transactions`);
       
        return data.data;
    } catch (error) {
        console.error('Error getting transactions:', error.message);
    }
}

export const transactions = {
    createTransaction,
    getAllTransactions
};
