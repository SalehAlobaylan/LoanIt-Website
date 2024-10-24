const { createTransaction, getTransactionsByLoanId , deleteTransaction } = require('../services/transactionService');
const { sendError } = require('../utils/errorHandler');

const createTransactionController = async (req, res, next) => {
    const { userId, loanId } = req.params;
    const { type, amount, date, notes } = req.body;

    try {
        const transaction = await createTransaction(userId, loanId, type, amount, date, notes);
        res.status(201).json({ data: transaction });
    } catch (error) {
        sendError(res, error.message);  // Use error message to send appropriate error code
        next(error);
    }
}

const getTransactions = async (req, res, next) => {
    const { loanId } = req.params;  
    
    try {
        const transactions = await getTransactionsByLoanId(loanId);
        res.json({ data: transactions });
    } catch (error) {
        sendError(res, error.message);  // Use error message to send appropriate error code
        next(error);
    }
}

const deleteTransactionController = async (req, res, next) => {
    const { transactionId } = req.params;

    try {
        const transaction = await deleteTransaction(transactionId);
        res.json({ data: transaction });
    } catch (error) {
        sendError(res, error.message);  // Use error message to send appropriate error code
        next(error);
    }
}

module.exports = {
    createTransactionController,
    getTransactions,
    deleteTransactionController
};
