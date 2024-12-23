const { createLoan, getLoanById, getLoansByUserId, updateLoanStatus, hideLoan } = require('../services/loanService');
const { sendError } = require('../utils/errorHandler');

// Controller for creating a loan
const createLoanController = async (req, res, next) => {
    const { userId } = req.params;
    const { partyPhoneNumber, role, title, amount, date, notes } = req.body;
    try {
        const loan = await createLoan(userId, partyPhoneNumber, role, title, amount, date, notes);
        res.status(201).json({ data: loan });
    } catch (error) {
        sendError(res, error.message);
        next(error);
    }
}

// Controller for fetching a loan by ID
const getLoanByIdController = async (req, res, next) => {
    const { loanId } = req.params;

    try {
        const loan = await getLoanById(loanId);
        res.json({ data: loan });
    } catch (error) {
        sendError(res, error.message);
        next(error);
    }
}

// Controller for fetching all loans by user ID
const getLoansByUserIdController = async (req, res, next) => {
    const { userId } = req.params;

    try {
        const loans = await getLoansByUserId(userId);
        res.json({ data: loans });
    } catch (error) {
        sendError(res, error.message);
        next(error);
    }
}

// Controller for updating the loan status (approve/reject)
const updateLoanStatusController = async (req, res, next) => {
    const { userId, loanId } = req.params;
    const { status } = req.body;  // Expecting status to be passed in the request body (e.g., 'approve' or 'reject')

    try {
        const loan = await updateLoanStatus(userId, loanId, status);  // Call the service to update the status
        res.status(204).json({ data: loan });
    } catch (error) {
        sendError(res, error.message);
        next(error);
    }
}

// Controller for hiding a loan
const hideLoanController = async (req, res, next) => {
    const { userId, loanId } = req.params;
    const { isHidden } = req.body;

    try {
        const _ = await hideLoan(userId, loanId, isHidden);
        res.status(204).send();
    } catch (error) {
        sendError(res, error.message);
        next(error);
    }
}

module.exports = {
    createLoan: createLoanController,
    getLoanById: getLoanByIdController,
    getLoans: getLoansByUserIdController,
    updateLoanStatus: updateLoanStatusController,  // New controller for updating loan status
    hideLoan: hideLoanController
};