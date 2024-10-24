const Transaction = require('../datamodels/Transaction');
const Loan = require('../datamodels/Loan');
const { getLoanById } = require('./loanService');

// Service to create a transaction
async function createTransaction(userId, loanId, type, amount, date, notes) {
    try {
        const loan = await getLoanById(loanId);
        if (!loan) {
            throw new Error('LOAN_008');  // Throw an error if loan not found
        }
        if (type === 'repayment' && amount > loan.remainingAmount) {
            throw new Error('TRANS_007')
        }

        const transaction = new Transaction({ 
            createdBy: userId, 
            loanId, 
            type, 
            amount, 
            date, 
            notes 
        });
        await transaction.save();

        return transaction;
    } catch (error) {
        throw error;
    }
}

// Service to get transactions by loanId
async function getTransactionsByLoanId(loanId) {
    try {
        const transactions = await Transaction.find({ loanId });
        return transactions;
    } catch (error) {
        throw error;
    }
}

async function deleteTransaction(transactionId) {
    try {
        const transaction = await Transaction.findById(transactionId);
        if (!transaction) {
            throw new Error('TRANS_006')
        }
        await transaction.deleteOne();
        return transaction;
    } catch (error) {
        throw error;
    }
}
module.exports = {
    createTransaction,
    getTransactionsByLoanId,
    deleteTransaction
};
