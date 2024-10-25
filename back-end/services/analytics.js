const User = require('../datamodels/User');
const { sendError } = require('../utils/errorHandler');
const { getLoansByUserId } = require('./loanService');



async function analyticsService(userId) {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('AUTH_002');
        }
        const loans = await getLoansByUserId(userId);
        let totalLoans = loans.length;
        let totalOwed = 0;
        let totalOwing = 0;
        for (let loan of loans) {
            if (loan.status === 'SETTLED' || loan.status === 'REJECTED' || loan.status === 'PENDING' || loan.isHidden) {
                continue;
            }
            if (loan.ownerId.toString() === userId) {
                if (loan.role === 'BORROWER') {
                    totalOwing += loan.totalAmount;
                } else {
                    totalOwed += loan.totalAmount;
                }
            } else {
                if (loan.role === 'BORROWER') {
                    totalOwed += loan.totalAmount;
                } else {
                    totalOwing += loan.totalAmount;
                }
            }
        }

        return { totalLoans, totalOwed, totalOwing };
    } catch (error) {
        throw error;
    }
}

module.exports = {
    analyticsService
}