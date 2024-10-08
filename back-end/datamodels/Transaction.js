const mongoose = require('mongoose');
const Loan = require('./Loan');

const Schema = mongoose.Schema;
const TransactionSchema = new Schema({

    createdBy: { type: String, required: true },
    loanId: { type: Schema.Types.ObjectId, ref: 'Loan', required: true },
    type: { type: String, enum: ['ADJUSTMENT', 'REPAYMENT'], required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now, required: true },
    notes: { type: String }

})