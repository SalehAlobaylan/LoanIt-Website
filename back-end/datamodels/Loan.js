const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const LoanSchema = new Schema({

    ownerId: { type: String, required: true },
    ownerName: { type: String },

    partyId: { type: String, required: true },
    partyName: { type: String },

    role: { type: String, enum: ['BORROWER', 'LENDER'], required: true },

    title: { type: String, required: true },

    date: { type: Date, default: Date.now, required: true },
    
    notes: { type: String }, 

    status: { 
        type: String, 
        enum: ['PENDING', 'ACTIVE', 'SETTLED', 'REJECTED'], 
        default: 'PENDING'  // Default status is Pending
    },

    createdAt: { type: Date, default: Date.now }, 
});

LoanSchema.pre('remove', async function(next) {
    try {
        await mongoose.model('Transaction').deleteMany({ loanId: this._id });
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('Loan', LoanSchema);