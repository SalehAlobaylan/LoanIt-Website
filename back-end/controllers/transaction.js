const { createTransactionService, getTransactionsService } = require('../services/transactionService');
const { sendError } = require('../utils/errorHandler');

const createTransaction = async (req, res, next) => {
    const { userId, loanId } = req.params;
    const { type, amount, date, notes } = req.body;

    try {
        const transaction = await createTransactionService(userId, loanId, type, amount, date, notes);
        res.status(201).json({ data: transaction });
    } catch (error) {
        sendError(res, error.message);  // Use error message to send appropriate error code
        next(error);
    }
}

const getTransactions = async (req, res, next) => {
    const { loanId } = req.params;  // Fix typo here: userId not needed
    
    try {
        const transactions = await getTransactionsService(loanId);
        res.json({ data: transactions });
    } catch (error) {
        sendError(res, error.message);  // Use error message to send appropriate error code
        next(error);
    }
}

module.exports = {
    createTransaction,
    getTransactions,
};
