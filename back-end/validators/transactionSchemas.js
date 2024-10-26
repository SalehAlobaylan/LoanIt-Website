const Joi = require('joi');

const createTransactionSchema = Joi.object({
    loanId: Joi.string()
        .required()
        .messages({
            'any.required': 'LOAN_001', // Loan ID is required
        }),
    type: Joi.string()
        .valid('INCREASE', 'REPAYMENT')
        .required()
        .messages({
            'any.only': 'TRANS_002', // Invalid transaction type
            'any.required': 'TRANS_002' // Transaction type is required
        }),
    amount: Joi.number()
        .positive()
        .precision(2)
        .required()
        .max(10000000000)
        .messages({
            'number.base': 'TRANS_002', // Invalid amount format
            'number.positive': 'TRANS_002', // Amount must be positive
            'any.required': 'TRANS_002', // Amount is required
            'number.max': 'TRANS_005'

        }),
    date: Joi.date()
        .iso()
        .required()
        .messages({
            'date.base': 'VAL_005', // Invalid date format
            'date.iso': 'VAL_005', // Date must be in ISO format
            'any.required': 'VAL_005' // Date is required
        }),
    notes: Joi.string()
        .optional()
        .allow(null, '')
        .messages({
            'string.base': 'VAL_004' // Notes must be a string if provided
        })
});

module.exports = { createTransactionSchema };
