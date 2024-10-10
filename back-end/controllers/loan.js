const Loan = require('../datamodels/Loan');
const User = require('../datamodels/User');
const { sendError } = require('../utils/errorHandler');

// loanStatus: { 
//     type: String, 
//     enum: ['Active', 'Settled', 'Overdue', 'Pending', 'Canceled'], 
//     required: true 
// },

const createLoan = async (req, res, next) => {
    const { userId } = req.params;
    const { partyPhoneNumber, role, title, amount, date, notes } = req.body;

    const partyPhoneNumberAltered = '966' + partyPhoneNumber.trim().slice(-9);
    console.log('partyPhoneNumberAltered', partyPhoneNumberAltered);
    console.log('userId', userId);
    console.log('amount', amount);

    try {
        const party = await User.findOne({ phoneNumber: partyPhoneNumberAltered });
        console.log('party', party);
        if (!party) {
            sendError(res, 'AUTH_002');
        } else if (party._id.toString() === userId) {
            sendError(res, 'LOAN_009');
        }

        const loan = new Loan({ ownerId: userId, partyId: party._id, role, title, amount, date, notes });
        await loan.save();
        res.status(201).json({ data: loan });
    } catch (error) {
        next(error);
    }
}

const getLoanById = async (req, res, next) => {
    const { loanId } = req.params;

    try {
        const loan = await Loan.findById(loanId);
        if (!loan) {
            sendError(res, 'LOAN_008');
        }
        res.json({ data: loan });
    } catch (error) {
        next(error);
    }
}

const getLoans = async (req, res, next) => {
    const { userId } = req.params;

    try {
        const loans = await Loan.find( {$or: [{ ownerId: userId }, { partyId: userId }] });
        if (!loans) {
            sendError(res, 'LOAN_008');
        }   
        res.json({ data: loans });
    } catch (error) {
        next(error);
    }
}

module.exports = { createLoan, getLoanById, getLoans };