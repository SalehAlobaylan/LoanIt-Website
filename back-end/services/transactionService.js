const Transaction = require('../datamodels/Transaction');
const Loan = require('../datamodels/Loan');

// Service to create a transaction
async function createTransaction(userId, loanId, type, amount, date, notes) {
    try {
        const loan = await Loan.findById(loanId);  
        if (!loan) {
            throw new Error('LOAN_008');  // Throw an error if loan not found
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
        if (transactions.length === 0) {
            throw new Error('TRANS_006');  // Throw an error if no transactions found
        }

        return transactions;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createTransaction,
    getTransactionsByLoanId,
};
