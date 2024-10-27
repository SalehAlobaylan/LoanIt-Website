const Loan = require('../datamodels/Loan');
const Transaction = require('../datamodels/Transaction');
const { getUserById, getUserByPhoneNumber } = require('./userService');
// const { getTransactionsByLoanId } = require('./transactionService');

// Function to create a loan
async function createLoan(userId, partyPhoneNumber, role, title, amount, date, notes) {
    const partyPhoneNumberAltered = '966' + partyPhoneNumber.trim().slice(-9);
    
    try {

        const owner = await getUserById(userId);
        const party = await getUserByPhoneNumber(partyPhoneNumberAltered);
        
        if (party._id.toString() === userId) {
            throw new Error('LOAN_009');
        }

        const loan = new Loan({
            ownerId: userId,
            ownerName: owner.fullName,
            partyId: party._id,
            partyName: party.fullName,
            role,
            title,
            amount,
            date,
            notes,
            status: 'PENDING'  // Loan starts in Pending state
        });
        await loan.save();

        const transaction = new Transaction({
            createdBy: userId,
            loanId: loan._id,
            type: 'INCREASE',  // Assuming "INCREASE" is a better descriptive name here
            amount,
            date,
            notes
        });
        await transaction.save();

        return loan;
    } catch (error) {
        throw error;
    }
}

async function updateLoanStatus(partyId, loanId, status) {
    try {
        const loan = await Loan.findById(loanId);
        if (loan.status !== 'PENDING') {
            throw new Error('LOAN_010');
        }

        if (loan.partyId.toString() !== partyId) {
            throw new Error('LOAN_012');
        }

        if (loan.status !== 'PENDING') {
            throw new Error('LOAN_010'); 
        }

        if (status === 'ACTIVE') {
            loan.status = 'ACTIVE';
            loan.isHidden = false;
        } else if (status === 'REJECTED') {
            loan.status = 'REJECTED';
            loan.isHidden = true;
        } else {
            throw new Error('LOAN_013'); 
        }

        await loan.save();
        return loan;
    } catch (error) {
        throw error;
    }
}

async function hideLoan(userId, loanId, isHidden) {
    try {
        const loan = await getLoanById(loanId);
        if (loan.ownerId.toString() !== userId) {
            throw new Error('LOAN_011');
        }

        loan.isHidden = isHidden;
        await loan.save();
        return loan;
    } catch (error) {
        throw error;
    }
}

// Function to fetch a loan by ID
async function getLoanById(loanId) {
    try {
        let loan = await Loan.findById(loanId)
        if (!loan) {
            throw new Error('LOAN_008');
        }
        loan = loan.toObject();

        // Fetch associated transactions
        const transactions = await Transaction.find({ loanId: loan._id });
        loan.transactions = transactions;

        // Calculate amounts based on transactions
        const amounts = calculateAmounts(transactions);
        loan.totalAmount = amounts.totalAmount;
        loan.totalPaid = amounts.totalPaid;
        loan.remainingAmount = amounts.remainingAmount;

        // Determine loan status
        loan.status = getLoanStatus(loan);

        // Optionally, remove transactions if not needed in the response
        loan.transactions = null;
        return loan;
    } catch (error) {
        throw error;
    }
}

// calculate the total paid and remaining amount
function calculateAmounts(transactions) {
    let totalAmount = 0;
    let totalPaid = 0;

    for (let transaction of transactions) {
        if (transaction.type === 'INCREASE') {
            totalAmount += transaction.amount;
        } else {
            totalPaid += transaction.amount;
        }
    }

    return { totalAmount, totalPaid, remainingAmount: totalAmount - totalPaid };
}

// get the status of the loan
function getLoanStatus(loan) {
    if (loan.status === 'PENDING' || loan.status === 'REJECTED') {
        return loan.status;
    }

    if (loan.remainingAmount === 0) {
        return 'SETTLED';
    }

    return 'ACTIVE';
}

// Function to fetch loans with transactions
async function getLoansByUserId(userId) {
    try {
        const loans = await Loan.find({ $or: [{ ownerId: userId }, { partyId: userId }] });
        if (!loans || loans.length === 0) {
            return [];
        }

        const modifiedLoans = [];

        for (let loanDoc of loans) {
            let loan = loanDoc.toObject();
            const transactions = await Transaction.find({ loanId: loan._id });
            loan.transactions = transactions;
            const amounts = calculateAmounts(transactions);
            loan.totalAmount = amounts.totalAmount;
            loan.totalPaid = amounts.totalPaid;
            loan.remainingAmount = amounts.remainingAmount;
            loan.status = getLoanStatus(loan);
            loan.transactions = null;
            modifiedLoans.push(loan);
        }

        return modifiedLoans;
    } catch (error) {
        throw error;
    }
}


module.exports = {
    createLoan,
    getLoanById,
    getLoansByUserId,
    updateLoanStatus,
    hideLoan
};