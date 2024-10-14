const Transaction = require('../datamodels/Transaction');
const Loan = require('../datamodels/Loan');
const { sendError } = require('../utils/errorHandler');

const createTransaction = async (req, res, next) => {
    const { userId, loanId } = req.params;
    const { type, amount, date, notes } = req.body;

    try {
        const loan = await Loan.findById(loanId);  
        if (!loan) {
            sendError(res, 'LOAN_008');
        } 

        const transaction = new Transaction({ createdBy: userId, loanId, type, amount, date, notes });
        await transaction.save();

        res.status(201).json({ data: transaction});
    } catch(error) {
        next(error);
    }
}

        